/**
 * theme.js — переключение светлой/тёмной темы.
 * Тема хранится в localStorage под ключом "theme" ('light' | 'dark').
 * Если пользователь ещё не выбирал — берём системную настройку (prefers-color-scheme).
 */

(function () {
  const STORAGE_KEY = 'theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleUI(theme);
  }

  function updateToggleUI(theme) {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach((btn) => {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('data-current-theme', theme);
    });
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Применяем тему как можно раньше (см. также инлайн-скрипт в <head>,
  // который делает это до первой отрисовки, чтобы не мигало).
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleUI(document.documentElement.getAttribute('data-theme') || 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  // Экспортируем на всякий случай для отладки / ручного вызова
  window.__theme = { setTheme, toggleTheme, getPreferredTheme };
})();
