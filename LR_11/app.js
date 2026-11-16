'use strict';
const header = document.querySelector('header'); const section = document.querySelector('section');
function populateHeader(data) {
  const heading = document.createElement('h1'); heading.textContent = data.squadName;
  const paragraph = document.createElement('p'); paragraph.textContent = `Hometown: ${data.homeTown} // Formed: ${data.formed}`;
  header.replaceChildren(heading, paragraph);
}
function showHeroes(data) {
  section.replaceChildren();
  for (const hero of data.members) {
    const article = document.createElement('article'); const heading = document.createElement('h2'); heading.textContent = hero.name;
    const identity = document.createElement('p'); identity.textContent = `Secret identity: ${hero.secretIdentity}`;
    const age = document.createElement('p'); age.textContent = `Age: ${hero.age}`;
    const powersTitle = document.createElement('p'); powersTitle.textContent = 'Superpowers:';
    const list = document.createElement('ul');
    for (const power of hero.powers) { const item = document.createElement('li'); item.textContent = power; list.append(item); }
    article.append(heading, identity, age, powersTitle, list); section.append(article);
  }
}
const request = new XMLHttpRequest();
request.open('GET', 'https://semegenkep.github.io/json/example.json'); request.responseType = 'json'; request.timeout = 15000;
const loading = document.createElement('p'); loading.textContent = 'Loading JSON…'; header.append(loading);
function showError(message) { const error = document.createElement('p'); error.setAttribute('role', 'alert'); error.textContent = message; header.replaceChildren(error); }
request.onload = () => {
  if (request.status < 200 || request.status >= 300) { showError(`HTTP error: ${request.status}`); return; }
  const data = request.response;
  if (!data || typeof data.squadName !== 'string' || !Array.isArray(data.members) || data.members.some(hero => !Array.isArray(hero.powers))) { showError('Invalid JSON data'); return; }
  console.log('superHeroes:', data); populateHeader(data); showHeroes(data);
};
request.onerror = () => showError('Network error. Check your connection and reload.');
request.ontimeout = () => showError('The JSON request timed out. Reload to retry.');
request.send();
