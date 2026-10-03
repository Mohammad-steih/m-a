/**
 * Countdown — دعوة خطوبة محمد وعائشة
 * Target: Friday, September 11, 2026 — 17:00 Palestine Time (UTC+3)
 */

(function () {
  'use strict';

  // Target: Sept 11, 2026, 17:00:00 UTC+3
  const TARGET = new Date('2026-09-11T17:00:00+03:00');

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const elGrid    = document.getElementById('cd-grid');
  const elZero    = document.getElementById('cd-zero');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  // Pad a number to 2 digits
  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  // Animate number change
  function animateChange(el, newVal) {
    if (el.textContent === newVal) return;
    el.classList.remove('cd-flip');
    // Force reflow
    void el.offsetWidth;
    el.classList.add('cd-flip');
    el.textContent = newVal;
  }

  function tick() {
    const now  = new Date();
    const diff = TARGET - now;

    if (diff <= 0) {
      // Event is happening now or has passed
      if (elGrid) elGrid.style.display = 'none';
      if (elZero) {
        elZero.style.display = 'block';
        elZero.style.opacity = '1';
      }
      return; // Stop ticking
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    animateChange(elDays,    pad(days));
    animateChange(elHours,   pad(hours));
    animateChange(elMinutes, pad(minutes));
    animateChange(elSeconds, pad(seconds));

    // Update ARIA label for accessibility
    const wrapper = document.getElementById('countdown-wrapper');
    if (wrapper) {
      wrapper.setAttribute('aria-label',
        `${days} يوم و ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`
      );
    }

    setTimeout(tick, 1000);
  }

  // Start immediately
  tick();
})();
