/**
 * mobile-menu.js — открытие/закрытие полноэкранного мобильного меню.
 * + Focus trap: пока меню открыто, Tab не уводит фокус за его пределы.
 * + Возврат фокуса на бургер при закрытии.
 */

(function () {
  const burger = document.querySelector('.nav-burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const trigger = menu.querySelector('.mobile-menu-trigger');

  // Все фокусируемые элементы внутри меню
  const focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return Array.from(menu.querySelectorAll(focusableSelector))
      .filter((el) => el.offsetParent !== null); // только видимые
  }

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');

    // Фокус не ставим — на iOS Safari он подсвечивает элемент голубым.
    // Focus trap всё равно работает при Tab с клавиатуры.
    requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    });
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');

    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    // Возвращаем фокус на бургер
    burger.focus();
  }

  function toggleMenu() {
    burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  }

  burger.addEventListener('click', toggleMenu);

  // Клик по ссылке меню — закрыть (навигация произойдёт сама)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Тап по пустому месту внутри меню — тоже закрывает.
  // Если попали по ссылке или кнопке — не трогаем:
  // ссылка сама закроет при переходе, кнопка раскрывает подсписок «Проекты».
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    closeMenu();
  });

  // Escape — закрыть
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });

  // Focus trap: Tab / Shift+Tab не выходят за пределы меню
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Внутренний триггер проектов — раскладывает подсписок
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