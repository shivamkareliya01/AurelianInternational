// src/lib/server/apps-script.ts
// Secure bridge forwarding enquiries to Google Apps Script Web App with retries

export interface AppsScriptPayload {
  secret: string;
  reference?: string;
  name?: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  product?: string;
  products: string[];
  quantity?: string;
  unit: string;
  message?: string;
  notes?: string;
  sourcePage?: string;
}

export interface AppsScriptResult {
  ok: boolean;
  reference?: string;
  error?: string;
  attempts: number;
}

/**
 * Forward commercial quotation enquiry payload to Google Apps Script Web App.
 * Includes exponential backoff retry (up to 3 attempts) and redirect following.
 */
export async function forwardToAppsScript(
  webAppUrl: string,
  payload: AppsScriptPayload,
  maxRetries = 3
): Promise<AppsScriptResult> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return {
      ok: false,
      error: "WEB_APP_URL is not configured in server environment.",
      attempts: 0,
    };
  }

  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const res = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        // Google Apps Script requires follow redirects (302 -> script.googleusercontent.com)
        redirect: "follow",
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        // If not valid JSON, capture raw text
        data = null;
      }

      if (res.ok && data?.ok) {
        return {
          ok: true,
          reference: data.reference,
          attempts: attempt,
        };
      }

      const errMsg =
        data?.error || `HTTP ${res.status}: ${text ? text.slice(0, 150) : res.statusText}`;
      lastError = errMsg;
      console.warn(
        `[Apps Script Webhook] Attempt ${attempt}/${maxRetries} rejected: ${errMsg}`
      );

      // If unauthorized (bad secret), don't blindly retry — secret won't change
      if (data?.error === "unauthorized") {
        return {
          ok: false,
          error: "unauthorized: ENQUIRY_SECRET does not match Google Apps Script SECRET property.",
          attempts: attempt,
        };
      }
    } catch (netErr: any) {
      lastError = netErr?.name === "AbortError" ? "Request timed out (20s)" : (netErr?.message || String(netErr));
      console.warn(
        `[Apps Script Webhook] Attempt ${attempt}/${maxRetries} network error: ${lastError}`
      );
    }

    if (attempt < maxRetries) {
      // Exponential backoff delay: 600ms, 1500ms
      const delay = Math.pow(2, attempt - 1) * 600;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return {
    ok: false,
    error: lastError,
    attempts: maxRetries,
  };
}
