# Commercial Enquiry Workflow Setup Guide
**Aurelian International — Export Quotations & Google Sheet Integration**

This document provides step-by-step instructions for non-technical users to set up the live Google Sheet and automatic email notification workflow.

---

## Architecture Overview
```
Client Submits Website Form 
   ⬇ (Encrypted POST)
Website Server Endpoint (/api/enquiry)
   ⬇ (Validates, blocks spam, keeps secret hidden)
Google Apps Script Web App
   ⬇
1. Appends formatted row to Google Sheet ("Aurelian Enquiries")
2. Sends instant HTML notification email to OWNER with client Reply-To & 1-click Excel (.xlsx) link
3. Sends instant branded confirmation email to Client with Reference Number (e.g. AV-2026-0001)
```

---

## Step-by-Step Setup Instructions

### Step 1: Create the Google Sheet
1. Open [Google Sheets](https://sheets.google.com) in the owner's Google Workspace or Gmail account.
2. Click **Blank spreadsheet** (`+`).
3. Title the spreadsheet in the top-left corner:  
   `Aurelian Enquiries`
4. Leave the sheet empty. The script will automatically create the styled headers (`Reference`, `Date & Time (IST)`, `First Name`, `Last Name`, `Company`, `Email`, `Phone`, `Destination Country`, `Products`, etc.) on the first submission.

---

### Step 2: Open Google Apps Script & Paste the Code
1. In your newly created Google Sheet, click the top menu:  
   **Extensions** ➔ **Apps Script**.
2. A new tab will open showing an editor with `myFunction()`.
3. Select and delete all sample code inside the editor.
4. Copy the entire contents of [`docs/google-apps-script/Code.gs`](file:///docs/google-apps-script/Code.gs) from this repository.
5. Paste it into the Apps Script editor window.
6. Click the **Save** icon (floppy disk) or press `Ctrl + S` (`Cmd + S` on Mac).
7. Rename the project in the top-left from *Untitled project* to `Aurelian Enquiry Webhook`.

---

### Step 3: Add Script Properties (SECRET and OWNER_EMAIL)
1. On the left sidebar of the Apps Script window, click the **Gear icon** (⚙️ **Project Settings**).
2. Scroll down to the **Script properties** section.
3. Click **Add script property**.
4. Add the first property:
   - **Property**: `SECRET`
   - **Value**: Generate a random 32+ character string (e.g. `aurelian_sec_88f9a2b71c4e095d3a1f8e2c7a9b0d1e` or use [1Password/Bitwarden/RandomKeyGen.com](https://randomkeygen.com)).
5. Click **Add script property** again.
6. Add the second property:
   - **Property**: `OWNER_EMAIL`
   - **Value**: `aurelianinternational@gmail.com`
7. Click **Save script properties**.

---

### Step 4: Deploy as Web App
1. At the top right of the Apps Script screen, click **Deploy** ➔ **New deployment**.
2. Next to *Select type*, click the **Gear icon** (⚙️) and select **Web app**.
3. Configure the fields as follows:
   - **Description**: `Aurelian Live Enquiry Webhook v1`
   - **Execute as**: **Me (your-email@gmail.com)** *(Important: must be "Me")*
   - **Who has access**: **Anyone** *(Important: allows our secure website backend to deliver the quote requests)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   - Click **Authorize access**.
   - Select your Google account.
   - You may see a screen saying *"Google hasn’t verified this app"*. Click **Advanced** at the bottom left, then click **Go to Aurelian Enquiry Webhook (unsafe)**.
   - Click **Allow** to give permission to manage the spreadsheet and send emails.
6. Once deployed, you will see **Web app URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).
7. **Copy this Web App URL**.

---

### Step 5: Put Web App URL & Secret in Website Environment
1. On your hosting server (Vercel, Netlify, or local `.env` file):
   - Set `WEB_APP_URL`: The URL you copied in Step 4.
   - Set `ENQUIRY_SECRET`: The exact same secret string you entered in Step 3 (`SECRET`).
2. Example `.env`:
   ```bash
   WEB_APP_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ENQUIRY_SECRET="aurelian_sec_88f9a2b71c4e095d3a1f8e2c7a9b0d1e"
   ```
3. Restart or redeploy the website so the environment variables take effect.

---

### Step 6: How to Update or Redeploy After Code Changes
Whenever you edit code in `Code.gs`:
1. Save the file (`Ctrl + S`).
2. Click **Deploy** ➔ **Manage deployments**.
3. Click the **Pencil icon** (Edit) next to the active deployment.
4. Under **Version**, select **New version**.
5. Click **Deploy**. *(Note: Google Apps Script requires creating a "New version" for edits to become live).*

---

### Step 7: How to Test and Verify
1. Go to your website: `http://localhost:8080/#enquiry-form` (or live domain).
2. Fill out the **Request Commercial Quotation** form with test details:
   - First Name: `Test`
   - Last Name: `Buyer`
   - Company: `Global Foods Ltd`
   - Email: Your own personal email (to verify client confirmation)
   - Phone: `+1 555 123 4567`
   - Destination: `United States`
   - Products: Select 1 or 2 products (e.g. *Beetroot Powder*, *1121 Basmati Rice*)
3. Click **Submit Commercial Quotation Request**.
4. **What you will see**:
   - **On the website**: Success screen showing reference number `AV-2026-0001` and confirmation notice.
   - **In your Google Sheet**: A new row formatted with navy header and gold text, containing all details.
   - **In the Owner's Inbox**: A notification email with all specifications, a direct link to the Sheet, an **Excel (.xlsx)** download link, and the Reply button replying directly to the client.
   - **In the Client's Inbox**: A branded confirmation acknowledging receipt with 24-hour turnaround notice.
