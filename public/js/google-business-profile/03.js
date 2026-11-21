/* Google Business Profile Optimisation page: banner parallax, marquee, checklist meter, scroll reveals. */
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

  /* ---- Hero banner: gentle pointer parallax ---- */
  var gb = document.getElementById('gbBanner');
  if (gb && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(pointer: fine)').matches) {
    var gbRaf = 0;
    gb.addEventListener('pointermove', function (e) {
      var r = gb.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width - 0.5) * 2, my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(gbRaf);
      gbRaf = requestAnimationFrame(function () { gb.style.setProperty('--mx', mx.toFixed(3)); gb.style.setProperty('--my', my.toFixed(3)); });
    });
    gb.addEventListener('pointerleave', function () { gb.style.setProperty('--mx', '0'); gb.style.setProperty('--my', '0'); });
  }

  /* ---- Marquee: clone the single crawlable set for a seamless loop (clone is aria-hidden) ---- */
  document.querySelectorAll('.gx-marquee').forEach(function (mq) {
    var set = mq.querySelector('.gx-marquee-set');
    if (!set || mq.classList.contains('is-ready')) return;
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    set.parentNode.appendChild(clone);
    mq.classList.add('is-ready');
  });

  /* ---- Checklist meter ---- */
  var list = document.getElementById('gxChecklist');
  if (list) {
    var boxes = list.querySelectorAll('input[type="checkbox"]');
    var num = document.getElementById('gxScoreNum');
    var fill = document.getElementById('gxMeterFill');
    var meter = document.getElementById('gxMeter');
    var msg = document.getElementById('gxScoreMsg');
    var msg0 = msg ? msg.textContent : '';
    function update() {
      var n = 0; boxes.forEach(function (b) { if (b.checked) n++; });
      var total = boxes.length;
      if (num) num.textContent = String(n);
      if (fill) fill.style.transform = 'scaleX(' + (n / total).toFixed(3) + ')';
      if (meter) meter.setAttribute('aria-valuenow', String(n));
      if (!msg) return;
      if (n === 0) msg.textContent = msg0;
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

/* Process: a light line slides through every step.
   - Plays an automatic sweep until the visitor first moves the pointer over the section.
   - After that it follows the pointer and stays exactly where the pointer stops,
     even after the pointer leaves (no reset, no jumping back). */
(function () {
  var wrap = document.getElementById('gxStepsWrap');
  if (!wrap) return;
  var section = wrap.closest('section') || wrap;
  var track = wrap.querySelector('.gx-steps-track');
  var fill = document.getElementById('gxStepsFill');
  var head = document.getElementById('gxStepsHead');
  var items = Array.prototype.slice.call(wrap.querySelectorAll('.gx-steps li'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var x0 = 0, len = 0, centers = [];
  var pos = 0, target = 0, manual = false, t0 = 0, raf = 0;

  function measure() {
    var wr = wrap.getBoundingClientRect();
    centers = items.map(function (li) { var n = li.querySelector('.gx-step-n').getBoundingClientRect(); return n.left + n.width / 2 - wr.left; });
    x0 = centers[0] || 0; len = (centers[centers.length - 1] || 0) - x0;
    track.style.left = x0 + 'px'; track.style.width = len + 'px';
    if (manual) { target = Math.min(target, len); }
  }
  function paint() {
    var p = Math.max(0, Math.min(len, pos));
    fill.style.width = p + 'px';
    head.style.left = p + 'px';
    items.forEach(function (li, i) { li.classList.toggle('is-lit', p >= centers[i] - x0 - 2); });
  }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (track.offsetParent === null) return; // hidden on small screens
    if (manual) {
      pos += (target - pos) * 0.2;
      if (Math.abs(target - pos) < 0.3) pos = target;
      fill.style.opacity = '1';
    } else {
      var cycle = 5000, e = (now - t0) % cycle;
      if (e < 2800) { pos = ease(e / 2800) * len; fill.style.opacity = '1'; }
      else if (e < 4000) { pos = len; }
      else { fill.style.opacity = String(Math.max(0, 1 - (e - 4000) / 900)); if (e > 4900) pos = 0; }
    }
    paint();
  }
  measure();
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if (reduce) { pos = len; paint(); return; }

  section.addEventListener('pointermove', function (e) {
    if (track.offsetParent === null) return;
    var wr = wrap.getBoundingClientRect();
    target = Math.min(len, Math.max(0, e.clientX - wr.left - x0));
    if (!manual) { manual = true; wrap.classList.add('is-running'); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting && !raf) { measure(); t0 = performance.now(); wrap.classList.add('is-running'); raf = requestAnimationFrame(frame); }
        else if (!x.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
      });
    }, { threshold: 0.2 }).observe(wrap);
  } else { raf = requestAnimationFrame(frame); }
})();
