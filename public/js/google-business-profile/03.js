/* Google Business Profile Optimisation page: video lightbox, checklist meter, scroll reveals. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Video lightbox ---- */
  var modal = document.getElementById('gxVideoModal');
  var openBtn = document.getElementById('gxWatchBtn');
  var video = document.getElementById('gxModalVideo');
  var lastFocus = null;
  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
    var close = modal.querySelector('.gx-modal-close');
    if (close) close.focus();
    if (video) { video.currentTime = 0; var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    if (window.lenis) window.lenis.start();
    if (video) video.pause();
    if (lastFocus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openModal);
  var media = document.getElementById('gxMedia');
  if (media) media.addEventListener('click', function (e) { if (e.target === media || e.target.classList.contains('gx-media-shade')) openModal(); });
  if (modal) modal.addEventListener('click', function (e) { if (e.target.getAttribute('data-close')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---- Checklist meter ---- */
  var list = document.getElementById('gxChecklist');
  if (list) {
    var boxes = list.querySelectorAll('input[type="checkbox"]');
    var num = document.getElementById('gxScoreNum');
    var fill = document.getElementById('gxMeterFill');
    var meter = document.getElementById('gxMeter');
    var msg = document.getElementById('gxScoreMsg');
    function update() {
      var n = 0; boxes.forEach(function (b) { if (b.checked) n++; });
      var total = boxes.length;
      if (num) num.textContent = String(n);
      if (fill) fill.style.width = (n / total * 100).toFixed(1) + '%';
      if (meter) meter.setAttribute('aria-valuenow', String(n));
      if (!msg) return;
      if (n === 0) msg.textContent = 'Start ticking to see where your profile stands.';
      else if (n < 6) msg.textContent = 'Needs work. Several basics are missing, and these are often the quickest wins.';
      else if (n < 11) msg.textContent = 'Getting there. A few gaps are likely costing you searches and clicks.';
      else if (n < total) msg.textContent = 'Strong foundation. The last details are where competitors pull ahead.';
      else msg.textContent = 'Excellent. Now it’s about keeping it active and accurate every month.';
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  /* ---- Scroll reveals ---- */
  if (reduce || !('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll('.gx-head, .gx-split > *, .gx-factor, .gx-tile, .gx-table-wrap, .gx-services li, .gx-check-grid > *, .gx-steps li, .gx-why > div, .gx-related a, .gx-faq-grid > *');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el, i) {
    el.classList.add('gx-reveal');
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(sib, 5) * 0.07 + 's';
    io.observe(el);
  });
})();

/* Process: a light line slides through every step (auto loop; follows the cursor on hover). */
(function () {
  var wrap = document.getElementById('gxStepsWrap');
  if (!wrap) return;
  var track = wrap.querySelector('.gx-steps-track');
  var fill = document.getElementById('gxStepsFill');
  var head = document.getElementById('gxStepsHead');
  var items = Array.prototype.slice.call(wrap.querySelectorAll('.gx-steps li'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x0 = 0, len = 0, centers = [];
  var pos = 0, target = 0, hovering = false, visible = false, t0 = 0, raf = 0;

  function measure() {
    var wr = wrap.getBoundingClientRect();
    centers = items.map(function (li) { var n = li.querySelector('.gx-step-n').getBoundingClientRect(); return n.left + n.width / 2 - wr.left; });
    x0 = centers[0] || 0; len = (centers[centers.length - 1] || 0) - x0;
    track.style.left = x0 + 'px'; track.style.width = len + 'px';
  }
  function paint() {
    fill.style.width = Math.max(0, pos) + 'px';
    head.style.left = Math.max(0, pos) + 'px';
    items.forEach(function (li, i) { li.classList.toggle('is-lit', pos >= centers[i] - x0 - 2); });
  }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (track.offsetParent === null) return; // hidden on small screens
    if (hovering) {
      pos += (target - pos) * 0.16;
    } else {
      // auto sweep: 2.8s travel, 1.2s hold, fade, restart
      var cycle = 5000, e = ((now - t0) % cycle);
      if (e < 2800) { pos = ease(e / 2800) * len; fill.style.opacity = 1; }
      else if (e < 4000) { pos = len; }
      else { fill.style.opacity = String(1 - (e - 4000) / 1000); if (e > 4900) pos = 0; }
    }
    paint();
  }
  measure();
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  if (reduce) { pos = len; paint(); return; }
  wrap.addEventListener('pointerenter', function () { hovering = true; fill.style.opacity = 1; wrap.classList.add('is-running'); });
  wrap.addEventListener('pointermove', function (e) {
    var wr = wrap.getBoundingClientRect();
    target = Math.min(len, Math.max(0, e.clientX - wr.left - x0));
  });
  wrap.addEventListener('pointerleave', function () { hovering = false; t0 = performance.now() - 0; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        visible = x.isIntersecting;
        if (visible && !raf) { measure(); t0 = performance.now(); wrap.classList.add('is-running'); raf = requestAnimationFrame(frame); }
        else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      });
    }, { threshold: 0.3 }).observe(wrap);
  } else { raf = requestAnimationFrame(frame); }
})();
