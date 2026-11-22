/* Content Writing page: banner typing + parallax, card spotlight, reveals. */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* banner: typing headline inside the document */
  var typedHost = document.getElementById('cwTyped');
  var typed = typedHost && typedHost.querySelector('bdi[data-t]');
  var setT = function (t) { typed.setAttribute('data-t', t); };
  if (typed && !reduce) {
    var lines = ['How to choose the right CRM for a small team', 'Best coworking spaces in Bengaluru for startups', 'What is GST and how does it affect pricing?', 'A beginner’s guide to term insurance in India'];
    var li = 0, ci = lines[0].length, del = true;
    (function tick() {
      var t = lines[li];
      if (del) { ci--; if (ci <= 0) { del = false; li = (li + 1) % lines.length; } }
      else { ci++; if (ci >= lines[li].length) { del = true; setT(lines[li]); return setTimeout(tick, 2400); } }
      setT(lines[li].slice(0, Math.max(0, ci)));
      setTimeout(tick, del ? 28 : 55);
    })();
  }

  /* banner parallax */
  var banner = document.getElementById('cwBanner');
  if (banner && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = 0;
    banner.addEventListener('pointermove', function (e) {
      var r = banner.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width - 0.5) * 2, my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { banner.style.setProperty('--mx', mx.toFixed(3)); banner.style.setProperty('--my', my.toFixed(3)); });
    });
    banner.addEventListener('pointerleave', function () { banner.style.setProperty('--mx', '0'); banner.style.setProperty('--my', '0'); });
  }

  /* process cards: spotlight follows the cursor */
  document.querySelectorAll('.rm-step').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--x', (e.clientX - r.left) + 'px');
      c.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  /* reveal split sections and cards */
  if (reduce || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.rm-split > *, .rm-step, .cw-bento-card');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) { el.classList.add('rm-reveal'); el.style.transitionDelay = (i % 3) * 0.1 + 's'; io.observe(el); });
})();

/* Process: a scrubber drives a document from blank page to published.
   Drag the slider, click a step label or use arrow keys; it also plays by itself while in view. */
(function () {
  var flow = document.getElementById('cwFlow');
  if (!flow) return;
  var range = document.getElementById('cfRange');
  var steps = Array.prototype.slice.call(flow.querySelectorAll('.cf-step'));
  var ticks = Array.prototype.slice.call(flow.querySelectorAll('.cf-tick'));
  var status = flow.querySelector('#cfStatus bdi');
  var names = steps.map(function (li) { return li.querySelector('.cf-t').textContent.trim(); });
  var short = ['Discovery', 'Research', 'Brief', 'Drafting', 'Editing', 'Published'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 1, timer = 0, visible = false, lastUser = 0;

  function setStep(n) {
    cur = Math.max(1, Math.min(6, n));
    for (var k = 1; k <= 6; k++) flow.classList.toggle('at-' + k, k <= cur);
    steps.forEach(function (li, i) { li.classList.toggle('is-on', i === cur - 1); });
    ticks.forEach(function (t, i) { t.classList.toggle('is-on', i === cur - 1); t.classList.toggle('is-past', i < cur - 1); });
    if (range) {
      range.value = String(cur);
      range.style.setProperty('--p', ((cur - 1) / 5 * 100) + '%');
      range.setAttribute('aria-valuetext', 'Step ' + cur + ' of 6: ' + names[cur - 1]);
    }
    if (status) status.setAttribute('data-t', short[cur - 1]);
  }
  function user(n) { lastUser = performance.now(); setStep(n); schedule(); }
  function schedule() {
    clearTimeout(timer);
    if (reduce || !visible) return;
    var wait = Math.max(cur === 6 ? 3600 : 2600, 9000 - (performance.now() - lastUser));
    timer = setTimeout(function () { if (performance.now() - lastUser >= 9000) setStep(cur === 6 ? 1 : cur + 1); schedule(); }, wait);
  }
  if (range) range.addEventListener('input', function () { user(+range.value); });
  ticks.forEach(function (t) { t.addEventListener('click', function () { user(+t.getAttribute('data-step')); if (range) range.focus(); }); });
  setStep(1);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(flow);
  }
})();
