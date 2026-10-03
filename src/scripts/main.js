/**
 * Main JS — دعوة خطوبة محمد وعائشة
 * Handles: opening card, scroll animations, Tatreez, WhatsApp, parallax
 */

(function () {
  'use strict';

  /* ── Elements ──────────────────────────────────────────── */
  const openingScreen = document.getElementById('opening-screen');
  const cardInner     = document.getElementById('card-inner');
  const cardOpenBtn   = document.getElementById('card-open-btn');
  const continueBtn   = document.getElementById('continue-btn');
  const mainContent   = document.getElementById('main-content');
  const petalsWrap    = document.getElementById('petals-wrap');

  /* ── State ─────────────────────────────────────────────── */
  let cardFlipped = false;

  /* ── Prevent scroll while opening screen is active ─────── */
  document.body.style.overflow = 'hidden';

  /* ── CARD OPEN ──────────────────────────────────────────── */
  function openCard() {
    if (cardFlipped) return;
    cardFlipped = true;

    // Flip the card
    cardInner.classList.add('flipped');

    // Update ARIA
    const front = cardInner.querySelector('.card-face-front');
    const back  = cardInner.querySelector('.card-face-back');
    if (front) front.setAttribute('aria-hidden', 'true');
    if (back)  back.setAttribute('aria-hidden', 'false');

    // Rain petals
    setTimeout(spawnPetals, 350);

    // Show continue button after card settles
    setTimeout(() => {
      if (continueBtn) continueBtn.classList.add('visible');
    }, 1800);
  }

  // Card click (anywhere on the card + explicit button)
  if (cardOpenBtn) cardOpenBtn.addEventListener('click', openCard);
  if (cardInner)   {
    cardInner.addEventListener('click', openCard);
    cardInner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); }
    });
    cardInner.setAttribute('tabindex', '0');
  }

  /* ── CONTINUE → reveal main content ────────────────────── */
  function revealMain() {
    openingScreen.classList.add('exit');
    document.body.style.overflow = '';
    mainContent.removeAttribute('aria-hidden');

    setTimeout(() => {
      openingScreen.style.display = 'none';
      initScrollAnimations();
      initParallax();
    }, 900);
  }

  if (continueBtn) continueBtn.addEventListener('click', revealMain);

  /* ── PETALS ─────────────────────────────────────────────── */
  function spawnPetals() {
    if (!petalsWrap) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const x = 25 + Math.random() * 50; // percent from right
      const drift = (Math.random() - 0.5) * 80;
      const rot   = 120 + Math.random() * 200;
      const dur   = 2.2 + Math.random() * 1.8;
      const delay = Math.random() * 1.2;
      petal.style.cssText = `
        right: ${x}%;
        --petal-drift: ${drift}px;
        --petal-rot: ${rot}deg;
        --dur: ${dur}s;
        --delay: ${delay}s;
        animation: petalFloat ${dur}s ease-out ${delay}s forwards;
      `;
      petalsWrap.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove());
    }
  }

  /* ── SCROLL ANIMATIONS (IntersectionObserver) ───────────── */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.anim, .anim-scale, .anim-slide-start').forEach((el) => {
      observer.observe(el);
    });
  }

  /* ── PARALLAX (desktop only) ────────────────────────────── */
  function initParallax() {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;

    const back = document.querySelector('.hero-layer--back');
    const mid  = document.querySelector('.hero-layer--mid');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (back) back.style.transform = `translateY(${y * 0.25}px)`;
      if (mid)  mid.style.transform  = `translateY(${y * 0.12}px)`;
    }, { passive: true });
  }

  /* ── TATREEZ PATTERNS ───────────────────────────────────── */
  // Inject SVG Tatreez pattern into each .tatreez-row element
  function initTatreez() {
    const rows = document.querySelectorAll('.tatreez-row');
    rows.forEach((row, i) => {
      const pid = `tp${i}`;
      row.innerHTML = `
        <svg width="100%" height="22" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
          <defs>
            <pattern id="${pid}" x="0" y="0" width="32" height="22" patternUnits="userSpaceOnUse">
              <!-- Central diamond -->
              <polygon points="16,2 22,11 16,20 10,11"
                fill="#C9A96E" opacity="0.45"/>
              <!-- Cross marks L -->
              <line x1="2" y1="7" x2="6" y2="11" stroke="#C9A96E" stroke-width="1.1" opacity="0.3"/>
              <line x1="6" y1="7" x2="2" y2="11" stroke="#C9A96E" stroke-width="1.1" opacity="0.3"/>
              <!-- Cross marks R -->
              <line x1="26" y1="7" x2="30" y2="11" stroke="#C9A96E" stroke-width="1.1" opacity="0.3"/>
              <line x1="30" y1="7" x2="26" y2="11" stroke="#C9A96E" stroke-width="1.1" opacity="0.3"/>
              <!-- Small blush squares -->
              <rect x="13" y="9" width="6" height="4" fill="#F2C4B0" opacity="0.12"/>
            </pattern>
          </defs>
          <rect width="100%" height="22" fill="url(#${pid})"/>
        </svg>
      `;
    });
  }

  initTatreez();

  /* ── GALLERY PLACEHOLDER ────────────────────────────────── */
  document.querySelectorAll('.gallery-img').forEach((img) => {
    img.addEventListener('error', () => {
      const frame = img.closest('.gallery-frame');
      if (frame) frame.classList.add('no-img');
      img.style.display = 'none';
    });
  });


  /* ── ACCESSIBILITY: trap focus in lightbox ──────────────── */
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb && lb.style.display === 'flex' && e.key === 'Tab') {
      const focusable = lb.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

})();
