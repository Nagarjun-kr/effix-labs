(function initPremiumSmoothScrolling() {
      if (typeof Lenis === 'undefined') return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lenis = new Lenis({
        duration: prefersReducedMotion ? 0 : 0.85,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !prefersReducedMotion,
        smoothTouch: false,
        touchMultiplier: 1.5,
        wheelMultiplier: 1.0,
        infinite: false,
        autoResize: true
      });
      window.lenis = lenis;
      function lenisRaf(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisRaf);
      }
      requestAnimationFrame(lenisRaf);

      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (!href || href === '#') return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, {
              offset: 0,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        });
      });
    })();
