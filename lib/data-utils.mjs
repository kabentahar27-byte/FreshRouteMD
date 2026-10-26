export const categories = [
  'Food Pantry',
  'Community Meal / Soup Kitchen',
  'SNAP-Authorized Retailer',
  'Grocery Store',
  'Farmers Market',
  'WIC Resource',
  'Food Distribution',
  'Youth/Summer Meals',
  'Senior Food Assistance',
  'Emergency Food Assistance',
  'Other Food Resource',
];
export function clean(v) {
  return v == null
    ? ''
    : String(v)
        .replace(/<[^>]*>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}
export function normalized(v) {
  return clean(v)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function normalizedAddress(v) {
  const aliases = {
    street: 'st',
    avenue: 'ave',
    road: 'rd',
    boulevard: 'blvd',
    drive: 'dr',
    lane: 'ln',
    court: 'ct',
    place: 'pl',
    north: 'n',
    south: 's',
    east: 'e',
    west: 'w',
    suite: 'ste',
  };
  return normalized(v)
    .split(' ')
    .map((x) => aliases[x] || x)
    .join(' ');
}
export function phoneKey(v) {
  return String(v || '')
    .split(/(?:ext\.?|option|x)\s*\d+/i)[0]
    .replace(/\D/g, '')
    .replace(/^1(?=\d{10}$)/, '');
}
export function milesBetween(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const h = Math.min(
    1,
    Math.max(
      0,
      Math.sin(rad(b[0] - a[0]) / 2) ** 2 +
        Math.cos(rad(a[0])) *
          Math.cos(rad(b[0])) *
          Math.sin(rad(b[1] - a[1]) / 2) ** 2,
    ),
  );
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export function validCoordinates(c) {
  return (
    Array.isArray(c) &&
    c.length === 2 &&
    c.every(Number.isFinite) &&
    c[0] >= 37.8 &&
    c[0] <= 39.8 &&
    c[1] >= -79.6 &&
    c[1] <= -75
  );
}
export function safeUrl(v) {
  try {
    const u = new URL(v);
    return ['https:', 'http:'].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export function quality(r, now = Date.now()) {
  const age = (d) => (d ? Math.floor((now - Date.parse(d)) / 86400000) : null);
  const verified = r.provenance
    .map((p) => p.date_last_verified)
    .filter(Boolean)
    .sort()
    .at(-1);
  const updated = r.provenance
    .map((p) => p.source_updated_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  const imported = r.provenance
    .map((p) => p.date_imported)
    .sort()
    .at(-1);
  if (verified && age(verified) <= 90) return 'Verified from source';
  if ((updated && age(updated) > 180) || age(imported) > 90)
    return 'Potentially outdated';
  if (age(imported) <= 30) return 'Recently imported';
  return 'Verification recommended';
}
function duplicateKeys(r) {
  return {
    mode: r.serviceMode,
    name: normalized(r.name),
    address: normalizedAddress(r.address),
    phone: phoneKey(r.phone),
    city: normalized(r.city),
    coordinates: r.coordinates,
  };
}
function reasonFromKeys(a, b) {
  if (a.mode !== b.mode) return null;
  const sameName = a.name && a.name === b.name,
    sameAddress = a.address && a.address === b.address,
    samePhone = a.phone.length === 10 && a.phone === b.phone;
  if (!sameName && !(sameAddress && samePhone)) return null;
  const near =
    a.coordinates &&
    b.coordinates &&
    milesBetween(a.coordinates, b.coordinates) < 0.06;
  if (sameName && sameAddress && (a.city === b.city || near))
    return 'name + normalized address';
  if (
    sameName &&
    samePhone &&
    (!a.address || !b.address) &&
    (!a.coordinates || !b.coordinates || near)
  )
    return 'name + phone';
  if (sameName && near) return 'name + coordinates within ~100 m';
  if (sameAddress && samePhone && (a.city === b.city || near))
    return 'address + phone';
  return null;
}
export function duplicateReason(a, b) {
  return reasonFromKeys(duplicateKeys(a), duplicateKeys(b));
}
export function deduplicate(input) {
  const records = [],
    merges = [],
    keys = [];
  const byName = new Map(),
    byAddressPhone = new Map();
  const addressKey = (k) => JSON.stringify([k.mode, k.address, k.phone]);
  function register(k, index) {
    const nameKey = JSON.stringify([k.mode, k.name]);
    if (k.name) {
      if (!byName.has(nameKey)) byName.set(nameKey, new Set());
      byName.get(nameKey).add(index);
    }
    if (k.address && k.phone.length === 10) {
      const ak = addressKey(k);
      if (!byAddressPhone.has(ak)) byAddressPhone.set(ak, new Set());
      byAddressPhone.get(ak).add(index);
    }
  }
  for (const row of input) {
    const rk = duplicateKeys(row);
    const candidates = new Set([
      ...(byName.get(JSON.stringify([rk.mode, rk.name])) || []),
      ...(byAddressPhone.get(addressKey(rk)) || []),
    ]);
    let match = null,
      reason = null,
      matchIndex = -1;
    // Stable order preserves the original first-match and provenance behavior.
    for (const index of [...candidates].sort((a, b) => a - b)) {
      reason = reasonFromKeys(keys[index], rk);
      if (reason) {
        match = records[index];
        matchIndex = index;
        break;
      }
    }
    if (!match) {
      const index = records.length;
      records.push(structuredClone(row));
      keys.push(rk);
      register(rk, index);
      continue;
    }
    merges.push({ kept: match.id, merged: row.id, reason });
    match.provenance.push(...row.provenance);
    match.resource_types = [
      ...new Set([...match.resource_types, ...row.resource_types]),
    ];
    match.services = [...new Set([...match.services, ...row.services])];
    for (const key of ['phone', 'hours', 'eligibility', 'coordinates'])
      if (!match[key] && row[key]) match[key] = row[key];
    match.conflicts ??= [];
    for (const key of ['address', 'hours', 'phone', 'eligibility'])
      if (
        match[key] &&
        row[key] &&
        normalized(match[key]) !== normalized(row[key])
      )
        match.conflicts.push({
          field: key,
          alternate: row[key],
          source_name: row.provenance[0].source_name,
        });
    keys[matchIndex] = duplicateKeys(match);
    register(keys[matchIndex], matchIndex);
  }
  return { records, merges };
}
export function validateResource(r) {
  if (
    !r ||
    !Array.isArray(r.resource_types) ||
    !Array.isArray(r.services) ||
    !Array.isArray(r.conflicts) ||
    !r.resource_types.every((c) => categories.includes(c)) ||
    !['in-person', 'online'].includes(r.serviceMode) ||
    !['id', 'name', 'description', 'city', 'zip', 'notes'].every(
      (k) => typeof r[k] === 'string',
    ) ||
    !['address', 'hours', 'eligibility', 'cost', 'phone'].every(
      (k) => r[k] === null || typeof r[k] === 'string',
    )
  )
    throw new Error('Invalid resource shape');
  if (!r.id || !clean(r.name) || !categories.includes(r.category))
    throw new Error('Invalid resource identity/type');
  if (r.coordinates && !validCoordinates(r.coordinates))
    throw new Error(`Invalid coordinates: ${r.id}`);
  if (!r.provenance?.length) throw new Error('Missing provenance');
  for (const p of r.provenance) {
    if (
      !p.source_name ||
      !safeUrl(p.source_url) ||
      !p.source_type ||
      !categories.includes(p.resource_type) ||
      !Number.isFinite(Date.parse(p.date_imported))
    )
      throw new Error(`Invalid provenance: ${r.id}`);
    if (p.date_last_verified && !p.verification_scope)
      throw new Error('Verification scope required');
  }
  return r;
}
export function directionsUrl(r) {
  return r.serviceMode === 'in-person' && r.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([r.address, r.city, 'MD', r.zip].filter(Boolean).join(', '))}`
    : null;
}
export function filterResources(
  data,
  {
    category = 'All resources',
    query = '',
    origin = [39.4195, -76.7803],
    radius = 25,
    service = 'all',
    sort = 'distance',
    withPhone = false,
  },
) {
  const q = normalized(query);
  return data
    .filter(
      (r) =>
        (category === 'All resources' || r.resource_types.includes(category)) &&
        (!q ||
          normalized(
            [r.name, r.address, r.city, r.zip, ...r.resource_types].join(' '),
          ).includes(q)) &&
        (!withPhone || !!r.phone) &&
        (service === 'all' || r.services.includes(service)) &&
        (!r.coordinates || milesBetween(origin, r.coordinates) <= radius),
    )
    .sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : (a.coordinates ? milesBetween(origin, a.coordinates) : Infinity) -
            (b.coordinates ? milesBetween(origin, b.coordinates) : Infinity) ||
          a.name.localeCompare(b.name),
    );
}
