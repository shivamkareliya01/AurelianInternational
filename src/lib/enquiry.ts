// src/lib/enquiry.ts
// Centralized enquiry submission engine wired to Google Apps Script

export const APPS_SCRIPT_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_APPS_SCRIPT_URL"]) ||
  "PASTE_YOUR_EXEC_URL_HERE";

export interface EnquirySubmissionData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  product?: string;
  quantity?: string;
  message: string;
  _hp?: string; // Hidden honeypot field
}

export interface EnquirySubmissionResult {
  ok: boolean;
  message?: string;
  error?: string;
}

/**
 * Validates and submits an enquiry to Google Apps Script.
 * Uses text/plain;charset=utf-8 to prevent CORS preflight issues with Google Apps Script.
 */
export async function submitEnquiry(
  raw: EnquirySubmissionData
): Promise<EnquirySubmissionResult> {
  // 1. Silent Honeypot Trap: ignore if bot filled hidden field
  if (raw._hp && raw._hp.trim() !== "") {
    console.warn("[Anti-Spam] Honeypot triggered. Silently ignoring submission.");
    return {
      ok: true,
      message: "Thank you! Our team will contact you within 24 hours.",
    };
  }

  // 2. Trim Whitespace
  const name = (raw.name || "").trim();
  const email = (raw.email || "").trim();
  const message = (raw.message || "").trim();
  const company = (raw.company || "").trim();
  const phone = (raw.phone || "").trim();
  const country = (raw.country || "").trim();
  const product = (raw.product || "").trim();
  const quantity = (raw.quantity || "").trim();

  // 3. Required Fields Validation
  if (!name) {
    return { ok: false, error: "Name is required." };
  }
  if (!email) {
    return { ok: false, error: "Email is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const finalMessage = message || "Commercial export quotation request.";

  const payload = {
    name,
    company,
    email,
    phone: phone ? (/^[=+\-@\t\r]/.test(phone.trim()) ? (phone.trim().startsWith("'") ? phone.trim() : `'${phone.trim()}`) : phone.trim()) : "",
    country,
    product,
    quantity,
    message: finalMessage,
  };

  try {
    let url = APPS_SCRIPT_URL;

    // If placeholder is not replaced yet, fallback to internal /api/enquiry for local testing
    if (!url || url === "PASTE_YOUR_EXEC_URL_HERE") {
      const internalRes = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: name.split(/\s+/)[0] || name,
          lastName: name.split(/\s+/).slice(1).join(" ") || "—",
          email,
          company: company || "Direct Importer",
          phone: phone || "+91 00000 00000",
          country: country || "India",
          products: product ? [product] : ["General Export Enquiry"],
          quantity: quantity || "1",
          unit: "MT",
          notes: message,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      if (internalRes.ok) {
        return {
          ok: true,
          message: "Thank you! Our team will contact you within 24 hours.",
        };
      }
    }

    // Direct Google Apps Script POST
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (res.ok && (data?.ok || res.type === "opaque" || res.status === 200)) {
      return {
        ok: true,
        message: "Thank you! Our team will contact you within 24 hours.",
      };
    }

    return {
      ok: false,
      error:
        "Something went wrong. Please try again or email us at shivamkareliya01@gmail.com",
    };
  } catch (err) {
    console.error("[Enquiry Submit Error]:", err);
    return {
      ok: false,
      error:
        "Something went wrong. Please try again or email us at shivamkareliya01@gmail.com",
    };
  }
}
