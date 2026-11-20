/* Content Writing page: enquiry form, banner typing + parallax, card spotlight, reveals. */
function handleContentSubmit(e) {
  e.preventDefault();
  var v = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
  var brand = v('businessName');
  var subject = encodeURIComponent('Content Writing Enquiry - ' + brand);
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
    fb.style.background = 'rgba(109, 77, 252, 0.08)';
    fb.style.color = '#4e5362';
    fb.style.border = '1px solid rgba(109, 77, 252, 0.25)';
    fb.innerHTML = 'Opening your email app to send your enquiry to <strong>effix.labs@gmail.com</strong>…';
  }
  window.location.href = 'mailto:effix.labs@gmail.com?subject=' + subject + '&body=' + body;
}

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* banner: typing headline inside the document */
  var typed = document.getElementById('cwTyped');
  if (typed && !reduce) {
    var lines = ['How to choose the right CRM for a small team', 'Best coworking spaces in Bengaluru for startups', 'What is GST and how does it affect pricing?', 'A beginner’s guide to term insurance in India'];
    var li = 0, ci = lines[0].length, del = true;
    (function tick() {
      var t = lines[li];
      if (del) { ci--; if (ci <= 0) { del = false; li = (li + 1) % lines.length; } }
      else { ci++; if (ci >= lines[li].length) { del = true; typed.textContent = lines[li]; return setTimeout(tick, 2400); } }
      typed.textContent = lines[li].slice(0, Math.max(0, ci));
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
  els.forEach(function (el, i) { el.classList.add('rm-reveal'); el.style.transitionDelay = (i % 3) * 0.08 + 's'; io.observe(el); });
})();
