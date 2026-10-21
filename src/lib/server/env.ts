import fs from "node:fs";
import path from "node:path";

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

function readEnvFile(): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          result[key] = val;
        }
      }
    }
  } catch {
    // fallback to process.env
  }
  return result;
}

export function getServerEnv(): ServerEnv {
  const fileEnv = readEnvFile();
  const getEnv = (key: string, fallback = "") => {
    const val = fileEnv[key] !== undefined ? fileEnv[key] : process.env[key];
    return val !== undefined ? val : fallback;
  };

  const webAppUrl = getEnv("WEB_APP_URL", "");
  const enquirySecret = getEnv("ENQUIRY_SECRET", "");

  const ownerEmailRaw = getEnv("OWNER_EMAIL", "averoinnovations@gmail.com");
  const ownerEmails = ownerEmailRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const smtpHost = getEnv("SMTP_HOST", "");
  const smtpPort = Number.parseInt(getEnv("SMTP_PORT", "587"), 10);
  const smtpUser = getEnv("SMTP_USER", "averoinnovations@gmail.com");
  const smtpPass = getEnv("SMTP_PASS", "");
  const resendApiKey = getEnv("RESEND_API_KEY", "");
  const turnstileSecret = getEnv("TURNSTILE_SECRET_KEY", "");

  const isTestModeExplicit = getEnv("TEST_MODE", "true") === "true";
  const isSmtpConfigured = Boolean((smtpHost && smtpUser && smtpPass) || resendApiKey);
  const testMode = isTestModeExplicit || (!webAppUrl && !isSmtpConfigured);

  const mailFrom = getEnv(
    "MAIL_FROM",
    `"Aurelian International Trade Desk" <${smtpUser || "averoinnovations@gmail.com"}>`
  );

  return {
    WEB_APP_URL: webAppUrl,
    ENQUIRY_SECRET: enquirySecret,
    OWNER_EMAIL: ownerEmails.length > 0 ? ownerEmails : ["averoinnovations@gmail.com"],
    MAIL_FROM: mailFrom,
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: smtpUser,
    SMTP_PASS: smtpPass,
    RESEND_API_KEY: resendApiKey,
    TURNSTILE_SECRET_KEY: turnstileSecret,
    TEST_MODE: testMode,
  };
}
