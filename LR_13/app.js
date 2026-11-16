import { startShop } from './shop.js';
async function loadCatalog() {
  const response = await fetch('products.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
startShop(loadCatalog, { cartKey: 'web-lr13-cart' });
