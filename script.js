/* VERSION 2 — NEW FILE (has MUSIC_FILE, CRITTER_SAYS, ribbons). If you can read this line, it is the new one. */
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

// Background music. NEVER autoplays — the visitor taps the ♪ button.
// Paste the YouTube video ID here (the part after youtu.be/ or v=).
// Your link https://youtu.be/VYe4oSD7_Ck  ->  ID is "VYe4oSD7_Ck".
// Set to "" (empty) to use a soft built-in hum instead of YouTube.
const YOUTUBE_VIDEO_ID = "VYe4oSD7_Ck";

// BEST OPTION: put your own audio file in the assets folder and name it music.mp3.
// If that file exists it plays first (most reliable, works on every phone).
// If it's missing, the site tries YouTube, then falls back to a soft hum.
// Set to "" to skip the local file. Any name works, e.g. "assets/our-song.mp3".
const MUSIC_FILE = "assets/music.mp3";
const MUSIC_VOLUME = 60;      // 0 to 100
const MUSIC_ENABLED = true;   // false hides the music button completely

// Tiny things the animals say when tapped. Add or change any you like!
const CRITTER_SAYS = [
  "hehe ♡", "hi Miss Little 5 Feet!", "*hugs you*", "you're so cute",
  "approved ✿", "tiny but mighty", "snuggle time?", "♡ ♡ ♡"
];

// Tapping anywhere sprinkles a tiny heart/sparkle (set false to turn off).
const TAP_SPARKLES = true;


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

/* ---------- Chibi critters (tiny inline SVG animals) ---------- */
const OUT = "#4A3B3E";
function face(cx, cy, muzzle){
  // eyes (blink), nose, smile, blush — reusable cute face
  return `
    <g class="eyes"><circle cx="${cx-11}" cy="${cy-3}" r="3.3" fill="${OUT}"/><circle cx="${cx+11}" cy="${cy-3}" r="3.3" fill="${OUT}"/>
      <circle cx="${cx-10}" cy="${cy-4.2}" r="1" fill="#fff"/><circle cx="${cx+12}" cy="${cy-4.2}" r="1" fill="#fff"/></g>
    <ellipse cx="${cx}" cy="${cy+6}" rx="4" ry="3" fill="${OUT}"/>
    <path d="M${cx-4} ${cy+11} Q${cx} ${cy+15} ${cx+4} ${cy+11}" stroke="${OUT}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="${cx-17}" cy="${cy+8}" r="4.5" fill="#F3A6B0" opacity=".65"/><circle cx="${cx+17}" cy="${cy+8}" r="4.5" fill="#F3A6B0" opacity=".65"/>`;
}
function bearGroup(fur, inner, belly){
  return `
    <ellipse cx="50" cy="82" rx="22" ry="16" fill="${fur}"/>
    <ellipse cx="50" cy="84" rx="12" ry="10" fill="${belly}"/>
    <circle cx="25" cy="90" r="7" fill="${fur}"/><circle cx="75" cy="90" r="7" fill="${fur}"/>
    <circle cx="27" cy="27" r="11" fill="${fur}"/><circle cx="73" cy="27" r="11" fill="${fur}"/>
    <circle cx="27" cy="27" r="5.5" fill="${inner}"/><circle cx="73" cy="27" r="5.5" fill="${inner}"/>
    <circle cx="50" cy="48" r="30" fill="${fur}"/>
    <ellipse cx="50" cy="58" rx="13" ry="10" fill="${belly}"/>
    ${face(50, 48, belly)}`;
}
function berets(){
  return `<ellipse cx="50" cy="20" rx="24" ry="9" fill="#B86B7C"/><circle cx="50" cy="10" r="3" fill="#8F4A5C"/>`;
}
function foxGroup(){
  return `
    <g class="tail"><path d="M68 84 Q98 78 92 52 Q84 66 66 72 Z" fill="#E98A4B"/><path d="M92 52 Q95 60 90 66 Q86 60 92 52 Z" fill="#FFF6EA"/></g>
    <ellipse cx="50" cy="82" rx="20" ry="15" fill="#E98A4B"/>
    <ellipse cx="50" cy="84" rx="11" ry="9" fill="#FFF6EA"/>
    <path d="M20 40 L24 12 L44 28 Z" fill="#E98A4B"/><path d="M80 40 L76 12 L56 28 Z" fill="#E98A4B"/>
    <path d="M25 33 L26 19 L37 28 Z" fill="#4A3B3E" opacity=".75"/><path d="M75 33 L74 19 L63 28 Z" fill="#4A3B3E" opacity=".75"/>
    <ellipse cx="50" cy="50" rx="31" ry="27" fill="#E98A4B"/>
    <path d="M19 56 Q34 50 50 66 Q66 50 81 56 Q70 74 50 74 Q30 74 19 56 Z" fill="#FFF6EA"/>
    ${face(50, 48, "#FFF6EA")}`;
}
function bunnyGroup(){
  return `
    <ellipse cx="50" cy="83" rx="19" ry="15" fill="#F6E9E4"/>
    <ellipse cx="50" cy="85" rx="10" ry="9" fill="#FFFFFF"/>
    <ellipse cx="36" cy="20" rx="8" ry="20" fill="#F6E9E4"/><ellipse cx="64" cy="20" rx="8" ry="20" fill="#F6E9E4"/>
    <ellipse cx="36" cy="22" rx="4" ry="14" fill="#F3B6BC"/><ellipse cx="64" cy="22" rx="4" ry="14" fill="#F3B6BC"/>
    <circle cx="50" cy="52" r="27" fill="#F6E9E4"/>
    ${face(50, 52, "#fff")}`;
}
function catGroup(fur, belly, inner, marks){
  return `
    <g class="tail"><path d="M68 86 Q100 84 92 56 Q90 72 66 76 Z" fill="${fur}"/></g>
    <ellipse cx="50" cy="82" rx="19" ry="15" fill="${fur}"/>
    <ellipse cx="50" cy="85" rx="10" ry="9" fill="${belly}"/>
    <path d="M21 42 L23 12 L45 28 Z" fill="${fur}"/><path d="M79 42 L77 12 L55 28 Z" fill="${fur}"/>
    <path d="M26 34 L27 20 L38 28 Z" fill="${inner}"/><path d="M74 34 L73 20 L62 28 Z" fill="${inner}"/>
    <ellipse cx="50" cy="52" rx="30" ry="26" fill="${fur}"/>
    ${marks}
    <ellipse cx="50" cy="60" rx="12" ry="9" fill="${belly}"/>
    ${face(50, 50, belly)}
    <g stroke="${OUT}" stroke-width="1.2" stroke-linecap="round" opacity=".6"><path d="M17 56 L31 58"/><path d="M17 63 L31 62"/><path d="M83 56 L69 58"/><path d="M83 63 L69 62"/></g>`;
}
const tabby = (col) => `<path d="M42 28 L42 35 M50 26 L50 34 M58 28 L58 35" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
function ribbonBow(x, y){
  return `<g class="bow"><path d="M${x} ${y} L${x-13} ${y-7} L${x-13} ${y+7} Z M${x} ${y} L${x+13} ${y-7} L${x+13} ${y+7} Z" fill="#E58FA0"/><circle cx="${x}" cy="${y}" r="3.4" fill="#D06F84"/><path d="M${x-2} ${y+3} L${x-7} ${y+14} M${x+2} ${y+3} L${x+7} ${y+14}" stroke="#E58FA0" stroke-width="3" stroke-linecap="round"/></g>`;
}
const CRITTER_ART = {
  bear:         () => bearGroup("#C9977A", "#F3B6BC", "#F3DFC8"),
  teddy:        () => bearGroup("#E4C39B", "#F7CFA8", "#FFF3E0") +
                       `<path d="M50 76 L38 70 L38 82 Z M50 76 L62 70 L62 82 Z" fill="#E58FA0"/><circle cx="50" cy="76" r="3" fill="#D06F84"/>`,
  "bear-beret": () => bearGroup("#C9977A", "#F3B6BC", "#F3DFC8") + berets(),
  fox:          () => foxGroup() + ribbonBow(70, 34),
  "fox-beret":  () => foxGroup() + `<ellipse cx="52" cy="24" rx="22" ry="8" fill="#B86B7C" transform="rotate(-8 52 24)"/><circle cx="52" cy="15" r="3" fill="#8F4A5C"/>`,
  bunny:        () => bunnyGroup() + ribbonBow(50, 34),
  "cat-orange": () => catGroup("#EDA35A", "#FFF1DF", "#F3B6BC", tabby("#D0803A")) + ribbonBow(71, 40),
  "cat-gray":   () => catGroup("#ABA4B8", "#EEE9F3", "#F3B6BC", tabby("#8C859C")) + ribbonBow(71, 40),
  "cat-cream":  () => catGroup("#F1DEC3", "#FFFBF3", "#F3B6BC", "") + ribbonBow(71, 40),
  "cat-calico": () => catGroup("#FFF6EC", "#FFFFFF", "#F3B6BC",
                     `<ellipse cx="31" cy="36" rx="9" ry="7" fill="#EDA35A"/><ellipse cx="70" cy="62" rx="7" ry="6" fill="#A79CA6" opacity=".85"/>`) + ribbonBow(71, 40)
};

function buildCritter(type){
  if (type === "hugbears"){
    // Two bears leaning in for a hug, with a beating heart above them
    return `<svg viewBox="0 0 200 100" role="img" aria-label="Two bears hugging">
      <g transform="translate(-6 8) scale(.9) rotate(5 50 80)">${bearGroup("#C9977A", "#F3B6BC", "#F3DFC8")}</g>
      <g transform="translate(96 8) scale(.9) rotate(-5 50 80)">${bearGroup("#E4C39B", "#F7CFA8", "#FFF3E0")}</g>
      <ellipse cx="97" cy="82" rx="16" ry="7" fill="#C9977A" transform="rotate(-8 97 82)"/>
      <ellipse cx="103" cy="86" rx="16" ry="7" fill="#E4C39B" transform="rotate(8 103 86)"/>
      <path class="hug-heart" d="M100 30 C92 20 80 26 88 36 L100 46 L112 36 C120 26 108 20 100 30 Z" fill="#E58FA0"/>
    </svg>`;
  }
  const art = CRITTER_ART[type];
  if (!art) return "";
  return `<svg viewBox="0 0 100 100" role="img" aria-label="A cute ${type.endsWith("-beret") ? type.replace("-beret", " in a beret") : type.split("-")[0]}">${art()}</svg>`;
}

function initCritters(){
  document.querySelectorAll("[data-critter]").forEach(el => {
    el.innerHTML = buildCritter(el.dataset.critter);
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Tap for a tiny hello");

    const react = () => {
      el.classList.remove("squish");
      void el.offsetWidth;
      el.classList.add("squish");

      const old = el.querySelector(".critter-bubble");
      if (old) old.remove();
      const bubble = document.createElement("span");
      bubble.className = "critter-bubble";
      bubble.textContent = CRITTER_SAYS[Math.floor(Math.random() * CRITTER_SAYS.length)];
      el.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1800);

      if (!prefersReducedMotion){
        const r = el.getBoundingClientRect();
        for (let i = 0; i < 3; i++){
          spawnTapPop(r.left + r.width * (0.25 + Math.random() * 0.5), r.top + r.height * 0.2, i % 2 ? "♡" : "✦");
        }
      }
    };
    el.addEventListener("click", react);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); react(); }
    });
  });
}

/* ---------- Tap sparkles (light and self-cleaning) ---------- */
let livePops = 0;
function spawnTapPop(x, y, symbol){
  if (livePops > 14) return;
  livePops++;
  const p = document.createElement("span");
  p.className = "tap-pop";
  p.textContent = symbol;
  p.style.left = x + "px";
  p.style.top = y + "px";
  document.body.appendChild(p);
  setTimeout(() => { p.remove(); livePops--; }, 900);
}
function initTapSparkles(){
  if (!TAP_SPARKLES || prefersReducedMotion) return;
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, [data-critter]")) return;
    spawnTapPop(e.clientX, e.clientY, Math.random() > 0.5 ? "♡" : "✦");
  });
}

/* ---------- Background music: your file -> YouTube -> soft hum ---------- */
function initMusic(){
  const btn = document.getElementById("musicToggle");
  if (!btn) return;
  if (!MUSIC_ENABLED){ btn.style.display = "none"; return; }

  let musicOn = false;

  // ----- 1) Local audio file (assets/music.mp3) -----
  let fileAudio = null;
  let fileFailed = !MUSIC_FILE;
  if (MUSIC_FILE){
    fileAudio = new Audio();
    fileAudio.loop = true;
    fileAudio.preload = "auto";
    fileAudio.volume = Math.max(0, Math.min(1, MUSIC_VOLUME / 100));
    fileAudio.addEventListener("error", () => {
      fileFailed = true;                       // file missing or unsupported
      if (musicOn) playFallback();             // keep music going with the next option
    });
    fileAudio.src = MUSIC_FILE;
  }

  // ----- 3) Fallback hum (Web Audio) -----
  let audioCtx = null, humNodes = [], humOn = false;
  function startHum(){
    if (humOn) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return; }
    const master = audioCtx.createGain();
    master.gain.value = 0.05;
    master.connect(audioCtx.destination);
    [261.63, 329.63, 392.0].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine"; osc.frequency.value = freq;
      const g = audioCtx.createGain(); g.gain.value = 0;
      osc.connect(g); g.connect(master); osc.start();
      g.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 2 + i);
      humNodes.push({ osc, g });
    });
    humOn = true;
  }
  function stopHum(){
    if (!humOn || !audioCtx) return;
    humNodes.forEach(({ osc, g }) => {
      try { g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5); osc.stop(audioCtx.currentTime + 0.6); } catch (e) {}
    });
    const ctx = audioCtx;
    setTimeout(() => { try { ctx.close(); } catch (e) {} }, 700);
    humNodes = []; audioCtx = null; humOn = false;
  }

  // ----- 2) YouTube (hidden player) -----
  let ytPlayer = null, ytReady = false, ytFailed = !YOUTUBE_VIDEO_ID, wantPlayWhenReady = false;
  function setupYouTube(){
    if (!YOUTUBE_VIDEO_ID) return;
    window.onYouTubeIframeAPIReady = () => {
      try {
        ytPlayer = new YT.Player("ytPlayer", {
          height: "1", width: "1",
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, loop: 1,
                        playlist: YOUTUBE_VIDEO_ID, playsinline: 1, rel: 0, modestbranding: 1 },
          events: {
            onReady: () => {
              ytReady = true;
              ytPlayer.setVolume(MUSIC_VOLUME);
              if (wantPlayWhenReady && musicOn){ ytPlayer.playVideo(); wantPlayWhenReady = false; }
            },
            onError: () => { ytFailed = true; if (musicOn) startHum(); }
          }
        });
      } catch (e) { ytFailed = true; }
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => { ytFailed = true; };
    document.head.appendChild(tag);
  }
  // Only bother loading YouTube if there's no local file to use
  if (fileFailed) setupYouTube();
  else fileAudio.addEventListener("error", setupYouTube, { once: true });

  function playFallback(){
    if (!ytFailed && YOUTUBE_VIDEO_ID){
      if (ytReady){ ytPlayer.playVideo(); }
      else {
        wantPlayWhenReady = true;
        setTimeout(() => { if (musicOn && !ytReady && !humOn){ ytFailed = true; startHum(); } }, 6000);
      }
    } else {
      startHum();
    }
  }

  function setUi(on){
    btn.classList.toggle("playing", on);
    btn.textContent = on ? "♫" : "♪";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  btn.addEventListener("click", () => {
    if (musicOn){
      musicOn = false; wantPlayWhenReady = false;
      if (fileAudio) fileAudio.pause();
      if (ytReady && ytPlayer) ytPlayer.pauseVideo();
      stopHum();
      setUi(false);
      return;
    }
    musicOn = true;
    setUi(true);
    if (fileAudio && !fileFailed){
      const p = fileAudio.play();             // straight from the tap so phones allow sound
      if (p && p.catch) p.catch(() => { fileFailed = true; if (musicOn) playFallback(); });
    } else {
      playFallback();
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
  initCritters();
  initTapSparkles();
  activateIncoming(0);
});
