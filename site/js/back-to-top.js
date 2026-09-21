/**
 * back-to-top.js — плавающая кнопка «наверх».
 * Сама создаёт кнопку в DOM, показывает при скролле > 400px,
 * плавно скроллит наверх. Уважает prefers-reduced-motion.
 */

(function () {
  const SCROLL_THRESHOLD = 400;

  // Создаём кнопку
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5"></path>
      <path d="M5 12l7-7 7 7"></path>
    </svg>
  `;
  document.body.appendChild(btn);

  // Показать/скрыть при скролле
  let ticking = false;

  function updateVisibility() {
    const y = window.scrollY;
    if (y > SCROLL_THRESHOLD) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  updateVisibility();

  // Клик — плавный скролл наверх
  btn.addEventListener('click', () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  });
})();