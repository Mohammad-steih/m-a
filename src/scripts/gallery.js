/**
 * Gallery, Slideshow & Lightbox — دعوة خطوبة محمد وعائشة
 * Features:
 *  - Auto slideshow: one image at a time, 5-second interval, fade + subtle scale
 *  - Lightbox: tap to open, swipe to navigate, keyboard support
 */

(function () {
  'use strict';

  const IMAGES = [
    { src: 'assets/images/ayoosh1.jpeg', alt: 'محمد وعائشة — صورة أولى' },
    { src: 'assets/images/ayoosh2.jpeg', alt: 'محمد وعائشة — صورة ثانية' },
    { src: 'assets/images/ayoosh3.jpeg', alt: 'محمد وعائشة — صورة ثالثة' },
  ];

  /* ── SLIDESHOW ─────────────────────────────────────────────── */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideshowTimer = null;

    function goToSlide(index) {
      const next = ((index % slides.length) + slides.length) % slides.length;

      // Remove active from current
      slides[currentSlide].classList.remove('slide--active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('slide-dot--active');

      // Activate next
      currentSlide = next;
      slides[currentSlide].classList.add('slide--active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('slide-dot--active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function startSlideshow() {
      // Clear any existing timer before starting
      if (slideshowTimer) clearInterval(slideshowTimer);
      slideshowTimer = setInterval(nextSlide, 5000);
    }

    // Start slideshow automatically
    startSlideshow();

    // Handle image load errors in slideshow
    slides.forEach(function (slide) {
      const img = slide.querySelector('.slide-img');
      if (img) {
        img.addEventListener('error', function () {
          const frame = img.closest('.slide-frame');
          if (frame) {
            frame.style.background = 'linear-gradient(135deg, #FBE8DF 0%, #FAF6F0 60%, rgba(201,169,110,0.15) 100%)';
          }
          img.style.display = 'none';
        });
      }
    });
  }

  /* ── LIGHTBOX ──────────────────────────────────────────────── */
  let currentIndex = 0;

  // Elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox) return;

  // ── Open ──────────────────────────────────────────
  function openLightbox(index) {
    currentIndex = ((index % IMAGES.length) + IMAGES.length) % IMAGES.length;
    const img = IMAGES[currentIndex];

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => {
      lightbox.classList.add('lb-open');
    });

    document.body.style.overflow = 'hidden';
    lightbox.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }

  // ── Close ─────────────────────────────────────────
  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    lightbox.addEventListener('transitionend', () => {
      lightbox.style.display = 'none';
    }, { once: true });
    document.body.style.overflow = '';
    lightbox.setAttribute('aria-hidden', 'true');
  }

  // ── Navigate ──────────────────────────────────────
  function showImage(index) {
    const img = IMAGES[((index % IMAGES.length) + IMAGES.length) % IMAGES.length];
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.96)';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      currentIndex = ((index % IMAGES.length) + IMAGES.length) % IMAGES.length;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 200);
  }

  // ── Gallery item click (slides are also clickable) ────────────────────────────
  document.querySelectorAll('.slide').forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      openLightbox(i);
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  // Keep old gallery-item support in case they exist
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index, 10) || 0;
      openLightbox(idx);
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(item.dataset.index, 10) || 0;
        openLightbox(idx);
      }
    });
  });

  // ── Controls ──────────────────────────────────────
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // RTL: left arrow in RTL = visually "next"
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── Keyboard navigation ───────────────────────────
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(currentIndex - 1); // RTL: right = prev
    if (e.key === 'ArrowLeft') showImage(currentIndex + 1); // RTL: left = next
  });

  // ── Touch / Swipe support ─────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only handle horizontal swipes
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;

    if (dx > 0) {
      showImage(currentIndex + 1); // Swipe right → next (RTL intuitive)
    } else {
      showImage(currentIndex - 1); // Swipe left → prev
    }
  }, { passive: true });

  // ── Image transition style ────────────────────────
  if (lightboxImg) {
    lightboxImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  }
})();
