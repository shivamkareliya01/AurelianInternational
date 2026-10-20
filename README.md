# Aurelian International — Web Application & Export Enquiry System

Production-ready web platform for **Aurelian International** (Morbi, Gujarat, India), featuring a 62-item export catalogue, interactive quotation builder, and automated commercial enquiry pipeline.

---

## 🏛️ System Architecture

- **Frontend & Fullstack Framework**: [TanStack Start](https://tanstack.com/start) with TanStack Router, React 19, Vite 8, and TailwindCSS / Vanilla CSS.
- **Server Handlers / API Routes**: TanStack Start server handlers powered by Nitro (`src/routes/api.enquiry.ts`, `src/routes/api.enquiries.*`).
- **Database / Persistent Store**: Lightweight JSON document store (`data/enquiries.json`) with atomic file writes, year-based sequential reference generator (`AV-YYYY-NNNN`), and status lifecycle (`New` → `Contacted` → `Quoted` → `Won` → `Lost`).
- **Spreadsheet Generation**: `exceljs` generating 2-sheet formatted `.xlsx` workbooks in memory:
  - **Sheet 1 ("Enquiry")**: Executive 2-column commercial summary styled with brand navy (`#0A1B35`) headers and gold (`#E3B95F`) accents.
  - **Sheet 2 ("Products")**: Itemized breakdown linking catalogue specifications (Origin, Grade, Export Packaging, MOQ, Shelf Life, Certifications).
  - **Formula Injection Defense**: All user values starting with `=`, `+`, `-`, `@` are automatically sanitized and prefixed with an apostrophe (`'`).
- **Email Engine**: `nodemailer` with exponential backoff retries (up to 3 attempts), HTML + plain-text fallback, direct `.xlsx` attachment for the owner, and auto-reply confirmation for the client.
- **Security & Anti-Bot**: Hidden honeypot trap (`_hp_company_fax`), submission time-trap (rejects bots submitting in < 3 seconds), per-IP rate limiting (5 requests/hour), and optional Cloudflare Turnstile token validation.

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your preferred configuration:
```env
# Recipient for commercial quotes (comma-separated supported)
OWNER_EMAIL="export@aurelianinternational.com"
MAIL_FROM="\"Aurelian International Trade Desk\" <noreply@aurelianinternational.com>"

# SMTP Credentials (e.g. Gmail, AWS SES, Brevo, SendGrid)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"

# Or use Resend
RESEND_API_KEY=""

# Anti-Bot (optional for local dev)
TURNSTILE_SECRET_KEY=""

# Local Test Mode (saves emails and Excel files to data/outbox/)
TEST_MODE="true"
```

### 4. Run Locally
```bash
npm run dev
```
The application will start on `http://localhost:8080/`.

---

## 📧 How to Set Up Email Providers

### Option A: Gmail / Google Workspace (Recommended for quick setup)
1. Log into your Google Account and navigate to **Security** → **2-Step Verification**.
2. Scroll to the bottom and select **App passwords**.
3. Generate a new app password for "Aurelian Website" (generates a 16-character password).
4. Set in `.env`:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-google-account@gmail.com"
   SMTP_PASS="xxxx xxxx xxxx xxxx"
   ```

### Option B: Resend
1. Sign up at [resend.com](https://resend.com) and create an API key (`re_...`).
2. Verify your domain (e.g., `aurelianinternational.com`).
3. Set in `.env`:
   ```env
   RESEND_API_KEY="re_123456789"
   MAIL_FROM="\"Aurelian Export Desk\" <export@aurelianinternational.com>"
   ```

### Option C: AWS SES / SendGrid / Brevo
Set standard SMTP credentials:
```env
SMTP_HOST="smtp.sendgrid.net" # or email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="SG.xxxxxxxx"
```

---

## 🧪 Testing the Enquiry Workflow

An automated verification test script is included in `scripts/test-enquiry-workflow.mjs`.

To run the automated test suite against the running server:
```bash
node scripts/test-enquiry-workflow.mjs
```

### Test Coverage:
1. **Valid Submission (3 Products)**:
   - Validates client details, company, destination country, and selected products.
   - Generates sequential reference (e.g., `AV-2026-0001`).
   - Generates branded 2-sheet Excel file (`Enquiry_AV-2026-0001_Henderson_Foods_Ltd.xlsx`).
   - Dispatches owner notification email with attachment.
   - Dispatches client confirmation email with 24h response SLA.
   - Persists enquiry into `data/enquiries.json`.
2. **Invalid Email Validation**:
   - Submits malformed email `trade-invalid-email` → verified server returns HTTP 400 with field error.
3. **Empty Products Validation**:
   - Submits 0 products → verified server returns HTTP 400 with product selection error.
4. **Honeypot Anti-Bot Trap**:
   - Fills hidden `_hp_company_fax` field → verified server blocks submission with HTTP 400.
5. **Fast Submission Time-Trap**:
   - Submits within 50ms of page load → verified server blocks bot with HTTP 400.
6. **Rate Limiting**:
   - Submits 6 requests rapidly → verified server enforces 5 req/hour limit and responds with HTTP 429.

---

## 🚢 Deployment Instructions

### Deploy to Vercel / Netlify
1. Connect your repository to Vercel or Netlify.
2. In the deployment dashboard, add the environment variables listed in `.env.example`:
   - `OWNER_EMAIL`
   - `MAIL_FROM`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (or `RESEND_API_KEY`)
   - `TEST_MODE="false"`
3. Framework preset: **TanStack Start** / **Vite** / **Nitro**.
4. Build command: `npm run build`
5. Output directory: default (`.output` / `.vercel`).

### Deploy to Self-Hosted Node.js / Docker / VPS
1. Run `npm run build`.
2. Launch the Nitro server:
   ```bash
   node .output/server/index.mjs
   ```
3. Set process environment variables or use a `.env` file in the working directory.
4. Use PM2 or systemd to keep the service running.
