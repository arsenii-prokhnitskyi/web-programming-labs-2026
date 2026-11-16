'use strict';
document.querySelector('#name').addEventListener('click', () => {
  const userName = prompt("Введіть ім'я:");
  if (userName === null) return;
  if (!userName.trim()) { document.querySelector('#name-result').textContent = "Ім'я не може бути порожнім."; return; }
  const message = `Hello, ${userName.trim()}! Welcome to JavaScript`;
  alert(message); document.querySelector('#name-result').textContent = message;
});
document.querySelector('#age').addEventListener('click', () => {
  const input = prompt('Ваш вік (повних років):');
  if (input === null) return;
  const age = Number(input);
  if (!input.trim() || !Number.isInteger(age) || age < 0 || age > 130) {
    document.querySelector('#age-result').textContent = 'Введіть цілий вік від 0 до 130.'; return;
  }
  const currentYear = new Date().getFullYear();
  const message = `You were born in ${currentYear - age}`;
  alert(message); document.querySelector('#age-result').textContent = message;
});
document.querySelector('#full-name').addEventListener('click', () => {
  const firstName = prompt("Ім'я:"); if (firstName === null) return;
  const lastName = prompt('Прізвище:'); if (lastName === null) return;
  if (!firstName.trim() || !lastName.trim()) { document.querySelector('#full-name-result').textContent = 'Обидва поля обов’язкові.'; return; }
  const concatenation = 'Your full name is ' + firstName.trim() + ' ' + lastName.trim();
  const template = `Your full name is ${firstName.trim()} ${lastName.trim()}`;
  console.log(concatenation); console.log(template);
  document.querySelector('#full-name-result').textContent = concatenation + '\n' + template;
});
