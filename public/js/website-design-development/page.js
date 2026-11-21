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
    fb.innerHTML = 'Opening your email app to send your enquiry to <strong>hello@effix.co.in</strong>…';
  }
  window.location.href = 'mailto:hello@effix.co.in?subject=' + subject + '&body=' + body;
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

  /* process studio: auto-advancing steps with a live preview */
  var flow = document.getElementById('wdFlow');
  if (flow) {
    var items = flow.querySelectorAll('.wd-flow-list li');
    var scenes = flow.querySelectorAll('.wd-sc');
    var stepLbl = document.getElementById('wdStageStep');
    var cur = 0, timer = 0, visible = false, hover = false;
    var DUR = 4600;
    var show = function (i) {
      cur = (i + items.length) % items.length;
      items.forEach(function (li, k) { li.classList.toggle('is-on', k === cur); li.setAttribute('aria-current', k === cur ? 'step' : 'false'); });
      scenes.forEach(function (sc, k) { sc.classList.toggle('is-on', k === cur); });
      var lblT = stepLbl && stepLbl.querySelector('bdi[data-t]');
      if (lblT) lblT.setAttribute('data-t', ('0' + (cur + 1)).slice(-2) + ' / 0' + items.length);
      /* restart the progress bar animation */
      var bar = items[cur].querySelector('.wd-fl-bar');
      if (bar) { bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = ''; }
    };
    var schedule = function () {
      clearTimeout(timer);
      if (reduce || !visible || hover) return;
      timer = setTimeout(function () { show(cur + 1); schedule(); }, DUR);
    };
    items.forEach(function (li, k) {
      li.addEventListener('click', function () { show(k); schedule(); });
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(k); schedule(); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); items[(k + 1) % items.length].focus(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); items[(k - 1 + items.length) % items.length].focus(); }
      });
    });
    flow.addEventListener('pointerenter', function () { hover = true; flow.classList.add('is-paused'); clearTimeout(timer); });
    flow.addEventListener('pointerleave', function () { hover = false; flow.classList.remove('is-paused'); show(cur); schedule(); });
    if (!reduce) flow.classList.add('is-auto');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { show(cur); } schedule(); }, { threshold: 0.35 }).observe(flow);
    }
    show(0);
  }

  /* reveal cards */
  if (reduce || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.wd-index li, .wd-vt, .wd-pf, .wd-browser');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) { el.classList.add('rm-reveal'); el.style.transitionDelay = (i % 3) * 0.1 + 's'; io.observe(el); });
})();
