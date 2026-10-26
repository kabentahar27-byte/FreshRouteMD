import assert from 'node:assert/strict';
import { recipes, equipment, ingredients } from '../lib/recipes.mjs';
import {
  identifyIngredient,
  evaluateRecipe,
  suggestRecipes,
  missingIngredients,
  scaleIngredients,
} from '../lib/meal-engine.mjs';
import {
  emptyPlan,
  migrateLegacy,
  isValidPlan,
  readPlan,
  PLAN_KEY,
  transferRecipe,
  canCombine,
  combineItems,
  groceryTotals,
  priceInCents,
} from '../lib/plan-model.mjs';
import {
  createDirectoryCache,
  applyDirectorySuccess,
  applyDirectoryFailure,
  DIRECTORY_TTL,
  MAX_STALE,
} from '../lib/directory-cache.mjs';
import { planText } from '../lib/plan-export.mjs';
import { filterResources, validateResource } from '../lib/data-utils.mjs';
let assertions = 0;
const check = (name, fn) => {
  fn();
  assertions++;
  console.log(`PASS ${name}`);
};
const oats = recipes.find((r) => r.id === 'banana-oats'),
  sandwich = recipes[0],
  salad = recipes[1],
  yogurt = recipes[3];
const all = {
  ...emptyPlan(),
  equipment: equipment.map((e) => e[0]),
  storage: ['refrigerator'],
};
check(
  'ingredient normalization is bilingual and never substitutes dry beans or plantains',
  () => {
    assert.equal(
      identifyIngredient('  CANNED   CHICKPEAS '),
      'canned-chickpeas',
    );
    assert.equal(identifyIngredient('Maíz enlatado'), 'canned-corn');
    assert.equal(identifyIngredient('dry chickpeas'), null);
    assert.equal(identifyIngredient('dried beans'), null);
    assert.equal(identifyIngredient('plantain'), null);
    assert.equal(identifyIngredient('almond yogurt'), null);
  },
);
check(
  'every method requires all tools, including distinct microwave-safe bowl',
  () => {
    for (const r of recipes)
      for (const m of r.methods) {
        const p = { ...all, equipment: m.equipment };
        assert.ok(evaluateRecipe(r, p).methods.some((x) => x.id === m.id));
        for (const tool of m.equipment)
          assert.ok(
            !evaluateRecipe(r, {
              ...p,
              equipment: m.equipment.filter((t) => t !== tool),
            }).methods.some((x) => x.id === m.id),
          );
      }
    assert.equal(
      evaluateRecipe(oats, { ...all, equipment: ['microwave', 'bowl'] })
        .compatible,
      false,
    );
  },
);
check('alternative instructions and storage restrictions apply', () => {
  assert.notDeepEqual(oats.methods[0].steps, oats.methods[1].steps);
  assert.equal(
    evaluateRecipe(yogurt, { ...all, storage: [] }).compatible,
    false,
  );
  assert.equal(evaluateRecipe(salad, { ...all, storage: [] }).compatible, true);
});
check(
  'known allergens exclude; product and cross-contact uncertainty remain',
  () => {
    assert.equal(
      evaluateRecipe(yogurt, { ...all, allergens: ['milk'] }).compatible,
      false,
    );
    assert.equal(
      evaluateRecipe(sandwich, { ...all, allergens: ['wheat'] }).compatible,
      false,
    );
    assert.equal(
      evaluateRecipe(salad, { ...all, allergens: ['sesame'] })
        .productInformationUnknown,
      true,
    );
    assert.ok(
      !suggestRecipes({ ...all, dietary: ['vegan'] }).some(
        (x) => x.recipe.id === yogurt.id,
      ),
    );
  },
);
check(
  'matching and ranking are deterministic and do not claim quantity sufficiency',
  () => {
    const p = { ...all, ingredients: ['rolled oats', 'banana', 'water'] };
    assert.deepEqual(missingIngredients(oats, 12, p.ingredients), []);
    assert.equal(suggestRecipes(p)[0].recipe.id, oats.id);
    assert.deepEqual(suggestRecipes(p), suggestRecipes(p));
    assert.equal(
      evaluateRecipe(salad, { ...all, ingredients: ['black beans'] }).have
        .length,
      0,
    );
  },
);
check('servings scale precisely without unit conversion', () => {
  assert.equal(scaleIngredients(oats, 3)[0].quantity, 1.5);
  assert.equal(
    scaleIngredients(sandwich, 3).find((i) => i.id === 'whole-wheat-bread')
      .quantity,
    6,
  );
  assert.equal(scaleIngredients(sandwich, 3)[0].unit, 'cup');
  for (const v of [0, -1, 1.5, NaN, Infinity, 13])
    assert.throws(() => scaleIngredients(oats, v));
});
check(
  'every recipe has coherent bilingual data, provenance and complete methods',
  () => {
    for (const r of recipes) {
      assert.ok(
        r.servings > 0 &&
          r.minutes > 0 &&
          r.name.en &&
          r.name.es &&
          r.description.es,
      );
      for (const i of r.ingredients)
        assert.ok(ingredients[i.id] && i.quantity > 0 && i.unit);
      for (const m of r.methods) {
        assert.ok(m.equipment.length >= 2 && m.steps.length >= 3);
        assert.ok(m.steps.every((s) => s.en.length > 30 && s.es.length > 30));
      }
    }
  },
);
check(
  'transfer excludes owned ingredients, preserves units and leaves prices and packages unknown',
  () => {
    const p = transferRecipe(
      { ...all, ingredients: ['banana'] },
      oats,
      2,
      'stove',
    );
    assert.equal(p.items.length, 2);
    assert.ok(
      p.items.every(
        (i) => i.price === '' && i.purchaseQuantity === '' && !i.acquired,
      ),
    );
    assert.equal(
      p.items.find((i) => i.ingredientId === 'rolled-oats').requirements[0]
        .quantity,
      1,
    );
    assert.equal(
      p.items.find((i) => i.ingredientId === 'water').requirements[0].unit,
      'cup',
    );
  },
);
check(
  'repeated transfer is idempotent, adjusts servings, preserves user values and names',
  () => {
    let p = transferRecipe(all, oats, 1, 'stove');
    p.items[0].price = '3.45';
    p.items[0].purchaseQuantity = '1';
    p.items[0].name = 'My oats brand';
    p.items[0].acquired = true;
    const again = transferRecipe(p, oats, 1, 'stove');
    assert.deepEqual(again, p);
    const scaled = transferRecipe(again, oats, 2, 'microwave');
    assert.equal(scaled.items.length, 3);
    assert.equal(scaled.items[0].price, '3.45');
    assert.equal(scaled.items[0].name, 'My oats brand');
    assert.equal(scaled.items[0].requirements[0].quantity, 1);
    assert.equal(scaled.items[0].acquired, true);
    assert.equal(
      new Set(scaled.items.map((i) => i.id)).size,
      scaled.items.length,
    );
  },
);
check(
  'different recipes combine compatible requirements without losing their origins',
  () => {
    let p = transferRecipe(all, sandwich, 2, 'no-cook');
    p = transferRecipe(p, salad, 2, 'no-cook');
    assert.equal(
      p.items.filter((i) => i.ingredientId === 'olive-oil').length,
      1,
    );
    assert.equal(
      p.items.find((i) => i.ingredientId === 'olive-oil').requirements.length,
      2,
    );
    const before = structuredClone(p);
    p = transferRecipe(p, sandwich, 4, 'no-cook');
    assert.equal(p.items.length, before.items.length);
    assert.equal(
      p.items
        .find((i) => i.ingredientId === 'olive-oil')
        .requirements.reduce((n, r) => n + r.quantity, 0),
      3,
    );
  },
);
const manual = (id, name, price, quantity, unit = 'package') => ({
  id,
  name,
  ingredientId: null,
  requirements: [],
  price,
  purchaseQuantity: quantity,
  purchaseUnit: unit,
  acquired: false,
});
check(
  'explicit combine rejects different products, units, prices and acquired states',
  () => {
    const a = manual('a', 'apples', '2', '.5', 'lb'),
      b = manual('b', 'Apples', '2', '1.25', 'lb');
    assert.ok(canCombine(a, b));
    assert.equal(combineItems([a, b], 'a', 'b')[0].purchaseQuantity, '1.75');
    for (const patch of [
      { name: 'pears' },
      { purchaseUnit: 'kg' },
      { price: '3' },
      { acquired: true },
    ])
      assert.ok(!canCombine(a, { ...b, ...patch }));
    assert.equal(
      combineItems([a, { ...b, purchaseQuantity: '' }], 'a', 'b').length,
      2,
    );
  },
);
check('currency is cents-precise with fractional purchase quantities', () => {
  const r = groceryTotals('10', [
    manual('a', 'A', '.10', '3'),
    manual('b', 'B', '.20', '2'),
    manual('c', 'C', '1.25', '.5'),
  ]);
  assert.equal(r.subtotalCents, 133);
  assert.equal(r.remainingCents, 867);
  assert.equal(r.complete, true);
  assert.equal(
    groceryTotals('1', [manual('a', 'A', '2', '1')]).remainingCents,
    -100,
  );
});
check(
  'blank is unknown; explicit zero is priced; invalid lines are excluded',
  () => {
    const r = groceryTotals('10', [
      manual('a', 'A', '', '1'),
      manual('b', 'B', '2', ''),
      manual('c', 'C', '0', '1'),
      manual('d', 'D', '2', '3'),
    ]);
    assert.equal(r.unpriced, 2);
    assert.equal(r.subtotalCents, 600);
    assert.equal(r.remainingCents, 400);
    assert.equal(r.complete, false);
    for (const n of [
      '',
      '-1',
      'NaN',
      'Infinity',
      '1e4',
      '1.001',
      '1000001',
      '1,000',
    ])
      assert.equal(priceInCents(n), null);
    for (const q of ['0', '-2', 'NaN', 'Infinity', '10001', '0.0001', '1e3']) {
      const r = groceryTotals('3', [manual('a', 'A', '1', q)]);
      assert.equal(r.unpriced, 1);
      assert.deepEqual(r.invalid, ['a']);
    }
    assert.equal(
      groceryTotals('100', [manual('a', 'A', '1000000', '2')]).overflow,
      true,
    );
  },
);
check(
  'migration preserves old budgets, fractional quantities, and supported preferences without rewriting storage',
  () => {
    const profile = {
      kitchenEquipment: ['Microwave', 'Mixing bowl'],
      foodStorage: ['Refrigerator'],
      dietaryPreferences: ['Vegan', 'Halal'],
      allergens: ['milk'],
      otherAllergy: 'Other label to check',
    };
    const budget = {
      budget: '42.50',
      items: [{ id: 3, name: 'Rice', price: '2.31', quantity: '1.5' }],
    };
    const before = JSON.stringify({ profile, budget });
    const migrated = migrateLegacy(profile, budget);
    assert.equal(migrated.budget, '42.50');
    assert.equal(migrated.items[0].purchaseQuantity, '1.5');
    assert.deepEqual(migrated.equipment, ['bowl', 'microwave']);
    assert.ok(migrated.reviewNotes.includes('Halal'));
    assert.equal(JSON.stringify({ profile, budget }), before);
    assert.ok(isValidPlan(migrated));
    const store = {
      getItem: (k) =>
        k === 'freshroute-budget-v1'
          ? JSON.stringify(budget)
          : k === 'freshroute-demo-profile-v1'
            ? JSON.stringify(profile)
            : null,
      setItem: () => assert.fail('read must not write'),
    };
    assert.deepEqual(readPlan(store).plan, migrated);
  },
);
check(
  'persisted state round-trips and malformed data is blocked, never overwritten',
  () => {
    const p = transferRecipe(all, oats, 3, 'stove');
    p.items[0].price = '2';
    p.items[0].purchaseQuantity = '1';
    const value = JSON.stringify(p);
    assert.deepEqual(
      readPlan({ getItem: (k) => (k === PLAN_KEY ? value : null) }).plan,
      p,
    );
    for (const bad of [
      '{',
      'null',
      '{}',
      JSON.stringify({ ...p, items: [{}] }),
    ])
      assert.equal(readPlan({ getItem: () => bad }).blocked, true);
  },
);
const resource = {
  id: 'test-source',
  name: 'Fixture only',
  category: 'Food Pantry',
  resource_types: ['Food Pantry'],
  services: [],
  description: 'Test record; never shipped as data',
  address: 'Fixture street',
  city: 'Baltimore',
  zip: '21201',
  coordinates: [39.3, -76.6],
  coordinateQuality: 'source-provided',
  hours: null,
  eligibility: null,
  cost: null,
  phone: null,
  notes: 'Fixture',
  serviceMode: 'in-person',
  provenance: [
    {
      source_name: 'Test source',
      source_url: 'https://example.org/',
      source_record_id: '1',
      source_type: 'government-api',
      resource_type: 'Food Pantry',
      date_imported: '2026-10-23T12:00:00Z',
      date_last_verified: null,
      verification_scope: null,
      source_updated_at: null,
    },
  ],
  conflicts: [],
};
check('resource filtering preserves provenance and unknown fields', () => {
  validateResource(resource);
  const rows = filterResources([resource], {
    category: 'Food Pantry',
    radius: 250,
    origin: [39.3, -76.6],
  });
  assert.equal(rows[0], resource);
  assert.equal(rows[0].cost, null);
  assert.equal(filterResources(rows, { withPhone: true }).length, 0);
  assert.equal(filterResources(rows, { service: 'SNAP accepted' }).length, 0);
});
const base = {
  resources: [resource],
  selected: resource,
  sequence: 2,
  loading: true,
  error: false,
  stale: false,
  importedAt: resource.provenance[0].date_imported,
  selectionNotice: '',
};
check(
  'refresh preserves selection, tracks changes and explains disappeared records',
  () => {
    const snapshot = {
      resources: [{ ...resource, hours: 'New published hours' }],
      imported_at: '2026-10-23T13:00:00Z',
    };
    const s = applyDirectorySuccess(base, snapshot, 2);
    assert.equal(s.selected.id, resource.id);
    assert.equal(s.selected.hours, 'New published hours');
    assert.equal(s.selectionNotice, 'updated');
    const removed = applyDirectorySuccess(s, { ...snapshot, resources: [] }, 2);
    assert.equal(removed.selected.id, resource.id);
    assert.equal(removed.selectionNotice, 'missing');
    assert.equal(removed.resources.length, 0);
    assert.equal(removed.error, false);
  },
);
check(
  'failure retains results and details; late responses cannot replace newer state',
  () => {
    const failed = applyDirectoryFailure(base, 2);
    assert.equal(failed.resources, base.resources);
    assert.equal(failed.selected, resource);
    assert.equal(failed.stale, true);
    assert.equal(failed.error, true);
    assert.equal(applyDirectorySuccess(base, { resources: [] }, 1), base);
    assert.equal(applyDirectoryFailure(base, 1), base);
    assert.equal(
      applyDirectoryFailure({ ...base, resources: [] }, 2).stale,
      false,
    );
  },
);
check(
  'export includes complete recipe, incomplete prices, source dates, and unconfirmed questions in both languages',
  () => {
    const p = {
      ...transferRecipe(all, oats, 1, 'stove'),
      resources: [
        { ...resource, savedAt: '2026-10-23T13:00:00Z', checks: ['date'] },
      ],
    };
    for (const lang of ['en', 'es']) {
      const out = planText(p, lang);
      assert.ok(out.includes('https://example.org/'));
      assert.ok(out.includes('2026-10-23T12:00:00Z'));
      assert.ok(out.includes('[x]'));
      assert.ok(out.includes(lang === 'es' ? 'incompleto' : 'incomplete'));
      assert.ok(
        out.includes(
          lang === 'es' ? 'no son confirmaciones' : 'not confirmations',
        ),
      );
    }
  },
);
let time = Date.parse('2026-10-23T12:00:00Z'),
  calls = 0,
  fail = false,
  saved = null;
const read = createDirectoryCache(
  async () => {
    calls++;
    await Promise.resolve();
    if (fail) throw new Error('offline');
    return {
      schema_version: 2,
      resources: [resource],
      imported_at: new Date(time).toISOString(),
    };
  },
  {
    now: () => time,
    readSaved: async () => saved,
    writeSaved: async (s) => {
      saved = s;
    },
  },
);
await Promise.all([read(), read(), read()]);
assert.equal(calls, 1);
await read();
assert.equal(calls, 1);
time += DIRECTORY_TTL + 1;
fail = true;
const stale = await read();
assert.equal(stale.stale, true);
assert.equal(stale.resources.length, 1);
assert.equal(calls, 2);
await read();
assert.equal(calls, 2);
time += 60001;
fail = false;
assert.equal((await read()).stale, false);
assert.equal(calls, 3);
time += MAX_STALE + 1;
fail = true;
await assert.rejects(read(), /offline/);
console.log(
  'PASS cache coalescing, TTL, error backoff, stale fallback, recovery and expiry',
);
assertions++;
console.log(
  `${assertions} behavioral groups passed. No browser or user-testing claims are made.`,
);
