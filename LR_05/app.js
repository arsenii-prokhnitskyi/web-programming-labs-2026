'use strict';
function initTemperature() {
  const fahrenheit = document.querySelector('#fahrenheit'); const celsius = document.querySelector('#celsius');
  function convert(source, target, calculate) {
    const text = source.value.trim().replace(',', '.'); const value = Number(text);
    if (!text) { target.value = ''; document.querySelector('#temperature-status').textContent = ''; return; }
    if (!Number.isFinite(value)) { document.querySelector('#temperature-status').textContent = 'Введіть число.'; return; }
    target.value = String(Number(calculate(value).toFixed(4))); document.querySelector('#temperature-status').textContent = '';
  }
  fahrenheit.addEventListener('input', () => convert(fahrenheit, celsius, f => 5 / 9 * (f - 32)));
  celsius.addEventListener('input', () => convert(celsius, fahrenheit, c => c * 9 / 5 + 32));
}
function initQuiz(id, radio) {
  const container = document.querySelector(id); let product = 0; let answered = false; let total = 0; let correct = 0;
  function showScore() { container.querySelector('.score').textContent = `Загальний рахунок ${total ? Math.round(correct / total * 100) : 0}% (${correct} правильних відповідей з ${total})`; }
  function check(value) {
    if (answered) return;
    if (String(value).trim() === '' || !Number.isInteger(Number(value))) { container.querySelector('.feedback').textContent = 'Введіть ціле число.'; return; }
    answered = true; total += 1;
    const success = Number(value) === product; if (success) correct += 1;
    container.querySelector('.feedback').textContent = success ? 'Правильно!' : `Помилка, правильна відповідь «${product}».`;
    container.querySelectorAll('input, .check').forEach(input => { input.disabled = true; }); showScore();
  }
  function nextQuestion() {
    answered = false; const a = 2 + Math.floor(Math.random() * 8); const b = 2 + Math.floor(Math.random() * 8); product = a * b;
    container.querySelector('.question').textContent = `${a} × ${b} =`;
    container.querySelector('.feedback').textContent = '';
    if (radio) {
      const answers = new Set([product]); while (answers.size < 4) answers.add(1 + Math.floor(Math.random() * 81));
      const shuffled = [...answers]; for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
      const options = container.querySelector('.options'); options.replaceChildren();
      for (const value of shuffled) {
        const label = document.createElement('label'); const input = document.createElement('input');
        input.type = 'radio'; input.name = 'multiplication-option'; input.value = value;
        input.addEventListener('change', () => check(input.value)); label.append(input, document.createTextNode(String(value))); options.append(label);
      }
    } else {
      const input = container.querySelector('.answer'); input.value = ''; input.disabled = false; container.querySelector('.check').disabled = false;
    }
  }
  container.querySelector('.next').addEventListener('click', nextQuestion);
  if (!radio) container.querySelector('.check').addEventListener('click', () => check(container.querySelector('.answer').value));
  showScore(); nextQuestion();
}
function initPhotoRotator(divId, imagesArray) {
  const container = document.getElementById(divId); let index = 0;
  const counter = document.createElement('p'); const row = document.createElement('div'); row.className = 'photo-row';
  const previous = document.createElement('a'); previous.href = '#'; previous.textContent = 'Назад';
  const next = document.createElement('a'); next.href = '#'; next.textContent = 'Вперед';
  const image = document.createElement('img'); image.width = 600; image.height = 360;
  const title = document.createElement('h3'); const description = document.createElement('p');
  row.append(previous, image, next); container.append(counter, row, title, description);
  function render() {
    const item = imagesArray[index]; image.src = item.path; image.alt = item.title;
    counter.textContent = `Фотографія ${index + 1} з ${imagesArray.length}`; title.textContent = item.title; description.textContent = item.description;
    previous.hidden = index === 0; next.hidden = index === imagesArray.length - 1;
  }
  previous.addEventListener('click', event => { event.preventDefault(); if (index > 0) { index -= 1; render(); } });
  next.addEventListener('click', event => { event.preventDefault(); if (index < imagesArray.length - 1) { index += 1; render(); } });
  render();
}
function initCaptcha(digitCount) {
  if (!Number.isInteger(digitCount) || digitCount < 1 || digitCount > 8) throw new Error('Кількість цифр має бути цілим числом від 1 до 8.');
  const patterns = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'];
  let number = ''; const container = document.querySelector('#captcha-image'); container.replaceChildren();
  for (let i = 0; i < digitCount; i++) {
    const digit = String(Math.floor(Math.random() * 10)); number += digit;
    const block = document.createElement('span'); block.className = 'digit';
    for (const bit of patterns[Number(digit)]) { const pixel = document.createElement('span'); pixel.className = bit === '1' ? 'pixel on' : 'pixel'; block.append(pixel); }
    container.append(block);
  }
  document.querySelector('#captcha-form').addEventListener('submit', event => {
    event.preventDefault(); const value = document.querySelector('#captcha-input').value.trim();
    document.querySelector('#captcha-result').textContent = value === number ? 'Правильно!' : 'Помилка';
  });
}
initTemperature(); initQuiz('#quiz-text', false); initQuiz('#quiz-radio', true);
initPhotoRotator('rotator', [
  { path: 'images/shoe-1.jpg', title: 'Червоні кросівки', description: 'Спортивне взуття для активного відпочинку.' },
  { path: 'images/shoe-2.jpg', title: 'Класичні спортивні кросівки', description: 'Зручна модель спортивного взуття.' },
  { path: 'images/shoe-3.jpg', title: 'Кросівки для тренувань', description: 'Легка модель для щоденної активності.' }
]);
initCaptcha(3);
