import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fetchLiveResources } from '../lib/live-resources.mjs';
import { deduplicate } from '../lib/data-utils.mjs';
const fixture = JSON.parse(
  fs.readFileSync(new URL('../data/source-snapshot.json', import.meta.url)),
);
const original = globalThis.fetch;
try {
  globalThis.fetch = async (input, options) => {
    const u = new URL(input);
    if (options?.body) u.search = options.body.toString();
    const county = u.hostname.startsWith('bcgisapps');
    const all = county ? fixture.countyRows : fixture.snapRows;
    const ids = u.searchParams.get('objectIds');
    const features = ids ? ids.split(',').map((id) => all[Number(id)]) : all;
    const payload = u.searchParams.get('returnIdsOnly')
      ? { objectIds: all.map((_, i) => i) }
      : u.pathname.endsWith('/query')
        ? { features }
        : county
          ? {}
          : fixture.snapMeta;
    return Response.json(payload);
  };
  const started = performance.now();
  const first = await fetchLiveResources();
  const elapsed = performance.now() - started;
  assert.ok(
    first.resources.length > 1000,
    'Exercise the complete source catalog',
  );
  assert.ok(elapsed < 15000, `Full catalog import took ${elapsed}ms`);
  console.log(
    `Full catalog: ${first.resources.length} resources in ${Math.round(elapsed)}ms including source pacing.`,
  );
  assert.equal(first.schema_version, 2);
  assert.ok(first.resources.length > 0);
  for (const r of first.resources) {
    assert.equal(r.provenance[0].date_imported, first.imported_at);
    assert.ok(r.provenance[0].source_record_id);
    assert.equal(r.provenance[0].date_last_verified, null);
    assert.equal(r.inventory, undefined);
    assert.equal(r.price, undefined);
    assert.ok(!r.name.includes('demo'));
  }
  const base = first.resources[0];
  const record = (id, overrides = {}) => ({
    ...structuredClone(base),
    id,
    name: 'Test pantry',
    address: '10 Main Street',
    city: 'Test city',
    phone: null,
    coordinates: null,
    ...overrides,
  });
  const result = deduplicate([
    record('first'),
    record('adds-phone', { address: '10 Main St', phone: '410-555-0100' }),
    record('alternate-name', { name: 'Alternate name', phone: '410-555-0100' }),
    record('different-place', { address: '20 Main St' }),
    record('online', { serviceMode: 'online' }),
    record('near-one', {
      name: 'Nearby pantry',
      address: null,
      coordinates: [39.4, -76.7],
    }),
    record('near-two', {
      name: 'Nearby pantry',
      address: null,
      coordinates: [39.40001, -76.7],
    }),
  ]);
  assert.deepEqual(
    result.records.map((r) => r.id),
    ['first', 'different-place', 'online', 'near-one'],
  );
  assert.deepEqual(
    result.merges.map((m) => [m.kept, m.merged]),
    [
      ['first', 'adds-phone'],
      ['first', 'alternate-name'],
      ['near-one', 'near-two'],
    ],
  );
  assert.equal(result.records[0].provenance.length, base.provenance.length * 3);
  assert.equal(result.records[0].phone, '410-555-0100');
  console.log(
    'Indexed duplicate matching preserves merged fields, provenance, service boundaries and first-match ordering.',
  );
  globalThis.fetch = async () => new Response('unavailable', { status: 503 });
  await assert.rejects(fetchLiveResources(), /HTTP 503/);
  globalThis.fetch = async () =>
    Response.json({ objectIds: [1, 2], features: [] });
  await assert.rejects(fetchLiveResources(), /Incomplete/);
  console.log(
    'Live source mapping, provenance, no stock claims, and failure handling passed.',
  );
} finally {
  globalThis.fetch = original;
}
