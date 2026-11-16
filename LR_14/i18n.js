import { startShop } from './shop.js';
export async function initializeCatalogue(engine) {
  const main = document.querySelector('main'); const status = document.querySelector('#shop-status'); const dialog = document.querySelector('#language-dialog');
  const selector = document.querySelector('#language'); const key = `web-lr14-${engine}-language`;
  let language;
  try { language = localStorage.getItem(key); } catch { language = null; }
  if (!['uk', 'en'].includes(language)) {
    dialog.addEventListener('cancel', event => event.preventDefault());
    language = await new Promise(resolve => {
      dialog.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => { dialog.close(); resolve(button.dataset.language); }, { once: true }));
      dialog.showModal();
    });
    try { localStorage.setItem(key, language); } catch { /* Каталог працює, але браузер не дозволяє зберегти вибір. */ }
  }
  try {
    const resources = {};
    for (const lang of ['uk', 'en']) { const response = await fetch(`locales/${lang}.json`); if (!response.ok) throw new Error(`Translations HTTP ${response.status}`); resources[lang] = await response.json(); }
    let t;
    if (engine === 'i18next') {
      if (!globalThis.i18next) throw new Error('i18next not loaded');
      await i18next.init({ lng: language, fallbackLng: 'uk', resources: { uk: { translation: resources.uk }, en: { translation: resources.en } } });
      t = key => i18next.t(key);
    } else { t = key => resources[language][key] || key; }
    document.documentElement.lang = language; selector.value = language;
    const shop = await startShop(async () => { const response = await fetch('products.json'); if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }, { cartKey: `web-lr14-${engine}-cart`, t, language: () => language });
    main.hidden = false;
    selector.addEventListener('change', async () => {
      language = selector.value; if (engine === 'i18next') await i18next.changeLanguage(language);
      document.documentElement.lang = language;
      try { localStorage.setItem(key, language); } catch { status.textContent = t('storageError'); }
      shop.render();
    });
  } catch (error) { main.hidden = false; status.textContent = 'Не вдалося завантажити переклади / Could not load translations.'; console.error(error.message); }
}
