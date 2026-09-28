/* =========================================================
   FOR MISS LITTLE 5 FEET — SCRIPT.JS

   =========================
   EASY CUSTOMIZATION
   =========================
   Everything you're likely to want to change lives right here
   at the top of the file. You do NOT need to understand the
   rest of this file to personalize the site.
   ========================================================= */

// The 4-digit PIN needed to unlock the site.
// Change "1234" to any 4-digit code you like, e.g. "0714".
const SECRET_CODE = "1234";

// The gentle "wrong code" message. Feel free to reword it.
const WRONG_CODE_MESSAGE = "Hmm… Miss Little 5 Feet wouldn't forget this that easily, would she? ♡";

// How many pages the scrapbook has in total (used for the "♡ 1 / 8" counter).
const TOTAL_PAGES = 8;

// Turn the floating background decorations on/off, and choose which symbols float.
const DECOR_ENABLED = true;
const DECOR_SYMBOLS = ["🌸", "🌷", "✿", "♡", "✦", "🐾"];
const DECOR_COUNT = 16; // fewer = lighter on performance

// Optional gentle background music. This NEVER autoplays — the visitor
// has to press the music button. It's a soft procedurally generated hum,
// not an audio file, so there's nothing extra to upload.
const MUSIC_ENABLED = true;


/* =========================================================
   Below this line is the site's logic.
   You don't need to edit anything past here to personalize
   names, messages, images, colors (those are all above, or
   in index.html / style.css) — but feel free to explore!
   ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Background floating decor ---------- */
function initDecor(){
  if (!DECOR_ENABLED || prefersReducedMotion) return;
  const container = document.getElementById("bgDecor");
  if (!container) return;

  for (let i = 0; i < DECOR_COUNT; i++){
    const span = document.createElement("span");
    span.className = "drift";
    span.textContent = DECOR_SYMBOLS[Math.floor(Math.random() * DECOR_SYMBOLS.length)];
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 16; // seconds
    const delay = Math.random() * 16;
    const size = 0.9 + Math.random() * 1.3;
    span.style.left = left + "vw";
    span.style.fontSize = size + "rem";
    span.style.animationDuration = duration + "s";
    span.style.animationDelay = "-" + delay + "s";
    container.appendChild(span);
  }
}

/* ---------- Page navigation ---------- */
let currentPage = 0;

function showPage(index){
  const pages = document.querySelectorAll(".page");
  const outgoing = document.querySelector(".page.active");

  if (outgoing){
    outgoing.classList.remove("show");
    setTimeout(() => {
      outgoing.classList.remove("active");
      activateIncoming(index);
    }, prefersReducedMotion ? 0 : 350);
  } else {
    activateIncoming(index);
  }
}

function activateIncoming(index){
  const incoming = document.getElementById("page-" + index);
  if (!incoming) return;
  incoming.classList.add("active");
  // Force reflow so the transition triggers
  void incoming.offsetWidth;
  requestAnimationFrame(() => incoming.classList.add("show"));

  currentPage = index;
  updateProgressIndicator(index);

  if (index === 5) animateAdoreList();
}

function updateProgressIndicator(index){
  const el = document.getElementById("progressIndicator");
  if (!el) return;
  if (index === 0){
    el.classList.remove("visible");
    return;
  }
  el.textContent = "♡ " + index + " / " + (TOTAL_PAGES - 1);
  el.classList.add("visible");
}

document.addEventListener("click", (e) => {
  const nextBtn = e.target.closest("[data-next]");
  if (nextBtn){
    showPage(parseInt(nextBtn.dataset.next, 10));
    return;
  }
  const prevLink = e.target.closest("[data-prev]");
  if (prevLink){
    showPage(parseInt(prevLink.dataset.prev, 10));
  }
});

/* ---------- PIN lock ---------- */
function initPinLock(){
  const boxes = Array.from(document.querySelectorAll(".pin-digit"));
  const boxesWrap = document.getElementById("pinBoxes");
  const message = document.getElementById("pinMessage");
  const entranceCard = document.querySelector(".entrance-card");

  if (!boxes.length) return;

  boxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/[^0-9]/g, "").slice(0, 1);
      if (box.value && i < boxes.length - 1){
        boxes[i + 1].focus();
      }
      checkPin();
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && i > 0){
        boxes[i - 1].focus();
      }
    });
  });

  function checkPin(){
    const entered = boxes.map(b => b.value).join("");
    if (entered.length < 4) return;

    if (entered === SECRET_CODE){
      boxesWrap.classList.remove("shake");
      boxesWrap.classList.add("correct");
      message.textContent = "It's you ♡";
      message.classList.remove("error");
      if (entranceCard) entranceCard.classList.add("unlocked");
      boxes.forEach(b => b.disabled = true);

      setTimeout(() => {
        showPage(1);
      }, prefersReducedMotion ? 200 : 1100);
    } else {
      boxesWrap.classList.remove("correct");
      message.textContent = WRONG_CODE_MESSAGE;
      message.classList.add("error");
      boxesWrap.classList.remove("shake");
      void boxesWrap.offsetWidth;
      boxesWrap.classList.add("shake");
      setTimeout(() => {
        boxes.forEach(b => b.value = "");
        boxes[0].focus();
      }, 400);
    }
  }
}

/* ---------- Adore list: cards appear one by one ---------- */
let adoreAnimated = false;
function animateAdoreList(){
  if (adoreAnimated) return;
  adoreAnimated = true;
  const cards = document.querySelectorAll("#adoreList .adore-card");
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add("shown"), prefersReducedMotion ? 0 : i * 220);
  });
}

/* ---------- Gallery lightbox ---------- */
function initGallery(){
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxFrame = document.getElementById("lightboxFrame");
  const closeBtn = document.getElementById("lightboxClose");

  document.querySelectorAll(".polaroid").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.full;
      const placeholder = btn.dataset.placeholder || "";
      lightboxImg.src = src;
      lightboxFrame.dataset.placeholder = placeholder;
      lightboxFrame.classList.remove("show-placeholder");
      lightbox.classList.add("open");
    });
  });

  lightboxImg.addEventListener("error", () => {
    lightboxFrame.classList.add("show-placeholder");
  });

  function closeLightbox(){ lightbox.classList.remove("open"); }
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* ---------- P.S. reveal ---------- */
function initPsButton(){
  const btn = document.getElementById("psBtn");
  const msg = document.getElementById("psMessage");
  if (!btn || !msg) return;
  btn.addEventListener("click", () => {
    msg.hidden = false;
    btn.hidden = true;
  });
}

/* ---------- Optional gentle music (Web Audio API, no files needed) ---------- */
function initMusic(){
  const btn = document.getElementById("musicToggle");
  if (!btn || !MUSIC_ENABLED){
    if (btn) btn.style.display = "none";
    return;
  }

  let audioCtx = null;
  let nodes = [];
  let playing = false;

  function startMusic(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.05;
    masterGain.connect(audioCtx.destination);

    // A soft, slowly shifting pad made of a few gentle sine tones.
    const notes = [261.63, 329.63, 392.0]; // C4, E4, G4 — a calm major triad
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = audioCtx.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      // Gentle fade in, then slow breathing volume
      const now = audioCtx.currentTime;
      gain.gain.linearRampToValueAtTime(0.6, now + 2 + i);

      nodes.push({ osc, gain });
    });

    playing = true;
    btn.classList.add("playing");
    btn.textContent = "♫";
  }

  function stopMusic(){
    if (audioCtx){
      nodes.forEach(({ osc, gain }) => {
        try {
          gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
          osc.stop(audioCtx.currentTime + 0.7);
        } catch (e) { /* already stopped, ignore */ }
      });
      setTimeout(() => { if (audioCtx) audioCtx.close(); }, 800);
    }
    nodes = [];
    playing = false;
    btn.classList.remove("playing");
    btn.textContent = "♪";
  }

  btn.addEventListener("click", () => {
    if (playing){
      stopMusic();
    } else {
      startMusic();
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initDecor();
  initPinLock();
  initGallery();
  initPsButton();
  initMusic();
  activateIncoming(0);
});
