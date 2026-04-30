/* ============================================================
   main.js — Orly Birthday Site
============================================================ */

'use strict';

/* ============================================================
   CONSTANTES
============================================================ */
const SECRET_CODE = '1505';

const messageContent = `Sandy, il y a des rencontres qui ne ressemblent à rien de ce qu'on a connu avant. La tienne est de celles-là.

Tu m'as appris, sans jamais le vouloir, que la légèreté est une forme de courage. Que sourire malgré ses tempêtes intérieures, c'est l'un des actes les plus beaux qui soit. Tu portes une lumière en toi que tu offres sans compter — et les gens autour de toi en sont changés, souvent sans même s'en rendre compte. Moi, je m'en suis rendu compte.

Ton visage est une fresque que je n'ai pas fini de lire. Chaque trait, chaque sourire est un vers d'un poème que j'aurais aimé écrire.

En ce jour où tu souffles une bougie de plus, je ne te souhaite pas juste du bonheur — je te souhaite d'être vue, entendue et aimée à la hauteur de ce que tu donnes au monde.

Merci d'exister. Merci d'avoir choisi de jouer un rôle dans le film de ma vie.`;

/* 23 qualités pour ses 23 ans */
const qualities = [
  "Ta force silencieuse",
  "Ton sourire qui guérit",
  "Ta lumière contagieuse",
  "Ton courage discret",
  "Ta générosité naturelle",
  "La façon dont tu existes",
  "Tes éclats de rire",
  "Ta douceur sincère",
  "Ton intelligence vive",
  "Ta sensibilité rare",
  "Ta façon d'écouter",
  "Ton regard qui comprend",
  "Ta légèreté précieuse",
  "Ton âme curieuse",
  "Ta façon de prendre soin",
  "Tes silences qui parlent",
  "Ta présence apaisante",
  "Ton élégance naturelle",
  "Ta persévérance discrète",
  "Ton cœur généreux",
  "Ta façon d'aimer",
  "Ton authenticité rare",
  "Simplement toi",
];

/* ============================================================
   LOCK SCREEN
============================================================ */
let currentInput = '';

const lcd   = document.getElementById('lcd');
const slots = [0,1,2,3].map(i => document.getElementById(`slot-${i}`));

function updateLCD() {
  slots.forEach((slot, i) => {
    slot.textContent = i < currentInput.length ? '●' : '_';
  });
}

function handleDigit(d) {
  if (currentInput.length >= 4) return;
  currentInput += d;
  updateLCD();
}

function handleClear() {
  if (!currentInput.length) return;
  currentInput = currentInput.slice(0, -1);
  updateLCD();
}

function handleValidate() {
  if (currentInput.length < 4) return;
  if (currentInput === SECRET_CODE) {
    lcd.classList.add('success');
    slots.forEach(s => s.textContent = '✓');
    setTimeout(unlockSite, 900);
  } else {
    lcd.classList.add('error');
    slots.forEach(s => s.textContent = '✕');
    setTimeout(() => {
      lcd.classList.remove('error');
      currentInput = '';
      updateLCD();
    }, 1000);
  }
}

document.querySelectorAll('.key[data-digit]').forEach(btn => {
  btn.addEventListener('click', () => handleDigit(btn.dataset.digit));
});
document.getElementById('key-clear').addEventListener('click', handleClear);
document.getElementById('key-validate').addEventListener('click', handleValidate);

document.addEventListener('keydown', e => {
  const ls = document.getElementById('lock-screen');
  if (!ls || ls.style.display === 'none') return;
  if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
  if (e.key === 'Backspace') { e.preventDefault(); handleClear(); }
  if (e.key === 'Enter') handleValidate();
});

/* ============================================================
   LOCK PARTICLES
============================================================ */
(function initLockParticles() {
  const canvas = document.getElementById('lock-particles');
  const ctx    = canvas.getContext('2d');
  const COLORS = ['#e8a5b2', '#c9a84c', '#f9b4c1', '#ffd9df'];
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    particles.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 2.2 + 0.5,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.45 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   UNLOCK
============================================================ */
function unlockSite() {
  const lockScreen = document.getElementById('lock-screen');
  lockScreen.classList.add('unlocking');

  setTimeout(() => {
    lockScreen.style.display = 'none';

    const container = document.getElementById('site-container');
    container.style.display = 'block';

    document.getElementById('nav-dots').style.display  = 'flex';
    document.getElementById('mute-btn').style.display  = 'flex';

    initHero();
    initPetals();
    initNavDots();
    initScrollObserver();
    initMessage();
    initQualities();
    initMobileGallery();
    initFlames();
    initWish();
    initBalloons();
    initHeroGarland();
    tryAutoplay();
  }, 800);
}

/* ============================================================
   HERO
============================================================ */
function initHero() {
  const name      = 'Orly';
  const container = document.getElementById('hero-name');
  container.innerHTML = '';
  [...name].forEach((char, i) => {
    const span = document.createElement('span');
    span.className   = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.8 + i * 0.2}s`;
    container.appendChild(span);
  });
  const delay = 800 + name.length * 200 + 500;
  setTimeout(launchConfetti, delay);
}

/* ============================================================
   PÉTALES
============================================================ */
function initPetals() {
  const hero  = document.getElementById('hero');
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size  = Math.random() * 12 + 7;
    const color = Math.random() > 0.5 ? '#f9b4c1' : '#e8a5b2';
    const rot   = Math.random() * 360;
    petal.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20">
      <ellipse cx="10" cy="10" rx="5" ry="10" fill="${color}"
        opacity="${(Math.random() * 0.4 + 0.3).toFixed(2)}"
        transform="rotate(${rot} 10 10)"/>
    </svg>`;
    petal.style.left              = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 7 + 6) + 's';
    petal.style.animationDelay    = (Math.random() * 9) + 's';
    hero.appendChild(petal);
  }
}

/* ============================================================
   NAV DOTS
============================================================ */
function initNavDots() {
  const SECTIONS  = ['hero', 'gallery', 'message', 'qualities', 'wish'];
  const dots      = document.querySelectorAll('.nav-dot');
  const container = document.getElementById('site-container');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      document.getElementById(dot.dataset.section)
        .scrollIntoView({ behavior: 'smooth' });
    });
  });

  container.addEventListener('scroll', () => {
    const scrollTop = container.scrollTop;
    SECTIONS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (scrollTop >= el.offsetTop - window.innerHeight / 2) {
        dots.forEach(d => d.classList.remove('active'));
        dots[i].classList.add('active');
      }
    });
  });
}

/* ============================================================
   SCROLL OBSERVER
============================================================ */
function initScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.artwork').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  const wishIntro = document.getElementById('wish-intro');
  if (wishIntro) observer.observe(wishIntro);
}

/* ============================================================
   MESSAGE
============================================================ */
function initMessage() {
  const container = document.getElementById('message-text');
  container.innerHTML = '';

  messageContent.split('\n\n').forEach(para => {
    const p = document.createElement('p');
    para.split(' ').forEach((word, wi, arr) => {
      const span = document.createElement('span');
      span.className   = 'word';
      span.textContent = word + (wi < arr.length - 1 ? ' ' : '');
      p.appendChild(span);
    });
    container.appendChild(p);
  });

  const section       = document.getElementById('message');
  const siteContainer = document.getElementById('site-container');
  let revealed = false;

  siteContainer.addEventListener('scroll', () => {
    if (revealed) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.65) {
      revealed = true;
      revealWords();
    }
  });
}

function revealWords() {
  const words = document.querySelectorAll('#message-text .word');
  words.forEach((w, i) => {
    setTimeout(() => {
      w.classList.add('revealed');
      if (i === words.length - 1) {
        setTimeout(() => {
          document.getElementById('msg-divider').classList.add('revealed');
          document.getElementById('msg-signature').classList.add('revealed');
        }, 300);
      }
    }, i * 32);
  });
}

/* ============================================================
   QUALITIES — 23 cartes numérotées
============================================================ */
function initQualities() {
  const grid = document.getElementById('qualities-grid');
  grid.innerHTML = '';

  qualities.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Raison ${i + 1}`);

    card.innerHTML = `
      <span class="q-number">${i + 1}</span>
      <span class="q-text">${text}</span>
      <span class="q-hint">appuie</span>
    `;

    card.addEventListener('click', () => card.classList.toggle('open'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('open');
      }
    });

    grid.appendChild(card);
  });
}

/* ============================================================
   MOBILE GALLERY CAROUSEL — auto-advance + touch/swipe
============================================================ */
function initMobileGallery() {
  if (window.innerWidth > 600) return;

  const track     = document.getElementById('gallery-track');
  const slides    = Array.from(track.querySelectorAll('.gallery-slide'));
  const dots      = Array.from(document.querySelectorAll('.gallery-dot'));
  const SLIDE_COUNT = slides.length;
  let current   = 0;
  let autoTimer = null;
  let touchStartX = 0;
  let touchStartTime = 0;

  function getSlideWidth() {
    // Chaque slide: 70vw + 16px padding
    return slides[0] ? slides[0].offsetWidth + 16 : window.innerWidth * 0.7 + 16;
  }

  function goTo(index, animate = true) {
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';

    current = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;

    // Centrage : offset pour que la slide active soit au centre
    const wrapper   = track.parentElement;
    const wrapWidth = wrapper.offsetWidth;
    const slideEl   = slides[0];
    const slideWidth = slideEl ? slideEl.offsetWidth : window.innerWidth * 0.7;
    const gap = 16; // gap entre slides en px (padding 8px * 2)
    const sw = slideWidth + gap;
    // Centrer la slide courante dans le wrapper
    const padLeft = (wrapWidth - slideWidth) / 2;
    const offset  = padLeft - current * sw;
    track.style.transform = `translateX(${offset}px)`;

    slides.forEach((s, i) => {
      s.classList.toggle('active-slide', i === current);
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Lancer l'overlay de développement sur la slide active
    const overlay = slides[current].querySelector('.photo-develop-overlay');
    if (overlay) {
      overlay.style.animation = 'none';
      overlay.offsetHeight; // reflow
      overlay.style.animation = 'photoDevelop 1.8s ease forwards';
    }

    if (!animate) requestAnimationFrame(() => { track.style.transition = ''; });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 3000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Touch swipe
  track.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].clientX;
    touchStartTime = Date.now();
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx   = e.changedTouches[0].clientX - touchStartX;
    const dt   = Date.now() - touchStartTime;
    if (Math.abs(dx) > 40 && dt < 400) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
    startAuto();
  }, { passive: true });

  // Dots cliquables
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  // Init
  goTo(0, false);
  startAuto();
}

/* ============================================================
   FLAMMES — animation subtile et contenue
   Amplitude très réduite : ±2% scale, ±0.6px translation
============================================================ */
const flameGroups = [
  document.getElementById('flame1'),
  document.getElementById('flame2'),
  document.getElementById('flame3'),
];

let flameRAF    = null;
let flameActive = true;

function initFlames() {
  const params = [
    { phaseX: 0,   phaseY: 0,   speedX: 1.8, speedY: 2.2, ampX: 0.008, ampY: 0.008 },
    { phaseX: 1.1, phaseY: 0.7, speedX: 2.1, speedY: 1.9, ampX: 0.010, ampY: 0.010 },
    { phaseX: 2.3, phaseY: 1.4, speedX: 1.6, speedY: 2.4, ampX: 0.007, ampY: 0.008 },
  ];

  let t = 0;

  function animateFlames() {
    if (!flameActive) return;
    t += 0.04;

    flameGroups.forEach((flame, i) => {
      if (!flame) return;
      const p  = params[i];
      // Translation horizontale légère uniquement, pas de descente
      const tx = Math.sin(t * p.speedX + p.phaseX) * 0.5;
      // Légère translation verticale vers le haut uniquement (oscillation autour de -1)
      const ty = -1 + Math.sin(t * p.speedY + p.phaseY) * 0.6;
      // Scale très réduit, centré sur 1
      const sx = 1 + Math.sin(t * p.speedX + p.phaseX) * p.ampX;
      const sy = 1 + Math.cos(t * p.speedY + p.phaseY) * p.ampY;
      flame.setAttribute('transform', `translate(${tx}, ${ty}) scale(${sx}, ${sy})`);
    });

    flameRAF = requestAnimationFrame(animateFlames);
  }
  animateFlames();
}

/* ============================================================
   WISH — souffler les bougies
   Extinction simultanée : flammes 1&3 d'abord, puis flamme 2
   après 500ms
============================================================ */
function initWish() {
  document.getElementById('wish-btn').addEventListener('click', blowCandles);
}

function blowCandles() {
  const btn = document.getElementById('wish-btn');
  btn.disabled    = true;
  btn.textContent = '💨 Pfouu…';

  const smokes = [
    document.getElementById('smoke1'),
    document.getElementById('smoke2'),
    document.getElementById('smoke3'),
  ];

  // Éteindre flammes extrêmes (1 et 3) d'abord
  [0, 2].forEach(i => extinguishFlame(i, smokes[i]));

  // Puis la flamme centrale (2) après 500ms
  setTimeout(() => extinguishFlame(1, smokes[1]), 500);

  // Stopper le RAF après tout
  setTimeout(() => {
    flameActive = false;
    if (flameRAF) cancelAnimationFrame(flameRAF);
  }, 700);

  // Message final
  setTimeout(() => {
    document.getElementById('wish-message').classList.add('revealed');
    launchConfetti();
    btn.textContent = '🌸';
  }, 1200);
}

function extinguishFlame(index, smokeEl) {
  const flame = flameGroups[index];
  if (!flame) return;
  flame.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  flame.style.opacity    = '0';
  flame.style.transform  = 'scale(0.1)';
  if (smokeEl) {
    setTimeout(() => { smokeEl.style.opacity = '1'; }, 150);
  }
}

/* ============================================================
   CONFETTI
============================================================ */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#e8a5b2','#c9a84c','#ffd9df','#fff0f3','#f9b4c1','#ffe088','#ffffff'];
  let pieces = [];

  for (let i = 0; i < 130; i++) {
    pieces.push({
      x:         Math.random() * canvas.width,
      y:         Math.random() * canvas.height - canvas.height,
      r:         Math.random() * 5 + 3,
      d:         Math.random() * 120 + 60,
      color:     COLORS[Math.floor(Math.random() * COLORS.length)],
      tiltAngle: Math.random() * Math.PI * 2,
      tiltSpeed: Math.random() * 0.08 + 0.04,
    });
  }

  let angle = 0;
  let tick  = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.01;
    tick++;

    pieces.forEach(p => {
      p.tiltAngle += p.tiltSpeed;
      p.y += (Math.cos(angle + p.d) + 2.2) * 1.4;
      p.x += Math.sin(angle) * 1.1;
      const tilt = Math.sin(p.tiltAngle) * 14;

      ctx.beginPath();
      ctx.lineWidth   = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + tilt,            p.y + tilt + p.r / 4);
      ctx.stroke();
    });

    pieces = pieces.filter(p => p.y < canvas.height + 20);
    if (pieces.length > 0 && tick < 280) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.display = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}

/* ============================================================
   BALLOONS — section hero bas
============================================================ */
function initBalloons() {
  const hero = document.getElementById('hero');
  const COLORS = ['#e8a5b2','#ffd9df','#f9b4c1','#c9a84c','#ffe088','#c2517a','#fff0f3'];
  const COUNT  = window.innerWidth < 600 ? 5 : 8;

  for (let i = 0; i < COUNT; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size  = 36 + Math.random() * 24;
    const left  = 5 + Math.random() * 90;
    const delay = Math.random() * 4;
    const dur   = 6 + Math.random() * 5;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.cssText = `
      left: ${left}%;
      bottom: ${6 + Math.random() * 14}%;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;
    balloon.innerHTML = `
      <svg width="${size}" height="${size * 1.25}" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="20" rx="19" ry="20" fill="${color}" opacity="0.82"/>
        <ellipse cx="14" cy="12" rx="5" ry="4" fill="white" opacity="0.28"/>
        <line x1="20" y1="40" x2="20" y2="52" stroke="${color}" stroke-width="1.2" opacity="0.6"/>
        <path d="M20 40 Q17 44 20 48" stroke="${color}" stroke-width="1" fill="none" opacity="0.5"/>
      </svg>
    `;
    hero.appendChild(balloon);
  }
}

/* ============================================================
   HERO GARLAND — guirlande de fleurs en haut
============================================================ */
function initHeroGarland() {
  const hero = document.getElementById('hero');
  const garland = document.createElement('div');
  garland.className = 'hero-garland';
  garland.setAttribute('aria-hidden', 'true');

  // SVG guirlande : vignes, fleurs roses, papillons
  garland.innerHTML = `
  <svg class="garland-svg" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <!-- Vigne principale -->
    <path d="M-20 55 Q60 20 120 60 Q180 95 240 50 Q300 10 360 55 Q420 95 480 48 Q540 5 600 55 Q660 100 720 50 Q780 5 840 55 Q900 100 960 50 Q1020 5 1080 55 Q1140 95 1220 50"
      stroke="#b5764a" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.55"/>
    <!-- Petites branches -->
    <path d="M90 45 Q95 25 110 20" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M210 58 Q218 38 230 30" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M350 48 Q358 28 370 22" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M490 42 Q498 22 510 16" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M640 48 Q648 28 660 22" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M790 48 Q798 28 810 22" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M940 46 Q948 26 960 20" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M1080 48 Q1088 28 1100 22" stroke="#b5764a" stroke-width="1.2" fill="none" opacity="0.4"/>
    <!-- Feuilles -->
    <ellipse cx="112" cy="17" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-30 112 17)"/>
    <ellipse cx="232" cy="27" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-20 232 27)"/>
    <ellipse cx="372" cy="19" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-35 372 19)"/>
    <ellipse cx="512" cy="13" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-25 512 13)"/>
    <ellipse cx="662" cy="19" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-30 662 19)"/>
    <ellipse cx="812" cy="19" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-30 812 19)"/>
    <ellipse cx="962" cy="17" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-30 962 17)"/>
    <ellipse cx="1102" cy="19" rx="7" ry="4" fill="#7ab87a" opacity="0.45" transform="rotate(-30 1102 19)"/>
    <!-- Vignes latérales gauche (dépassent) -->
    <path d="M-20 55 Q-40 30 -30 5" stroke="#b5764a" stroke-width="1.5" fill="none" opacity="0.3"/>
    <ellipse cx="-28" cy="6" rx="6" ry="4" fill="#7ab87a" opacity="0.35" transform="rotate(15 -28 6)"/>
    <!-- Vignes latérales droite (dépassent) -->
    <path d="M1220 50 Q1240 28 1235 5" stroke="#b5764a" stroke-width="1.5" fill="none" opacity="0.3"/>
    <ellipse cx="1234" cy="6" rx="6" ry="4" fill="#7ab87a" opacity="0.35" transform="rotate(-15 1234 6)"/>

    <!-- FLEURS : macro rose à 5 pétales -->
    <!-- Fleur 1 -->
    <g transform="translate(60,57)">
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(72)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(144)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(216)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="4" fill="#c9a84c"/>
    </g>
    <!-- Fleur 2 -->
    <g transform="translate(180,52)">
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(72)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(144)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(216)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="3.5" fill="#ffe088"/>
    </g>
    <!-- Fleur 3 -->
    <g transform="translate(300,58)">
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(72)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(144)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(216)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="4" fill="#ffd9df"/>
    </g>
    <!-- Fleur 4 -->
    <g transform="translate(420,50)">
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(72)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(144)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(216)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="3.5" fill="#c9a84c"/>
    </g>
    <!-- Fleur 5 -->
    <g transform="translate(540,57)">
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#f9b4c1" opacity="0.85"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#f9b4c1" opacity="0.85" transform="rotate(72)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#f9b4c1" opacity="0.85" transform="rotate(144)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#f9b4c1" opacity="0.85" transform="rotate(216)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#f9b4c1" opacity="0.85" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="4" fill="#ffe088"/>
    </g>
    <!-- Fleur 6 -->
    <g transform="translate(660,52)">
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#c2517a" opacity="0.8"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#c2517a" opacity="0.8" transform="rotate(72)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#c2517a" opacity="0.8" transform="rotate(144)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#c2517a" opacity="0.8" transform="rotate(216)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#c2517a" opacity="0.8" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="3.5" fill="#ffd9df"/>
    </g>
    <!-- Fleur 7 -->
    <g transform="translate(780,55)">
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(72)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(144)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(216)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#e8a5b2" opacity="0.85" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="4" fill="#c9a84c"/>
    </g>
    <!-- Fleur 8 -->
    <g transform="translate(900,53)">
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(72)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(144)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(216)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#f9b4c1" opacity="0.9" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="3.5" fill="#ffe088"/>
    </g>
    <!-- Fleur 9 -->
    <g transform="translate(1020,57)">
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(72)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(144)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(216)"/>
      <ellipse cx="0" cy="-9" rx="5" ry="9" fill="#c2517a" opacity="0.75" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="4" fill="#ffd9df"/>
    </g>
    <!-- Fleur 10 -->
    <g transform="translate(1140,54)">
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(72)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(144)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(216)"/>
      <ellipse cx="0" cy="-8" rx="4.5" ry="8" fill="#e8a5b2" opacity="0.9" transform="rotate(288)"/>
      <circle cx="0" cy="0" r="3.5" fill="#c9a84c"/>
    </g>

    <!-- PAPILLONS -->
    <!-- Papillon 1 -->
    <g class="butterfly" transform="translate(130,28)" style="animation: butterflyFloat1 5s ease-in-out infinite">
      <ellipse cx="-7" cy="-3" rx="8" ry="5" fill="#f9b4c1" opacity="0.75" transform="rotate(-20 -7 -3)"/>
      <ellipse cx="7" cy="-3" rx="8" ry="5" fill="#f9b4c1" opacity="0.75" transform="rotate(20 7 -3)"/>
      <ellipse cx="-5" cy="3" rx="5" ry="3" fill="#e8a5b2" opacity="0.6" transform="rotate(-30 -5 3)"/>
      <ellipse cx="5" cy="3" rx="5" ry="3" fill="#e8a5b2" opacity="0.6" transform="rotate(30 5 3)"/>
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#7a4060" stroke-width="0.8" opacity="0.5"/>
      <path d="M0 -6 Q-4 -12 -3 -14" stroke="#7a4060" stroke-width="0.7" fill="none" opacity="0.4"/>
      <path d="M0 -6 Q4 -12 3 -14" stroke="#7a4060" stroke-width="0.7" fill="none" opacity="0.4"/>
    </g>
    <!-- Papillon 2 -->
    <g class="butterfly" transform="translate(460,22)" style="animation: butterflyFloat2 6s ease-in-out infinite 1.5s">
      <ellipse cx="-7" cy="-3" rx="7" ry="4.5" fill="#c9a84c" opacity="0.65" transform="rotate(-20 -7 -3)"/>
      <ellipse cx="7" cy="-3" rx="7" ry="4.5" fill="#c9a84c" opacity="0.65" transform="rotate(20 7 -3)"/>
      <ellipse cx="-5" cy="3" rx="4.5" ry="2.8" fill="#ffe088" opacity="0.55" transform="rotate(-30 -5 3)"/>
      <ellipse cx="5" cy="3" rx="4.5" ry="2.8" fill="#ffe088" opacity="0.55" transform="rotate(30 5 3)"/>
      <line x1="0" y1="-5" x2="0" y2="5" stroke="#7a4060" stroke-width="0.8" opacity="0.4"/>
    </g>
    <!-- Papillon 3 -->
    <g class="butterfly" transform="translate(750,25)" style="animation: butterflyFloat1 7s ease-in-out infinite 3s">
      <ellipse cx="-7" cy="-3" rx="8" ry="5" fill="#ffd9df" opacity="0.8" transform="rotate(-20 -7 -3)"/>
      <ellipse cx="7" cy="-3" rx="8" ry="5" fill="#ffd9df" opacity="0.8" transform="rotate(20 7 -3)"/>
      <ellipse cx="-5" cy="3" rx="5" ry="3" fill="#e8a5b2" opacity="0.65" transform="rotate(-30 -5 3)"/>
      <ellipse cx="5" cy="3" rx="5" ry="3" fill="#e8a5b2" opacity="0.65" transform="rotate(30 5 3)"/>
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#7a4060" stroke-width="0.8" opacity="0.4"/>
      <path d="M0 -6 Q-4 -12 -3 -14" stroke="#7a4060" stroke-width="0.7" fill="none" opacity="0.35"/>
      <path d="M0 -6 Q4 -12 3 -14" stroke="#7a4060" stroke-width="0.7" fill="none" opacity="0.35"/>
    </g>
    <!-- Papillon 4 -->
    <g class="butterfly" transform="translate(1050,30)" style="animation: butterflyFloat2 5.5s ease-in-out infinite 0.8s">
      <ellipse cx="-6" cy="-3" rx="7" ry="4.5" fill="#c2517a" opacity="0.6" transform="rotate(-20 -6 -3)"/>
      <ellipse cx="6" cy="-3" rx="7" ry="4.5" fill="#c2517a" opacity="0.6" transform="rotate(20 6 -3)"/>
      <ellipse cx="-4" cy="3" rx="4.5" ry="2.8" fill="#f9b4c1" opacity="0.55" transform="rotate(-30 -4 3)"/>
      <ellipse cx="4" cy="3" rx="4.5" ry="2.8" fill="#f9b4c1" opacity="0.55" transform="rotate(30 4 3)"/>
      <line x1="0" y1="-5" x2="0" y2="5" stroke="#7a4060" stroke-width="0.8" opacity="0.4"/>
    </g>
  </svg>
  `;

  hero.insertBefore(garland, hero.firstChild);
}

/* ============================================================
   AUDIO
============================================================ */
const music   = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
let isMuted   = false;

function tryAutoplay() {
  if (!music.querySelector('source')) return;
  music.volume = 0.35;
  music.play().catch(() => {
    muteBtn.textContent = '▶️';
    muteBtn.title       = 'Lancer la musique';
  });
}

muteBtn.addEventListener('click', () => {
  if (!music.querySelector('source')) return;
  if (music.paused) {
    music.play();
    isMuted = false;
    music.muted = false;
    muteBtn.textContent = '🔊';
  } else {
    isMuted             = !isMuted;
    music.muted         = isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  }
});
