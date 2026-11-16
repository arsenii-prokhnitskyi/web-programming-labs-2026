export function getFullName(firstName, lastName) { return `${firstName.trim()} ${lastName.trim()}`; }
export function checkGrade(score) {
  if (!Number.isInteger(score) || score < 0 || score > 12) throw new Error('Бал має бути цілим числом від 0 до 12.');
  if (score >= 10) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 4) return 'Satisfactory';
  return 'Fail';
}
export function calculateTip(amount, percent = 10) {
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(percent) || percent < 0) throw new Error('Некоректна сума або відсоток.');
  return Math.round((amount * percent / 100 + Number.EPSILON) * 100) / 100;
}
