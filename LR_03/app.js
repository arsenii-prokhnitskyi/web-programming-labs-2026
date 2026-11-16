import { getFullName, checkGrade, calculateTip } from './functions.js';
function askText(question) {
  const value = prompt(question); if (value === null) return null;
  if (!value.trim()) throw new Error('Текст не може бути порожнім.');
  return value.trim();
}
function askNumber(question, max, integer = true) {
  const text = askText(question); if (text === null) return null;
  const value = Number(text.replace(',', '.'));
  if (!Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) throw new Error('Введено некоректне число.');
  return value;
}
function run(button, result, action) {
  document.querySelector(button).addEventListener('click', () => {
    try { action(); } catch (error) { document.querySelector(result).textContent = error.message; }
  });
}
function showGreeting(fullName, age) { document.querySelector('#greeting-result').textContent = `Hello, ${fullName}! You are ${age} years old.`; }
run('#greeting', '#greeting-result', () => {
  const firstName = askText("Ім'я:"); if (firstName === null) return;
  const lastName = askText('Прізвище:'); if (lastName === null) return;
  const age = askNumber('Вік:', 130); if (age === null) return;
  showGreeting(getFullName(firstName, lastName), age);
});
// Однакові назви showResult із двох вправ ізольовано у різних блоках.
{
  function getStudentInfo() {
    const name = askText("Ім'я студента:"); if (name === null) return null;
    const score = askNumber('Бал (0–12):', 12); return score === null ? null : { name, score };
  }
  function showResult(name, grade) { document.querySelector('#grade-result').textContent = `Student: ${name}\nGrade: ${grade}`; }
  run('#grade', '#grade-result', () => { const student = getStudentInfo(); if (student) showResult(student.name, checkGrade(student.score)); });
}
{
  function showResult(amount, tip) {
    const money = value => value.toFixed(2);
    document.querySelector('#tip-result').textContent = `Bill: ${money(amount)} грн\nTip (10%): ${money(tip)} грн\nTotal: ${money(amount + tip)} грн`;
  }
  run('#tip', '#tip-result', () => { const amount = askNumber('Сума рахунку, грн:', 1e9, false); if (amount !== null) showResult(amount, calculateTip(amount)); });
}
