/**
 * Aurelian International — Google Apps Script Enquiries Webhook
 * 
 * Features:
 * 1. Appends every commercial enquiry as a formatted row to the 'Enquiries' Google Sheet.
 * 2. Generates sequential export reference numbers (AV-YYYY-NNNN).
 * 3. Sends instant HTML notification email to OWNER_EMAIL with replyTo set to the client.
 * 4. Includes direct 1-click links to the live Sheet and direct .xlsx Excel export.
 * 5. Sends instant branded confirmation email to the client.
 * 6. Thread-safe execution using ScriptLock to prevent concurrent row collisions.
 */

const SHEET_NAME = 'Enquiries';
const HEADERS = [
  'Reference',
  'Date & Time (IST)',
  'Status',
  'First Name',
  'Last Name',
  'Company',
  'Email',
  'Phone',
  'Destination Country',
  'Products',
  'No. of Products',
  'Quantity',
  'Unit',
  'Notes',
  'Source Page'
];

/**
 * Handle GET requests for health check verification
 */
function doGet(e) {
  return json_({
    ok: true,
    service: 'Aurelian International Enquiries Webhook',
    status: 'online',
    timestamp: new Date().toISOString()
  });
}

/**
 * Primary webhook handler for POST /api/enquiry
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 20 seconds for lock release if concurrent requests arrive
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'missing_request_body' });
    }

    const P = PropertiesService.getScriptProperties();
    const configuredSecret = P.getProperty('SECRET');
    const ownerEmail = P.getProperty('OWNER_EMAIL');

    let d;
    try {
      d = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ ok: false, error: 'invalid_json_payload' });
    }

    // 1. Secret authentication
    if (!d.secret || !configuredSecret || d.secret !== configuredSecret) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    // 2. Mandatory fields validation
    if (!d.email || !d.firstName || !(d.products && d.products.length)) {
      return json_({ ok: false, error: 'missing fields' });
    }

    // 3. Spreadsheet & sheet initialization
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // If sheet is empty, create styled header row and freeze it
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length)
        .setBackground('#0a1b35')
        .setFontColor('#e3b95f')
        .setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    // 4. Generate sequential reference number (AV-YYYY-NNNN)
    const currentYear = new Date().getFullYear();
    const seqNum = ('000' + sh.getLastRow()).slice(-4);
    const ref = 'AV-' + currentYear + '-' + seqNum;
    const when = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');

    // 5. Normalize products (handles both string array and object array)
    const rawProducts = Array.isArray(d.products) ? d.products : [];
    const productsList = rawProducts
      .map(p => (typeof p === 'object' && p !== null ? (p.name || '') : String(p)))
      .filter(Boolean);
    const products = productsList.join(', ');
    const productCount = productsList.length;

    const quantityText = d.quantity ? String(d.quantity) : '';
    const unitText = d.unit ? String(d.unit) : 'MT';
    const quantityDisplay = quantityText ? (quantityText + ' ' + unitText) : 'Unspecified';

    // 6. Append row as plain text strings to preserve phone numbers and formatting
    const row = [
      ref,
      when,
      'New',
      d.firstName,
      d.lastName,
      d.company,
      d.email,
      d.phone,
      d.country,
      products,
      productCount,
      quantityText,
      unitText,
      d.notes,
      d.sourcePage
    ].map(v => String(v == null ? '' : v));

    const nextRowIndex = sh.getLastRow() + 1;
    sh.getRange(nextRowIndex, 1, 1, row.length)
      .setNumberFormat('@')
      .setValues([row]);

    // Auto-fit columns 1-8 for clean readability
    sh.autoResizeColumns(1, 8);

    // 7. Generate direct links
    const sheetUrl = ss.getUrl();
    const xlsxUrl = sheetUrl.replace(/\/edit.*$/, '/export?format=xlsx');

    // 8. Send notification email to Owner
    const rowsHtml = [
      ['Reference', ref],
      ['Received', when + ' (IST)'],
      ['Client Name', d.firstName + ' ' + (d.lastName || '')],
      ['Company', d.company],
      ['Official Email', d.email],
      ['Phone', d.phone],
      ['Destination', d.country],
      ['Products', products],
      ['Quantity', quantityDisplay],
      ['Notes / Specifications', d.notes || 'None provided'],
      ['Originating Page', d.sourcePage || '/']
    ].map(x => '<tr><td style="padding:6px 12px;color:#666;font-size:13px;border-bottom:1px solid #eee;white-space:nowrap">' + x[0] + '</td><td style="padding:6px 12px;font-size:13px;border-bottom:1px solid #eee"><b>' + esc_(x[1]) + '</b></td></tr>').join('');

    if (ownerEmail) {
      MailApp.sendEmail({
        to: ownerEmail,
        replyTo: d.email,
        name: 'Aurelian Website Trade Desk',
        subject: 'New Export Enquiry ' + ref + ' - ' + d.company + ' (' + d.country + ') - ' + productCount + ' product(s)',
        htmlBody: '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;color:#1a1a1a;line-height:1.5">' +
          '<div style="background:#0a1b35;padding:18px 24px;border-radius:8px 8px 0 0">' +
            '<h2 style="color:#e3b95f;margin:0;font-size:20px;letter-spacing:0.5px">Aurelian International — New Export Enquiry</h2>' +
            '<p style="color:#ffffff;margin:4px 0 0 0;font-size:13px">Reference: <b>' + ref + '</b></p>' +
          '</div>' +
          '<div style="background:#ffffff;padding:24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">' +
            '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">' + rowsHtml + '</table>' +
            '<div style="background:#faf8f3;padding:14px 18px;border-radius:6px;border:1px solid #ecd8ab;margin:20px 0">' +
              '<p style="margin:0;font-size:13px"><b>Spreadsheet Actions:</b></p>' +
              '<p style="margin:6px 0 0 0;font-size:13px">' +
                '<a href="' + sheetUrl + '" style="color:#0a1b35;font-weight:bold;text-decoration:underline">Open Live Enquiry Sheet</a> &nbsp;|&nbsp; ' +
                '<a href="' + xlsxUrl + '" style="color:#b28020;font-weight:bold;text-decoration:underline">Download as Excel (.xlsx)</a>' +
              '</p>' +
            '</div>' +
            '<p style="color:#777;font-size:12px;margin:16px 0 0 0">💡 <b>Tip:</b> Click <b>Reply</b> in your email client to send a direct response to ' + esc_(d.email) + '.</p>' +
          '</div>' +
        '</div>'
      });
    }

    // 9. Send branded confirmation email to Client
    try {
      const primaryOwnerEmail = (ownerEmail || '').split(',')[0].trim() || 'shivamkareliya01@gmail.com';
      MailApp.sendEmail({
        to: d.email,
        replyTo: primaryOwnerEmail,
        name: 'Aurelian International',
        subject: 'We received your export enquiry ' + ref + ' — Aurelian International',
        htmlBody: '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;color:#1a1a1a;line-height:1.6">' +
          '<div style="background:#0a1b35;padding:20px 24px;border-radius:8px 8px 0 0">' +
            '<h2 style="color:#e3b95f;margin:0;font-size:22px">Aurelian International</h2>' +
            '<p style="color:#e0e0e0;margin:4px 0 0 0;font-size:13px">Commercial Export Desk · India</p>' +
          '</div>' +
          '<div style="background:#ffffff;padding:24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">' +
            '<p style="font-size:15px">Dear ' + esc_(d.firstName) + ',</p>' +
            '<p style="font-size:14px">Thank you for your commercial enquiry for: <b>' + esc_(products) + '</b>.</p>' +
            '<p style="font-size:14px">Your inquiry has been assigned reference number: <strong style="color:#b28020">' + ref + '</strong>.</p>' +
            '<p style="font-size:14px">Our international export desk is reviewing your requirements and destination specifications (' + esc_(d.country) + '). A representative will respond with FOB/CIF quotation, laboratory certificates, and container schedules within <b>24 hours</b>.</p>' +
            '<div style="margin:24px 0;padding:16px;background:#f5f7fa;border-left:4px solid #0a1b35;font-size:13px">' +
              '<p style="margin:0 0 6px 0"><b>Aurelian International</b></p>' +
              '<p style="margin:0 0 4px 0">Agricultural Produce, Dehydrated Powders, Natural Stones & Vitrified Tiles</p>' +
              '<p style="margin:0">Morbi & Gujarat, India | Direct Export Desk</p>' +
            '</div>' +
            '<p style="color:#888;font-size:12px;margin:0">If you have urgent container requirements, you may reply directly to this email.</p>' +
          '</div>' +
        '</div>'
      });
    } catch (clientMailErr) {
      console.warn('Could not send client confirmation email: ' + clientMailErr);
    }

    return json_({ ok: true, reference: ref });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>'"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[m]));
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
