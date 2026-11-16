export function validateConfig(config) {
  if (!config.courseTopic?.trim()) throw new Error('Вкажіть затверджену тему курсового у config.js.');
  let url; try { url = new URL(config.projectUrl); } catch { throw new Error('Вкажіть реальний Project URL у config.js.'); }
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.supabase.co')) throw new Error('Потрібен HTTPS Project URL власного Supabase-проєкту.');
  if (!config.publishableKey?.startsWith('sb_publishable_') || config.publishableKey.length < 25) throw new Error('Потрібен Publishable key формату sb_publishable_. Secret/service_role заборонені.');
  if (!/^[a-z][a-z0-9_]*$/.test(config.table)) throw new Error('Некоректна назва таблиці.');
}
