// Mobile Drawer Toggle
    function toggleMobileDrawer() {
      const drawer = document.getElementById('mobileDrawer');
      if (drawer) {
        drawer.classList.toggle('active');
        const isActive = drawer.classList.contains('active');
        const btn = document.getElementById('mobileMenuBtn');
        if (btn) btn.setAttribute('aria-expanded', String(isActive));
        if (window.lenis) {
          if (isActive) window.lenis.stop();
          else window.lenis.start();
        }
      }
    }

    // Escape closes the mobile menu and returns focus to its button
    document.addEventListener('keydown', function (e) {
      const drawer = document.getElementById('mobileDrawer');
      if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
        toggleMobileDrawer();
        const btn = document.getElementById('mobileMenuBtn');
        if (btn) btn.focus();
      }
    });

    // FAQ Accordion Handler
    function toggleFaq(btn) {
      const item = btn.closest('.faq-item');
      const panel = item.querySelector('.faq-answer-panel');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close other FAQs for a clean accordion flow
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-button');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        panel.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }

    // Hero Audit URL Handoff to /discover
    function handleAuditSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('urlInput');
      const btn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const feedback = document.getElementById('auditFeedback');

      let val = input.value.trim();
      if (!val) return;

      // Normalization
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        val = 'https://' + val;
      }

      btn.disabled = true;
      btnText.textContent = 'Preparing Audit...';

      // Store in session storage so /discover can pick it up without loss
      try {
        sessionStorage.setItem('effix_audit_target', val);
      } catch (err) {
        // Storage might be restricted
      }

      // Route handoff to /discover passing URL parameter
      const targetUrl = '/discover?url=' + encodeURIComponent(val);
      feedback.textContent = 'Redirecting to audit...';
      feedback.style.display = 'block';

      // Redirect without discarding input
      window.location.href = targetUrl;
    }

    // Preserve entered URL across all audit CTA links (Navbar, Product Card, Final CTA)
    const urlInputEl = document.getElementById('urlInput');
    if (urlInputEl) {
      try {
        const saved = sessionStorage.getItem('effix_audit_target');
        if (saved && !urlInputEl.value) {
          urlInputEl.value = saved.replace(/^https?:\/\//, '');
        }
      } catch (e) { }

      urlInputEl.addEventListener('input', () => {
        let val = urlInputEl.value.trim();
        if (val) {
          if (!val.startsWith('http://') && !val.startsWith('https://')) {
            val = 'https://' + val;
          }
          try {
            sessionStorage.setItem('effix_audit_target', val);
          } catch (e) { }
        }
      });
    }

    // Every "Run a Visibility Audit" link points to the one search box (#audit): with a website typed in, start the
    // audit; otherwise scroll to the box and put the cursor in it.
    document.querySelectorAll('a[href="#audit"], a[href="/#audit"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const input = document.getElementById('urlInput');
        const box = document.getElementById('audit');
        if (!input || !box) return;
        e.preventDefault();
        if (input.value.trim()) {
          const form = input.form;
          if (form && form.requestSubmit) { form.requestSubmit(); return; }
        }
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (err) { input.focus(); } }, 700);
      });
    });

    // Arriving at /#audit (e.g. from "New Audit" on the report): focus the search box.
    if (location.hash === '#audit') {
      setTimeout(() => {
        const input = document.getElementById('urlInput');
        const box = document.getElementById('audit');
        if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (input) setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (err) { input.focus(); } }, 700);
      }, 300);
    }

    // ==========================================================================
    // SECTION 5 — EFFIX DISCOVER AUTO-ROTATION (4 SECONDS) & PILLAR SWITCHING
    // ==========================================================================
    (function initDiscoverAutoRotation() {
      const section = document.getElementById('discover-product');
      if (!section) return;

      const pillars = section.querySelectorAll('.discover-pillar-item');
      const slideGirl = section.querySelector('.discover-slide[data-slide="girl"]');
      const slideBoy = section.querySelector('.discover-slide[data-slide="boy"]');
      if (!pillars.length || !slideGirl || !slideBoy) return;

      const ROTATION_INTERVAL = 4000; // 4000ms = 4 seconds
      // State: 0 = Girl (First!), 1 = Boy (After that!)
      let currentSlide = 0;
      let currentPillarIndex = 0; // 0 = Search, 1 = Content, 2 = AI
      let timer = null;
      let isPaused = false;

      function updateState(slideIdx, pillarIdx) {
        currentSlide = slideIdx;
        currentPillarIndex = pillarIdx;

        // 1. Cross-fade slides: Girl (0) vs Boy (1)
        slideGirl.classList.toggle('is-active', currentSlide === 0);
        slideBoy.classList.toggle('is-active', currentSlide === 1);

        // 2. Sync active pillar button style
        pillars.forEach((btn, idx) => {
          const isActive = idx === currentPillarIndex;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }

      function nextStep() {
        if (isPaused) return;

        // Image ALWAYS alternates between Girl (0) and Boy (1) every 4 seconds:
        // Girl -> Boy -> Girl -> Boy -> Girl -> Boy...
        const nextSlide = currentSlide === 0 ? 1 : 0;

        // Pillar advances sequentially through Search (0) -> Content (1) -> AI (2) -> Search (0)...
        const nextPillar = (currentPillarIndex + 1) % pillars.length;

        updateState(nextSlide, nextPillar);
      }

      function startTimer() {
        stopTimer();
        timer = setInterval(nextStep, ROTATION_INTERVAL);
      }

      function stopTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      // Manual interaction: click any pillar
      // Search -> Girl image (Slide 0)
      // Content -> Boy image (Slide 1)
      // AI -> Boy image (Slide 1)
      pillars.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          const targetSlide = idx === 0 ? 0 : 1;
          updateState(targetSlide, idx);
          startTimer();
        });
      });

      // User comfort: pause auto-rotation when hovering over showcase visual or pillars
      const hoverTargets = [
        section.querySelector('.discover-showcase-frame'),
        section.querySelector('.discover-pillars-list')
      ];

      hoverTargets.forEach(target => {
        if (!target) return;
        target.addEventListener('mouseenter', () => { isPaused = true; });
        target.addEventListener('mouseleave', () => { isPaused = false; });
      });

      // Pause rotation when browser tab is inactive to preserve resources
      document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;
      });

      // Initialize: FIRST Girl image appears, with Search pillar active!
      updateState(0, 0);
      startTimer();
    })();

    // ==========================================================================
    // SECTION 5 — SMOOTH, FLICKER-FREE THEME TRANSITION CONTROLLER
    // ==========================================================================
    (function initDiscoverSmoothThemeSwitch() {
      const discoverSection = document.getElementById('discover-product');
      const servicesSection = document.getElementById('services');
      if (!discoverSection) return;

      let isLightModeActive = false;
      let ticking = false;

      function checkTheme() {
        const rect = discoverSection.getBoundingClientRect();
        const vh = window.innerHeight;

        // Hysteresis deadband:
        // Transition to Light Mode when Discover enters upper 50% from bottom (rect.top <= vh * 0.52)
        // Revert to Dark Mode only when Discover drops back below 68% from bottom (rect.top > vh * 0.68)
        // This ~140px deadband completely eliminates any boundary jitter or flickering!
        const enterThreshold = vh * 0.52;
        const exitThreshold = vh * 0.68;

        let shouldBeLight = isLightModeActive;
        if (!isLightModeActive && rect.top <= enterThreshold) {
          shouldBeLight = true;
        } else if (isLightModeActive && rect.top > exitThreshold) {
          shouldBeLight = false;
        }

        if (shouldBeLight !== isLightModeActive) {
          isLightModeActive = shouldBeLight;
          discoverSection.classList.toggle('light-mode', isLightModeActive);
          if (servicesSection) {
            servicesSection.classList.toggle('light-mode', isLightModeActive);
          }
        }
      }

      function onScroll() {
        if (!ticking) {
          requestAnimationFrame(() => {
            checkTheme();
            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      checkTheme();
    })();

    // ==========================================================================
    // SCROLL-DRIVEN 5-CARD SERVICES GALLERY & EDGE LIGHTING
    // ==========================================================================
    (function initServicesScrollAnimation() {
      const section = document.getElementById('services');
      const approachSection = document.getElementById('our-approach');
      const cards = document.querySelectorAll('.service-artwork-card');
      const header = document.getElementById('servicesHeaderWrap');
      const gallery = document.getElementById('servicesGalleryWrap');
      const indicator = document.getElementById('servicesScrollIndicator');
      if (!section || !cards.length) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 5 Card entrance configurations (smoothly converge to center)
      const configs = [
        // Card 1: Google Business Profile (lower left)
        {
          start: 0.10,
          end: 0.46,
          init: { x: -180, y: 130, r: -9, s: 0.68 }
        },
        // Card 2: Reddit & Quora (upper center-left)
        {
          start: 0.14,
          end: 0.50,
          init: { x: -80, y: -140, r: 8, s: 0.68 }
        },
        // Card 3: AI Search & Brand Visibility (lower center)
        {
          start: 0.12,
          end: 0.48,
          init: { x: 0, y: 150, r: -5, s: 0.68 }
        },
        // Card 4: AI-Assisted Blog SEO (upper center-right)
        {
          start: 0.16,
          end: 0.52,
          init: { x: 80, y: -130, r: 8, s: 0.68 }
        },
        // Card 5: Website Design & Development (lower right)
        {
          start: 0.18,
          end: 0.54,
          init: { x: 180, y: 120, r: -8, s: 0.68 }
        }
      ];

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      let targetProgress = 0;
      let currentProgress = 0;
      let isAnimating = false;

      // --- Light Switch / Dual-Section Smooth Theme Transition ---
      function updateThemeSwitch(rect) {
        if (!rect) rect = section.getBoundingClientRect();
        // 40% threshold: when services enters >= 40% of viewport from bottom (rect.top <= window.innerHeight * 0.60)
        // and remains active while services is in view
        const isDark = rect.top <= window.innerHeight * 0.60 && rect.bottom >= -100;
        if (approachSection) {
          approachSection.classList.toggle('is-dark', isDark);
        }
        section.classList.toggle('is-dark', isDark);
      }

      // IntersectionObserver at 40% viewport threshold (smooth light switch effect)
      if ('IntersectionObserver' in window) {
        const switchObserver = new IntersectionObserver(() => {
          updateThemeSwitch();
        }, {
          root: null,
          rootMargin: '0px 0px -40% 0px',
          threshold: 0
        });
        switchObserver.observe(section);
      }

      function resetToInitial() {
        if (window.innerWidth <= 820 || prefersReducedMotion) {
          return;
        }
        if (gallery) {
          gallery.style.opacity = '0';
          gallery.style.visibility = 'hidden';
        }
        cards.forEach((card, idx) => {
          const cfg = configs[idx];
          if (cfg) {
            card.style.transform = `translate(${cfg.init.x}px, ${cfg.init.y}px) rotate(${cfg.init.r}deg) scale(${cfg.init.s})`;
          }
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
          card.style.pointerEvents = 'none';
        });
      }
      resetToInitial();

      function updateProgress() {
        const rect = section.getBoundingClientRect();
        updateThemeSwitch(rect);

        if (prefersReducedMotion || window.innerWidth <= 820) return;

        const totalScrollable = section.offsetHeight - window.innerHeight;
        if (totalScrollable <= 0) return;

        const scrolled = -rect.top;
        targetProgress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

        if (!isAnimating) {
          isAnimating = true;
          requestAnimationFrame(renderLoop);
        }
      }

      function renderLoop() {
        currentProgress += (targetProgress - currentProgress) * 0.32;
        const diff = Math.abs(targetProgress - currentProgress);

        // --- Stage 1 & 2: Heading fade & scale ---
        if (header) {
          const fadeStart = 0.05;
          const fadeEnd = 0.22;
          let op, sc;
          if (currentProgress <= fadeStart) {
            op = 1;
            sc = 1;
          } else if (currentProgress >= fadeEnd) {
            op = 0;
            sc = 0.94;
          } else {
            const t = (currentProgress - fadeStart) / (fadeEnd - fadeStart);
            const eased = easeOutCubic(t);
            op = 1 - eased;
            sc = 1 - 0.06 * eased;
          }
          header.style.opacity = op.toFixed(3);
          header.style.transform = `translate(-50%, -50%) scale(${sc.toFixed(3)})`;
          header.style.visibility = op > 0.01 ? 'visible' : 'hidden';
          header.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
        }

        // --- Scroll indicator ---
        if (indicator) {
          const indOp = Math.max(0, Math.min(1, 1 - currentProgress / 0.10));
          indicator.style.opacity = indOp.toFixed(3);
          indicator.style.transform = `translateY(${(-currentProgress * 25).toFixed(1)}px)`;
        }

        // --- Gallery wrapper fade ---
        if (gallery) {
          const galStart = 0.08;
          const galEnd = 0.22;
          let galOp;
          if (currentProgress <= galStart) {
            galOp = 0;
          } else if (currentProgress >= galEnd) {
            galOp = 1;
          } else {
            galOp = (currentProgress - galStart) / (galEnd - galStart);
          }
          gallery.style.opacity = galOp.toFixed(3);
          gallery.style.visibility = galOp > 0.01 ? 'visible' : 'hidden';
        }

        // --- Stage 2: Five cards progressive convergence ---
        cards.forEach((card, idx) => {
          const cfg = configs[idx];
          if (!cfg) return;

          if (currentProgress <= cfg.start) {
            card.style.transform = `translate(${cfg.init.x}px, ${cfg.init.y}px) rotate(${cfg.init.r}deg) scale(${cfg.init.s})`;
            card.style.opacity = '0';
            card.style.visibility = 'hidden';
            card.style.pointerEvents = 'none';
          } else if (currentProgress >= cfg.end) {
            card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.pointerEvents = 'auto';
          } else {
            const norm = (currentProgress - cfg.start) / (cfg.end - cfg.start);
            const eased = easeOutCubic(norm);
            const inv = 1 - eased;
            const x = cfg.init.x * inv;
            const y = cfg.init.y * inv;
            const r = cfg.init.r * inv;
            const s = cfg.init.s + (1 - cfg.init.s) * eased;
            const op = Math.min(1, Math.max(0, norm * 1.6));

            card.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
            card.style.opacity = op.toFixed(3);
            card.style.visibility = 'visible';
            card.style.pointerEvents = (norm >= 0.9) ? 'auto' : 'none';
          }
        });

        if (diff > 0.0005) {
          requestAnimationFrame(renderLoop);
        } else {
          currentProgress = targetProgress;
          isAnimating = false;
        }
      }

      // --- Interactive Cursor-Following Edge Lighting ---
      cards.forEach(card => {
        let isHovered = false;

        function updateCoords(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
          card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
          if (!isHovered) {
            isHovered = true;
            card.style.setProperty('--mouse-active', '1');
          }
        }

        card.addEventListener('pointerenter', updateCoords);
        card.addEventListener('pointermove', updateCoords);

        card.addEventListener('pointerleave', () => {
          isHovered = false;
          card.style.setProperty('--mouse-active', '0');
        });

        card.addEventListener('pointercancel', () => {
          isHovered = false;
          card.style.setProperty('--mouse-active', '0');
        });

        // Ensure seamless navigation across file://, localhost, and live web servers
        card.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (!href) return;

          if (window.location.protocol === 'file:') {
            e.preventDefault();
            let target = href;
            if (target.startsWith('/')) target = target.slice(1);
            if (!target.endsWith('.html') && !target.endsWith('/')) {
              target += '/index.html';
            } else if (target.endsWith('/')) {
              target += '/';
            }
            window.location.href = target;
          }
        });
      });

      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', () => {
        resetToInitial();
        updateThemeSwitch();
        updateProgress();
      }, { passive: true });
      updateThemeSwitch();
      updateProgress();
    })();

    // ==========================================================================
    // SECTION 6 — PROCESS SCROLL-SYNCHRONIZED TIMELINE & PARALLAX CONTROLLER
    // ==========================================================================
    (function initDecagonTimeline() {
      // 1. Lottie Player Initializer
      function initCollageLotties() {
        // No Lottie containers on the page: nothing to load (and no retry loop).
        if (!document.querySelector('[id^="lottie-mm-"]')) return;
        if (typeof lottie === 'undefined') {
          // If lottie script is still loading, retry shortly
          setTimeout(initCollageLotties, 80);
          return;
        }

        const lottieConfigs = [
          { id: 'lottie-mm-01', path: '/images/process/mm_01.json' },
          { id: 'lottie-mm-04', path: '/images/process/mm_04.json' },
          { id: 'lottie-mm-03', path: '/images/process/mm_03.json' }
        ];

        lottieConfigs.forEach(cfg => {
          const container = document.getElementById(cfg.id);
          if (container && !container.hasAttribute('data-lottie-loaded')) {
            container.setAttribute('data-lottie-loaded', 'true');
            const anim = lottie.loadAnimation({
              container: container,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: cfg.path
            });
            anim.addEventListener('DOMLoaded', () => {
              anim.play();
            });
          }
        });
      }

      // 2. Timeline Scroll & Node Progression
      const timelineLine = document.querySelector('.timeline_custom-line');
      const progressBar = document.querySelector('.timeline_progress-bar');
      const timelineItems = Array.from(document.querySelectorAll('.timeline_content-slot .timeline-item'));
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function updateTimelineProgress() {
        if (!timelineLine || !progressBar) return;

        if (prefersReducedMotion || window.innerWidth <= 990) {
          progressBar.style.height = '100%';
          timelineItems.forEach(item => {
            const pt = item.querySelector('.timeline_point-element');
            if (pt) pt.classList.add('is-active');
            item.classList.add('is-active');
          });
          const closingPt = document.querySelector('.timeline_point-element.closing-node');
          if (closingPt) closingPt.classList.add('is-active');
          const closingCard = document.getElementById('processClosingCard');
          if (closingCard) closingCard.classList.add('is-in-view');
          return;
        }

        const lineRect = timelineLine.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Trigger line growth as the timeline approaches reading viewport center
        const start = windowHeight * 0.65;
        const scrollDistance = start - lineRect.top;
        const totalDistance = lineRect.height;

        let progress = (scrollDistance / totalDistance) * 100;
        progress = Math.max(0, Math.min(progress, 100));

        progressBar.style.height = `${progress.toFixed(2)}%`;

        const progressPx = (progress / 100) * totalDistance;

        timelineItems.forEach((item, idx) => {
          const pt = item.querySelector('.timeline_point-element');
          if (!pt) return;

          const ptRect = pt.getBoundingClientRect();
          const ptCenterY = (ptRect.top - lineRect.top) + (ptRect.height / 2);

          // Activate node when progress reaches its center, deactivate on reverse scroll
          if (progressPx >= ptCenterY - 12 || (idx === 0 && progress > 5)) {
            pt.classList.add('is-active');
            item.classList.add('is-active');
          } else {
            pt.classList.remove('is-active');
            item.classList.remove('is-active');
          }
        });

        const closingPt = document.querySelector('.timeline_point-element.closing-node');
        if (closingPt) {
          const closingRect = closingPt.getBoundingClientRect();
          const closingCenterY = (closingRect.top - lineRect.top) + (closingRect.height / 2);
          if (progressPx >= closingCenterY - 14) {
            closingPt.classList.add('is-active');
          } else {
            closingPt.classList.remove('is-active');
          }
        }

        const closingCard = document.getElementById('processClosingCard');
        if (closingCard) {
          const cardRect = closingCard.getBoundingClientRect();
          if (cardRect.top < windowHeight * 0.88 && cardRect.bottom > windowHeight * 0.12) {
            closingCard.classList.add('is-in-view');
          } else {
            closingCard.classList.remove('is-in-view');
          }
        }
      }

      // 3. High Performance Smooth Parallax Engine
      const parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
      let parallaxItems = [];
      let ticking = false;

      function setupParallax() {
        parallaxItems = parallaxElements.map(el => {
          return {
            el: el,
            axis: el.getAttribute('data-parallax') || 'y',
            speed: parseFloat(el.getAttribute('data-parallax-speed')) || 0.15,
            range: parseFloat(el.getAttribute('data-parallax-range')) || 120,
            direction: parseFloat(el.getAttribute('data-parallax-direction')) || 1,
            ease: parseFloat(el.getAttribute('data-parallax-ease')) || 0.12,
            base: parseFloat(el.getAttribute('data-parallax-base')) || 0,
            current: 0,
            target: 0
          };
        });
      }

      const processSection = document.getElementById('process');
      let isProcessInView = false;
      let parallaxTicking = false;

      function updateParallax() {
        if (!isProcessInView || prefersReducedMotion || window.innerWidth <= 990) {
          parallaxTicking = false;
          return;
        }

        const windowHeight = window.innerHeight;
        const vpCenterY = windowHeight / 2;
        let hasMovement = false;

        parallaxItems.forEach(it => {
          const rect = it.el.getBoundingClientRect();
          if (rect.bottom >= 0 && rect.top <= windowHeight) {
            const elCenterY = rect.top + rect.height / 2;
            const factor = (vpCenterY - elCenterY) / vpCenterY;
            const rawTarget = factor * it.range * it.speed * it.direction;
            it.target = Math.max(-it.range, Math.min(it.range, rawTarget));
          }

          const diff = Math.abs(it.target - it.current);
          if (diff > 0.1) hasMovement = true;

          it.current += (it.target - it.current) * it.ease;
          const val = (it.base + it.current).toFixed(2);
          it.el.style.transform = `translate3d(0, ${val}px, 0)`;
        });

        if (hasMovement) {
          requestAnimationFrame(updateParallax);
        } else {
          parallaxTicking = false;
        }
      }

      function triggerParallax() {
        if (isProcessInView && !parallaxTicking) {
          parallaxTicking = true;
          requestAnimationFrame(updateParallax);
        }
      }

      if ('IntersectionObserver' in window && processSection) {
        const processObs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isProcessInView = entry.isIntersecting;
            if (isProcessInView) triggerParallax();
          });
        }, { rootMargin: '200px 0px 200px 0px' });
        processObs.observe(processSection);
      } else {
        isProcessInView = true;
      }

      function onScroll() {
        updateTimelineProgress();
        triggerParallax();
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        updateTimelineProgress();
        triggerParallax();
      }, { passive: true });

      // Init on load
      setupParallax();
      updateTimelineProgress();
      triggerParallax();
      initCollageLotties();

      if (document.fonts) {
        document.fonts.ready.then(() => {
          updateTimelineProgress();
        });
      }
    })();
