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
 *    - Execute as: Me (shivamkareliya01@gmail.com)
 *    - Who has access: Anyone
 * 5. Click Deploy, Authorize access, and COPY the Web app URL (ends with /exec).
 * 6. Paste that Web app URL into your .env file as WEB_APP_URL!
 */

const SPREADSHEET_ID = "1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc";
const OWNER_EMAIL = "shivamkareliya01@gmail.com";
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
      "Reference",
      "Client Name",
      "Company",
      "Email Address",
      "Phone / WhatsApp",
      "Destination Country",
      "Export Product",
      "Quantity / Volume",
      "Client Message"
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#0A1B35").setFontColor("#E3B95F");
  }
  return sheet;
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const sheet = getTargetSheet();

    const clientName = d.name || [d.firstName, d.lastName].filter(Boolean).join(" ") || d.fullName || "";
    const products = Array.isArray(d.products)
      ? d.products.map(p => (typeof p === "object" && p ? (p.name || "") : String(p))).filter(Boolean).join(", ")
      : (d.product || "");
    const volume = d.quantity ? String(d.quantity) : (d.unit ? "Unit: " + d.unit : "");
    const message = d.message || d.notes || "";
    const ref = d.reference || ("AV-" + new Date().getFullYear() + "-" + ("000" + sheet.getLastRow()).slice(-4));

    sheet.appendRow([
      new Date(),
      ref,
      clientName,
      d.company || "",
      d.email || "",
      d.phone || "",
      d.country || "",
      products,
      volume,
      message
    ]);

    try {
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        replyTo: d.email || OWNER_EMAIL,
        subject: "New Commercial Enquiry [" + ref + "]: " + (products || "General") + " - " + (clientName || "Unknown"),
        htmlBody:
          "<h3>New commercial export enquiry from website (" + esc(ref) + ")</h3>" +
          "<p><b>Reference:</b> " + esc(ref) + "<br>" +
          "<b>Name:</b> " + esc(clientName) + "<br>" +
          "<b>Company:</b> " + esc(d.company) + "<br>" +
          "<b>Email:</b> " + esc(d.email) + "<br>" +
          "<b>Phone:</b> " + esc(d.phone) + "<br>" +
          "<b>Country:</b> " + esc(d.country) + "<br>" +
          "<b>Product:</b> " + esc(products) + "<br>" +
          "<b>Quantity:</b> " + esc(volume) + "</p>" +
          "<p><b>Message / Notes:</b><br>" + esc(message) + "</p>"
      });
    } catch (mailErr) {
      Logger.log("MailApp error: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, reference: ref }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
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
