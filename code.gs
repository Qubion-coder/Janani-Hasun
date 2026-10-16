/**
 * Google Apps Script Web App — Janani & Hasun Wedding RSVP
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1qaJkKLh05HuMXUTdbHZzBG2PKUxVvs281HLy1p0MA2g/edit
 *
 * The "RSVP" sheet (with styled headers) is created automatically on the
 * first submission, or right away by running setupSheets() once.
 */

const SPREADSHEET_ID = "1qaJkKLh05HuMXUTdbHZzBG2PKUxVvs281HLy1p0MA2g";
const TIME_ZONE = "Asia/Colombo";

const SHEETS = {
  rsvp: {
    name: "RSVP",
    headers: ["Submitted At", "Name", "Attendance", "Guests", "Invite Link Name", "Invited As"],
    widths: [170, 220, 120, 80, 180, 190],
  },
};

/** Run once from the editor to create the RSVP sheet and its headers. */
function setupSheets() {
  getSheet_("rsvp");
}

function doPost(e) {
  return handleRequest_(e);
}

function doGet(e) {
  if (!e || !e.parameter || !e.parameter.action) {
    return jsonResponse_({ ok: true, message: "RSVP service is running" });
  }
  return handleRequest_(e);
}

function handleRequest_(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const params = parseParams_(e);
    const action = String(params.action || "").trim().toLowerCase();

    if (action === "rsvp") return jsonResponse_(saveRsvp_(params));

    return jsonResponse_({ ok: false, message: action ? "Invalid action" : "Missing action" });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error && error.message ? error.message : "Unexpected error" });
  } finally {
    lock.releaseLock();
  }
}

function saveRsvp_(params) {
  const name = clean_(params.name, 120);
  if (!name) return { ok: false, message: "Name is required" };

  const guests = clean_(params.guests, 3) || "1";
  const attending = guests !== "0";

  const sheet = getSheet_("rsvp");
  sheet.appendRow([
    now_(),
    name,
    attending ? "Attending" : "Declined",
    attending ? Number(guests) || 1 : 0,
    clean_(params.inviteName, 120),
    clean_(params.salutation, 160),
  ]);

  const row = sheet.getLastRow();
  sheet.getRange(row, 3)
    .setFontColor(attending ? "#1E6B3A" : "#9B2C2C")
    .setFontWeight("bold");

  return { ok: true, message: "RSVP saved" };
}

/** Returns the sheet for `key`, creating it and its header row if needed. */
function getSheet_(key) {
  const config = SHEETS[key];
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(config.name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    const header = sheet.getRange(1, 1, 1, config.headers.length);
    header
      .setValues([config.headers])
      .setFontWeight("bold")
      .setFontColor("#FFFFFF")
      .setBackground("#8C6420")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    sheet.setRowHeight(1, 34);
    sheet.setFrozenRows(1);
    config.widths.forEach(function (width, i) {
      sheet.setColumnWidth(i + 1, width);
    });
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");

    // Remove the blank default "Sheet1" once a real sheet exists.
    const blank = spreadsheet.getSheetByName("Sheet1");
    if (blank && blank.getLastRow() === 0 && spreadsheet.getSheets().length > 1) {
      spreadsheet.deleteSheet(blank);
    }
  }

  return sheet;
}

function now_() {
  return Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm:ss");
}

/** Trims, caps length, and blocks spreadsheet formula injection. */
function clean_(value, maxLength) {
  let text = String(value == null ? "" : value).trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function parseParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});
  const contents = e && e.postData && e.postData.contents ? String(e.postData.contents).trim() : "";
  if (!contents) return params;

  if (contents.charAt(0) === "{") {
    return Object.assign(params, JSON.parse(contents));
  }

  contents.split("&").forEach(function (pair) {
    if (!pair) return;
    const parts = pair.split("=");
    const key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    const value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
    if (key) params[key] = value;
  });
  return params;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
