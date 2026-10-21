/**
 * Aurelian International — Google Apps Script Live Enquiry Webhook
 * Appends every enquiry to the SAME Google Sheet and sends instant email notification.
 * 
 * -----------------------------------------------------------------------------
 * 3-MINUTE SETUP INSTRUCTIONS:
 * -----------------------------------------------------------------------------
 * 1. Open your Google Sheet in browser:
 *    https://docs.google.com/spreadsheets/d/1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc/edit
 * 2. In top menu click: Extensions > Apps Script
 * 3. Delete all code inside, paste THIS ENTIRE SCRIPT, and click Save (Ctrl + S).
 * 4. Click Deploy > New deployment (or Manage deployments > Edit > New version):
 *    - Type: Web app
 *    - Description: Aurelian Live Enquiries
 *    - Execute as: Me (averoinnovations@gmail.com)
 *    - Who has access: Anyone
 * 5. Click Deploy, Authorize access, and copy the Web App URL (ends with /exec).
 * 6. Make sure this URL is in your .env file as WEB_APP_URL!
 */

const OWNER_EMAIL = "averoinnovations@gmail.com";
const SHEET_NAME = "Sheet1";

/**
 * Accesses or initializes the target sheet.
 * Automatically connects to the spreadsheet where this script is installed!
 */
function getTargetSheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    try {
      ss = SpreadsheetApp.openById("1086JPGL_w9HTWbS8SiHJ9Ahdl0uMG-5fLkNeLhlYbgc");
    } catch (e) {
      throw new Error("Could not find spreadsheet. Make sure this script is opened via Extensions > Apps Script inside your Google Sheet.");
    }
  }
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

  // Auto-initialize styled header row if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Date & Time (IST)",
      "Reference",
      "Client Name",
      "Importing Company",
      "Official Email",
      "Phone / WhatsApp",
      "Destination Country",
      "Export Products",
      "Order Volume",
      "Client Notes / Requirements"
    ]);

    // Style header row (Navy #0A1B35 background, Gold #E3B95F text)
    const headerRange = sheet.getRange(1, 1, 1, 10);
    headerRange.setFontWeight("bold")
      .setBackground("#0A1B35")
      .setFontColor("#E3B95F")
      .setFontSize(10);
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);

    // Auto-fit column widths
    try {
      sheet.autoResizeColumns(1, 8);
    } catch (e) {}
  }
  return sheet;
}

/**
 * Handles incoming POST requests from the website.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: "Empty request payload" });
    }

    const d = JSON.parse(e.postData.contents);
    const sheet = getTargetSheet();

    const clientName = d.name || [d.firstName, d.lastName].filter(Boolean).join(" ") || d.fullName || "Trade Buyer";
    const company = d.company || "N/A";
    const email = d.email || "";
    const phone = d.phone || "";
    const country = d.country || "";
    
    // Parse products array or string
    const products = Array.isArray(d.products)
      ? d.products.map(p => (typeof p === "object" && p ? (p.name || "") : String(p))).filter(Boolean).join(", ")
      : (d.product || "Export Catalog Items");

    const volume = d.quantity ? String(d.quantity) : (d.unit ? "Unit: " + d.unit : "Standard Commercial MOQ");
    const message = d.message || d.notes || "None specified";
    const ref = d.reference || ("AV-" + new Date().getFullYear() + "-" + ("000" + sheet.getLastRow()).slice(-4));
    
    // Current IST timestamp
    const istTime = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");

    // 1. Append new row into the SAME spreadsheet
    sheet.appendRow([
      istTime,
      ref,
      clientName,
      company,
      email,
      phone,
      country,
      products,
      volume,
      message
    ]);

    // Format new row styling
    const newRowIndex = sheet.getLastRow();
    const newRowRange = sheet.getRange(newRowIndex, 1, 1, 10);
    newRowRange.setVerticalAlignment("middle").setFontSize(9);
    sheet.setRowHeight(newRowIndex, 24);

    // 2. Send instant Email Notification to Owner
    try {
      const emailSubject = "New Export Quotation [" + ref + "] — " + company + " (" + (country || "International") + ")";
      
      const emailHtml =
        "<div style='margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #0f172a;'>" +
          "<div style='max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05);'>" +
            
            // Header
            "<div style='background: #0A1B35; padding: 20px 24px; border-bottom: 3px solid #E3B95F;'>" +
              "<h2 style='color: #E3B95F; margin: 0; font-size: 20px; letter-spacing: 0.5px;'>Aurelian International — New Export Enquiry</h2>" +
              "<p style='color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px;'>Reference: <strong style='color: #ffffff;'>" + esc_(ref) + "</strong> &nbsp;|&nbsp; Received: " + istTime + "</p>" +
            "</div>" +

            // Content Table
            "<div style='padding: 24px;'>" +
              "<table style='width: 100%; border-collapse: collapse; font-size: 13px;'>" +
                rowHtml_("Client Name", clientName) +
                rowHtml_("Company", company) +
                rowHtml_("Official Email", email ? "<a href='mailto:" + esc_(email) + "' style='color: #0284c7; text-decoration: none; font-weight: bold;'>" + esc_(email) + "</a>" : "N/A") +
                rowHtml_("Phone / WhatsApp", phone ? "<a href='https://wa.me/" + phone.replace(/[^0-9]/g, "") + "' style='color: #16a34a; text-decoration: none; font-weight: bold;'>" + esc_(phone) + " (WhatsApp)</a>" : "N/A") +
                rowHtml_("Destination Country", country) +
                rowHtml_("Export Products", "<strong style='color: #0A1B35;'>" + esc_(products) + "</strong>") +
                rowHtml_("Order Volume", volume) +
                rowHtml_("Client Notes", esc_(message)) +
              "</table>" +

              // Action Box
              "<div style='margin-top: 24px; padding: 14px 18px; background-color: #faf5ea; border: 1px solid #e9d7af; border-radius: 8px;'>" +
                "<p style='margin: 0; font-size: 13px; color: #78350f;'><b>📊 Live Google Sheet:</b></p>" +
                "<p style='margin: 6px 0 0 0; font-size: 13px;'>" +
                  "<a href='" + sheet.getParent().getUrl() + "' style='color: #0A1B35; font-weight: bold; text-decoration: underline;'>Open Aurelian Enquiries Spreadsheet</a>" +
                "</p>" +
              "</div>" +

              "<p style='margin: 18px 0 0 0; font-size: 12px; color: #64748b;'>" +
                "💡 <b>Quick Reply:</b> Click <b>Reply</b> in your email client to send a direct response to " + (email || "the client") + "." +
              "</p>" +
            "</div>" +

          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: OWNER_EMAIL,
        replyTo: email || OWNER_EMAIL,
        subject: emailSubject,
        htmlBody: emailHtml
      });
    } catch (mailErr) {
      Logger.log("MailApp Error: " + mailErr);
    }

    return jsonResponse_({
      ok: true,
      reference: ref,
      sheetUrl: sheet.getParent().getUrl()
    });
  } catch (err) {
    Logger.log("doPost Error: " + err);
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/**
 * Handles GET health check requests to verify status and retrieve real sheet URL.
 */
function doGet(e) {
  try {
    const sheet = getTargetSheet();
    return jsonResponse_({
      status: "online",
      sheetUrl: sheet.getParent().getUrl(),
      owner: OWNER_EMAIL,
      message: "Aurelian International Apps Script Webhook is active and connected!"
    });
  } catch (err) {
    return jsonResponse_({
      status: "online",
      owner: OWNER_EMAIL,
      message: "Webhook active"
    });
  }
}

function rowHtml_(label, value) {
  return "<tr>" +
    "<td style='padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 35%; vertical-align: top; font-weight: 500;'>" + label + "</td>" +
    "<td style='padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; width: 65%;'>" + value + "</td>" +
  "</tr>";
}

function esc_(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
