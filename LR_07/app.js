import { computeDistance } from './distance.js';
const ourCoords = { latitude: 48.94321, longitude: 24.73380 };
const location = document.querySelector('#location');
function displayLocation(position) {
  const { latitude, longitude, accuracy } = position.coords;
  location.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
  document.querySelector('#accuracy').textContent = `Точність: ${accuracy} м`;
  document.querySelector('#distance').textContent = `Відстань до коледжу: ${computeDistance(position.coords, ourCoords).toFixed(3)} км`;
}
function displayError(error) {
  const types = { 1: 'Доступ до геолокації відхилено користувачем.', 2: 'Місцезнаходження недоступне.', 3: 'Час очікування вичерпано.' };
  location.textContent = types[error.code] || 'Не вдалося визначити місцезнаходження.';
  document.querySelector('#accuracy').textContent = ''; document.querySelector('#distance').textContent = '';
}
function getMyLocation() {
  location.textContent = 'Визначення координат…';
  if (!navigator.geolocation) { location.textContent = 'Браузер не підтримує Geolocation API.'; return; }
  navigator.geolocation.getCurrentPosition(displayLocation, displayError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}
document.querySelector('#retry').addEventListener('click', getMyLocation);
getMyLocation();
