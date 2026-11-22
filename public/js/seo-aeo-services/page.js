/* SEO & AEO page: banner parallax, timeline progress, reveals. */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* banner parallax */
  var banner = document.getElementById('saBanner');
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

  /* timeline: line fills and steps light up as you scroll */
  var tl = document.getElementById('saTimeline');
  if (tl) {
    var items = tl.querySelectorAll('li');
    var update = function () {
      var r = tl.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      var p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      tl.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
      items.forEach(function (li) { li.classList.toggle('is-on', reduce || li.getBoundingClientRect().top + 28 < mid); });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* reveal cards */
  if (reduce || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.sa-lane, .sa-plat, .sa-svc');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) { el.classList.add('rm-reveal'); el.style.transitionDelay = (i % 3) * 0.1 + 's'; io.observe(el); });
})();
