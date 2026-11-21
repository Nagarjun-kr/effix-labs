// ==========================================================================
    // SECTION 2 — 3D SCROLL WINDOW REVEAL CONTROLLER (PURPLE BLEND DYNAMICS)
    // ==========================================================================
    (function init3DWindowScrollRevealAnimation() {
      const card = document.getElementById('windowScrollCard');
      const stage = document.querySelector('.window-stage-container') || document.getElementById('why-discovery');
      const purpleAurora = document.getElementById('windowPurpleAurora');

      if (!card || !stage) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Exact physics from Nice / Blitzy Framer Motion:
      // Initial: rotateX = 25deg, perspective = 1200px, transform-origin = center (50% 50%)
      // Fully revealed: rotateX = 0deg
      const MAX_ROTATEX = 25; // degrees
      const TARGET_TOP = 80;   // px from top of viewport when fully upright (below sticky navbar)

      let isTicking = false;

      function update() {
        isTicking = false;

        if (prefersReducedMotion || window.innerWidth <= 768) {
          card.style.transform = '';
          card.style.webkitTransform = '';
          if (purpleAurora) {
            purpleAurora.style.opacity = '1';
            purpleAurora.style.transform = 'translate(-50%, -50%)';
          }
          return;
        }

        const stageRect = stage.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;

        // Progress calculation based on stable stage container (independent of card 3D rotation):
        // When top of stage is at viewport bottom (winH): progress = 0 (rotateX = 25deg)
        // When top of stage reaches TARGET_TOP (80px): progress = 1 (rotateX = 0deg)
        const totalDistance = winH - TARGET_TOP;
        const currentDistance = winH - stageRect.top;
        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

        // 1. Smooth 3D tilt un-tilts as user scrolls down
        const rotX = MAX_ROTATEX * (1 - progress);
        const transformStr = 'perspective(1200px) rotateX(' + rotX.toFixed(3) + 'deg)';
        card.style.transform = transformStr;
        card.style.webkitTransform = transformStr;

        // 2. Crystal transparent glass card shadow & specular bloom (without blue color)
        const shadowBlur = 30 + 35 * (1 - progress);
        const shadowAlpha = 0.10 + 0.05 * (1 - progress);
        card.style.boxShadow =
          '0 0 0 1px rgba(255, 255, 255, 0.50), ' +
          '0 25px ' + shadowBlur.toFixed(1) + 'px -15px rgba(0, 0, 0, ' + shadowAlpha.toFixed(2) + '), ' +
          '0 12px 28px -10px rgba(0, 0, 0, 0.06), ' +
          'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.85), ' +
          'inset 0 -1px 2px 0 rgba(255, 255, 255, 0.25)';

        // 3. Ambient Purple Aurora radiance expands subtly with scroll
        if (purpleAurora) {
          const auroraOpacity = 0.75 + 0.25 * Math.sin(progress * Math.PI * 0.5);
          const auroraScale = 0.95 + 0.08 * progress;
          purpleAurora.style.opacity = auroraOpacity.toFixed(3);
          purpleAurora.style.transform = 'translate(-50%, -50%) scale(' + auroraScale.toFixed(3) + ')';
        }
      }

      function onScroll() {
        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(update);
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      // Run immediately
      update();
      window.addEventListener('load', update);
    })();


