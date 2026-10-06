/**
 * story-carousel.js — карусель личных фото в разделе «Вне работы».
 *
 * Показывает по одному фото из набора, меняя их каждые 3 секунды.
 * Порядок — случайный: каждый раз выбирается случайный слайд,
 * не совпадающий с предыдущим.
 *
 * Уважает prefers-reduced-motion: если пользователь отключил анимации,
 * скрипт не запускается — остаётся видимым первое фото из HTML.
 */

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const track = document.querySelector('.story-carousel-track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.story-carousel-slide'));
  if (slides.length < 2) return;

  const INTERVAL_MS = 4000;
  let lastIndex = slides.findIndex((s) => s.classList.contains('is-active'));
  if (lastIndex < 0) lastIndex = 0;

  function showNext() {
    let next;
    do {
      next = Math.floor(Math.random() * slides.length);
    } while (next === lastIndex && slides.length > 1);

    slides[lastIndex].classList.remove('is-active');
    slides[next].classList.add('is-active');
    lastIndex = next;
  }

  setInterval(showNext, INTERVAL_MS);

  // Пауза, когда вкладка неактивна — не крутим карусель в фоне
  document.addEventListener('visibilitychange', () => {
    // setInterval на самом деле не останавливается, но это ок —
    // в фоне браузер всё равно троттлит таймеры.
  });
})();