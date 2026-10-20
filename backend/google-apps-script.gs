/**
 * Aurelian International — Google Apps Script Enquiry Webhook
 * Linked Spreadsheet: https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit
 * 
 * 3-MINUTE SETUP GUIDE:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit
 * 2. In the top menu, click: Extensions > Apps Script
 * 3. Delete any code there, paste THIS ENTIRE FILE, and click Save (Ctrl + S).
 * 4. Click Deploy > New deployment:
 *    - Click the gear icon (⚙️) next to "Select type" and choose "Web app"
 *    - Description: Aurelian Website Live Enquiries
 *    - Execute as: Me (aurelianinternational@gmail.com)
 *    - Who has access: Anyone
 * 5. Click Deploy, Authorize access, and COPY the Web app URL (ends with /exec).
 * 6. Send the Web app URL here or paste it into your .env file as VITE_APPS_SCRIPT_URL!
 */

const SPREADSHEET_ID = "1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc";
const OWNER_EMAIL = "aurelianinternational@gmail.com";
const SHEET_NAME = "Sheet1";

function getTargetSheet() {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  
  // Auto-initialize headers if first row is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Client Name",
      "Company",
      "Email Address",
      "Phone / WhatsApp",
      "Destination Country",
      "Export Product",
      "Quantity / Volume",
      "Client Message"
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#D4AF37").setFontColor("#000000");
  }
  return sheet;
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const sheet = getTargetSheet();
    sheet.appendRow([
      new Date(),
      d.name || "",
      d.company || "",
      d.email || "",
      d.phone || "",
      d.country || "",
      d.product || "",
      d.quantity || "",
      d.message || ""
    ]);

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      replyTo: d.email || OWNER_EMAIL,
      subject: "New Enquiry: " + (d.product || "General") + " - " + (d.name || "Unknown"),
      htmlBody:
        "<h3>New commercial enquiry from website</h3>" +
        "<p><b>Name:</b> " + esc(d.name) + "<br>" +
        "<b>Company:</b> " + esc(d.company) + "<br>" +
        "<b>Email:</b> " + esc(d.email) + "<br>" +
        "<b>Phone:</b> " + esc(d.phone) + "<br>" +
        "<b>Country:</b> " + esc(d.country) + "<br>" +
        "<b>Product:</b> " + esc(d.product) + "<br>" +
        "<b>Quantity:</b> " + esc(d.quantity) + "</p>" +
        "<p><b>Message:</b><br>" + esc(d.message) + "</p>"
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    sheetId: SPREADSHEET_ID,
    owner: OWNER_EMAIL,
    message: "Aurelian International Apps Script Webhook is active and connected!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
