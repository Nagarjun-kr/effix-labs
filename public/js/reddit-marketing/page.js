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

/* "Why Reddit matters now": search-like-a-buyer demo.
   Pick a question (or press "Ask the internet"): it types into the search bar, then Google,
   an AI answer and the Reddit thread light up in turn, ending with a 3/3 verdict. */
(function () {
  var root = document.getElementById('rqPlay');
  if (!root) return;
  var Q = [
    { q: 'best crm for a small team', s1: 'reddit.com › r/startups', t1: 'Which CRM do small teams actually use?',
      ai: 'Based on Reddit discussions, people suggest starting simple: pick a CRM your team will actually use, check pricing per seat, and test the integrations you need first.',
      s3: 'r/smallbusiness', t3: 'Small team here. Which CRM did you stick with?', c1: 'We tried three. The simple one won because people actually used it.', c2: 'Check the pricing once you add seats.', n0: 128, n1: 846 },
    { q: 'is this budgeting app safe?', s1: 'reddit.com › r/personalfinance', t1: 'Anyone using this budgeting app? Is it legit?',
      ai: 'Reddit users mostly discuss how the app stores data, what support is like and whether there are hidden fees. Several threads recommend checking the permissions it asks for.',
      s3: 'r/personalfinance', t3: 'Honest review after six months of use', c1: 'Support replied within a day when I had an issue.', c2: 'Read the permissions before linking your bank.', n0: 64, n1: 512 },
    { q: 'running shoes for flat feet', s1: 'reddit.com › r/running', t1: 'Best shoes for flat feet? Need honest advice',
      ai: 'Runners on Reddit often suggest getting a gait check, trying stability shoes in store, and replacing pairs on time. Many threads warn against buying on looks alone.',
      s3: 'r/running', t3: 'Flat-footed runner here. What finally worked', c1: 'A gait check at a running store changed everything.', c2: 'Stability models, but try them on first.', n0: 210, n1: 1300 }
  ];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var consoleEl = root.querySelector('.rq-console');
  var qEl = root.querySelector('#rqQ');
  var panes = Array.prototype.slice.call(root.querySelectorAll('.rq-pane'));
  var chips = Array.prototype.slice.call(root.querySelectorAll('.rq-chip'));
  var go = root.querySelector('#rqGo');
  var up = root.querySelector('.rq-up');
  var $ = function (c) { return root.querySelector('.' + c); };
  var set = function (c, t) { var el = $(c); if (el) el.setAttribute('data-t', t); };
  var fmt = function (n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(Math.round(n)); };
  var token = 0, current = 0, count = 0, started = false;

  function wait(ms, tk) { return new Promise(function (res, rej) { setTimeout(function () { tk === token ? res() : rej(); }, reduce ? 0 : ms); }); }
  function type(el, text, speed, tk) {
    return new Promise(function (res, rej) {
      if (reduce) { el.setAttribute('data-t', text); return res(); }
      var i = 0;
      (function step() {
        if (tk !== token) return rej();
        el.setAttribute('data-t', text.slice(0, i));
        if (i++ >= text.length) return res();
        setTimeout(step, speed);
      })();
    });
  }
  function countUp(from, to, tk) {
    var t0 = performance.now(), d = reduce ? 1 : 1300;
    (function step(now) {
      if (tk !== token) return;
      var t = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - t, 3);
      count = Math.round(from + (to - from) * e); set('rq-n', fmt(count));
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  function run(i) {
    var tk = ++token, d = Q[i]; current = i;
    chips.forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
    root.classList.add('is-running'); root.classList.remove('is-done');
    panes.forEach(function (p) { p.classList.remove('is-lit', 'is-cited'); });
    set('rq-s1', d.s1); set('rq-t1', d.t1); set('rq-t2', ''); set('rq-s3', d.s3); set('rq-t3', d.t3); set('rq-c1', d.c1); set('rq-c2', d.c2); set('rq-n', fmt(d.n0));
    consoleEl.classList.add('is-typing');
    type(qEl, d.q, 38, tk)
      .then(function () { consoleEl.classList.remove('is-typing'); return wait(250, tk); })
      .then(function () { panes[0].classList.add('is-lit'); return wait(1300, tk); })
      .then(function () { panes[1].classList.add('is-lit'); return type($('rq-t2'), d.ai, 14, tk); })
      .then(function () { panes[1].classList.add('is-cited'); return wait(700, tk); })
      .then(function () { panes[2].classList.add('is-lit'); countUp(d.n0, d.n1, tk); return wait(1500, tk); })
      .then(function () { root.classList.add('is-done'); root.classList.remove('is-running'); })
      .catch(function () {});
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { run(+c.getAttribute('data-q')); }); });
  if (go) go.addEventListener('click', function () { run(current); });
  if (up) up.addEventListener('click', function () {
    count += 1; set('rq-n', fmt(count));
    var plus = document.createElement('span'); plus.className = 'rq-plus'; plus.setAttribute('aria-hidden', 'true'); plus.textContent = '+1';
    up.parentNode.appendChild(plus); setTimeout(function () { plus.remove(); }, 900);
  });
  set('rq-t2', Q[0].ai); count = Q[0].n0;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting && !started) { started = true; run(0); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(root);
  } else { run(0); }
})();
