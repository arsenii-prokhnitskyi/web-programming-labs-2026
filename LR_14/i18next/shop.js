const uk = { cart: 'Корзина', quantityPrompt: 'Вкажіть кількість:', quantity: 'Кількість', add: 'Додати у корзину', cancel: 'Скасувати', added: 'Товар додано', goCart: 'Перейти у корзину', continue: 'Повернутись до покупок', empty: 'Корзина пуста', close: 'Закрити', selected: 'Ви обрали:', name: 'Назва товару', price: 'Ціна за од.', sum: 'Сума', actions: 'Дії', total: 'Разом до оплати:', pay: 'Оплатити', remove: 'Видалити', checkoutNote: 'Це навчальний кошик. Платіжна система не підключена; оплата не здійснюється.', loading: 'Завантаження каталогу…', loadError: 'Не вдалося завантажити каталог. Перевірте з’єднання і спробуйте оновити сторінку.', invalidQuantity: 'Введіть цілу кількість від 1 до 999.', storageError: 'Збереження кошика недоступне. Дозвольте сховище для цього сайту.', invalidData: 'Некоректні дані каталогу.' };
export async function startShop(loadCatalog, options) {
  const t = options.t || (key => uk[key] || key); const language = options.language || (() => 'uk');
  let catalog; let pendingProduct; let cart = {};
  const status = document.querySelector('#shop-status');
  const money = value => new Intl.NumberFormat(language() === 'en' ? 'en-US' : 'uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 2 }).format(value);
  function readCart() {
    try { const stored = JSON.parse(localStorage.getItem(options.cartKey) || '{}');
      if (stored && typeof stored === 'object' && !Array.isArray(stored)) for (const [id, qty] of Object.entries(stored)) if (Number.isSafeInteger(Number(id)) && Number.isInteger(qty) && qty >= 1 && qty <= 999) cart[id] = qty;
    } catch { cart = {}; }
  }
  function saveCart() { localStorage.setItem(options.cartKey, JSON.stringify(cart)); }
  function translateStatic() { document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); }); }
  function render() {
    translateStatic();
    if (!catalog) return;
    document.title = document.body.dataset.page === 'basket' ? t('cart') : options.t ? t('catalogTitle') : catalog.title;
    document.querySelector('#cart-link')?.setAttribute('aria-label', t('cart'));
    const title = document.querySelector('#catalog-title'); if (title) title.textContent = options.t ? t('catalogTitle') : catalog.title;
    const counter = document.querySelector('#cart-count'); if (counter) counter.textContent = Object.keys(cart).length;
    const products = document.querySelector('#products');
    if (products) {
      products.replaceChildren();
      for (const product of catalog.products) {
        const article = document.createElement('article'); article.className = 'product';
        const image = document.createElement('img'); image.src = product.image; image.alt = product.name; image.width = 280; image.height = 150;
        const name = document.createElement('h2'); name.textContent = product.name;
        const description = document.createElement('p'); description.textContent = language() === 'en' && product.descriptionEn ? product.descriptionEn : product.description;
        const price = document.createElement('p'); price.textContent = money(product.price);
        const button = document.createElement('button'); button.textContent = t('add'); button.dataset.productId = product.id;
        button.addEventListener('click', () => { pendingProduct = product; document.querySelector('#quantity').value = 1; document.querySelector('#quantity-error').textContent = ''; document.querySelector('#quantity-dialog').showModal(); });
        article.append(image, name, description, price, button); products.append(article);
      }
    }
    const body = document.querySelector('#basket-body');
    if (body) {
      body.replaceChildren(); let total = 0; let index = 0;
      for (const [id, quantity] of Object.entries(cart)) {
        const product = catalog.products.find(item => item.id === Number(id)); if (!product) continue;
        index += 1; total += product.price * quantity; const row = document.createElement('tr'); row.dataset.productId = id;
        for (const value of [index, product.name, money(product.price)]) { const td = document.createElement('td'); td.textContent = value; row.append(td); }
        const qtyCell = document.createElement('td'); const input = document.createElement('input'); input.type = 'number'; input.min = '1'; input.max = '999'; input.step = '1'; input.value = quantity; input.setAttribute('aria-label', `${t('quantity')}: ${product.name}`);
        input.addEventListener('change', () => {
          const value = Number(input.value);
          if (!Number.isInteger(value) || value < 1 || value > 999) { status.textContent = t('invalidQuantity'); input.value = quantity; return; }
          const old = cart[id]; cart[id] = value;
          try { saveCart(); status.textContent = ''; render(); } catch { cart[id] = old; input.value = old; status.textContent = t('storageError'); }
        }); qtyCell.append(input); row.append(qtyCell);
        const sum = document.createElement('td'); sum.textContent = money(product.price * quantity); row.append(sum);
        const actions = document.createElement('td'); const remove = document.createElement('button'); remove.textContent = t('remove'); remove.dataset.remove = id;
        remove.addEventListener('click', () => { const old = cart[id]; delete cart[id]; try { saveCart(); render(); } catch { cart[id] = old; status.textContent = t('storageError'); } }); actions.append(remove); row.append(actions); body.append(row);
      }
      document.querySelector('#total').textContent = money(total); if (index === 0) status.textContent = t('empty'); else status.textContent = '';
    }
  }
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  document.querySelector('#cart-link')?.addEventListener('click', event => { if (!Object.keys(cart).length) { event.preventDefault(); document.querySelector('#empty-dialog').showModal(); } });
  document.querySelector('#checkout')?.addEventListener('click', event => { event.preventDefault(); document.querySelector('#checkout-dialog').showModal(); });
  document.querySelector('#quantity-form')?.addEventListener('submit', event => {
    event.preventDefault(); const quantity = Number(document.querySelector('#quantity').value);
    if (!pendingProduct || !Number.isInteger(quantity) || quantity < 1 || quantity > 999) { document.querySelector('#quantity-error').textContent = t('invalidQuantity'); return; }
    const id = pendingProduct.id; const old = cart[id]; const next = (old || 0) + quantity;
    if (next > 999) { document.querySelector('#quantity-error').textContent = t('invalidQuantity'); return; }
    cart[id] = next;
    try { saveCart(); document.querySelector('#quantity-dialog').close(); render(); document.querySelector('#added-dialog').showModal(); }
    catch { if (old) cart[id] = old; else delete cart[id]; document.querySelector('#quantity-error').textContent = t('storageError'); }
  });
  status.textContent = t('loading');
  try {
    catalog = await loadCatalog();
    if (!catalog || typeof catalog.title !== 'string' || !Array.isArray(catalog.products)) throw new Error(t('invalidData'));
    const ids = new Set();
    for (const item of catalog.products) {
      if (!Number.isSafeInteger(item.id) || ids.has(item.id) || typeof item.name !== 'string' || !Number.isFinite(item.price) || item.price < 0 || typeof item.image !== 'string' || typeof item.description !== 'string') throw new Error(t('invalidData'));
      ids.add(item.id);
    }
    readCart(); for (const id of Object.keys(cart)) if (!ids.has(Number(id))) delete cart[id];
    status.textContent = ''; render();
  } catch (error) { status.textContent = t('loadError'); console.error('Каталог:', error.message); }
  return { render };
}
