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
  btn.addEventListener('click', () => {
    handleDigit(btn.dataset.digit);
    btn.blur();
  });
  // Force blur on touchend to prevent persistent active state on Android
  btn.addEventListener('touchend', () => { setTimeout(() => btn.blur(), 50); }, { passive: true });
});
document.getElementById('key-clear').addEventListener('click', () => {
  handleClear();
  document.getElementById('key-clear').blur();
});
document.getElementById('key-clear').addEventListener('touchend', () => {
  setTimeout(() => document.getElementById('key-clear').blur(), 50);
}, { passive: true });

document.getElementById('key-validate').addEventListener('click', () => {
  handleValidate();
  document.getElementById('key-validate').blur();
});
document.getElementById('key-validate').addEventListener('touchend', () => {
  setTimeout(() => document.getElementById('key-validate').blur(), 50);
}, { passive: true });

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
    // document.getElementById('mute-btn').style.display  = 'flex'; // bouton mute désactivé

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
  const container = document.getElementById('site-container');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { root: container, threshold: 0.15 });

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

  const section     = document.getElementById('message');
  const siteContainer = document.getElementById('site-container');
  let revealed = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealed) {
        revealed = true;
        revealWords();
      }
    });
  }, { root: siteContainer, threshold: 0.2 });

  observer.observe(section);
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
   QUALITIES — 23 cartes numérotées avec auto-retournement
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

  // Auto-flip : on retourne chaque carte en cascade, avec un délai croissant
  // Dès que la section est visible
  const section = document.getElementById('qualities');
  const siteContainer = document.getElementById('site-container');
  let autoFlipped = false;

  function autoFlipCards() {
    if (autoFlipped) return;
    autoFlipped = true;
    const cards = grid.querySelectorAll('.q-card');
    cards.forEach((card, i) => {
      const delay = 600 + i * 150;
      setTimeout(() => {
        card.classList.add('open');
      }, delay);
    });
  }

  const qualitiesObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) autoFlipCards();
    });
  }, { root: siteContainer, threshold: 0.1 });

  qualitiesObserver.observe(section);
}

/* ============================================================
   MOBILE GALLERY CAROUSEL — centrage parfait garanti
============================================================ */
function initMobileGallery() {
  if (window.innerWidth > 600) return;

  const track       = document.getElementById('gallery-track');
  const slides      = Array.from(track.querySelectorAll('.gallery-slide'));
  const dotsWrapper = document.getElementById('gallery-dots');
  const dots        = Array.from(dotsWrapper.querySelectorAll('.gallery-dot'));
  const SLIDE_COUNT = slides.length;
  let current      = 0;
  let autoTimer    = null;
  let touchStartX  = 0;
  let touchStartTime = 0;

  // Chaque slide fait 70vw, gap 0 (on gère le padding dans le CSS)
  // On utilise scroll natif : chaque slide = 100% du wrapper → centrage parfait
  // Mais ici on reste sur transform pour compatibilité.
  // Clé : slideWidth = offsetWidth de la slide RÉELLE (pas de padding parasite)

  function computeOffset(idx) {
    const wrapper    = track.parentElement;
    const wrapWidth  = wrapper.offsetWidth;
    const slide      = slides[idx];
    if (!slide) return 0;
    // offsetLeft de la slide par rapport au track (position naturelle)
    const slideLeft  = slide.offsetLeft;
    const slideWidth = slide.offsetWidth;
    // Offset pour centrer : on veut que le centre de la slide = centre du wrapper
    return -(slideLeft - (wrapWidth - slideWidth) / 2);
  }

  function goTo(index, animate = true) {
    current = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;

    track.style.transition = animate
      ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';

    track.style.transform = `translateX(${computeOffset(current)}px)`;

    slides.forEach((s, i) => s.classList.toggle('active-slide', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Overlay développement
    const overlay = slides[current].querySelector('.photo-develop-overlay');
    if (overlay) {
      overlay.style.animation = 'none';
      overlay.offsetHeight;
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
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dt = Date.now() - touchStartTime;
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

  // Recalcul au resize
  window.addEventListener('resize', () => {
    goTo(current, false);
  });

  // Init après un court délai pour que le DOM soit rendu
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      goTo(0, false);
      startAuto();
    });
  });
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

  // Éteindre toutes les flammes simultanément
  [0, 1, 2].forEach(i => extinguishFlame(i, smokes[i]));

  // Stopper le RAF
  setTimeout(() => {
    flameActive = false;
    if (flameRAF) cancelAnimationFrame(flameRAF);
  }, 400);

  // Message final
  setTimeout(() => {
    document.getElementById('wish-message').classList.add('revealed');
    launchConfetti();
    btn.textContent = '🌸';
  }, 1000);
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
   HERO GARLAND — guirlande d'anniversaire en haut
============================================================ */
function initHeroGarland() {
  const hero = document.getElementById('hero');
  const garland = document.createElement('div');
  garland.className = 'hero-garland';
  garland.setAttribute('aria-hidden', 'true');

  // Couleurs alternées pour les fanions
  const flagColors = [
    '#e8a5b2','#c9a84c','#f9b4c1','#ffd9df','#c2517a',
    '#ffe088','#e8a5b2','#c9a84c','#f9b4c1','#ffd9df',
    '#c2517a','#ffe088','#e8a5b2','#c9a84c','#f9b4c1',
  ];

  // Positions des fanions répartis sur la largeur
  // viewBox 0 0 1200 110
  // La ficelle fait une belle courbe caténaire de gauche à droite
  // On place 15 fanions équidistants
  const N = 15;
  const ropeY1 = 18, ropeY2 = 18, sagY = 52; // hauteur ficelle aux extrémités et au centre
  // Calcul d'une parabole simple pour la ficelle
  function ropeY(x) {
    // parabole : y = sagY - (sagY - ropeY1)*4*(x/1200)*(1 - x/1200)
    return ropeY1 + (sagY - ropeY1) * 4 * (x / 1200) * (1 - x / 1200);
  }

  let flags = '';
  let ropePoints = '';

  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const x = 20 + t * 1160;
    const y = ropeY(x);
    const color = flagColors[i % flagColors.length];
    const angle = (Math.random() - 0.5) * 14; // légère rotation aléatoire
    const w = 48, h = 56;

    // Fanion triangulaire : sommet en (0,0), base en haut
    flags += `
      <g transform="translate(${x}, ${y}) rotate(${angle})">
        <polygon points="${-w/2},0 ${w/2},0 0,${h}"
          fill="${color}" opacity="0.88"/>
        <polygon points="${-w/2},0 ${w/2},0 0,${h}"
          fill="none" stroke="white" stroke-width="0.8" opacity="0.4"/>
        <line x1="${-w/2}" y1="0" x2="${w/2}" y2="0"
          stroke="white" stroke-width="1.2" opacity="0.35"/>
      </g>`;

    if (i === 0) ropePoints = `M ${x} ${y}`;
    else ropePoints += ` Q ${x - 580/N} ${y + 8} ${x} ${y}`;
  }

  // Ficelle caténaire lissée
  let catenary = `M -10 ${ropeY(0)}`;
  for (let px = 0; px <= 1210; px += 10) {
    catenary += ` L ${px} ${ropeY(px)}`;
  }

  garland.innerHTML = `
  <svg class="garland-svg" viewBox="0 0 1200 115" preserveAspectRatio="xMidYMid meet"
       xmlns="http://www.w3.org/2000/svg" overflow="visible">

    <!-- Ficelle caténaire -->
    <path d="${catenary}"
      stroke="#8B6040" stroke-width="1.8" fill="none"
      stroke-linecap="round" opacity="0.55"/>

    <!-- Fanions -->
    ${flags}

    <!-- Extrémités : ficelle sort du bord gauche -->
    <line x1="-30" y1="${ropeY(0)}" x2="20" y2="${ropeY(0)}"
      stroke="#8B6040" stroke-width="1.8" opacity="0.45"/>
    <!-- ... et du bord droit -->
    <line x1="1180" y1="${ropeY(1200)}" x2="1230" y2="${ropeY(1200)}"
      stroke="#8B6040" stroke-width="1.8" opacity="0.45"/>

    <!-- Petits nœuds sur la ficelle aux attaches -->
    ${Array.from({length: N}, (_, i) => {
      const t = i / (N - 1);
      const x = 20 + t * 1160;
      const y = ropeY(x);
      return `<circle cx="${x}" cy="${y}" r="2.5" fill="#8B6040" opacity="0.5"/>`;
    }).join('')}
  </svg>
  `;

  hero.insertBefore(garland, hero.firstChild);
}

/* ============================================================
   AUDIO — bouton mute désactivé pour le moment
============================================================ */
// const music   = document.getElementById('bg-music');
// const muteBtn = document.getElementById('mute-btn');
// let isMuted   = false;

function tryAutoplay() {
  const music = document.getElementById('bg-music');
  if (music) music.play().catch(() => {});
}

// muteBtn.addEventListener('click', () => { ... });
