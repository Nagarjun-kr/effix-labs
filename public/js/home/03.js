/* Homepage hero entrance: tags, title, text and audit box rise in on load. */
(function initHeroEntrance() {
  const hero = document.getElementById('hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parts = ['.hero-tags-row', '.hero-title', '.hero-supporting-text', '.audit-box-label', '.audit-form-container'];
  const els = parts.map((sel) => hero.querySelector(sel)).filter(Boolean);
  els.forEach((el, i) => {
    el.classList.add('fx-rise');
    el.style.setProperty('--rd', (0.1 + i * 0.1).toFixed(2) + 's');
  });
  requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => el.classList.add('is-in'))));
})();
