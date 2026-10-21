// src/lib/server/mailer.ts
// Robust email notification dispatcher with retry backoff and HTML templates

import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { getServerEnv } from "./env";
import { updateEnquiryEmailStatus, type StoredEnquiry } from "./enquiry-store";
import { getSanitizedExcelFilename } from "./excel";

const OUTBOX_DIR = path.resolve(process.cwd(), "data", "outbox");

function ensureOutboxDir() {
  if (!fs.existsSync(OUTBOX_DIR)) {
    fs.mkdirSync(OUTBOX_DIR, { recursive: true });
  }
}

/**
 * Creates Nodemailer transporter from environment config.
 */
function createTransporter() {
  const env = getServerEnv();

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Fallback for Resend SMTP endpoint if RESEND_API_KEY is provided
  if (env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: env.RESEND_API_KEY,
      },
    });
  }

  return null;
}

/**
 * Clean phone number for WhatsApp link (digits only with leading plus or country code)
 */
function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}`;
}

/**
 * Generates Mobile-Responsive HTML Email for OWNER
 */
export function buildOwnerEmailHtml(enquiry: StoredEnquiry): string {
  const productsRows = enquiry.products
    .map(
      (p, i) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #0F172A; font-weight: 600;">
        ${i + 1}. ${p.name}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px; color: #475569;">
        ${p.category}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px; color: #475569;">
        ${p.origin || "India"}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px; color: #C9973F; font-weight: 600;">
        ${p.moq || "1 FCL"}
      </td>
    </tr>
  `
    )
    .join("");

  const waLink = formatWhatsAppLink(enquiry.phone);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Export Enquiry ${enquiry.reference}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F5F9; color: #0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 660px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color: #071A33; padding: 28px 32px; border-bottom: 3px solid #C9973F;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #F2C86E; background-color: rgba(201,151,63,0.18); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(242,200,110,0.3);">
                Official Commercial Inquiry
              </span>
              <h1 style="margin: 12px 0 4px; font-size: 22px; font-weight: 700; color: #FFFFFF;">
                New Export Enquiry ${enquiry.reference}
              </h1>
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                Received: ${enquiry.createdAtIST} (IST) / ${enquiry.createdAtUTC} (UTC)
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 32px;">
        <!-- Importer Summary Card -->
        <h2 style="margin: 0 0 14px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #071A33;">
          Client & Destination Overview
        </h2>
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 24px;">
          <tr>
            <td width="35%" style="padding: 10px 14px; font-size: 12px; color: #64748B; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Company</td>
            <td style="padding: 10px 14px; font-size: 13px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #E2E8F0;">${enquiry.company}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 12px; color: #64748B; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Contact Person</td>
            <td style="padding: 10px 14px; font-size: 13px; color: #0F172A; border-bottom: 1px solid #E2E8F0;">${enquiry.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 12px; color: #64748B; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Trade Email</td>
            <td style="padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #E2E8F0;">
              <a href="mailto:${enquiry.email}" style="color: #0284C7; font-weight: 600; text-decoration: none;">${enquiry.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 12px; color: #64748B; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Phone & WhatsApp</td>
            <td style="padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #E2E8F0;">
              <a href="tel:${enquiry.phone}" style="color: #0F172A; text-decoration: none; font-weight: 600;">${enquiry.phone}</a>
              <span style="margin: 0 6px; color: #CBD5E1;">|</span>
              <a href="${waLink}" style="color: #16A34A; text-decoration: none; font-weight: 600;" target="_blank">Chat on WhatsApp</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 12px; color: #64748B; font-weight: 600; border-bottom: 1px solid #E2E8F0;">Destination Market</td>
            <td style="padding: 10px 14px; font-size: 13px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #E2E8F0;">${enquiry.country}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-size: 12px; color: #64748B; font-weight: 600;">Quantity / Volume</td>
            <td style="padding: 10px 14px; font-size: 13px; color: #C9973F; font-weight: 700;">
              ${enquiry.quantity ? `${enquiry.quantity} ${enquiry.unit}` : `Not specified (Unit preference: ${enquiry.unit})`}
            </td>
          </tr>
        </table>

        <!-- Requested Products Table -->
        <h2 style="margin: 0 0 14px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #071A33;">
          Products of Interest (${enquiry.products.length})
        </h2>
        <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <tr style="background-color: #071A33; color: #F2C86E;">
            <th align="left" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase;">Product</th>
            <th align="left" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase;">Category</th>
            <th align="left" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase;">Origin</th>
            <th align="left" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase;">MOQ</th>
          </tr>
          ${productsRows}
        </table>

        <!-- Specification Details & Notes -->
        <h2 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #071A33;">
          Buyer Shipping & Specification Notes
        </h2>
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
          ${enquiry.notes ? enquiry.notes.replace(/\n/g, "<br>") : "<em>No additional specification notes provided by client.</em>"}
        </div>

        <!-- Live Google Sheet Card -->
        <div style="background-color: #0A1B35; border: 2px solid #E3B95F; border-radius: 12px; padding: 22px 24px; margin-bottom: 24px; text-align: center;">
          <div style="color: #E3B95F; font-size: 16px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px;">
            📊 Live Google Sheet Updated
          </div>
          <p style="color: #E2E8F0; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">
            Enquiry <strong>${enquiry.reference}</strong> has been automatically added to your live <strong>Aurelian Enquiries</strong> Google Sheet.
          </p>
          <a href="${getServerEnv().GOOGLE_SHEET_URL}" target="_blank" style="background-color: #E3B95F; color: #071A33; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; padding: 12px 26px; border-radius: 8px; display: inline-block;">
            Open Live Google Sheet ➔
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #64748B;">
        <p style="margin: 0 0 4px;">Aurelian International Trade Desk • Mundra / Kandla Port Gateway, Gujarat, India</p>
        <p style="margin: 0;">Click Reply to respond directly to the importer (${enquiry.email}).</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generates Plain-Text alternative for OWNER email
 */
export function buildOwnerEmailText(enquiry: StoredEnquiry): string {
  const env = getServerEnv();
  const productsList = enquiry.products
    .map((p, i) => `  ${i + 1}. ${p.name} [${p.category}] (Origin: ${p.origin || "India"}, MOQ: ${p.moq || "1 FCL"})`)
    .join("\n");

  return `
NEW EXPORT ENQUIRY - ${enquiry.reference}
============================================================
Received: ${enquiry.createdAtIST} (IST) / ${enquiry.createdAtUTC} (UTC)

LIVE GOOGLE SHEET:
  ${env.GOOGLE_SHEET_URL}
  Enquiry ${enquiry.reference} has been automatically appended to your live sheet.

CLIENT INFORMATION:
  Company:     ${enquiry.company}
  Contact:     ${enquiry.fullName}
  Email:       ${enquiry.email}
  Phone:       ${enquiry.phone} (WhatsApp: ${formatWhatsAppLink(enquiry.phone)})
  Country:     ${enquiry.country}
  Volume:      ${enquiry.quantity ? `${enquiry.quantity} ${enquiry.unit}` : `Unit: ${enquiry.unit}`}
  Source Page: ${enquiry.sourcePage}

PRODUCTS REQUESTED (${enquiry.products.length}):
${productsList}

BUYER NOTES:
${enquiry.notes || "None provided"}

NOTE:
  Click the live Google Sheet link above to view your master enquiries sheet in real-time.
  To reply directly to the client, simply hit reply in your mail client.
============================================================
Aurelian International Trade Desk
`;
}

/**
 * Generates Confirmation Email for CLIENT
 */
export function buildClientConfirmationHtml(enquiry: StoredEnquiry): string {
  const productsList = enquiry.products
    .map((p) => `<li style="margin-bottom: 6px;"><strong>${p.name}</strong> (${p.category})</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your quotation request [${enquiry.reference}]</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F5F9; color: #0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color: #071A33; padding: 32px; border-bottom: 3px solid #C9973F;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #F2C86E;">
          Aurelian International • Export Commercial Desk
        </span>
        <h1 style="margin: 10px 0 0; font-size: 22px; font-weight: 700; color: #FFFFFF;">
          We Received Your Quotation Request
        </h1>
        <p style="margin: 6px 0 0; font-size: 13px; color: #CBD5E1;">
          Reference Number: <strong style="color: #F2C86E;">${enquiry.reference}</strong>
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #0F172A;">
          Dear <strong>${enquiry.firstName}</strong>,
        </p>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #334155;">
          Thank you for requesting a commercial export quotation from Aurelian International for <strong>${enquiry.company}</strong>.
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">
          Our export operations desk has received your requirements for shipping to <strong>${enquiry.country}</strong>. Our commercial team will evaluate current farm-gate / quarry pricing, vessel availability from Gujarat Coast (Mundra / Kandla), and prepare your FOB/CIF schedule within <strong>24 business hours</strong>.
        </p>

        <!-- Summary Box -->
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 10px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #071A33;">
            Summary of Requested Items
          </h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #0F172A; line-height: 1.6;">
            ${productsList}
          </ul>
          ${
            enquiry.quantity
              ? `<p style="margin: 12px 0 0; font-size: 13px; color: #475569;"><strong>Target Volume:</strong> ${enquiry.quantity} ${enquiry.unit}</p>`
              : ""
          }
        </div>

        <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.6; color: #334155;">
          If your request is urgent, you may connect directly with our international desk via WhatsApp or phone:
        </p>
        <p style="margin: 0 0 24px; font-size: 14px;">
          <a href="https://wa.me/919876543210" style="color: #16A34A; font-weight: 600; text-decoration: none;">💬 Connect on WhatsApp Trade Desk</a>
        </p>

        <p style="margin: 0; font-size: 13px; color: #64748B;">
          Warm regards,<br>
          <strong style="color: #071A33;">International Export & Trade Desk</strong><br>
          Aurelian International<br>
          Gujarat, India
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #F8FAFC; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #64748B;">
        <p style="margin: 0 0 4px;">Aurelian International — APEDA, FSSAI & Spices Board Registered Exporter</p>
        <p style="margin: 0;">This is an automated confirmation of inquiry receipt. You will receive an official quotation shortly.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends owner email with Excel attachment, retrying up to 3 times on transient network failures.
 */
export async function sendOwnerEmailWithRetry(
  enquiry: StoredEnquiry,
  excelBuffer: Buffer
): Promise<{ success: boolean; error?: string }> {
  const env = getServerEnv();
  const filename = `Enquiry_${enquiry.reference}_Offline_Backup.xlsx`;
  const subject = `New Export Enquiry ${enquiry.reference} - ${enquiry.company} (${enquiry.country}) - ${enquiry.products.length} product(s)`;

  // If in TEST_MODE or SMTP credentials are not configured, save record to outbox & log
  if (env.TEST_MODE) {
    try {
      ensureOutboxDir();
      const outboxPrefix = `${enquiry.reference}_${Date.now()}`;
      const emailRecord = {
        to: env.OWNER_EMAIL,
        from: env.MAIL_FROM,
        replyTo: enquiry.email,
        subject,
        excelFilename: filename,
        excelSizeBytes: excelBuffer.length,
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(
        path.join(OUTBOX_DIR, `${outboxPrefix}_owner_email.json`),
        JSON.stringify(emailRecord, null, 2),
        "utf8"
      );

      console.log(`[TEST_MODE] Owner notification recorded: ${enquiry.reference} (Master Excel kept in sync)`);
      updateEnquiryEmailStatus(enquiry.reference, "skipped_test_mode", "Test mode: email recorded, master Excel updated");
      return { success: true };
    } catch (err) {
      console.error("[TEST_MODE] Failed to save email to outbox:", err);
      return { success: false, error: String(err) };
    }
  }

  const transporter = createTransporter();
  if (!transporter) {
    updateEnquiryEmailStatus(enquiry.reference, "email_failed", "No SMTP transporter configured");
    return { success: false, error: "No SMTP transporter configured" };
  }

  const mailOptions = {
    from: env.MAIL_FROM,
    to: env.OWNER_EMAIL,
    replyTo: enquiry.email,
    subject,
    text: buildOwnerEmailText(enquiry),
    html: buildOwnerEmailHtml(enquiry),
    attachments: [
      {
        filename,
        content: excelBuffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };

  // Up to 3 attempts with exponential backoff
  const maxRetries = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Mailer] Sending owner notification for ${enquiry.reference} (Attempt ${attempt}/${maxRetries})...`);
      await transporter.sendMail(mailOptions);
      console.log(`[Mailer] Owner notification delivered successfully for ${enquiry.reference}`);
      updateEnquiryEmailStatus(enquiry.reference, "sent", `Delivered to ${env.OWNER_EMAIL.join(", ")} on attempt ${attempt}`);
      return { success: true };
    } catch (err) {
      lastError = err;
      console.error(`[Mailer] Attempt ${attempt} failed for ${enquiry.reference}:`, err);
      if (attempt < maxRetries) {
        const backoffMs = attempt * 1000;
        await new Promise((res) => setTimeout(res, backoffMs));
      }
    }
  }

  // If all retries exhausted, log & flag enquiry
  const errMsg = lastError instanceof Error ? lastError.message : String(lastError);
  updateEnquiryEmailStatus(enquiry.reference, "email_failed", `All 3 send attempts failed: ${errMsg}`);
  return { success: false, error: errMsg };
}

/**
 * Sends non-blocking confirmation email to client.
 */
export async function sendClientConfirmationEmail(enquiry: StoredEnquiry): Promise<void> {
  const env = getServerEnv();

  if (env.TEST_MODE) {
    try {
      ensureOutboxDir();
      const outboxPrefix = `${enquiry.reference}_${Date.now()}`;
      fs.writeFileSync(
        path.join(OUTBOX_DIR, `${outboxPrefix}_client_confirm.json`),
        JSON.stringify(
          {
            to: enquiry.email,
            from: env.MAIL_FROM,
            subject: `We received your quotation request [${enquiry.reference}] — Aurelian International`,
            createdAt: new Date().toISOString(),
          },
          null,
          2
        ),
        "utf8"
      );
      console.log(`[TEST_MODE] Client confirmation saved to outbox for ${enquiry.email}`);
    } catch (err) {
      console.error("[TEST_MODE] Failed to save client confirmation:", err);
    }
    return;
  }

  const transporter = createTransporter();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: enquiry.email,
      subject: `We received your quotation request [${enquiry.reference}] — Aurelian International`,
      html: buildClientConfirmationHtml(enquiry),
    });
    console.log(`[Mailer] Client confirmation sent to ${enquiry.email}`);
  } catch (err) {
    // Non-blocking: if client confirmation fails, log but do not disrupt submission
    console.warn(`[Mailer] Client confirmation email could not be sent to ${enquiry.email}:`, err);
  }
}
