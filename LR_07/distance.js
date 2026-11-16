export function degreesToRadians(degrees) { return degrees * Math.PI / 180; }
export function computeDistance(startCoords, destCoords) {
  for (const coords of [startCoords, destCoords]) {
    if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude) || Math.abs(coords.latitude) > 90 || Math.abs(coords.longitude) > 180) throw new Error('Некоректні координати.');
  }
  if (startCoords.latitude === destCoords.latitude && startCoords.longitude === destCoords.longitude) return 0;
  const startLat = degreesToRadians(startCoords.latitude); const destLat = degreesToRadians(destCoords.latitude);
  const deltaLong = degreesToRadians(startCoords.longitude - destCoords.longitude);
  const cosine = Math.sin(startLat) * Math.sin(destLat) + Math.cos(startLat) * Math.cos(destLat) * Math.cos(deltaLong);
  return Math.acos(Math.min(1, Math.max(-1, cosine))) * 6371;
}
