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
    '#our-approach .dq-eyebrow', '#our-approach .section-heading-editorial', '#our-approach .section-intro-text', '#our-approach .dq-item', '#our-approach .dq-lens',
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


/* Digital Discovery: three questions cycle in turn; the lens card shows each one.
   Hover, click, focus or arrow keys pick a question; autoplay resumes after a pause. */
(function () {
  var wrap = document.getElementById('dqWrap');
  if (!wrap) return;
  var items = Array.prototype.slice.call(wrap.querySelectorAll('.dq-item'));
  var scenes = Array.prototype.slice.call(wrap.querySelectorAll('.dq-scene'));
  var stepT = wrap.querySelector('#dqStep bdi');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var DUR = 4500, cur = 0, timer = 0, visible = false, lastUser = 0;
  wrap.style.setProperty('--dq-dur', DUR + 'ms');
  function show(i) {
    cur = (i + items.length) % items.length;
    items.forEach(function (li, k) { li.classList.toggle('is-on', k === cur); li.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    scenes.forEach(function (sc, k) { sc.classList.toggle('is-on', k === cur); });
    if (stepT) stepT.setAttribute('data-t', '0' + (cur + 1));
    var bar = items[cur].querySelector('.dq-bar');
    if (bar) { bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = ''; }
  }
  function schedule() {
    clearTimeout(timer);
    if (reduce || !visible) { wrap.classList.remove('is-auto'); return; }
    var idle = performance.now() - lastUser;
    if (idle < 8000) { wrap.classList.remove('is-auto'); timer = setTimeout(schedule, 8000 - idle); return; }
    wrap.classList.add('is-auto');
    timer = setTimeout(function () { show(cur + 1); schedule(); }, DUR);
  }
  function user(i) { lastUser = performance.now(); show(i); schedule(); }
  items.forEach(function (li, i) {
    li.addEventListener('click', function () { user(i); });
    li.addEventListener('focus', function () { if (i !== cur) user(i); });
    if (fine) li.addEventListener('pointerenter', function () { if (i !== cur) user(i); });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
  });
  show(0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(wrap);
  }
})();
