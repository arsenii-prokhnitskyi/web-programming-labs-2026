'use strict';
const input = document.querySelector('#new-task');
const formatter = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
input.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.isComposing) return;
  event.preventDefault(); const text = input.value.trim();
  if (!text) { document.querySelector('#status').textContent = 'Введіть текст завдання.'; return; }
  const item = document.createElement('li'); const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.setAttribute('aria-label', `Виконати: ${text}`);
  const label = document.createElement('span'); label.textContent = text;
  const time = document.createElement('time'); const now = new Date(); time.dateTime = now.toISOString(); time.textContent = formatter.format(now);
  checkbox.addEventListener('change', () => { item.classList.add('completed'); checkbox.remove(); });
  item.append(checkbox, label, time); document.querySelector('#tasks').append(item);
  input.value = ''; document.querySelector('#status').textContent = 'Завдання додано.';
});
