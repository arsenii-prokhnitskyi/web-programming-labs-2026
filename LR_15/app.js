import { config } from './config.js';
import { validateConfig } from './config-validation.js';
const $ = selector => document.querySelector(selector);
let db; let isAdmin = false;
async function loadItems() {
  $('#status').textContent = 'Завантаження…'; $('#items').replaceChildren();
  try {
    const { data, error } = await db.from(config.table).select('id, title, details').order('id', { ascending: true });
    if (error) throw error;
    for (const row of data || []) { const item = document.createElement('li'); item.textContent = `${row.title} — ${row.details}`; $('#items').append(item); }
    $('#status').textContent = data?.length ? `Знайдено записів: ${data.length}` : 'Записів немає.';
  } catch { $('#status').textContent = 'Не вдалося отримати записи. Перевірте доступ і з’єднання.'; }
}
async function updateAuthState() {
  isAdmin = false; $('#admin-panel').hidden = true; $('#item-form').reset();
  try {
    const { data, error } = await db.auth.getUser();
    if (error || !data.user) { $('#login-form').hidden = false; $('#user-panel').hidden = true; $('#auth-status').textContent = 'Вхід не виконано.'; }
    else {
      $('#login-form').hidden = true; $('#user-panel').hidden = false; $('#user-info').textContent = data.user.email;
      const role = await db.rpc('check_admin');
      if (role.error) throw role.error;
      isAdmin = role.data === true; $('#admin-panel').hidden = !isAdmin;
      $('#auth-status').textContent = isAdmin ? 'Виконано вхід адміністратора.' : 'Виконано вхід звичайного користувача.';
    }
  } catch { $('#auth-status').textContent = 'Не вдалося перевірити роль. Зміни заборонені.'; }
  await loadItems();
}
$('#login-form').addEventListener('submit', async event => {
  event.preventDefault(); const button = event.currentTarget.querySelector('button'); button.disabled = true;
  try {
    const { error } = await db.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#password').value });
    if (error) throw error;
    $('#login-form').reset(); await updateAuthState();
  } catch { $('#auth-status').textContent = 'Вхід не виконано. Перевірте email, пароль і з’єднання.'; }
  finally { button.disabled = false; }
});
$('#logout').addEventListener('click', async () => {
  isAdmin = false; $('#admin-panel').hidden = true;
  try { const { error } = await db.auth.signOut(); if (error) throw error; await updateAuthState(); }
  catch { $('#auth-status').textContent = 'Не вдалося завершити сеанс. Спробуйте ще раз.'; }
});
$('#item-form').addEventListener('submit', async event => {
  event.preventDefault(); if (!isAdmin) return;
  const title = $('#title').value.trim(); const details = $('#details').value.trim();
  if (!title || title.length > 150 || !details || details.length > 300) { $('#form-status').textContent = 'Перевірте обов’язкові поля та довжину.'; return; }
  const button = event.currentTarget.querySelector('button'); button.disabled = true;
  try {
    const { error } = await db.from(config.table).insert({ title, details }); if (error) throw error;
    $('#item-form').reset(); await loadItems(); $('#form-status').textContent = 'Запис додано.';
  } catch { $('#form-status').textContent = 'Запис не додано. Перевірте RLS та з’єднання.'; }
  finally { button.disabled = false; }
});
async function start() {
  try {
    $('#topic').textContent = config.courseTopic;
    $('#title-label').textContent = config.titleLabel; $('#details-label').textContent = config.detailsLabel; validateConfig(config);
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    db = createClient(config.projectUrl, config.publishableKey); await updateAuthState();
  } catch (error) { $('#auth-status').textContent = `Підключення не виконано: ${error.message}`; }
}
start();
