// src/lib/server/security.ts
// Anti-spam, rate limiting, and injection sanitization

import { getServerEnv } from "./env";

/**
 * Strips HTML tags and unsafe ASCII control characters (keeping standard newlines and tabs).
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    // Remove HTML tags
    .replace(/<[^>]*>?/gm, "")
    // Remove control characters except newline and tab
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Prevents CSV / Excel Formula Injection (CWE-1236).
 * If a cell value begins with =, +, -, @, or tab/CR, prepend an apostrophe (')
 * so spreadsheet engines treat it strictly as literal text.
 */
export function sanitizeExcelValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

// In-memory sliding window IP rate limiter (5 submissions per hour by default)
interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();
let lastPruneAt = 0;

function pruneStaleEntries(now: number) {
  if (now - lastPruneAt < 60 * 1000) return; // at most once every minute
  lastPruneAt = now;
  const oneHourAgo = now - 60 * 60 * 1000;
  for (const [ip, record] of ipRequestMap.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > oneHourAgo);
    if (record.timestamps.length === 0) {
      ipRequestMap.delete(ip);
    }
  }
}

export function checkRateLimit(
  ip: string,
  maxSubmissions = 5,
  windowMs = 60 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  // Normalize localhost / loopback IPs for testing
  const normalizedIp = ip === "::1" || ip === "127.0.0.1" ? "127.0.0.1" : ip;
  const now = Date.now();
  pruneStaleEntries(now);
  const windowStart = now - windowMs;

  let record = ipRequestMap.get(normalizedIp);
  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(normalizedIp, record);
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= maxSubmissions) {
    const oldest = record.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxSubmissions - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Reset rate limit for a specific IP (useful for automated testing)
 */
export function resetRateLimit(ip: string): void {
  const normalizedIp = ip === "::1" || ip === "127.0.0.1" ? "127.0.0.1" : ip;
  ipRequestMap.delete(normalizedIp);
}

/**
 * Validates Cloudflare Turnstile token if configured in server environment.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const { TURNSTILE_SECRET_KEY, TEST_MODE } = getServerEnv();

  // If Turnstile is not configured or in test mode, allow smoothly
  if (!TURNSTILE_SECRET_KEY || TEST_MODE) {
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Turnstile challenge token missing." };
  }

  try {
    const body = new URLSearchParams();
    body.append("secret", TURNSTILE_SECRET_KEY);
    body.append("response", token);
    if (remoteIp) body.append("remoteip", remoteIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return {
        success: false,
        error: `Bot verification failed: ${(data["error-codes"] || []).join(", ")}`,
      };
    }
    return { success: true };
  } catch (err) {
    console.error("Turnstile verification error:", err);
    // Don't fail the user if Cloudflare siteverify is temporarily unreachable
    return { success: true };
  }
}
