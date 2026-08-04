# Setup Guide

This is a static site — no build step, no server required for the site itself. Upload the whole folder (HTML, JS, and all image/gallery files) to any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting) and it works.

## 1. Personalize the content

Search each file for `REPLACE` and fill in your real names, dates, addresses, and social links.

- **Hero background:** `main-couple.jpg`, kept next to `index.html`.
- **Gallery:** photos live in the `gallery/` folder, named `image (1).jpg` through `image (98).jpg` (that count is set in `app.js` under `CONFIG.gallery.count` — change it if you add/remove photos). They're spread evenly across up to 5 auto-scrolling rows automatically; you don't need to touch the HTML to add more, just drop files in with the next number and bump `count`.
- **Ceremony/reception flip-cards & the groom/bride contact headshots:** still placeholder `picsum.photos` images — swap those `src` URLs for real photos whenever you have them.
- **Parent contact cards:** already use `evelyn-quiroz.jpg` and `rizza-taruc.jpg`, kept next to `index.html`.
- **Logo / monogram:** `favicon.png` is the browser-tab icon. `monogram-mark-white.png` (just the "AR" mark) is used in the envelope wax seal and the footer. `monogram-white.png` (the full mark + "Aldrin and Richelle · 12.11.2026" lockup) isn't placed on the page yet but is available if you want to use it somewhere — it's a transparent PNG so it drops cleanly onto any dark background.

## 2. Personalized guest links

Every guest gets a link like:

```
https://yoursite.com/index.html?guest=Tita+Baby
```

The envelope intro, hero subtext, and the RSVP name field will all pre-fill with "Tita Baby" (spaces can be `+` or `%20`). Generate one link per guest/family in a spreadsheet and send each guest their own link.

## 3. Wire up the Google Sheets + email backend (RSVP & Attire)

This uses **Google Apps Script**, which is free and doesn't need a server:

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet — this will be your RSVP/attire database.
2. In the sheet, go to **Extensions → Apps Script**.
3. Delete the placeholder `myFunction()` code and paste in the entire contents of `google-apps-script.gs`.
4. Change `NOTIFY_EMAIL` at the top to the email address(es) that should get notified of every RSVP/attire submission (comma-separate for more than one).
5. Click **Deploy → New deployment**, choose type **Web app**, set:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**, authorize the permissions Google asks for (it needs to send email and edit the sheet on your behalf), and copy the **Web app URL** it gives you.
7. Open `app.js` and paste that URL into `CONFIG.appsScriptUrl` near the top of the file.

That's it — every RSVP and attire submission will now:
- Append a new row to a "RSVP" or "Attire" tab in your Google Sheet (created automatically on first submission)
- Send an email notification to the address(es) you set in `NOTIFY_EMAIL`
- For RSVPs where the guest filled in their email: automatically send **that guest** a confirmation email ("We received your RSVP!") with a short thank-you note from the couple. Edit the wording in `GUEST_THANK_YOU_MESSAGE` near the top of `google-apps-script.gs`.

Notifications are **email-only** — there's no SMS/text-messaging feature, so nothing extra to set up or pay for on that front. Guests reach the couple directly through the Facebook links on the Contact section instead.

**Until you do this setup**, the site runs in "demo mode": submissions just log to the browser console and still show the thank-you message, so you can test the UI without a backend.

## 4. Background music

The music button (bottom-right, note icon) opens a small panel where guests can pick from a few tracks and play/pause with a volume slider. The functionality is fully wired up — you just need to supply the actual audio files, since none are bundled with the site:

1. Get 2–3 royalty-free MP3s you have the rights to use (e.g. from Pixabay Music, YouTube Audio Library, or a track you licensed).
2. Create a `music/` folder next to `index.html` and drop the MP3s in, named `track-1.mp3`, `track-2.mp3`, `track-3.mp3` (or your own filenames).
3. Open `app.js` and edit `CONFIG.musicTracks` near the top — update each `label` (what guests see in the picker) and `src` (path or URL to the MP3) to match. You can add or remove tracks from that list freely.

Browsers block audio from auto-playing with sound until the guest interacts with the page, which is why the widget starts silent and only plays once someone taps a track — this is expected and works reliably across browsers.

## 5. Files in this delivery

| File | Purpose |
|---|---|
| `index.html` | The full site — structure, styles, all sections |
| `app.js` | All interactivity: countdown, guest personalization, animations, forms, music widget, gallery |
| `google-apps-script.gs` | Backend script — paste into Google Apps Script |
| `main-couple.jpg` | Hero background photo — keep next to `index.html` |
| `evelyn-quiroz.jpg` / `rizza-taruc.jpg` | Parent contact-card photos — keep next to `index.html` |
| `favicon.png` | Browser-tab icon |
| `monogram-mark-white.png` | Transparent "AR" mark — used in the envelope seal and footer |
| `monogram-white.png` | Transparent full logo lockup (mark + names + date) — available, not placed yet |
| `gallery/` | Folder of `image (1).jpg` … `image (N).jpg` for the Gallery section |
| `SETUP-GUIDE.md` | This file |
