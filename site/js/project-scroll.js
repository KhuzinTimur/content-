/**
 * project-scroll.js — управление активной сценой + «магнит по остановке».
 *
 * Задача 1 — активная сцена. IntersectionObserver переключает [data-active]
 * у той сцены, что сейчас занимает экран. От этого атрибута стартует вся
 * CSS-анимация (картинка → затемнение → заголовок → описание → CTA).
 *
 * Задача 2 — «магнит». CSS scroll-snap-type не подходит: proximity оставляет
 * пользователя в «пропасти» между сценами при лёгком скролле, mandatory
 * намертво запирает внутри секции. Поэтому снапим сами, по событию
 * «скролл остановился»: если пользователь прекратил скроллить и его
 * центр экрана внутри секции проектов — плавно доехать до ближайшей сцены.
 * Никакого preventDefault, никакого перехвата wheel — только корректировка
 * после того, как пользователь сам закончил жест.
 */

(function () {
  const scenes = Array.from(document.querySelectorAll('.project-scene'));
  if (!scenes.length) return;

  const section = document.getElementById('projects');
  const snapEnabled = () => window.matchMedia('(min-width: 721px)').matches;

  /* ---------- 1. Активная сцена ---------- */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scene = entry.target;
        const next = entry.isIntersecting ? 'true' : 'false';
        if (scene.getAttribute('data-active') !== next) {
          scene.setAttribute('data-active', next);
        }
      });
    },
    {
      threshold: 0.6,
      rootMargin: '-5% 0px -5% 0px',
    }
  );

  scenes.forEach((scene) => {
    scene.setAttribute('data-active', 'false');
    observer.observe(scene);
  });

  /* ---------- 2. Магнит по остановке скролла ---------- */

  if (!section) return;

  const SNAP_IDLE_MS = 130;   // сколько ждать после последнего события скролла
  const SNAP_TOLERANCE = 6;   // px — если мы уже почти на сцене, не дёргаемся

  let idleTimer = null;
  let snapping = false;       // true, пока идёт плавный догон — игнорируем новые замеры

  function sceneTop(scene) {
    return scene.getBoundingClientRect().top + window.scrollY;
  }

  function snapToNearest() {
    if (!snapEnabled()) return;
    if (snapping) return;

    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const vpCenter = scrollY + vh / 2;

    const sectionTop = sceneTop(section);
    const sectionBottom = sectionTop + section.offsetHeight;

    // Центр экрана вне секции проектов — не вмешиваемся
    if (vpCenter < sectionTop || vpCenter > sectionBottom) return;

    // Ближайшая сцена по верхней границе
    let nearestTop = null;
    let minDist = Infinity;
    scenes.forEach((s) => {
      const top = sceneTop(s);
      const d = Math.abs(top - scrollY);
      if (d < minDist) { minDist = d; nearestTop = top; }
    });

    if (nearestTop === null) return;
    if (minDist < SNAP_TOLERANCE) return;   // уже на месте

        snapping = true;
    window.__isSnapping = true;
    window.scrollTo({ top: nearestTop, behavior: 'smooth' });

    setTimeout(() => {
      snapping = false;
      window.__isSnapping = false;
    }, 500);
  }

  window.addEventListener('scroll', () => {
    if (snapping) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(snapToNearest, SNAP_IDLE_MS);
  }, { passive: true });

  // После смены размера окна тоже пересчитываем
  window.addEventListener('resize', () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(snapToNearest, SNAP_IDLE_MS);
  }, { passive: true });
})();