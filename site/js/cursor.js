/**
 * cursor.js — двойной кастомный курсор.
 *
 *   .cursor-ring  — внешнее кольцо, mix-blend-mode: difference,
 *                   плавно догоняет мышь (медленный ease)
 *   .cursor-dot   — внутренняя фиолетовая точка,
 *                   следует почти точно за мышью (быстрый ease)
 *
 * Работает только на устройствах с мышью (hover + pointer: fine).
 * На тач-устройствах отключён.
 */

(function () {
  const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFine) return;

  const ring = document.querySelector('.cursor-ring');
  const dot  = document.querySelector('.cursor-dot');
  if (!ring || !dot) return;

  const EASE_RING = 0.16;   // чем меньше — тем сильнее отстаёт кольцо
  const EASE_DOT  = 0.55;   // точка почти «прилипает» к мыши

  let mx = 0, my = 0;       // позиция мыши
  let rx = 0, ry = 0;       // позиция кольца
  let dx = 0, dy = 0;       // позиция точки
  let rafId = null;

  function loop() {
    rx += (mx - rx) * EASE_RING;
    ry += (my - ry) * EASE_RING;
    dx += (mx - dx) * EASE_DOT;
    dy += (my - dy) * EASE_DOT;

    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    dot.style.transform  = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;

    const still =
      Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1 &&
      Math.abs(mx - dx) < 0.1 && Math.abs(my - dy) < 0.1;

    rafId = still ? null : requestAnimationFrame(loop);
  }

  function kick() {
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    ring.classList.add('is-visible');
    dot.classList.add('is-visible');
    kick();
  });

  document.addEventListener('mouseleave', () => {
    ring.classList.remove('is-visible');
    dot.classList.remove('is-visible');
  });

  document.addEventListener('mouseenter', () => {
    ring.classList.add('is-visible');
    dot.classList.add('is-visible');
  });

  const interactiveSelector =
    'a, button, input, textarea, select, [role="button"], ' +
    '.skill-pill, .project-scene-cta, .contact-icon-btn, .theme-toggle, .control-segment';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('is-hover');
      dot.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('is-hover');
      dot.classList.remove('is-hover');
    }
  });

  document.addEventListener('mousedown', () => {
    ring.classList.add('is-down');
    dot.classList.add('is-down');
  });

  document.addEventListener('mouseup', () => {
    ring.classList.remove('is-down');
    dot.classList.remove('is-down');
  });
})();