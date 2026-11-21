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
