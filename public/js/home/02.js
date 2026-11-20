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

    // ==========================================================================
    // EFFIX LABS — LINEAR INTERACTIVE ORBITAL SERVICES CONTROLLER
    // PURE DARK REFINED + INDIVIDUAL PIXEL-ART ANIMATIONS + STAGGERED SEQUENCE
    // ==========================================================================
    (function initEffixLinearServicesOrbit() {
      const stage = document.getElementById('effixServicesOrbitStage');
      const wheel = document.getElementById('orbitWheelContainer');
      const topBackBtn = document.getElementById('orbitTopBackBtn');
      const navServicesBtn = document.getElementById('navServicesBtn');
      const mobileNavServicesBtn = document.getElementById('mobileNavServicesBtn');

      if (!stage || !wheel) return;

      // 5 Official EFFIX Labs Services
      const services = [
        {
          id: 'gbp',
          index: '01',
          title: 'Google Business Profile Optimisation',
          category: 'Local Search Intelligence',
          color: '#00FF9D',
          glow: 'rgba(0, 255, 157, 0.45)',
          url: '/services/google-business-profile'
        },
        {
          id: 'reddit-quora',
          index: '02',
          title: 'Reddit Marketing',
          category: 'Community Search Authority',
          color: '#FF5CFE',
          glow: 'rgba(255, 92, 254, 0.45)',
          url: '/services/reddit-marketing'
        },
        {
          id: 'ai-search',
          index: '03',
          title: 'SEO & AEO Services',
          category: 'GEO & AEO Knowledge Graph',
          color: '#00F0FF',
          glow: 'rgba(0, 240, 255, 0.45)',
          url: '/services/ai-search-visibility'
        },
        {
          id: 'blog-seo',
          index: '04',
          title: 'Content Writing',
          category: 'Editorial Information Gain',
          color: '#FF5500',
          glow: 'rgba(255, 85, 0, 0.45)',
          url: '/services/ai-assisted-blog-seo'
        },
        {
          id: 'web-dev',
          index: '05',
          title: 'Website Design & Development',
          category: 'High-Performance Web Engineering',
          color: '#A855F7',
          glow: 'rgba(168, 85, 247, 0.45)',
          url: '/services/website-design-development'
        }
      ];

      // Build 15 spokes (3 complete cycles of the 5 services) spaced 24° apart
      const TOTAL_SPOKES = 15;
      const SPOKE_STEP = 360 / TOTAL_SPOKES; // 24 degrees

      wheel.innerHTML = '';
      const cards = [];
      const cardCanvases = [];

      for (let i = 0; i < TOTAL_SPOKES; i++) {
        const sIdx = i % services.length;
        const sData = services[sIdx];
        const angle = i * SPOKE_STEP;

        const spoke = document.createElement('div');
        spoke.className = 'orbit-spoke';
        spoke.style.transform = `rotate(${angle}deg)`;

        const card = document.createElement('a');
        card.className = 'orbit-card';
        card.href = sData.url;
        card.setAttribute('data-service-id', sData.id);
        card.setAttribute('data-index', sData.index);
        card.setAttribute('data-service-index', sIdx);
        card.setAttribute('aria-label', `${sData.title} - Explore Service`);
        card.style.setProperty('--card-color', sData.color);
        card.style.setProperty('--card-glow', sData.glow);

        card.innerHTML = `
          <div class="orbit-card-visual">
            <canvas class="orbit-pixel-canvas" width="304" height="232"></canvas>
            <div class="orbit-card-visual-scrim"></div>
          </div>
          <div class="orbit-card-info">
            <div class="orbit-card-top-row">
              <span class="orbit-card-num">${sData.index}</span>
              <span class="orbit-card-tag">${sData.category}</span>
            </div>
            <h3 class="orbit-card-title">${sData.title}</h3>
          </div>
        `;

        const canvas = card.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);

        spoke.appendChild(card);
        wheel.appendChild(spoke);
        cards.push(card);
        cardCanvases.push({ canvas, ctx, sIdx });
      }

      // --- PIXEL ART RENDERING ENGINE (5 UNIQUE CANVAS ANIMATIONS) ---
      const W = 152;
      const H = 116;
      const COLS = 26;
      const ROWS = 18;
      const BLOCK_SIZE = 4.4;
      const STEP = 5.2;
      const X0 = (W - COLS * STEP) / 2;
      const Y0 = (H - ROWS * STEP) / 2;

      // 5 Offscreen canvases for optimal performance
      const offscreen = services.map(() => {
        const c = document.createElement('canvas');
        c.width = 304;
        c.height = 232;
        const ctx = c.getContext('2d');
        ctx.scale(2, 2);
        return { canvas: c, ctx };
      });

      function drawPixel(ctx, col, row, color, alpha, glow, scale) {
        if (alpha <= 0.01) return;
        const a = alpha === undefined ? 1.0 : alpha;
        const sc = scale === undefined ? 1.0 : scale;
        const x = X0 + col * STEP;
        const y = Y0 + row * STEP;
        const s = BLOCK_SIZE * sc;
        const o = (BLOCK_SIZE - s) / 2;
        ctx.save();
        ctx.globalAlpha = Math.min(Math.max(a, 0), 1);
        if (glow) {
          ctx.shadowColor = glow;
          ctx.shadowBlur = 5;
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x + o, y + o, s, s);
        ctx.fill();
        ctx.restore();
      }

      // 01: Google Business Profile Growth (Emerald & Lime)
      function renderGBP(ctx, p, active) {
        ctx.clearRect(0, 0, W, H);
        const LIME = '#00FF9D';
        const EMERALD = '#10B981';
        const MINT = '#34D399';
        const GLOW = 'rgba(0, 255, 157, 0.45)';

        for (let c = 2; c < COLS - 2; c += 4) {
          for (let r = 2; r < ROWS - 2; r += 4) {
            drawPixel(ctx, c, r, '#13281c', 0.28);
          }
        }

        if (p < 0.45) {
          const stageP = p / 0.45;
          const radius = 2 + stageP * 8;
          for (let angle = 0; angle < Math.PI * 2; angle += 0.4) {
            const rc = Math.round(13 + Math.cos(angle) * radius);
            const rr = Math.round(8 + Math.sin(angle) * (radius * 0.7));
            if (rc >= 0 && rc < COLS && rr >= 0 && rr < ROWS) {
              drawPixel(ctx, rc, rr, MINT, (1 - stageP) * 0.7, GLOW, 0.8);
            }
          }
          const pin = [
            [12, 3], [13, 3], [14, 3],
            [11, 4], [12, 4], [13, 4], [14, 4], [15, 4],
            [10, 5], [11, 5], [15, 5], [16, 5],
            [10, 6], [11, 6], [13, 6], [15, 6], [16, 6],
            [10, 7], [11, 7], [15, 7], [16, 7],
            [11, 8], [12, 8], [13, 8], [14, 8], [15, 8],
            [12, 9], [13, 9], [14, 9],
            [12, 10], [13, 10], [14, 10],
            [13, 11], [13, 12], [13, 13]
          ];
          pin.forEach(([c, r], idx) => {
            const appear = Math.min(1, stageP * 1.5 - idx * 0.015);
            if (appear > 0) {
              const col = (c === 13 && r === 6) ? '#FFFFFF' : (r <= 5 ? LIME : EMERALD);
              drawPixel(ctx, c, r, col, appear, GLOW);
            }
          });
        } else {
          for (let c = 7; c <= 19; c++) {
            const col = (c % 2 === 0) ? LIME : EMERALD;
            drawPixel(ctx, c, 4, col, 1, GLOW);
            drawPixel(ctx, c, 5, col, 1, GLOW);
            if (c % 2 === 0) drawPixel(ctx, c, 6, MINT, 1, GLOW);
          }
          const pillars = [
            [8, 7], [8, 8], [8, 9], [8, 10], [8, 11],
            [18, 7], [18, 8], [18, 9], [18, 10], [18, 11],
            [12, 7], [14, 7], [12, 8], [14, 8], [12, 9], [14, 9], [12, 10], [14, 10], [12, 11], [14, 11]
          ];
          pillars.forEach(([c, r]) => drawPixel(ctx, c, r, EMERALD, 0.9));
          drawPixel(ctx, 13, 9, '#FDE047', 0.95, 'rgba(253, 224, 71, 0.5)');
          drawPixel(ctx, 13, 10, '#FDE047', 0.95, 'rgba(253, 224, 71, 0.5)');
          for (let c = 6; c <= 20; c++) {
            drawPixel(ctx, c, 12, EMERALD, 0.95);
            drawPixel(ctx, c, 13, '#065F46', 0.85);
          }
          const badge = [[19, 2], [20, 2], [18, 3], [21, 3], [19, 4], [20, 4]];
          badge.forEach(([c, r]) => drawPixel(ctx, c, r, LIME, 1, GLOW));
          drawPixel(ctx, 19, 3, '#FFFFFF', 1);
        }
      }

      // 02: Reddit & Quora Brand Visibility (Warm Magenta & Pink)
      function renderRedditQuora(ctx, p, active) {
        ctx.clearRect(0, 0, W, H);
        const MAGENTA = '#FF5CFE';
        const HOTPINK = '#EC4899';
        const ROSE = '#FB7185';
        const GLOW = 'rgba(255, 92, 254, 0.45)';

        for (let c = 2; c < COLS - 2; c += 4) {
          for (let r = 2; r < ROWS - 2; r += 4) {
            drawPixel(ctx, c, r, '#261221', 0.28);
          }
        }

        const b1 = [
          [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3],
          [6, 4], [13, 4],
          [5, 5], [14, 5],
          [5, 6], [14, 6],
          [5, 7], [14, 7],
          [6, 8], [13, 8],
          [7, 9], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9],
          [7, 10], [6, 11]
        ];
        b1.forEach(([c, r]) => drawPixel(ctx, c, r, MAGENTA, 1, GLOW));

        if (p < 0.5) {
          const dotsP = (p / 0.5) * 3;
          if (dotsP > 0.5) drawPixel(ctx, 8, 6, '#FFFFFF', 1);
          if (dotsP > 1.5) drawPixel(ctx, 10, 6, '#FFFFFF', 1);
          if (dotsP > 2.2) drawPixel(ctx, 12, 6, '#FFFFFF', 1);
        } else {
          for (let c = 8; c <= 12; c++) drawPixel(ctx, c, 5, ROSE, 0.85);
          for (let c = 8; c <= 11; c++) drawPixel(ctx, c, 7, ROSE, 0.85);
        }

        const b2P = Math.max(0, (p - 0.25) / 0.75);
        if (b2P > 0) {
          const b2 = [
            [14, 7], [15, 7], [16, 7], [17, 7], [18, 7], [19, 7],
            [13, 8], [20, 8],
            [13, 9], [20, 9],
            [13, 10], [20, 10],
            [14, 11], [15, 11], [16, 11], [17, 11], [18, 11], [19, 11],
            [18, 12], [19, 13]
          ];
          b2.forEach(([c, r], idx) => {
            const a = Math.min(1, b2P * 1.6 - idx * 0.02);
            if (a > 0) drawPixel(ctx, c, r, HOTPINK, a, GLOW);
          });

          if (b2P > 0.5) {
            const upvote = [[17, 3], [16, 4], [17, 4], [18, 4], [17, 5]];
            upvote.forEach(([c, r]) => drawPixel(ctx, c, r, '#FF5CFE', Math.min(1, (b2P - 0.5) * 2), GLOW));
          }

          drawPixel(ctx, 13, 6, ROSE, b2P * 0.7);
          drawPixel(ctx, 14, 6, ROSE, b2P * 0.7);
        }
      }

      // 03: AI Search & Brand Visibility (Electric Blue & Cyan)
      function renderAISearch(ctx, p, active) {
        ctx.clearRect(0, 0, W, H);
        const CYAN = '#00F0FF';
        const BLUE = '#388BFF';
        const SKY = '#60A5FA';
        const GLOW = 'rgba(0, 240, 255, 0.45)';

        for (let c = 2; c < COLS - 2; c += 4) {
          for (let r = 2; r < ROWS - 2; r += 4) {
            drawPixel(ctx, c, r, '#0f1f33', 0.28);
          }
        }

        if (p < 0.40) {
          const stageP = p / 0.40;
          const lens = [
            [9, 3], [10, 3], [11, 3], [12, 3],
            [8, 4], [13, 4],
            [7, 5], [14, 5],
            [7, 6], [14, 6],
            [7, 7], [14, 7],
            [8, 8], [13, 8],
            [9, 9], [10, 9], [11, 9], [12, 9],
            [14, 10], [15, 11], [16, 12], [17, 13]
          ];
          lens.forEach(([c, r]) => drawPixel(ctx, c, r, BLUE, 1, 'rgba(56, 139, 255, 0.4)'));

          const scanRow = 3 + Math.floor(stageP * 9);
          for (let c = 8; c <= 13; c++) {
            drawPixel(ctx, c, scanRow, CYAN, 1, GLOW);
          }
        } else {
          const stageP = (p - 0.40) / 0.60;
          drawPixel(ctx, 12, 7, '#FFFFFF', 1, GLOW);
          drawPixel(ctx, 13, 7, CYAN, 1, GLOW);
          drawPixel(ctx, 12, 8, CYAN, 1, GLOW);
          drawPixel(ctx, 13, 8, '#FFFFFF', 1, GLOW);

          const nodes = [
            { c: 7, r: 4 },
            { c: 19, r: 4 },
            { c: 6, r: 11 },
            { c: 20, r: 11 },
            { c: 13, r: 14 }
          ];

          nodes.forEach((n, idx) => {
            const a = Math.min(1, stageP * 1.5 - idx * 0.1);
            if (a > 0) {
              drawPixel(ctx, n.c, n.r, BLUE, a, 'rgba(56, 139, 255, 0.45)');
              drawPixel(ctx, n.c + 1, n.r, CYAN, a, GLOW);
              const steps = 4;
              for (let s = 1; s < steps; s++) {
                const lc = Math.round(n.c + ((12 - n.c) * s) / steps);
                const lr = Math.round(n.r + ((7 - n.r) * s) / steps);
                drawPixel(ctx, lc, lr, SKY, a * 0.45);
              }
            }
          });

          const ringRad = 4 + (stageP * 6) % 5;
          for (let a = 0; a < Math.PI * 2; a += 0.6) {
            const rc = Math.round(12.5 + Math.cos(a) * ringRad);
            const rr = Math.round(7.5 + Math.sin(a) * (ringRad * 0.7));
            if (rc >= 0 && rc < COLS && rr >= 0 && rr < ROWS) {
              drawPixel(ctx, rc, rr, CYAN, 0.35, GLOW, 0.7);
            }
          }
        }
      }

      // 04: AI-Assisted Blog SEO (Orange & Amber)
      function renderBlogSEO(ctx, p, active) {
        ctx.clearRect(0, 0, W, H);
        const ORANGE = '#FF5500';
        const AMBER = '#F59E0B';
        const PEACH = '#FB923C';
        const GLOW = 'rgba(255, 85, 0, 0.45)';

        for (let c = 2; c < COLS - 2; c += 4) {
          for (let r = 2; r < ROWS - 2; r += 4) {
            drawPixel(ctx, c, r, '#2b170c', 0.28);
          }
        }

        for (let c = 7; c <= 15; c++) drawPixel(ctx, c, 2, ORANGE, 1, GLOW);
        drawPixel(ctx, 16, 3, PEACH, 1);
        drawPixel(ctx, 17, 4, PEACH, 1);
        drawPixel(ctx, 15, 3, PEACH, 1);
        drawPixel(ctx, 15, 4, PEACH, 1);
        for (let r = 5; r <= 14; r++) drawPixel(ctx, 18, r, ORANGE, 0.9);
        for (let r = 2; r <= 14; r++) drawPixel(ctx, 7, r, ORANGE, 0.9);
        for (let c = 7; c <= 18; c++) drawPixel(ctx, c, 14, ORANGE, 0.9);

        const hP = Math.min(1, p * 2.5);
        for (let c = 9; c <= 14; c++) {
          if ((c - 9) / 5 <= hP) drawPixel(ctx, c, 4, AMBER, 1, 'rgba(245, 158, 11, 0.4)');
        }
        const sP = Math.min(1, Math.max(0, (p - 0.2) * 2.5));
        for (let c = 9; c <= 16; c++) {
          if ((c - 9) / 7 <= sP) drawPixel(ctx, c, 6, PEACH, 0.85);
        }
        const p1 = Math.min(1, Math.max(0, (p - 0.4) * 2.5));
        for (let c = 9; c <= 16; c++) {
          if ((c - 9) / 7 <= p1) drawPixel(ctx, c, 8, PEACH, 0.7);
        }
        const p2 = Math.min(1, Math.max(0, (p - 0.55) * 2.5));
        for (let c = 9; c <= 14; c++) {
          if ((c - 9) / 5 <= p2) drawPixel(ctx, c, 10, PEACH, 0.7);
        }

        if (p > 0.6) {
          const rP = (p - 0.6) / 0.4;
          drawPixel(ctx, 14, 12, ORANGE, rP);
          drawPixel(ctx, 15, 12, '#10B981', rP, 'rgba(16, 185, 129, 0.5)');
          drawPixel(ctx, 15, 11, '#10B981', rP, 'rgba(16, 185, 129, 0.5)');
          drawPixel(ctx, 16, 12, '#10B981', rP, 'rgba(16, 185, 129, 0.5)');
        }
      }

      // 05: Website Design & Development (Violet & Purple)
      function renderWebDev(ctx, p, active) {
        ctx.clearRect(0, 0, W, H);
        const PURPLE = '#A855F7';
        const VIOLET = '#8B5CF6';
        const LAVENDER = '#C084FC';
        const GLOW = 'rgba(168, 85, 247, 0.45)';

        for (let c = 2; c < COLS - 2; c += 4) {
          for (let r = 2; r < ROWS - 2; r += 4) {
            drawPixel(ctx, c, r, '#201233', 0.28);
          }
        }

        for (let c = 5; c <= 14; c++) drawPixel(ctx, c, 2, PURPLE, 1, GLOW);
        drawPixel(ctx, 6, 3, '#EF4444', 1);
        drawPixel(ctx, 7, 3, '#F59E0B', 1);
        drawPixel(ctx, 8, 3, '#10B981', 1);
        for (let c = 10; c <= 13; c++) drawPixel(ctx, c, 3, LAVENDER, 0.5);

        for (let r = 3; r <= 14; r++) {
          drawPixel(ctx, 5, r, PURPLE, 0.85);
          drawPixel(ctx, 14, r, PURPLE, 0.85);
        }
        for (let c = 5; c <= 14; c++) drawPixel(ctx, c, 14, PURPLE, 0.85);

        for (let c = 6; c <= 13; c++) {
          drawPixel(ctx, c, 5, VIOLET, 0.9);
          drawPixel(ctx, c, 6, VIOLET, 0.9);
        }
        for (let c = 6; c <= 8; c++) {
          drawPixel(ctx, c, 8, LAVENDER, 0.7);
          drawPixel(ctx, c, 9, LAVENDER, 0.7);
          drawPixel(ctx, c, 11, LAVENDER, 0.7);
        }
        for (let c = 10; c <= 13; c++) {
          drawPixel(ctx, c, 8, LAVENDER, 0.7);
          drawPixel(ctx, c, 9, LAVENDER, 0.7);
          drawPixel(ctx, c, 11, LAVENDER, 0.7);
        }

        const mobP = Math.min(1, Math.max(0, (p - 0.25) * 1.5));
        if (mobP > 0) {
          for (let c = 16; c <= 21; c++) {
            drawPixel(ctx, c, 4, PURPLE, mobP, GLOW);
            drawPixel(ctx, c, 14, PURPLE, mobP, GLOW);
          }
          for (let r = 4; r <= 14; r++) {
            drawPixel(ctx, 16, r, PURPLE, mobP * 0.9);
            drawPixel(ctx, 21, r, PURPLE, mobP * 0.9);
          }
          drawPixel(ctx, 18, 5, LAVENDER, mobP);
          drawPixel(ctx, 19, 5, LAVENDER, mobP);
          drawPixel(ctx, 18, 13, LAVENDER, mobP);
          drawPixel(ctx, 19, 13, LAVENDER, mobP);

          for (let c = 17; c <= 20; c++) {
            drawPixel(ctx, c, 7, VIOLET, mobP * 0.85);
            drawPixel(ctx, c, 9, LAVENDER, mobP * 0.7);
            drawPixel(ctx, c, 11, LAVENDER, mobP * 0.7);
          }
        }
      }

      const renderers = [renderGBP, renderRedditQuora, renderAISearch, renderBlogSEO, renderWebDev];

      // --- STAGGERED SEQUENCE & ORBIT LOOP ENGINE ---
      const ROTATION_SPEED = 4.0; // 4 deg/sec orbit
      const CYCLE_DURATION = 4.2; // 4.2s per card slot
      const ACTIVE_DURATION = 3.2; // 3.2s active animation phase (followed by 1.0s calm hold pause)
      let currentAngle = 0;
      let sequenceTime = 0;
      let isPaused = false;
      let lastTime = null;
      let animId = null;
      let resumeTimeout = null;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function getWheelScale() {
        const w = window.innerWidth;
        if (w <= 480) return 0.58;
        if (w <= 768) return 0.70;
        if (w <= 1024) return 0.85;
        return 1.0;
      }

      function orbitLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
        lastTime = timestamp;

        // 1. Continuous Outer Orbit (pauses on hover)
        if (!isPaused && !prefersReducedMotion) {
          currentAngle = (currentAngle + ROTATION_SPEED * dt) % 360;
          const scale = getWheelScale();
          wheel.style.transform = `scale(${scale}) rotate(${currentAngle.toFixed(4)}deg)`;
        }

        // 2. Internal Staggered Animation Sequence (plays continuously, even when orbit paused!)
        sequenceTime += dt;
        const activeService = Math.floor(sequenceTime / CYCLE_DURATION) % services.length;
        const tInCycle = sequenceTime % CYCLE_DURATION;
        // In active phase: progress goes 0.0 -> 1.0. In pause phase (1.0s): stays at 1.0 (completed state)
        const cycleProgress = tInCycle < ACTIVE_DURATION ? (tInCycle / ACTIVE_DURATION) : 1.0;

        // Render each service to its offscreen canvas
        for (let s = 0; s < services.length; s++) {
          const isCardActive = (s === activeService);
          const p = isCardActive ? cycleProgress : 1.0;
          renderers[s](offscreen[s].ctx, p, isCardActive);
        }

        // Blit offscreen buffer to all card canvases
        for (let i = 0; i < cardCanvases.length; i++) {
          const { ctx, sIdx } = cardCanvases[i];
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, 304, 232);
          ctx.drawImage(offscreen[sIdx].canvas, 0, 0);
          ctx.restore();
        }

        animId = requestAnimationFrame(orbitLoop);
      }

      // --- HOVER PAUSE & RESUME HANDLING ---
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          clearTimeout(resumeTimeout);
          isPaused = true;
          cards.forEach(c => c.classList.remove('is-hovered'));
          card.classList.add('is-hovered');
        });

        card.addEventListener('mouseleave', () => {
          card.classList.remove('is-hovered');
          clearTimeout(resumeTimeout);
          resumeTimeout = setTimeout(() => {
            const hovered = cards.find(c => c.matches(':hover'));
            if (!hovered) {
              isPaused = false;
              lastTime = performance.now(); // Essential: prevents jump delta!
            }
          }, 40);
        });

        // Mobile Touch Handling:
        card.addEventListener('touchstart', (e) => {
          if (!card.classList.contains('is-hovered')) {
            e.preventDefault();
            clearTimeout(resumeTimeout);
            isPaused = true;
            cards.forEach(c => c.classList.remove('is-hovered'));
            card.classList.add('is-hovered');
          }
        }, { passive: false });
      });

      // Touch outside resumes orbit
      stage.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.orbit-card') && !e.target.closest('.orbit-top-back-btn')) {
          cards.forEach(c => c.classList.remove('is-hovered'));
          isPaused = false;
          lastTime = performance.now();
        }
      });

      // Open & Close Stage
      window.openServicesOrbitStage = function() {
        stage.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        if (window.lenis) window.lenis.stop();
        isPaused = false;
        lastTime = performance.now();
        if (!animId) {
          animId = requestAnimationFrame(orbitLoop);
        }
        if (topBackBtn) topBackBtn.focus();
      };

      window.closeServicesOrbitStage = function() {
        stage.classList.remove('is-active');
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
        clearTimeout(resumeTimeout);
        cards.forEach(c => c.classList.remove('is-hovered'));
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        if (navServicesBtn) navServicesBtn.focus();
      };

      if (topBackBtn) {
        topBackBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.closeServicesOrbitStage();
        });
      }

      // Keyboard ESC to close
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && stage.classList.contains('is-active')) {
          window.closeServicesOrbitStage();
        }
      });

      // Connect Navbar "Services" Links
      if (navServicesBtn) {
        navServicesBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.openServicesOrbitStage();
        });
      }

      if (mobileNavServicesBtn) {
        mobileNavServicesBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof toggleMobileDrawer === 'function') toggleMobileDrawer();
          window.openServicesOrbitStage();
        });
      }

      // Performance: Do not run heavy canvas loop when stage is closed!
      // Loop begins dynamically when window.openServicesOrbitStage() is called.
    })();
