/* ==========================================================================
   CONFIG — customize these values for your own wedding
   ========================================================================== */
const CONFIG = {
  couple: { partnerA: "Aldrin", partnerB: "Richelle", initials: "A&R" },

  // Set to the wedding date/time used by the countdown timer (ISO format)
  weddingDateISO: "2026-12-11T15:00:00+08:00",

  // Paste the Web App URL you get after deploying the companion
  // Google Apps Script (see google-apps-script.gs + SETUP-GUIDE.md).
  // Leave as-is to run in "demo mode" (submissions are only logged
  // to the browser console and shown as a success message).
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbwDi4G488dmhoOxNnVRlFNex4NUGAkOzC-HP6jQL2zuonW6ZZ8SPNupl0BsWTFgBts/exec",

  // Background music choices for the music widget (bottom-right button).
  // Each "src" must point to an actual MP3 file — add your own royalty-free
  // tracks to a "music/" folder next to index.html (or link to any hosted
  // MP3 URL) and update the paths below. See SETUP-GUIDE.md, section 5.
  musicTracks: [
    { label: "Intertwine", src: "music/intertwine.mp3" },
    { label: "Beautiful in White", src: "music/beautiful.mp3" },
    { label: "Can't Help Falling in Love", src: "music/canthelp.mp3" },
  ],

  // Gallery photos. Files live in the "gallery/" folder next to index.html,
  // named "image (1).jpg" through "image (N).jpg" — change `count` to match
  // how many you actually have in that folder. Rather than loading and
  // animating all of them at once (heavy on slower phones), the page
  // randomly picks `displayCount` photos from that pool on every visit and
  // spreads them across `maxRows` auto-scrolling rows.
  gallery: {
    folder: "gallery/",
    filename: (i) => `image (${i}).jpg`,
    count: 98,
    displayCount: 30,
    maxRows: 3,
  },
};

/* ==========================================================================
   GUEST PERSONALIZATION — reads ?guest=Name from the URL
   ========================================================================== */
const params = new URLSearchParams(window.location.search);
const guestName = params.get("guest") ? decodeURIComponent(params.get("guest").replace(/\+/g, " ")) : "";

document.getElementById("envelope-guest-name").textContent = guestName || "Esteemed Guest";
if (guestName) {
  document.getElementById("hero-guest-slot").textContent = guestName;
  const rsvpNameField = document.getElementById("rsvp-name");
  if (rsvpNameField) rsvpNameField.value = guestName;
}

/* ==========================================================================
   ENVELOPE INTRO
   ========================================================================== */
const envelope = document.getElementById("envelope");
const envelopeIntro = document.getElementById("envelope-intro");
document.body.style.overflow = "hidden";

envelope.addEventListener("click", openEnvelope);
function openEnvelope() {
  envelope.classList.add("open");
  setTimeout(() => {
    envelopeIntro.classList.add("hide");
    document.body.style.overflow = "";
  }, 700);
  tryStartMusic();
}
// Auto-open after a short delay if the guest doesn't interact
setTimeout(() => { if (!envelope.classList.contains("open")) openEnvelope(); }, 6000);

/* ==========================================================================
   COUNTDOWN TIMER
   ========================================================================== */
const weddingDate = new Date(CONFIG.weddingDateISO).getTime();
function updateCountdown() {
  const now = Date.now();
  const diff = weddingDate - now;
  const els = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs"),
  };
  if (diff <= 0) {
    els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = "00";
    return;
  }
  const pad = (n) => String(n).padStart(2, "0");
  els.d.textContent = pad(Math.floor(diff / 86400000));
  els.h.textContent = pad(Math.floor((diff / 3600000) % 24));
  els.m.textContent = pad(Math.floor((diff / 60000) % 60));
  els.s.textContent = pad(Math.floor((diff / 1000) % 60));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ==========================================================================
   NAVIGATION — sticky bg, active link, mobile panel, smooth scroll
   ========================================================================== */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

const navToggle = document.getElementById("nav-toggle");
const navMobile = document.getElementById("nav-mobile");
navToggle.addEventListener("click", () => navMobile.classList.toggle("open"));
document.querySelectorAll(".nav-mobile-panel a").forEach((a) =>
  a.addEventListener("click", () => navMobile.classList.remove("open"))
);

// scroll-spy for active nav link
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav-link");
const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);
sections.forEach((s) => spyObserver.observe(s));

/* ==========================================================================
   HERO PARALLAX
   ========================================================================== */
const heroParallax = document.getElementById("hero-parallax");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroParallax.style.transform = `scale(1.08) translateY(${y * 0.25}px)`;
  }
});

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
      openItem.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});

/* ==========================================================================
   MAP FLIP CARDS
   ========================================================================== */
document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    // don't flip back when the "Open in Google Maps" link itself is clicked
    if (e.target.closest("a")) return;
    card.classList.toggle("flipped");
  });
});

/* ==========================================================================
   GALLERY
   Desktop: randomly picks photos, spreads them into auto-scrolling marquee
   rows (duplicated for a seamless loop).
   Phone: the marquee doesn't work well on small screens — a moving row is
   hard to focus on when the visible width is so narrow — so phones instead
   get a static masonry grid (CSS columns) that lays each photo out at its
   own natural aspect ratio, uncropped, filling the screen width with no
   animation at all.
   ========================================================================== */
const galleryRowsEl = document.getElementById("gallery-rows");
const galleryWrapEl = document.querySelector(".gallery-marquee-wrap");
const galleryCfg = CONFIG.gallery;
const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;

// build the full, ordered pool of { src, alt } for every available photo
const galleryPool = Array.from({ length: galleryCfg.count }, (_, idx) => {
  const n = idx + 1;
  return { src: galleryCfg.folder + galleryCfg.filename(n), alt: `Aldrin and Richelle ${n}` };
});

// Fisher–Yates shuffle, then take the first `displayCount` — a fresh
// random selection every time the page loads.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lighter load on phones: fewer simultaneous photos to decode at once.
const displayCount = isSmallScreen ? Math.min(16, galleryCfg.displayCount) : galleryCfg.displayCount;
const maxRows = Math.min(3, galleryCfg.maxRows);

const pickCount = Math.min(displayCount, galleryPool.length);
const galleryPhotos = shuffled(galleryPool).slice(0, pickCount);

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  lbImg.src = galleryPhotos[i].src;
  lightbox.classList.add("open");
}
document.getElementById("lb-close").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
document.getElementById("lb-next").addEventListener("click", () => openLightbox((lbIndex + 1) % galleryPhotos.length));
document.getElementById("lb-prev").addEventListener("click", () => openLightbox((lbIndex - 1 + galleryPhotos.length) % galleryPhotos.length));
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") lightbox.classList.remove("open");
  if (e.key === "ArrowRight") openLightbox((lbIndex + 1) % galleryPhotos.length);
  if (e.key === "ArrowLeft") openLightbox((lbIndex - 1 + galleryPhotos.length) % galleryPhotos.length);
});

let galleryBuilt = false;
function buildGallery() {
  if (galleryBuilt) return;
  galleryBuilt = true;

  if (isSmallScreen) {
    buildMasonryGallery();
  } else {
    buildMarqueeGallery();
  }
}

// ---- Phone: static masonry grid, no animation, natural photo shapes ----
function buildMasonryGallery() {
  galleryRowsEl.classList.add("gallery-masonry");
  const fades = document.querySelectorAll(".gallery-marquee-fade");
  fades.forEach((f) => (f.style.display = "none"));

  galleryPhotos.forEach((photo, i) => {
    const img = document.createElement("img");
    img.decoding = "async";
    img.loading = "lazy";
    img.src = photo.src;
    img.alt = photo.alt;
    img.addEventListener("click", () => openLightbox(i));
    galleryRowsEl.appendChild(img);
  });
}

// ---- Desktop: auto-scrolling marquee rows ----
function buildMarqueeGallery() {
  const numRows = Math.max(1, Math.min(maxRows, galleryPhotos.length));

  // round-robin distribute photos into rows so each row gets a spread of ~equal size
  const rows = Array.from({ length: numRows }, () => []);
  galleryPhotos.forEach((photo, i) => rows[i % numRows].push(photo));

  const tracks = [];
  rows.forEach((rowPhotos, rowIdx) => {
    if (!rowPhotos.length) return;
    const track = document.createElement("div");
    track.className = "gallery-track";
    // vary duration per row so rows don't all move in lockstep
    const duration = 34 + rowIdx * 9 + rowPhotos.length * 0.6;
    track.style.animationDuration = `${duration}s`;

    rowPhotos.forEach((photo) => {
      const img = document.createElement("img");
      img.decoding = "async";
      img.src = photo.src;
      img.alt = photo.alt;
      const originalIndex = galleryPhotos.indexOf(photo);
      img.addEventListener("click", () => openLightbox(originalIndex));
      track.appendChild(img);
    });

    // duplicate the row once so the CSS animation (translateX 0 -> -50%) loops seamlessly
    Array.from(track.children).forEach((img) => {
      const clone = img.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("tabindex", "-1");
      track.appendChild(clone);
    });

    galleryRowsEl.appendChild(track);
    tracks.push(track);
  });

  // pause the marquee whenever it's scrolled off-screen so it doesn't
  // burn CPU/battery (and compete for main-thread time) in the background
  if (galleryWrapEl && "IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          tracks.forEach((t) => t.classList.toggle("paused", !entry.isIntersecting));
        });
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(galleryWrapEl);
  }
}

// Defer building the gallery until it's about to scroll into view, so it
// never competes with the hero/envelope/fonts for bandwidth on first load.
if (galleryWrapEl && "IntersectionObserver" in window) {
  const buildObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          buildGallery();
          buildObserver.disconnect();
        }
      });
    },
    { rootMargin: "600px 0px" }
  );
  buildObserver.observe(galleryWrapEl);
} else {
  buildGallery();
}

/* ==========================================================================
   BACKGROUND MUSIC WIDGET
   → click the note button to open the track picker, pick a song, then
     play/pause and adjust volume from the panel that opens.
   ========================================================================== */
const bgAudio = document.getElementById("bg-audio");
const musicFab = document.getElementById("music-fab");
const musicPanel = document.getElementById("music-panel");
const musicTrackList = document.getElementById("music-track-list");
const musicPlayBtn = document.getElementById("music-play-btn");
const musicVolume = document.getElementById("music-volume");

let activeTrackIndex = null;

CONFIG.musicTracks.forEach((track, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "music-track";
  btn.textContent = track.label;
  btn.addEventListener("click", () => selectTrack(i));
  musicTrackList.appendChild(btn);
});

function selectTrack(i) {
  activeTrackIndex = i;
  document.querySelectorAll(".music-track").forEach((el, idx) => el.classList.toggle("active", idx === i));
  bgAudio.src = CONFIG.musicTracks[i].src;
  bgAudio.play().catch(() => {
    // Autoplay can be blocked until the user interacts with the page;
    // since this runs from a click handler it should normally succeed.
  });
  setPlayingUI(true);
}

function setPlayingUI(isPlaying) {
  musicPlayBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  musicPlayBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  musicFab.classList.toggle("playing", isPlaying);
}

// Browsers block real autoplay-with-sound until the guest has interacted
// with the page at least once — there's no way around that from code, it's
// a hard browser policy. So instead of waiting for someone to find the
// music button, we start playback on the guest's very first interaction
// with the site (tapping the envelope open counts), which is effectively
// "as soon as they access the site" in practice.
function tryStartMusic() {
  if (activeTrackIndex !== null) return;
  selectTrack(0);
}
["pointerdown", "keydown"].forEach((evt) => {
  document.addEventListener(evt, tryStartMusic, { once: true, passive: true });
});

musicFab.addEventListener("click", () => musicPanel.classList.toggle("open"));
document.addEventListener("click", (e) => {
  if (!document.getElementById("music-widget").contains(e.target)) musicPanel.classList.remove("open");
});

musicPlayBtn.addEventListener("click", () => {
  if (activeTrackIndex === null) {
    selectTrack(0);
    return;
  }
  if (bgAudio.paused) {
    bgAudio.play().catch(() => {});
  } else {
    bgAudio.pause();
  }
});
bgAudio.addEventListener("play", () => setPlayingUI(true));
bgAudio.addEventListener("pause", () => setPlayingUI(false));

// Auto-advance to the next track once one finishes, looping back to the
// first track after the last one. This only fires on natural end-of-track
// (the "ended" event) — pausing manually never triggers it, so playback
// only stops when the guest presses pause themselves.
bgAudio.addEventListener("ended", () => {
  const nextIndex = (activeTrackIndex + 1) % CONFIG.musicTracks.length;
  selectTrack(nextIndex);
});

musicVolume.addEventListener("input", () => { bgAudio.volume = Number(musicVolume.value); });
bgAudio.volume = Number(musicVolume.value);

/* ==========================================================================
   RSVP SUBMISSION
   → posts to the Google Apps Script Web App, which appends a row to a
     Google Sheet AND emails the couple. See google-apps-script.gs.
   ========================================================================== */
async function submitToBackend(payload) {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) {
    console.info("[Demo mode] No Apps Script URL configured. Payload:", payload);
    return { demo: true };
  }
  // Apps Script web apps require no-cors from the browser for simple POSTs;
  // the response can't be read back, but the submission still goes through.
  await fetch(CONFIG.appsScriptUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return { demo: false };
}

const rsvpForm = document.getElementById("rsvp-form");
rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = rsvpForm.querySelector("button[type=submit]");
  const label = document.getElementById("rsvp-submit-label");
  const originalLabel = label.textContent;
  label.textContent = "Sending...";
  submitBtn.disabled = true;

  const formData = new FormData(rsvpForm);
  const payload = {
    type: "rsvp",
    guestName: formData.get("guestName"),
    attending: formData.get("attending"),
    numGuests: formData.get("numGuests"),
    email: formData.get("email"),
    message: formData.get("message"),
    submittedAt: new Date().toISOString(),
  };

  try {
    await submitToBackend(payload);
    rsvpForm.style.display = "none";
    document.getElementById("rsvp-success").style.display = "block";
  } catch (err) {
    console.error("RSVP submission failed:", err);
    label.textContent = originalLabel;
    submitBtn.disabled = false;
    alert("Something went wrong sending your RSVP. Please try again or contact us directly.");
  }
});
