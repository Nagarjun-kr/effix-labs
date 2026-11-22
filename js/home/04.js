(function initPremiumSmoothScrolling() {
      if (typeof Lenis === 'undefined') return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const lenis = new Lenis({
        duration: prefersReducedMotion ? 0 : 2.4, // reference site: Framer Smooth Scroll, intensity 24 = 2.4s glide
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exact Lenis exponential ease-out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !prefersReducedMotion,
        smoothTouch: false, // Preserves authentic 60fps/120fps hardware touch on mobile
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

      // Smooth in-page anchor navigation matching Sample feel
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (!href || href === '#' || href === '#services') return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, {
              offset: 0,
              duration: 2.4,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        });
      });
    })();
