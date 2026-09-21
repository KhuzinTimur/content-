/**
 * i18n.js — простой движок переводов без зависимостей.
 *
 * Как использовать в HTML:
 *   <span data-i18n="nav.home"></span>                — текст элемента
 *   <input data-i18n-placeholder="form.email">        — атрибут placeholder
 *   <a data-i18n-aria-label="cta.figma">               — атрибут aria-label
 *   <img data-i18n-alt="hero.photoAlt">                 — атрибут alt
 *
 * Словари: window.I18N_COMMON (общие) + window.I18N_SCENES (сцены проектов)
 * + window.I18N_PAGE (специфичные для страницы, задаются в i18n-<page>.js,
 * подключаемом ПЕРЕД i18n.js на конкретной странице).
 *
 * Язык хранится в localStorage под ключом "lang" ('ru' | 'en').
 * По умолчанию — 'ru' (основная аудитория проекта русскоязычная).
 */

(function () {
  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = 'ru';

  function buildDictionary(lang) {
    const common = (window.I18N_COMMON && window.I18N_COMMON[lang]) || {};
    const scenes = (window.I18N_SCENES && window.I18N_SCENES[lang]) || {};
    const page = (window.I18N_PAGE && window.I18N_PAGE[lang]) || {};
    return Object.assign({}, common, scenes, page);
  }

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'ru' ? stored : DEFAULT_LANG;
  }

  function translate(key, dict) {
    if (key in dict) return dict[key];
    console.warn('[i18n] Missing key:', key);
    return key;
  }

  function applyLang(lang) {
    const dict = buildDictionary(lang);
    document.documentElement.setAttribute('lang', lang);

    const allTargets = document.querySelectorAll(
      '[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-aria-label], [data-i18n-alt]'
    );

    // ВАЖНО: элементы внутри .project-scene (заголовок кейса, описание, CTA)
    // имеют собственную анимацию появления (см. project-scroll.css). Если
    // i18n навесит на них inline style="opacity: 1", он перебьёт CSS-анимацию
    // и текст станет виден сразу после загрузки страницы. Поэтому исключаем
    // их из фейд-обработки: переключение языка у них всё равно сработает,
    // просто без короткого мигания — у них своя анимация.
    const targets = Array.from(allTargets).filter(
      (el) => !el.closest('.project-scene')
    );

    // Короткий фейд-аут/фейд-ин на текстовых узлах — снимает ощущение
    // "дёрганья" при смене длины текста между RU/EN. Высота контейнеров
    // при этом фиксируется через CSS (min-height) там, где это критично.
    targets.forEach((el) => {
      el.style.transition = 'opacity 120ms ease';
      el.style.opacity = '0';
    });

    window.setTimeout(() => {
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = translate(el.getAttribute('data-i18n'), dict);
      });

      document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        el.innerHTML = translate(el.getAttribute('data-i18n-html'), dict);
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        el.setAttribute('placeholder', translate(el.getAttribute('data-i18n-placeholder'), dict));
      });

      document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
        el.setAttribute('aria-label', translate(el.getAttribute('data-i18n-aria-label'), dict));
      });

      document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
        el.setAttribute('alt', translate(el.getAttribute('data-i18n-alt'), dict));
      });

      targets.forEach((el) => { el.style.opacity = '1'; });
    }, 120);

    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.setAttribute('data-current-lang', lang);
      const label = btn.querySelector('[data-lang-label]');
      if (label) {
        label.textContent = translate(lang === 'ru' ? 'lang.ru' : 'lang.en', dict);
      }
    });

    document.querySelectorAll('[data-lang-set]').forEach((btn) => {
      const isActive = btn.getAttribute('data-lang-set') === lang;
      btn.setAttribute('data-active', isActive ? 'true' : 'false');
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function toggleLang() {
    const current = getLang();
    setLang(current === 'ru' ? 'en' : 'ru');
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLang());

    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleLang);
    });

    document.querySelectorAll('[data-lang-set]').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-set')));
    });
  });

  window.__i18n = { setLang, toggleLang, getLang };
})();