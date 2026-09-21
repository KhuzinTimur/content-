/**
 * reveal.js — универсальные анимации появления при скролле + параллакс.
 *
 * Как применять в HTML:
 *   <p class="reveal">...</p>                       — fade-in + подъём снизу
 *   <p class="reveal reveal-left">...</p>            — выезд слева
 *   <p class="reveal reveal-right">...</p>           — выезд справа
 *   <p class="reveal reveal-scale">...</p>           — появление с лёгким масштабом
 *
 *   data-reveal-delay="200"                          — задержка появления в мс
 *   data-parallax="0.15"                             — параллакс (картинка движется)
 *
 * Элемент появляется ОДИН РАЗ и остаётся видимым. Уважает prefers-reduced-motion.
 */

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* ---------- 1. REVEAL: появление при попадании в viewport ---------- */

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);

          if (delay > 0) {
            setTimeout(() => el.classList.add('is-visible'), delay);
          } else {
            el.classList.add('is-visible');
          }
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- 2. PARALLAX: элемент движется медленнее скролла ---------- */

  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    let ticking = false;

    const updateParallax = () => {
      const vh = window.innerHeight;

      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        const rect = el.getBoundingClientRect();

        // Пропускаем, если элемент далеко за пределами viewport
        if (rect.bottom < -200 || rect.top > vh + 200) return;

        const center = rect.top + rect.height / 2 - vh / 2;
        const offset = -center * speed;

        el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      });

      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', updateParallax, { passive: true });
    updateParallax();
  }
})();