/* Website Design & Development page: enquiry form, banner parallax, stepper progress, reveals. */
function handleWebSubmit(e) {
  e.preventDefault();
  var v = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
  var brand = v('businessName');
  var subject = encodeURIComponent('Website Enquiry - ' + brand);
  var body = encodeURIComponent(
    'Full Name: ' + v('fullName') + '\n' +
    'Work Email: ' + v('workEmail') + '\n' +
    'Brand / Company: ' + brand + '\n' +
    'Website: ' + (v('websiteUrl') || 'Not provided') + '\n' +
    'Project type: ' + v('locationCount') + '\n\n' +
    'Details:\n' + v('message')
  );
  var fb = document.getElementById('formFeedback');
  if (fb) {
    fb.style.display = 'block';
    fb.style.background = 'rgba(37, 99, 235, 0.08)';
    fb.style.color = '#4e5362';
    fb.style.border = '1px solid rgba(37, 99, 235, 0.25)';
    fb.innerHTML = 'Opening your email app to send your enquiry to <strong>effix.labs@gmail.com</strong>…';
  }
  window.location.href = 'mailto:effix.labs@gmail.com?subject=' + subject + '&body=' + body;
}

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* banner parallax */
  var banner = document.getElementById('wdBanner');
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

  /* process stepper: steps light up as the row scrolls into view */
  var steps = document.getElementById('wdSteps');
  if (steps) {
    var lis = steps.querySelectorAll('li');
    var run = function () {
      var r = steps.getBoundingClientRect();
      if (reduce || r.top < window.innerHeight * 0.75) {
        steps.classList.add('is-on');
        lis.forEach(function (li, i) { setTimeout(function () { li.classList.add('is-on'); }, reduce ? 0 : i * 180); });
        window.removeEventListener('scroll', run);
      }
    };
    run();
    window.addEventListener('scroll', run, { passive: true });
  }

  /* reveal cards */
  if (reduce || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.wd-index li, .wd-vt, .wd-platforms > div, .wd-browser');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) { el.classList.add('rm-reveal'); el.style.transitionDelay = (i % 3) * 0.08 + 's'; io.observe(el); });
})();
