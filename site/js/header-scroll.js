/**
 * header-scroll.js — хедер скрывается при скролле вниз, появляется вверх.
 * Игнорирует программный скролл от магнита проектов (флаг window.__isSnapping).
 */

(function () {
  const HIDE_AFTER_PX = 80;
  const header = document.querySelector('.site-header-wrap');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    if (window.__isSnapping) {
      // Магнит сам дёргает страницу — не мигаем хедером
      lastScrollY = window.scrollY;
      ticking = false;
      return;
    }

    const currentY = window.scrollY;

    if (currentY <= HIDE_AFTER_PX) {
      header.classList.remove('header-hidden');
    } else if (currentY > lastScrollY) {
      header.classList.add('header-hidden');
    } else if (currentY < lastScrollY) {
      header.classList.remove('header-hidden');
    }

    header.classList.toggle('header-elevated', currentY > 4);

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();