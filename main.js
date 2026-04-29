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

/* ============================================================
   LOCK SCREEN
============================================================ */
let currentInput = '';

const lcd        = document.getElementById('lcd');
const slots      = [0,1,2,3].map(i => document.getElementById(`slot-${i}`));

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

// Boutons du clavier
document.querySelectorAll('.key[data-digit]').forEach(btn => {
  btn.addEventListener('click', () => handleDigit(btn.dataset.digit));
});
document.getElementById('key-clear').addEventListener('click', handleClear);
document.getElementById('key-validate').addEventListener('click', handleValidate);

// Support clavier physique
document.addEventListener('keydown', e => {
  const ls = document.getElementById('lock-screen');
  if (!ls || ls.style.display === 'none') return;
  if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
  if (e.key === 'Backspace') { e.preventDefault(); handleClear(); }
  if (e.key === 'Enter') handleValidate();
});

/* ============================================================
   LOCK PARTICLES (canvas)
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
   UNLOCK — transition vers le site
============================================================ */
function unlockSite() {
  const lockScreen = document.getElementById('lock-screen');
  lockScreen.classList.add('unlocking');

  setTimeout(() => {
    lockScreen.style.display = 'none';

    const container = document.getElementById('site-container');
    container.style.display = 'block';

    const navDots = document.getElementById('nav-dots');
    navDots.style.display = 'flex';

    const muteBtn = document.getElementById('mute-btn');
    muteBtn.style.display = 'flex';

    // Init dans l'ordre
    initHero();
    initPetals();
    initNavDots();
    initScrollObserver();
    initMessage();
    initFlipCards();
    initCarousel();
    initFlames();
    initWish();
    tryAutoplay();
  }, 800);
}

/* ============================================================
   HERO — lettres une à une
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
  // Confetti quand le nom finit de s'écrire
  const delay = 800 + name.length * 200 + 500;
  setTimeout(launchConfetti, delay);
}

/* ============================================================
   PÉTALES TOMBANTS
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
  const SECTIONS = ['hero', 'gallery', 'message', 'qualities', 'wish'];
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
   INTERSECTION OBSERVER (animations au scroll)
============================================================ */
function initScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.artwork').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });

  const wishIntro = document.getElementById('wish-intro');
  if (wishIntro) observer.observe(wishIntro);
}

/* ============================================================
   MESSAGE — révélation mot à mot
============================================================ */
function initMessage() {
  const container = document.getElementById('message-text');
  container.innerHTML = '';

  messageContent.split('\n\n').forEach(para => {
    const p = document.createElement('p');
    // On injecte les mots avec un espace après chacun,
    // en inline (pas inline-block) pour éviter les collisions
    para.split(' ').forEach((word, wi, arr) => {
      const span = document.createElement('span');
      span.className   = 'word';
      // Ajoute un espace sauf après le dernier mot du paragraphe
      span.textContent = word + (wi < arr.length - 1 ? ' ' : '');
      p.appendChild(span);
    });
    container.appendChild(p);
  });

  const section      = document.getElementById('message');
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
   FLIP CARDS
============================================================ */
function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

/* ============================================================
   CARROUSEL MOBILE (swipe horizontal)
============================================================ */
function initCarousel() {
  if (window.innerWidth > 600) return; // grille desktop — pas besoin

  const grid       = document.getElementById('cards-grid');
  const dots       = document.querySelectorAll('.carousel-dot');
  const cards      = document.querySelectorAll('.flip-card');
  const CARD_COUNT = cards.length;

  function getActiveIndex() {
    const scrollLeft   = grid.scrollLeft;
    const cardWidth    = grid.scrollWidth / CARD_COUNT;
    return Math.round(scrollLeft / cardWidth);
  }

  grid.addEventListener('scroll', () => {
    const idx = getActiveIndex();
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, { passive: true });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx      = parseInt(dot.dataset.index);
      const cardWidth = grid.scrollWidth / CARD_COUNT;
      grid.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   FLAMMES — animation naturelle via JS
   FIX : on anime via requestAnimationFrame pour pouvoir
   arrêter l'animation proprement quand on souffle
============================================================ */
const flameGroups = [
  document.getElementById('flame1'),
  document.getElementById('flame2'),
  document.getElementById('flame3'),
];

let flameRAF = null;
let flameActive = true;

function initFlames() {
  // Paramètres par flamme pour varier la phase et la vitesse
  const params = [
    { phaseX: 0,    phaseY: 0,    speedX: 1.8, speedY: 2.2, ampX: 0.06, ampY: 0.08 },
    { phaseX: 1.1,  phaseY: 0.7,  speedX: 2.1, speedY: 1.9, ampX: 0.07, ampY: 0.10 },
    { phaseX: 2.3,  phaseY: 1.4,  speedX: 1.6, speedY: 2.4, ampX: 0.05, ampY: 0.09 },
  ];

  let t = 0;

  function animateFlames() {
    if (!flameActive) return;
    t += 0.04;

    flameGroups.forEach((flame, i) => {
      if (!flame) return;
      const p  = params[i];
      const sx = 1 + Math.sin(t * p.speedX + p.phaseX) * p.ampX;
      const sy = 1 + Math.cos(t * p.speedY + p.phaseY) * p.ampY;
      // Légère translation horizontale pour le vacillement
      const tx = Math.sin(t * p.speedX * 0.7 + p.phaseX) * 0.8;
      flame.setAttribute('transform', `translate(${tx}, 0) scale(${sx}, ${sy})`);
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

  // Éteindre les flammes une par une avec un délai
  flameGroups.forEach((flame, i) => {
    setTimeout(() => {
      if (!flame) return;
      // Stop l'animation JS et masque la flamme
      flame.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      flame.style.opacity    = '0';
      flame.style.transform  = 'scale(0.1)';
      // Affiche la fumée
      if (smokes[i]) smokes[i].style.opacity = '1';
    }, i * 350);
  });

  // Après l'extinction de la dernière flamme, stoppe le RAF
  setTimeout(() => {
    flameActive = false;
    if (flameRAF) cancelAnimationFrame(flameRAF);
  }, flameGroups.length * 350 + 100);

  // Message final + confetti
  setTimeout(() => {
    document.getElementById('wish-message').classList.add('revealed');
    launchConfetti();
    btn.textContent = '🌸';
  }, flameGroups.length * 350 + 600);
}

/* ============================================================
   CONFETTI (canvas)
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
   AUDIO / MUTE
============================================================ */
const music   = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
let isMuted   = false;

function tryAutoplay() {
  // Aucune source définie → ne rien faire
  if (!music.querySelector('source')) return;
  music.volume = 0.35;
  music.play().catch(() => {
    // Autoplay bloqué → bouton devient "lancer la musique"
    muteBtn.textContent = '▶️';
    muteBtn.title       = 'Lancer la musique';
  });
}

muteBtn.addEventListener('click', () => {
  if (!music.querySelector('source')) return;
  if (music.paused) {
    music.play();
    muteBtn.textContent = '🔊';
    isMuted = false;
  } else {
    isMuted       = !isMuted;
    music.muted   = isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
  }
});
