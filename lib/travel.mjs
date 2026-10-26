import { directionsUrl, filterResources } from './data-utils.mjs';
export const travelModes = [
  ['unspecified', 'Not specified', 'Sin especificar'],
  ['walking', 'Walking', 'A pie'],
  ['bicycling', 'Bicycle', 'Bicicleta'],
  ['transit', 'Public transportation', 'Transporte público'],
  ['driving', 'Car or ride', 'Automóvil o transporte de otra persona'],
];
export function travelDirections(resource, mode) {
  const raw = directionsUrl(resource);
  if (!raw) return null;
  const u = new URL(raw);
  if (travelModes.some((m) => m[0] === mode) && mode !== 'unspecified')
    u.searchParams.set('travelmode', mode);
  return u.href;
}
export function relevantResources(rows, filters, excluded = []) {
  return filterResources(rows, filters).filter((r) => !excluded.includes(r.id));
}
