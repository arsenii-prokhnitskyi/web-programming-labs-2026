import { config } from './config.js';
import { validateConfig } from './config-validation.js';
const status = document.querySelector('#status'); const list = document.querySelector('#items');
// Спільний шлях відображення успішної відповіді, включно з порожньою вибіркою.
export async function showProjects(query) {
  status.textContent = 'Завантаження…';
  const { data, error } = await query;
  if (error) throw error;
  list.replaceChildren();
  for (const row of data || []) { const item = document.createElement('li'); item.textContent = `${row.title} — ${row.details}`; list.append(item); }
  status.textContent = data?.length ? `Знайдено записів: ${data.length}` : 'Записів немає.';
  return data;
}
async function start() {
  try {
    document.querySelector('#topic').textContent = config.courseTopic; validateConfig(config);
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const db = createClient(config.projectUrl, config.publishableKey);
    await showProjects(db.from(config.table).select('id, title, details').order('id', { ascending: true }));
  } catch (error) { status.textContent = `Підключення не виконано: ${error.message}`; }
}
start();
