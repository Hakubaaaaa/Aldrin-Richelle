/**
 * QuakeNet-style backend? No — this is the wedding site's backend.
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet.
 * It receives RSVP submissions from the wedding site, logs each one as a
 * new row in the Sheet, emails a notification to the couple, and (for
 * RSVPs that include an email) emails the guest a confirmation + short
 * thank-you message. Email is the only notification channel used —
 * there is no SMS/text messaging.
 *
 * SETUP — see SETUP-GUIDE.md for the full walkthrough. Short version:
 * 1. Create a new Google Sheet. Add a tab named exactly "RSVP".
 * 2. In the Sheet, go to Extensions > Apps Script, delete the placeholder
 *    code, and paste this entire file in.
 * 3. Edit NOTIFY_EMAIL below to the email(s) that should get notified.
 * 4. Click Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into CONFIG.appsScriptUrl in app.js.
 */

const NOTIFY_EMAIL = "your-email@example.com"; // REPLACE — couple's email, comma-separate for multiple

// Short note the guest sees in their RSVP confirmation email. Edit freely.
const GUEST_THANK_YOU_MESSAGE =
  "Thank you so much for letting us know! We are so grateful and can't wait " +
  "to celebrate this day with you. See you there!\n\n— Aldrin & Richelle";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (data.type === "rsvp") {
    logRsvp(ss, data);
    notifyRsvp(data); // emails the couple
    sendGuestConfirmation(data); // emails the guest, if they gave an email
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function logRsvp(ss, d) {
  const sheet = ss.getSheetByName("RSVP") || ss.insertSheet("RSVP");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Guest Name", "Attending", "# Guests", "Email", "Message"]);
  }
  sheet.appendRow([
    new Date(d.submittedAt || Date.now()),
    d.guestName || "",
    d.attending || "",
    d.numGuests || "",
    d.email || "",
    d.message || "",
  ]);
}

function notifyRsvp(d) {
  const subject = `New RSVP: ${d.guestName} — ${d.attending}`;
  const body = [
    `Guest: ${d.guestName}`,
    `Attending: ${d.attending}`,
    `Number of guests: ${d.numGuests}`,
    `Email: ${d.email || "—"}`,
    `Message: ${d.message || "—"}`,
  ].join("\n");
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// Emails the GUEST (not the couple) a confirmation that their RSVP was
// received, plus a short thank-you note. Only runs if the guest provided
// an email address on the form — this is the only guest-facing
// notification the site sends (no SMS/text messaging is used).
function sendGuestConfirmation(d) {
  if (!d.email) return;
  const attendingLine =
    d.attending === "Yes"
      ? `We've got you down for ${d.numGuests || 1} guest(s). Joyfully accepted!`
      : "We're sorry you can't make it, but we appreciate you letting us know.";
  const subject = "We received your RSVP! 💌";
  const body = [
    `Hi ${d.guestName || "there"},`,
    "",
    "This confirms we received your RSVP for Aldrin & Richelle's wedding on December 11, 2026.",
    attendingLine,
    "",
    GUEST_THANK_YOU_MESSAGE,
  ].join("\n");
  MailApp.sendEmail(d.email, subject, body);
}
