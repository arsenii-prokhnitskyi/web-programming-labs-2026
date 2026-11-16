'use strict';
document.querySelector('#greet').addEventListener('click', () => {
  const fullName = document.querySelector('#full-name').value.trim();
  if (!fullName) { document.querySelector('#greeting').textContent = "Введіть своє прізвище та ім'я."; return; }
  alert('Натисніть «ОК», щоб побачити привітання.');
  document.querySelector('#greeting').textContent = `Hello, ${fullName}!`;
});
document.querySelector('#confirm').addEventListener('click', () => {
  const accepted = confirm('Оберіть «ОК» або «Відміна».');
  document.querySelector('#choice').textContent = accepted ? 'Натиснуто «ОК».' : 'Натиснуто «Відміна».';
});
const number = 12 % 10;
for (let multiplier = 1; multiplier <= 10; multiplier += 1) {
  const row = document.createElement('tr');
  for (const text of [`${number} × ${multiplier}`, number * multiplier]) {
    const cell = document.createElement('td'); cell.textContent = text; row.append(cell);
  }
  document.querySelector('#multiplication').append(row);
}
