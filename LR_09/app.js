const button = document.querySelector('#run'); const loader = document.querySelector('#loader'); const result = document.querySelector('#result');
export function helloPromise() { return new Promise(resolve => setTimeout(() => resolve('Hello, World!'), 2000)); }
export async function showPromise(promiseFactory = helloPromise) {
  button.disabled = true; result.textContent = ''; loader.style.display = 'block';
  try { result.textContent = await promiseFactory(); }
  catch (error) { result.textContent = `Помилка: ${error.message || error}`; }
  finally { loader.style.display = 'none'; button.disabled = false; }
}
button.addEventListener('click', () => showPromise());
