/**
 * mobile-menu.js — открытие/закрытие полноэкранного мобильного меню.
 * Работает на всех страницах — скрипт сам находит .nav-burger и .mobile-menu,
 * если их нет, тихо выходит.
 */

(function () {
  const burger = document.querySelector('.nav-burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const trigger = menu.querySelector('.mobile-menu-trigger');

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');

    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  }

  burger.addEventListener('click', toggleMenu);

  // Клик по ссылке меню — закрыть (навигация произойдёт сама)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Escape — закрыть
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Внутренний триггер проектов — раскрывает подсписок
  if (trigger) {
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  // Если экран расширили с мобилки на десктоп — принудительно закрываем
  window.matchMedia('(min-width: 721px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
})();