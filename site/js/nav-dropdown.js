/**
 * nav-dropdown.js — открытие/закрытие выпадающих списков «Проекты» и «О себе».
 *
 * Возможности:
 *  - Hover открывает (на устройствах с мышью)
 *  - Клик — тумблер (работает и на тач-устройствах)
 *  - Escape / клик вне — закрыть
 *  - Клавиатура: ArrowDown / ArrowUp — навигация по пунктам,
 *    Home / End — прыжок к первому / последнему,
 *    стрелка вниз на закрытом дропдауне — открывает его.
 */

(function () {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  const isTouch = window.matchMedia('(hover: none)').matches;

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!trigger || !menu) return;

    const items = () => Array.from(menu.querySelectorAll('a'));
    let hoverTimer = null;

    function open()  { trigger.setAttribute('aria-expanded', 'true'); }
    function close() {
      trigger.setAttribute('aria-expanded', 'false');
      hoverTimer && clearTimeout(hoverTimer);
    }
    function isOpen() { return trigger.getAttribute('aria-expanded') === 'true'; }

    /* ---------- Hover (только с мышью) ---------- */
    if (!isTouch) {
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        open();
      });
      dropdown.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(close, 120);
      });
    }

    /* ---------- Клик по триггеру ---------- */
    trigger.addEventListener('click', (e) => {
      // На тач-устройствах — тумблер.
      // На десктопе — переход по href (меню открывается по hover).
      if (isTouch) {
        e.preventDefault();
        isOpen() ? close() : open();
      }
    });

    /* ---------- Клик вне — закрыть ---------- */
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) close();
    });

    /* ---------- Escape — закрыть и вернуть фокус на триггер ---------- */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        close();
        trigger.focus();
      }
    });

    /* ---------- Клавиатура внутри триггера ---------- */
    trigger.addEventListener('keydown', (e) => {
      // ArrowDown на закрытом — открыть и уйти к первому пункту
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen()) {
          open();
        }
        const list = items();
        if (list.length) list[0].focus();
      }
      // ArrowUp на закрытом — открыть и уйти к последнему
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen()) {
          open();
        }
        const list = items();
        if (list.length) list[list.length - 1].focus();
      }
    });

    /* ---------- Клавиатура внутри меню ---------- */
    menu.addEventListener('keydown', (e) => {
      const list = items();
      const currentIndex = list.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = currentIndex === -1 ? 0 : (currentIndex + 1) % list.length;
        list[next]?.focus();
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
        list[prev]?.focus();
      }

      if (e.key === 'Home') {
        e.preventDefault();
        list[0]?.focus();
      }

      if (e.key === 'End') {
        e.preventDefault();
        list[list.length - 1]?.focus();
      }

      // Tab — закрыть меню и отдать фокус дальше по странице
      if (e.key === 'Tab') {
        close();
      }
    });

    /* ---------- Клик по пункту меню — закрыть ---------- */
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', close);
    });
  });

  /* ---------- Синхронизация data-text для underline-эффекта ----------
     i18n перезаписывает textContent ссылок — MutationObserver ловит это
     и обновляет data-text. */
  const navLinks = document.querySelectorAll('.nav-links > li > a');
  const syncDataText = (el) => el.setAttribute('data-text', el.textContent.trim());

  navLinks.forEach((a) => {
    syncDataText(a);
    new MutationObserver(() => syncDataText(a)).observe(a, {
      childList: true, characterData: true, subtree: true,
    });
  });

  /* То же самое для триггеров (у них текст внутри <span data-i18n>) */
  document.querySelectorAll('.nav-dropdown-trigger > span[data-i18n]').forEach((span) => {
    const sync = () => span.setAttribute('data-text', span.textContent.trim());
    sync();
    new MutationObserver(sync).observe(span, {
      childList: true, characterData: true, subtree: true,
    });
  });

  /* И для ссылок внутри меню */
  document.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    const sync = () => link.setAttribute('data-text', link.textContent.trim());
    sync();
    new MutationObserver(sync).observe(link, {
      childList: true, characterData: true, subtree: true,
    });
  });
})();