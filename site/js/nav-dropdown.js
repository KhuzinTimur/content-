/**
 * nav-dropdown.js — открытие/закрытие выпадающего списка «Projects».
 *
 * Раньше открытие висело на CSS :hover. Из-за этого клик по триггеру
 * «не закрывал» меню: пока курсор остаётся на триггере, правило :hover
 * держало меню открытым, что бы JS ни делал. Теперь весь hover перенесён
 * сюда: mouseenter открывает, mouseleave (с небольшой задержкой) закрывает,
 * клик переключает, клик вне — закрывает, Escape — закрывает.
 */

(function () {
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;

  const trigger = dropdown.querySelector('.nav-dropdown-trigger');
  if (!trigger) return;

  const isTouch = window.matchMedia('(hover: none)').matches;
  let hoverTimer = null;

  function open()  { trigger.setAttribute('aria-expanded', 'true'); }
  function close() { trigger.setAttribute('aria-expanded', 'false'); }
  function isOpen() { return trigger.getAttribute('aria-expanded') === 'true'; }

  // Ховер — только на устройствах с настоящей мышью.
  if (!isTouch) {
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      open();
    });

    dropdown.addEventListener('mouseleave', () => {
      // Небольшая задержка — если курсор «чиркнул» по краю и вернулся,
      // меню не мигнёт.
      hoverTimer = setTimeout(close, 120);
    });
  }

  // Клик по триггеру:
  // - на тач-устройствах — тумблер меню (ссылка не срабатывает)
  // - на десктопе с мышью — обычный переход по ссылке (меню открывается по hover)
  trigger.addEventListener('click', (e) => {
    if (isTouch) {
      e.preventDefault();
      isOpen() ? close() : open();
    }
    // else — позволяем браузеру перейти по href
  });

  // Клик вне — закрыть.
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) close();
  });

  // Escape — закрыть.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Клик по пункту меню — сразу закрываем (навигация и так произойдёт).
  dropdown.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    link.addEventListener('click', close);
  });
  
    /* --- Синхронизация data-text для underline-эффекта ---
     i18n перезаписывает textContent ссылок, поэтому data-text надо
     обновлять после каждой смены языка. MutationObserver ловит это сам. */
  const navLinks = document.querySelectorAll('.nav-links > li > a');
  const syncDataText = (el) => el.setAttribute('data-text', el.textContent.trim());

  navLinks.forEach((a) => {
    syncDataText(a);
    new MutationObserver(() => syncDataText(a)).observe(a, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });

    /* То же самое для триггера «Проекты» — ставим data-text на его span */
  const triggerSpan = document.querySelector('.nav-dropdown-trigger > span[data-i18n]');
  if (triggerSpan) {
    const syncTriggerText = () => triggerSpan.setAttribute('data-text', triggerSpan.textContent.trim());
    syncTriggerText();
    new MutationObserver(syncTriggerText).observe(triggerSpan, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  
    /* Ссылки внутри dropdown — тот же приём для подчёркивания при hover */
  dropdown.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    const sync = () => link.setAttribute('data-text', link.textContent.trim());
    sync();
    new MutationObserver(sync).observe(link, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });
})();