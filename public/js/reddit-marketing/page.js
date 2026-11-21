/* Reddit Marketing page: enquiry form handler + gentle banner parallax. */
function handleRedditSubmit(e) {
  e.preventDefault();
  var v = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
  var brand = v('businessName');
  var subject = encodeURIComponent('Reddit Marketing Enquiry - ' + brand);
  var body = encodeURIComponent(
    'Full Name: ' + v('fullName') + '\n' +
    'Work Email: ' + v('workEmail') + '\n' +
    'Brand / Company: ' + brand + '\n' +
    'Website: ' + (v('websiteUrl') || 'Not provided') + '\n' +
    'Need: ' + v('locationCount') + '\n\n' +
    'Details:\n' + v('message')
  );
  var fb = document.getElementById('formFeedback');
  if (fb) {
    fb.style.display = 'block';
    fb.style.background = 'rgba(139, 37, 226, 0.08)';
    fb.style.color = '#4e5362';
    fb.style.border = '1px solid rgba(139, 37, 226, 0.25)';
    fb.innerHTML = 'Opening your email app to send your enquiry to <strong>hello@effix.co.in</strong>…';
  }
  window.location.href = 'mailto:hello@effix.co.in?subject=' + subject + '&body=' + body;
}

(function () {
  var banner = document.getElementById('rmBanner');
  if (!banner || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return;
  var raf = 0;
  banner.addEventListener('pointermove', function (e) {
    var r = banner.getBoundingClientRect();
    var mx = ((e.clientX - r.left) / r.width - 0.5) * 2, my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { banner.style.setProperty('--mx', mx.toFixed(3)); banner.style.setProperty('--my', my.toFixed(3)); });
  });
  banner.addEventListener('pointerleave', function () { banner.style.setProperty('--mx', '0'); banner.style.setProperty('--my', '0'); });
})();

/* reveal the split sections on scroll */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.rm-split > *, .rm-step');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.15 });
  els.forEach(function (el, i) { el.classList.add('rm-reveal'); el.style.transitionDelay = (i % 2) * 0.12 + 's'; io.observe(el); });
})();

/* process cards: spotlight follows the cursor */
(function () {
  var cards = document.querySelectorAll('.rm-step');
  cards.forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--x', (e.clientX - r.left) + 'px');
      c.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });
})();

/* "Why Reddit matters now": the three scenes play in turn (search -> AI answer -> thread).
   Hovering or focusing a card plays that scene; autoplay resumes after a pause. */
(function () {
  var grid = document.getElementById('rwGrid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.rw-card'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counter = grid.querySelector('.rw-count');
  var counterT = counter && counter.querySelector('bdi');
  var active = 0, timer = 0, visible = false, lastUser = 0, countRaf = 0;
  var fmt = function (n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(Math.round(n)); };

  if (reduce) { cards.forEach(function (c) { c.classList.add('is-on'); }); if (counterT) counterT.setAttribute('data-t', fmt(+counter.dataset.to)); return; }

  function countUp() {
    if (!counterT) return;
    cancelAnimationFrame(countRaf);
    var from = +counter.dataset.from, to = +counter.dataset.to, t0 = performance.now(), d = 1400;
    (function step(now) {
      var t = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - t, 3);
      counterT.setAttribute('data-t', fmt(from + (to - from) * e));
      if (t < 1) countRaf = requestAnimationFrame(step);
    })(t0);
  }
  function setActive(i) {
    active = (i + cards.length) % cards.length;
    cards.forEach(function (c, k) { c.classList.toggle('is-on', k === active); });
    if (active === 2) countUp(); else if (counterT) { cancelAnimationFrame(countRaf); counterT.setAttribute('data-t', counter.dataset.from); }
  }
  function schedule() {
    clearTimeout(timer);
    if (!visible) return;
    var idle = performance.now() - lastUser;
    timer = setTimeout(function () { if (performance.now() - lastUser >= 6000) setActive(active + 1); schedule(); }, Math.max(3400, 6000 - idle));
  }
  cards.forEach(function (c, i) {
    c.addEventListener('pointerenter', function () { lastUser = performance.now(); if (i !== active) setActive(i); });
    c.addEventListener('focusin', function () { lastUser = performance.now(); setActive(i); });
    c.addEventListener('click', function () { lastUser = performance.now(); setActive(i); });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var was = visible; visible = en[0].isIntersecting;
      if (visible && !was) setActive(active);
      schedule();
    }, { threshold: 0.35 }).observe(grid);
  }
})();
