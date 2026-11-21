/* Service poster cards: floating icon layers that drift with the pointer (SEO & AEO, Content Writing). */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  document.querySelectorAll('.poster-float').forEach(function (layerWrap) {
    var layers = layerWrap.querySelectorAll('.poster-float-layer');
    layers.forEach(function (el, i) {
      el.style.setProperty('--d', el.getAttribute('data-depth') || '16');
      el.style.animationDelay = (-i * 0.9) + 's';
    });
    if (reduce || !fine) return;
    var card = layerWrap.closest('.service-artwork-card') || layerWrap.parentElement;
    var raf = 0;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        layerWrap.style.setProperty('--px', px.toFixed(3));
        layerWrap.style.setProperty('--py', py.toFixed(3));
      });
    });
    card.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      layerWrap.style.setProperty('--px', '0');
      layerWrap.style.setProperty('--py', '0');
    });
  });
})();

/* Scroll reveal (reference-site preset): headings, intro text, question cards, principles,
   FAQ and the closing call-to-action fade up with a gentle spring as they enter the viewport. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var sel = [
    '#our-approach .dq-eyebrow', '#our-approach .section-heading-editorial', '#our-approach .section-intro-text', '#our-approach .q3-card', '#our-approach .q3-foot',
    '.principles-panel-header', '.principles-col',
    '#faqs .section-heading-editorial', '#faqs .faq-item',
    '#final-cta .cta-heading', '#final-cta .cta-desc', '#final-cta .cta-actions-row'
  ].join(',');
  var els = Array.prototype.slice.call(document.querySelectorAll(sel));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) {
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.classList.add('fx-reveal');
    el.style.setProperty('--fx-d', (Math.min(sib, 5) * 0.1).toFixed(2) + 's');
    io.observe(el);
  });
})();


/* Digital Discovery (three questions): the mock-ups animate only while the section is on screen, and the
   search box in card 2 types out real-style customer questions one after another. */
(function () {
  var section = document.getElementById('our-approach');
  var typed = document.getElementById('q3Typed');
  if (!section) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phrases = ['best option near me', 'is it worth the price?', 'which one is better?', 'can I trust them?'];
  var timer = 0, p = 0, n = 0, del = false;
  function tick() {
    var word = phrases[p];
    n += del ? -1 : 1;
    typed.textContent = word.slice(0, n);
    var wait = del ? 35 : 75;
    if (!del && n === word.length) { del = true; wait = 1400; }
    else if (del && n === 0) { del = false; p = (p + 1) % phrases.length; wait = 300; }
    timer = setTimeout(tick, wait);
  }
  if (reduce) { if (typed) typed.textContent = phrases[0]; return; }
  if (!('IntersectionObserver' in window)) { section.classList.add('is-live'); if (typed) tick(); return; }
  new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      section.classList.toggle('is-live', en.isIntersecting);
      if (!typed) return;
      if (en.isIntersecting && !timer) tick();
      if (!en.isIntersecting) { clearTimeout(timer); timer = 0; }
    });
  }, { threshold: 0.15 }).observe(section);
})();

/* Principles card: a soft purple glow follows the cursor (mouse devices only). */
(function () {
  var panel = document.querySelector('.principles-editorial-panel');
  if (!panel || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var raf = 0, x = 0, y = 0;
  function paint() { raf = 0; panel.style.setProperty('--mx', x + 'px'); panel.style.setProperty('--my', y + 'px'); }
  function move(e) {
    var r = panel.getBoundingClientRect();
    x = e.clientX - r.left; y = e.clientY - r.top;
    if (!raf) raf = requestAnimationFrame(paint);
  }
  panel.addEventListener('pointerenter', function (e) { move(e); paint(); panel.classList.add('is-glow'); });
  panel.addEventListener('pointermove', move);
  panel.addEventListener('pointerleave', function () { panel.classList.remove('is-glow'); });
})();
