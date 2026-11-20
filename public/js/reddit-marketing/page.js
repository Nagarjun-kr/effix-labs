/* Reddit Marketing page: enquiry form handler + gentle banner parallax. */
function handleRedditSubmit(e) {
  e.preventDefault();
  var v = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
  var brand = v('businessName');
  var subject = encodeURIComponent('Reddit Marketing Audit Request - ' + brand);
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
    fb.innerHTML = 'Opening your email app to send your Reddit audit request to <strong>effix.labs@gmail.com</strong>…';
  }
  window.location.href = 'mailto:effix.labs@gmail.com?subject=' + subject + '&body=' + body;
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
