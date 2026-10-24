// src/routes/api.enquiry.ts
// Primary server endpoint for commercial quotation submissions (POST /api/enquiry)

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  sanitizeText,
  sanitizeExcelValue,
  checkRateLimit,
  verifyTurnstileToken,
} from "@/lib/server/security";
import {
  formatISTDate,
  type StoredEnquiry,
  type EnquiryProductItem,
} from "@/lib/server/enquiry-store";
import { forwardToAppsScript } from "@/lib/server/apps-script";
import { getServerEnv } from "@/lib/server/env";
import {
  sendOwnerEmailWithRetry,
  sendClientConfirmationEmail,
} from "@/lib/server/mailer";

// Server-side Zod validation schema
const productItemSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(100),
  category: z.string().trim().max(100).optional(),
  slug: z.string().trim().max(100).optional(),
  origin: z.string().trim().max(100).optional(),
  grade: z.string().trim().max(100).optional(),
  moq: z.string().trim().max(100).optional(),
});

const enquiryPayloadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60, "First name cannot exceed 60 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(60, "Last name cannot exceed 60 characters"),
  email: z.string().trim().email("Enter a valid official trade email").max(255, "Email is too long"),
  phone: z.string().trim().min(6, "Enter a valid phone number with country code").max(30, "Phone number is too long"),
  company: z.string().trim().min(1, "Importing company name is required").max(120, "Company name cannot exceed 120 characters"),
  country: z.string().trim().min(1, "Destination country is required").max(60, "Country name cannot exceed 60 characters"),
  state: z.string().trim().max(100, "State/Province cannot exceed 100 characters").optional(),
  city: z.string().trim().max(100, "City cannot exceed 100 characters").optional(),
  pincode: z.string().trim().max(30, "Postal code cannot exceed 30 characters").optional(),
  products: z
    .array(z.union([z.string().trim().min(1, "Product name cannot be empty"), productItemSchema]))
    .min(1, "Select at least one export product from the catalogue"),
  quantity: z.string().trim().max(60, "Quantity is too long").optional(),
  unit: z.enum(["MT", "FCL", "kg"]).default("MT"),
  notes: z.string().trim().max(3000, "Notes cannot exceed 3,000 characters").optional(),
  // Anti-spam honeypot
  _hp_company_fax: z.string().optional(),
  // Time-trap verification
  formLoadedAt: z.union([z.number(), z.string()]).optional(),
  // Cloudflare Turnstile token
  turnstileToken: z.string().optional(),
  // Context metadata
  sourcePage: z.string().trim().max(255).optional(),
  sourceCard: z.string().trim().max(100).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
});

export const Route = createFileRoute("/api/enquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const env = getServerEnv();

          // 1. Extract client IP and headers for spam/audit defense
          const clientIp =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-real-ip") ||
            "127.0.0.1";

          const userAgent = request.headers.get("user-agent") || "Unknown Client";

          // 2. Rate limit check (max 5 requests/hr per IP)
          const rateCheck = checkRateLimit(clientIp, 5, 60 * 60 * 1000);
          if (!rateCheck.allowed) {
            return new Response(
              JSON.stringify({
                ok: false,
                error: `Too many quote requests from your network. Please wait ${Math.ceil(
                  rateCheck.retryAfterSeconds / 60
                )} minutes or connect directly with our WhatsApp trade desk.`,
              }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Retry-After": rateCheck.retryAfterSeconds.toString(),
                },
              }
            );
          }

          // 3. Parse JSON payload
          let rawBody: unknown;
          try {
            rawBody = await request.json();
          } catch {
            return new Response(
              JSON.stringify({ ok: false, error: "Invalid JSON request body." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 4. Validate with Zod
          const parsed = enquiryPayloadSchema.safeParse(rawBody);
          if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
              const fieldName = issue.path[0]?.toString() || "form";
              if (!fieldErrors[fieldName]) {
                fieldErrors[fieldName] = issue.message;
              }
            }
            return new Response(
              JSON.stringify({
                ok: false,
                error: "Please correct the highlighted fields.",
                errors: fieldErrors,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const data = parsed.data;

          // 5. Spam Trap 1: Honeypot field must be completely empty
          if (data._hp_company_fax && data._hp_company_fax.trim() !== "") {
            console.warn(`[Spam Blocked] Honeypot filled by IP ${clientIp}`);
            return new Response(
              JSON.stringify({
                ok: false,
                error: "Submission rejected by anti-bot verification.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 6. Spam Trap 2: Minimum submission time (3 seconds)
          if (data.formLoadedAt) {
            const loadedAt = typeof data.formLoadedAt === "number" ? data.formLoadedAt : Number(data.formLoadedAt);
            if (!Number.isNaN(loadedAt) && loadedAt > 0) {
              const elapsed = Date.now() - loadedAt;
              if (elapsed < 3000) {
                console.warn(`[Spam Blocked] Rapid submission (${elapsed}ms) by IP ${clientIp}`);
                return new Response(
                  JSON.stringify({
                    ok: false,
                    error: "Form submitted too quickly. Please take a moment to review your specifications.",
                  }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
            }
          }

          // 7. Spam Trap 3: Cloudflare Turnstile token validation
          const turnstileCheck = await verifyTurnstileToken(data.turnstileToken, clientIp);
          if (!turnstileCheck.success) {
            return new Response(
              JSON.stringify({
                ok: false,
                error: turnstileCheck.error || "Security verification failed.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 8. Sanitize all string fields (strip HTML and control characters)
          const sanitizedFirstName = sanitizeText(data.firstName);
          const sanitizedLastName = sanitizeText(data.lastName);
          const sanitizedCompany = sanitizeText(data.company);
          const sanitizedCountry = sanitizeText(data.country);
          const sanitizedState = sanitizeText(data.state || "");
          const sanitizedCity = sanitizeText(data.city || "");
          const sanitizedPincode = sanitizeText(data.pincode || "");
          const sanitizedPhone = sanitizeText(data.phone);
          const sanitizedEmail = sanitizeText(data.email).toLowerCase();
          const sanitizedQuantity = sanitizeText(data.quantity || "");
          const sanitizedNotes = sanitizeText(data.notes || "");
          const sanitizedSourcePage = sanitizeText(data.sourcePage || "/");

          const sanitizedProducts: EnquiryProductItem[] = data.products.map((p) => {
            if (typeof p === "string") {
              return {
                name: sanitizeText(p),
                category: "Export Product",
                origin: "India",
                grade: "Export Premium",
                moq: "1 MT",
              };
            }
            return {
              name: sanitizeText(p.name),
              category: sanitizeText(p.category || "Export Product"),
              slug: sanitizeText(p.slug || ""),
              origin: sanitizeText(p.origin || "India"),
              grade: sanitizeText(p.grade || "Export Premium"),
              moq: sanitizeText(p.moq || "1 MT"),
            };
          });

          const productNames = sanitizedProducts.map((p) => p.name);

          // 9. Generate reference number
          const now = new Date();
          const timestampSeq = Date.now().toString().slice(-4);
          const localRef = `AV-${now.getFullYear()}-${timestampSeq}`;
          const createdAtIST = formatISTDate(now);
          const createdAtUTC = now.toISOString();

          // 10. Forward to Google Apps Script Web App (stores directly in live Google Sheet)
          let finalReference = localRef;
          let isSynced = false;
          let syncErrorMsg: string | undefined;
          let liveSheetUrl: string | undefined;

          if (env.WEB_APP_URL) {
            const appsScriptResult = await forwardToAppsScript(
              env.WEB_APP_URL,
              {
                secret: env.ENQUIRY_SECRET,
                reference: finalReference,
                name: `${sanitizedFirstName} ${sanitizedLastName}`.trim(),
                firstName: sanitizedFirstName,
                lastName: sanitizedLastName,
                company: sanitizedCompany,
                email: sanitizedEmail,
                phone: sanitizeExcelValue(sanitizedPhone),
                country: sanitizedCountry,
                state: sanitizedState,
                city: sanitizedCity,
                pincode: sanitizedPincode,
                destination: [sanitizedCity, sanitizedState, sanitizedPincode, sanitizedCountry].filter(Boolean).join(", "),
                product: productNames.join(", "),
                products: productNames,
                quantity: sanitizedQuantity ? `${sanitizedQuantity} ${data.unit}` : `Unit: ${data.unit}`,
                unit: data.unit,
                message: sanitizedNotes,
                notes: sanitizedNotes,
                sourcePage: sanitizedSourcePage,
                spreadsheetId: env.GOOGLE_SHEET_URL?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || undefined,
                ownerEmail: env.OWNER_EMAIL.length > 0 ? env.OWNER_EMAIL.join(", ") : undefined,
              },
              3 // 3 retries with exponential backoff
            );

            if (appsScriptResult.ok) {
              isSynced = true;
              if (appsScriptResult.reference) {
                finalReference = appsScriptResult.reference;
              }
              if (appsScriptResult.sheetUrl) {
                liveSheetUrl = appsScriptResult.sheetUrl;
              }
              console.log(
                `[Apps Script Success] Reference ${finalReference} created in Google Sheet.`
              );
            } else {
              syncErrorMsg = appsScriptResult.error || "Failed to reach Google Apps Script";
              console.error(
                `[Apps Script Error] Failed after ${appsScriptResult.attempts} attempts: ${syncErrorMsg}`
              );
            }
          } else {
            syncErrorMsg = "WEB_APP_URL not configured in environment";
            console.log(`[Apps Script Notice] WEB_APP_URL is empty.`);
          }

          // 11. In-memory enquiry record for emails (zero disk writes)
          const storedRecord: StoredEnquiry = {
            id: `enq_${finalReference.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
            reference: finalReference,
            year: now.getFullYear(),
            seq: Number.parseInt(finalReference.split("-")[2] || "1", 10) || 1,
            createdAtUTC,
            createdAtIST,
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            fullName: `${sanitizedFirstName} ${sanitizedLastName}`.trim(),
            email: sanitizedEmail,
            phone: sanitizedPhone,
            company: sanitizedCompany,
            country: sanitizedCountry,
            state: sanitizedState,
            city: sanitizedCity,
            pincode: sanitizedPincode,
            quantity: sanitizedQuantity,
            unit: data.unit,
            notes: sanitizedNotes,
            products: sanitizedProducts,
            sourcePage: sanitizedSourcePage,
            ip: clientIp,
            userAgent,
            status: "New",
            emailStatus: isSynced ? "sent" : "pending",
            emailRetries: 0,
            syncStatus: isSynced ? "synced" : "pending_sync",
            logs: [
              `Enquiry submitted from ${sanitizedSourcePage} at ${createdAtIST}`,
              isSynced
                ? `Google Sheet synced successfully as ${finalReference}`
                : `Google Sheet sync: ${syncErrorMsg}`,
            ],
          };

          if (data.sourceCard) storedRecord.sourceCard = sanitizeText(data.sourceCard);
          if (data.utmSource) storedRecord.utmSource = sanitizeText(data.utmSource);
          if (data.utmMedium) storedRecord.utmMedium = sanitizeText(data.utmMedium);
          if (data.utmCampaign) storedRecord.utmCampaign = sanitizeText(data.utmCampaign);
          if (syncErrorMsg) storedRecord.syncError = syncErrorMsg;

          // 12. Dispatch notification email via SMTP to owner with direct Google Sheet link (zero disk attachments)
          if ((env.SMTP_HOST && env.SMTP_USER) || env.TEST_MODE || env.RESEND_API_KEY) {
            try {
              sendOwnerEmailWithRetry(storedRecord, liveSheetUrl).catch((err) => {
                console.error(`[Owner Email SMTP Error]:`, err);
              });
              sendClientConfirmationEmail(storedRecord).catch((err) => {
                console.error(`[Client Confirmation Email Error]:`, err);
              });
            } catch (mailerErr) {
              console.warn(`[Mailer Warning]:`, mailerErr);
            }
          }

          // 13. Always return success with the assigned reference number
          return new Response(
            JSON.stringify({
              ok: true,
              reference: finalReference,
              message: "Commercial quotation request transmitted successfully.",
              clientEmail: sanitizedEmail,
              productsCount: sanitizedProducts.length,
              synced: isSynced,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (fatalErr) {
          console.error("[POST /api/enquiry Fatal Error]:", fatalErr);
          return new Response(
            JSON.stringify({
              ok: false,
              error: "An unexpected error occurred while transmitting your request. Please try again or reach our trade desk directly on WhatsApp.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
