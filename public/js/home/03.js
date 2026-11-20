(function initEffixIntro() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

    // ---- 1. Split headline into words → chars ----
    document.querySelectorAll('.fx-split').forEach((el) => {
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      el.setAttribute('aria-label', text);
      let i = 0;
      el.innerHTML = text.split(' ').map((word) =>
        '<span class="fx-word" aria-hidden="true">' +
        Array.from(word).map((ch) => `<span class="fx-char" style="--i:${i++}">${ch}</span>`).join('') +
        '</span>'
      ).join(' ');
      el.classList.remove('fx-split-pending');
    });

    // ---- 2. Image parallax (speed 0.8) ----
    const media = document.getElementById('fxMedia');
    const img   = document.getElementById('fxMediaImg');
    if (media && img && !reduceMotion) {
      let maxShift = 0;
      const measure = () => { maxShift = img.offsetHeight - media.offsetHeight; };
      const render = () => {
        const y = clamp(window.scrollY * 0.2, 0, maxShift);
        img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      };
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { render(); ticking = false; });
      }, { passive: true });
      window.addEventListener('resize', () => { measure(); render(); });
      if (img.complete) { measure(); render(); } else img.addEventListener('load', () => { measure(); render(); });
      measure(); render();
    }

    // ---- 3. Homepage hero entrance ----
    const hero = document.getElementById('hero');
    if (!hero || reduceMotion) return;

    const rise = ['.hero-tags-row', '.hero-title', '.hero-supporting-text', '.audit-box-label', '.audit-form-container'];
    rise.forEach((sel, i) => {
      const el = hero.querySelector(sel);
      if (!el) return;
      el.classList.add('fx-rise');
      el.style.setProperty('--rd', (i * 0.09).toFixed(2) + 's');
    });

    const para = hero.querySelector('.hero-supporting-text');
    let words = [];
    if (para) {
      const text = para.textContent.trim().replace(/\s+/g, ' ');
      para.setAttribute('aria-label', text);
      para.innerHTML = text.split(' ').map((w) => `<span class="fx-scrub-word" aria-hidden="true">${w}</span>`).join(' ');
      words = Array.from(para.querySelectorAll('.fx-scrub-word'));
    }

    function scrub() {
      if (!words.length) return;
      const r = para.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = clamp((vh * 0.98 - r.top) / (vh * 0.45));
      const n = words.length;
      words.forEach((w, i) => {
        const local = clamp(prog * (n + 4) - i, 0, 4) / 4;
        w.style.opacity = (0.16 + 0.84 * local).toFixed(3);
      });
    }

    let scrubTick = false;
    window.addEventListener('scroll', () => {
      if (scrubTick) return;
      scrubTick = true;
      requestAnimationFrame(() => { scrub(); scrubTick = false; });
    }, { passive: true });
    scrub();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            hero.querySelectorAll('.fx-rise').forEach((el) => el.classList.add('is-in'));
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(hero);
    } else {
      hero.querySelectorAll('.fx-rise').forEach((el) => el.classList.add('is-in'));
    }
  })();
