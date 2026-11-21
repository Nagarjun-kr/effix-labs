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
    el.style.transitionDelay = Math.min(sib, 5) * 0.1 + 's';
    io.observe(el);
  });
})();

/* Process route: a pin travels along a winding road to the active step.
   Auto-advances while in view; hover, click, tap or arrow keys pick a step (auto resumes after a pause). */
(function () {
  var route = document.getElementById('gxRoute');
  if (!route) return;
  var map = route.querySelector('.gr-map');
  var path = document.getElementById('grFillPath');
  var stops = Array.prototype.slice.call(route.querySelectorAll('.gr-stop'));
  var items = Array.prototype.slice.call(route.querySelectorAll('.gr-step'));
  var pin = document.getElementById('grPin');
  var shadow = document.getElementById('grPinShadow');
  var pinN = route.querySelector('#grPinN bdi');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var VW = 1200, VH = 170, DUR = 3600;
  var total = path.getTotalLength(), lens = [], cur = 0, active = 0, anim = 0, timer = 0, visible = false, lastUser = 0;

  route.style.setProperty('--gr-dur', DUR + 'ms');
  path.style.strokeDasharray = total;
  path.style.strokeDashoffset = total;

  function lengthAtX(x) {               // the road always moves left to right, so x grows with length
    var lo = 0, hi = total;
    for (var k = 0; k < 28; k++) { var mid = (lo + hi) / 2; if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  function place(el, len) {
    var w = map.clientWidth, h = map.clientHeight, p = path.getPointAtLength(len);
    el.style.left = (p.x / VW * w) + 'px'; el.style.top = (p.y / VH * h) + 'px';
  }
  function measure() {
    if (!map.offsetParent) return;      // road hidden on phones
    var mr = map.getBoundingClientRect();
    var oneRow = items[items.length - 1].offsetTop === items[0].offsetTop;
    lens = items.map(function (li, i) {
      if (!oneRow) return total * (0.04 + 0.92 * i / (items.length - 1));
      var r = li.getBoundingClientRect();
      return lengthAtX(((r.left + r.width / 2) - mr.left) / mr.width * VW);
    });
    stops.forEach(function (s, i) { place(s, lens[i]); });
    cur = lens[active]; draw();
  }
  function draw() {
    place(pin, cur); place(shadow, cur);
    path.style.strokeDashoffset = total - cur;
  }
  function travel(to) {
    cancelAnimationFrame(anim);
    if (reduce || !map.offsetParent) { cur = to; draw(); return; }
    var from = cur, t0 = performance.now(), d = Math.min(1100, 420 + Math.abs(to - from) * 1.1);
    (function step(now) {
      var t = Math.min(1, (now - t0) / d), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      cur = from + (to - from) * e; draw();
      if (t < 1) anim = requestAnimationFrame(step);
    })(t0);
  }
  function setActive(i) {
    active = (i + items.length) % items.length;
    items.forEach(function (li, k) { li.classList.toggle('is-on', k === active); li.classList.toggle('is-past', k < active); li.setAttribute('aria-current', k === active ? 'step' : 'false'); });
    stops.forEach(function (s, k) { s.classList.toggle('is-on', k === active); s.classList.toggle('is-past', k < active); });
    if (pinN) pinN.setAttribute('data-t', String(active + 1));
    var bar = items[active].querySelector('.gr-step-bar');
    if (bar) { bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = ''; }
    if (lens.length) travel(lens[active]);
  }
  function schedule() {
    clearTimeout(timer);
    if (reduce || !visible) { route.classList.remove('is-auto'); return; }
    var idle = performance.now() - lastUser;
    if (idle < 9000) { route.classList.remove('is-auto'); timer = setTimeout(schedule, 9000 - idle); return; }
    route.classList.add('is-auto');
    timer = setTimeout(function () { setActive(active + 1); schedule(); }, DUR);
  }
  function user(i) { lastUser = performance.now(); setActive(i); schedule(); }

  items.forEach(function (li, i) {
    li.addEventListener('click', function () { user(i); });
    if (fine) li.addEventListener('pointerenter', function () { if (i !== active) user(i); });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); user(i); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); user(i + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); user(i - 1); }
    });
  });

  measure(); setActive(0);
  window.addEventListener('resize', function () { measure(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) measure(); schedule(); }, { threshold: 0.3 }).observe(route);
  }
})();
