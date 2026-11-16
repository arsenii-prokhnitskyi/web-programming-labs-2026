import { catalog } from './products.js';
import { startShop } from './shop.js';
startShop(() => Promise.resolve(catalog), { cartKey: 'web-lr10-cart' });
