/* Service poster cards: floating icon layers that drift with the pointer (SEO & AEO, Content Writing). */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  document.querySelectorAll('.poster-float').forEach(function (layerWrap) {
    var layers = layerWrap.querySelectorAll('.poster-float-layer');
    layers.forEach(function (el, i) {
      el.style.setProperty('--d', el.getAttribute('data-depth') || '16');
      el.style.animationDelay = (-i * 0.9) + 's';
    });
    if (reduce || !fine) return;
    var card = layerWrap.closest('.service-artwork-card') || layerWrap.parentElement;
    var raf = 0;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        layerWrap.style.setProperty('--px', px.toFixed(3));
        layerWrap.style.setProperty('--py', py.toFixed(3));
      });
    });
    card.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      layerWrap.style.setProperty('--px', '0');
      layerWrap.style.setProperty('--py', '0');
    });
  });
})();
