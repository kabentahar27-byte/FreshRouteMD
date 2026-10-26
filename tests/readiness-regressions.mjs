import assert from 'node:assert/strict';
import { recipes, equipment } from '../lib/recipes.mjs';
import {
  emptyPlan,
  PLAN_KEY,
  previousPlanKey,
  readPlan,
  isValidPlan,
  transferRecipe,
  removeMeal,
  canCombine,
  groceryTotals,
} from '../lib/plan-model.mjs';
import {
  evaluateRecipe,
  suggestRecipes,
  preparationMinutes,
} from '../lib/meal-engine.mjs';
import { quoteFor, estimateGroceries } from '../lib/price-estimates.mjs';
import { positiveAmount } from '../lib/money.mjs';
import { packageCoverage, savedMealReview } from '../lib/plan-review.mjs';
import { travelDirections, relevantResources } from '../lib/travel.mjs';
import { planText } from '../lib/plan-export.mjs';
let count = 0;
const check = (name, fn) => {
  fn();
  count++;
  console.log(`PASS ${name}`);
};
const all = () => ({
  ...emptyPlan(),
  equipment: equipment.map((e) => e[0]),
  storage: ['refrigerator'],
});
const [sandwich, salad, oats, yogurt] = recipes;
check(
  'recovering from the budget filter preserves allergy and equipment exclusions',
  () => {
    const restricted = {
      ...all(),
      budget: '20',
      onlyAffordable: true,
      allergens: ['milk'],
      priceQuotes: [],
    };
    assert.equal(suggestRecipes(restricted).length, 0);
    const recovered = { ...restricted, onlyAffordable: false };
    const suggestions = suggestRecipes(recovered);
    assert.ok(suggestions.length > 0);
    assert.ok(
      suggestions.every(
        (x) => !x.conflicts.length && x.cost.status === 'unknown',
      ),
    );
    assert.ok(!suggestions.some((x) => x.recipe.id === yogurt.id));
    assert.equal(suggestRecipes({ ...recovered, equipment: [] }).length, 0);
    assert.equal(restricted.onlyAffordable, true);
  },
);

const quote = (ingredientId, price, amount, unit) => ({
  ingredientId,
  price,
  amount,
  unit,
});
const storage = (entries) => ({
  getItem: (key) => entries[key] || null,
  setItem: () => assert.fail('Reading must not write'),
});
check(
  'v2 is copied into v3 without deleting or overwriting earlier storage',
  () => {
    const old = {
      ...all(),
      version: 2,
      selected: { recipeId: oats.id, methodId: 'stove', servings: 3 },
      budget: '25.00',
    };
    for (const key of [
      'meals',
      'householdSize',
      'maxPrepMinutes',
      'onlyAffordable',
      'priceQuotes',
      'travel',
      'area',
      'finder',
      'excludedResourceIds',
    ])
      delete old[key];
    const raw = JSON.stringify(old),
      entries = { [previousPlanKey]: raw };
    const loaded = readPlan(storage(entries));
    assert.equal(loaded.blocked, false);
    assert.equal(loaded.plan.version, 3);
    assert.deepEqual(loaded.plan.meals, [old.selected]);
    assert.equal(loaded.plan.budget, '25.00');
    assert.equal(entries[previousPlanKey], raw);
    assert.ok(isValidPlan(loaded.plan));
  },
);
check(
  'v3 constraints, public search area, exclusions and multiple meals round-trip',
  () => {
    let p = all();
    p.householdSize = 4;
    p.maxPrepMinutes = '45';
    p.travel = {
      mode: 'transit',
      maxMiles: '3',
      needsStepFree: true,
      notes: 'Confirm the return journey',
    };
    p.area = { kind: 'zip', label: 'ZIP 21117', coordinates: [39.4, -76.8] };
    p.finder = {
      category: 'Food Pantry',
      service: 'all',
      withPhone: true,
      sort: 'name',
    };
    p.excludedResourceIds = ['unsuitable'];
    p.priceQuotes = [quote('olive-oil', '3.25', '10', 'tbsp')];
    p = transferRecipe(
      transferRecipe(p, sandwich, 4, 'no-cook'),
      salad,
      4,
      'no-cook',
    );
    assert.ok(isValidPlan(p));
    assert.deepEqual(
      readPlan(storage({ [PLAN_KEY]: JSON.stringify(p) })).plan,
      p,
    );
    for (const invalid of [
      { ...p, householdSize: 0 },
      { ...p, travel: { ...p.travel, mode: 'flying' } },
      { ...p, area: { ...p.area, coordinates: [999, 0] } },
      { ...p, meals: [...p.meals, p.meals[0]] },
      { ...p, priceQuotes: [...p.priceQuotes, p.priceQuotes[0]] },
    ])
      assert.equal(isValidPlan(invalid), false);
    const entries = {
      [PLAN_KEY]: 'broken',
      [previousPlanKey]: JSON.stringify(p),
    };
    assert.equal(readPlan(storage(entries)).blocked, true);
    assert.equal(entries[PLAN_KEY], 'broken');
  },
);
check(
  'household scaling and conservative batch times affect eligibility',
  () => {
    for (const n of [1, 2, 4, 12]) {
      const p = { ...all(), householdSize: n };
      const e = evaluateRecipe(oats, p);
      assert.equal(e.servings, n);
      assert.equal(
        e.missing.find((i) => i.id === 'rolled-oats').quantity,
        n / 2,
      );
      assert.equal(preparationMinutes(oats, oats.methods[1], n), 10 * n);
    }
    const p = { ...all(), householdSize: 2, maxPrepMinutes: '15' };
    assert.equal(evaluateRecipe(oats, p).timeConflict, true);
    assert.equal(evaluateRecipe(oats, p).compatible, false);
    assert.equal(evaluateRecipe(salad, p).compatible, true);
    assert.equal(
      evaluateRecipe(yogurt, { ...p, storage: [] }).compatible,
      false,
    );
    assert.ok(suggestRecipes(p).every((e) => e.minutes <= 15));
  },
);
check('quotes round up whole packages using only matching units', () => {
  const need = { id: 'rolled-oats', quantity: 0.5, unit: 'cup' },
    q = quote('rolled-oats', '3.25', '0.3', 'cup');
  assert.equal(quoteFor(need, [q]).packages, 2);
  assert.equal(quoteFor(need, [q]).cents, 650);
  for (const bad of [
    { ...q, unit: 'can' },
    { ...q, amount: '' },
    { ...q, amount: '0' },
    { ...q, amount: '1e2' },
    { ...q, price: '' },
    { ...q, price: 'NaN' },
    { ...q, price: '-1' },
  ])
    assert.equal(quoteFor(need, [bad]), null);
  assert.equal(quoteFor(need, [q, q]), null);
  assert.equal(quoteFor(need, [{ ...q, price: '0' }]).cents, 0);
  assert.equal(positiveAmount('.001'), 1);
  for (const value of ['', 0, -1, '1e3', '2.0001', 10001, Infinity])
    assert.equal(positiveAmount(value), null);
});
check('missing or invalid quotes never establish affordability', () => {
  const p = {
    ...all(),
    ingredients: ['banana', 'water'],
    budget: '3.00',
    onlyAffordable: true,
  };
  assert.equal(evaluateRecipe(oats, p).compatible, false);
  p.priceQuotes = [quote('rolled-oats', '3.25', '2', 'cup')];
  assert.equal(evaluateRecipe(oats, p).cost.status, 'over');
  assert.equal(evaluateRecipe(oats, p).compatible, false);
  p.budget = '3.25';
  assert.equal(evaluateRecipe(oats, p).compatible, true);
  p.budget = 'invalid';
  assert.equal(evaluateRecipe(oats, p).compatible, false);
  p.ingredients.push('rolled-oats');
  p.budget = '0';
  assert.equal(evaluateRecipe(oats, p).compatible, true);
  const partial = estimateGroceries(
    [
      { id: 'rolled-oats', quantity: 1, unit: 'cup' },
      { id: 'banana', quantity: 1, unit: 'each' },
    ],
    p.priceQuotes,
    '2',
  );
  assert.equal(partial.complete, false);
  assert.equal(partial.status, 'over');
});
check(
  'ranking uses affordability then missing ingredients and is deterministic',
  () => {
    const p = {
      ...all(),
      ingredients: ['banana', 'water'],
      budget: '4',
      priceQuotes: [
        quote('rolled-oats', '3.25', '2', 'cup'),
        quote('plain-yogurt', '6', '2', 'cup'),
      ],
    };
    const found = suggestRecipes(p);
    assert.equal(found[0].recipe.id, oats.id);
    assert.equal(found.at(-1).recipe.id, yogurt.id);
    assert.deepEqual(found, suggestRecipes(p));
  },
);
check(
  'multiple saved meals remain visible and requirements update without duplicates',
  () => {
    let p = transferRecipe(
      transferRecipe(all(), sandwich, 2, 'no-cook'),
      salad,
      2,
      'no-cook',
    );
    assert.equal(p.meals.length, 2);
    p = transferRecipe(p, sandwich, 4, 'no-cook');
    assert.equal(p.meals.length, 2);
    const oil = p.items.find((i) => i.ingredientId === 'olive-oil');
    assert.equal(oil.requirements.length, 2);
    assert.equal(
      oil.requirements.reduce((n, r) => n + r.quantity, 0),
      3,
    );
    assert.ok(p.meals.every((m) => !savedMealReview(p, m).groceriesChanged));
    assert.deepEqual(transferRecipe(p, sandwich, 4, 'no-cook'), p);
    assert.throws(() => transferRecipe(p, sandwich, 4, 'microwave'));
    assert.throws(() => transferRecipe(p, sandwich, 0, 'no-cook'));
  },
);
check(
  'quoted transfers preserve user-entered prices, names, quantities and acquired state',
  () => {
    let p = {
      ...all(),
      ingredients: ['banana', 'water'],
      priceQuotes: [quote('rolled-oats', '3.25', '1', 'cup')],
    };
    p = transferRecipe(p, oats, 1, 'stove');
    assert.equal(p.items[0].price, '3.25');
    assert.equal(p.items[0].purchaseQuantity, '1');
    assert.equal(p.items[0].packageAmount, '1');
    p.items[0] = {
      ...p.items[0],
      name: 'My own oats',
      price: '4.10',
      acquired: true,
    };
    p.priceQuotes[0].price = '5.25';
    p = transferRecipe(p, oats, 6, 'stove');
    assert.equal(p.items[0].price, '4.10');
    assert.equal(p.items[0].purchaseQuantity, '1');
    assert.equal(p.items[0].name, 'My own oats');
    assert.equal(p.items[0].acquired, true);
    assert.equal(packageCoverage(p.items[0]).status, 'short');
    assert.equal(packageCoverage(p.items[0]).packagesNeeded, 3);
  },
);
check('accumulated needs cannot hide an insufficient purchase quantity', () => {
  let p = { ...all(), priceQuotes: [quote('olive-oil', '2.00', '1', 'tbsp')] };
  p = transferRecipe(
    transferRecipe(p, sandwich, 2, 'no-cook'),
    salad,
    2,
    'no-cook',
  );
  const oil = p.items.find((i) => i.ingredientId === 'olive-oil');
  assert.equal(oil.purchaseQuantity, '1');
  assert.deepEqual(packageCoverage(oil), {
    status: 'short',
    packagesNeeded: 2,
  });
  oil.purchaseQuantity = '2';
  assert.equal(packageCoverage(oil).status, 'covered');
  assert.equal(groceryTotals(p.budget, [oil]).subtotalCents, 400);
  oil.packageMeasure = 'cup';
  assert.equal(packageCoverage(oil).status, 'unknown');
  oil.packageMeasure = 'tbsp';
  oil.packageAmount = '';
  assert.equal(packageCoverage(oil).status, 'unknown');
});
check(
  'removing a meal or reporting an ingredient owned preserves entered purchases',
  () => {
    let p = transferRecipe(all(), oats, 1, 'stove');
    p.items[0].price = '4.00';
    p.items[0].purchaseQuantity = '1';
    p.items[0].acquired = true;
    p.ingredients = ['rolled-oats'];
    assert.equal(savedMealReview(p, p.meals[0]).groceriesChanged, true);
    p = transferRecipe(p, oats, 1, 'stove');
    assert.equal(
      p.items.find((i) => i.ingredientId === 'rolled-oats').price,
      '4.00',
    );
    assert.equal(
      p.items.find((i) => i.ingredientId === 'rolled-oats').requirements.length,
      0,
    );
    p = removeMeal(p, oats.id);
    assert.equal(p.meals.length, 0);
    assert.equal(p.selected, null);
    assert.equal(p.items.length, 1);
    assert.equal(p.items[0].acquired, true);
    const purchaseId = p.items[0].id;
    p.items[0].name = 'My retained oats purchase';
    p.ingredients = [];
    p = transferRecipe(p, oats, 2, 'stove');
    assert.equal(
      p.items.filter((i) => i.ingredientId === 'rolled-oats').length,
      1,
    );
    assert.equal(
      p.items.find((i) => i.id === purchaseId).name,
      'My retained oats purchase',
    );
    assert.equal(p.items.find((i) => i.id === purchaseId).price, '4.00');
    assert.equal(
      p.items.find((i) => i.id === purchaseId).requirements[0].quantity,
      1,
    );
  },
);
check(
  'changing constraints warns without silently deleting saved meals',
  () => {
    const p = transferRecipe(all(), oats, 3, 'stove');
    assert.equal(savedMealReview(p, p.meals[0]).compatible, true);
    for (const next of [
      { ...p, equipment: [] },
      { ...p, maxPrepMinutes: '15' },
      { ...p, onlyAffordable: true },
    ]) {
      assert.equal(savedMealReview(next, p.meals[0]).compatible, false);
      assert.equal(next.meals.length, 1);
    }
  },
);
check('combining cannot mix incompatible package contents', () => {
  const p = transferRecipe(
    { ...all(), priceQuotes: [quote('rolled-oats', '3.25', '1', 'cup')] },
    oats,
    1,
    'stove',
  );
  const a = p.items[0],
    b = { ...a, id: 'another' };
  assert.equal(canCombine(a, b), true);
  assert.equal(canCombine(a, { ...b, packageAmount: '2' }), false);
  assert.equal(canCombine(a, { ...b, packageMeasure: 'tbsp' }), false);
});
check(
  'travel modes only change external directions, with no invented origin or duration',
  () => {
    const r = {
      serviceMode: 'in-person',
      address: 'Public address',
      city: 'Owings Mills',
      zip: '21117',
      coordinates: [39.4, -76.8],
    };
    for (const mode of ['walking', 'bicycling', 'transit', 'driving']) {
      const u = new URL(travelDirections(r, mode));
      assert.equal(u.searchParams.get('travelmode'), mode);
      assert.equal(u.searchParams.has('origin'), false);
    }
    assert.equal(
      new URL(travelDirections(r, 'unknown')).searchParams.has('travelmode'),
      false,
    );
    assert.equal(
      travelDirections({ ...r, serviceMode: 'online' }, 'walking'),
      null,
    );
  },
);
check(
  'user exclusions and distance filtering preserve unknown-data records honestly',
  () => {
    const row = {
      name: 'Fixture',
      address: '',
      city: '',
      zip: '',
      resource_types: ['Food Pantry'],
      services: [],
      phone: null,
    };
    const data = [
      { ...row, id: 'near', coordinates: [39.4, -76.8] },
      { ...row, id: 'far', coordinates: [38, -76] },
      { ...row, id: 'unknown', coordinates: null },
    ];
    const filters = { origin: [39.4, -76.8], radius: 3 };
    assert.deepEqual(
      relevantResources(data, filters).map((r) => r.id),
      ['near', 'unknown'],
    );
    assert.deepEqual(
      relevantResources(data, filters, ['near']).map((r) => r.id),
      ['unknown'],
    );
    assert.equal(data.length, 3);
  },
);
check(
  'exports contain every saved meal, required tools, warnings and travel considerations in both languages',
  () => {
    const p = transferRecipe(
      transferRecipe(all(), sandwich, 2, 'no-cook'),
      oats,
      2,
      'stove',
    );
    p.travel = {
      ...p.travel,
      mode: 'transit',
      needsStepFree: true,
      notes: 'Confirm return journey',
    };
    p.equipment = [];
    const en = planText(p),
      es = planText(p, 'es');
    for (const r of [sandwich, oats]) {
      assert.ok(en.includes(r.name.en));
      assert.ok(es.includes(r.name.es));
    }
    assert.ok(en.includes('Required equipment'));
    assert.ok(en.includes('REVIEW:'));
    assert.ok(en.includes('Public transportation'));
    assert.ok(en.includes('Confirm step-free access'));
    assert.ok(es.includes('Equipo necesario'));
    assert.ok(es.includes('REVISAR:'));
    assert.ok(es.includes('Transporte público'));
    assert.ok(es.includes('Confirma acceso sin escalones'));
    assert.ok(en.includes('Confirm return journey'));
  },
);
console.log(
  `${count} readiness regression groups passed. Browser interaction remains a separate check.`,
);
