// src/lib/server/env.ts
// Centralized server-side environment variables configuration

export interface ServerEnv {
  WEB_APP_URL: string;
  ENQUIRY_SECRET: string;
  OWNER_EMAIL: string[];
  MAIL_FROM: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  TEST_MODE: boolean;
}

export function getServerEnv(): ServerEnv {
  // Never expose secrets to client code
  const webAppUrl = process.env.WEB_APP_URL || "";
  const enquirySecret = process.env.ENQUIRY_SECRET || "";

  const ownerEmailRaw =
    process.env.OWNER_EMAIL || "aurelianinternational@gmail.com";
  const ownerEmails = ownerEmailRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const smtpHost = process.env.SMTP_HOST || "";
  const smtpPort = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";
  const resendApiKey = process.env.RESEND_API_KEY || "";
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "";

  const isTestModeExplicit = process.env.TEST_MODE === "true";
  const isSmtpConfigured = Boolean((smtpHost && smtpUser && smtpPass) || resendApiKey);
  const testMode = isTestModeExplicit || (!webAppUrl && !isSmtpConfigured);

  return {
    WEB_APP_URL: webAppUrl,
    ENQUIRY_SECRET: enquirySecret,
    OWNER_EMAIL: ownerEmails.length > 0 ? ownerEmails : ["sales@aurelianinternational.com"],
    MAIL_FROM: process.env.MAIL_FROM || "Aurelian International Trade Desk <quotes@aurelianinternational.com>",
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: smtpUser,
    SMTP_PASS: smtpPass,
    RESEND_API_KEY: resendApiKey,
    TURNSTILE_SECRET_KEY: turnstileSecret,
    TEST_MODE: testMode,
  };
}
