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
    '#our-approach .section-heading-editorial', '#our-approach .section-intro-text', '#our-approach .approach-col',
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
