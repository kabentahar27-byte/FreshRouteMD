import { equipment, allergens, ingredients, recipes } from './recipes.mjs';
import { validateResource, validCoordinates } from './data-utils.mjs';
import { quoteFor } from './price-estimates.mjs';
import { priceInCents } from './money.mjs';
export { priceInCents } from './money.mjs';
import { missingIngredients, normalizeName } from './meal-engine.mjs';
export const PLAN_KEY = 'freshroute-plan-v3';
export const previousPlanKey = 'freshroute-plan-v2';
export const emptyPlan = () => ({
  version: 3,
  householdSize: 1,
  maxPrepMinutes: '',
  onlyAffordable: false,
  priceQuotes: [],
  meals: [],
  travel: {
    mode: 'unspecified',
    maxMiles: '25',
    needsStepFree: false,
    notes: '',
  },
  area: null,
  finder: {
    category: 'All resources',
    service: 'all',
    withPhone: false,
    sort: 'distance',
  },
  excludedResourceIds: [],
  ingredients: [],
  equipment: [],
  storage: [],
  dietary: [],
  allergens: [],
  reviewNotes: '',
  budget: '',
  items: [],
  selected: null,
  resources: [],
});
export function migrateLegacy(profile, budget) {
  const next = emptyPlan();
  const p = profile && typeof profile === 'object' ? profile : {};
  const strings = (x) =>
    Array.isArray(x) ? x.filter((v) => typeof v === 'string') : [];
  if (
    Number.isInteger(p.householdSize) &&
    p.householdSize >= 1 &&
    p.householdSize <= 12
  )
    next.householdSize = p.householdSize;
  next.equipment = equipment
    .filter((e) => strings(p.kitchenEquipment).includes(e[1]))
    .map((e) => e[0]);
  next.storage = strings(p.foodStorage).includes('Refrigerator')
    ? ['refrigerator']
    : [];
  next.dietary = strings(p.dietaryPreferences)
    .map((v) => v.toLowerCase())
    .filter((v) => ['vegetarian', 'vegan'].includes(v));
  next.allergens = strings(p.allergens)
    .map((v) => v.toLowerCase())
    .filter((v) => allergens.includes(v));
  next.reviewNotes = [
    ...strings(p.dietaryPreferences).filter(
      (v) => !['Vegetarian', 'Vegan', 'No preference'].includes(v),
    ),
    typeof p.otherAllergy === 'string' ? p.otherAllergy : '',
    typeof p.otherDietary === 'string' ? p.otherDietary : '',
  ]
    .filter(Boolean)
    .join('; ')
    .slice(0, 500);
  if (
    budget &&
    typeof budget.budget === 'string' &&
    Array.isArray(budget.items)
  ) {
    next.budget = budget.budget;
    next.items = budget.items
      .filter(
        (i) =>
          i &&
          typeof i.name === 'string' &&
          typeof i.price === 'string' &&
          typeof i.quantity === 'string',
      )
      .map((i, n) => ({
        id: `legacy-${n}-${i.id}`,
        name: i.name,
        ingredientId: null,
        requirements: [],
        price: i.price,
        purchaseQuantity: i.quantity,
        purchaseUnit: 'unit',
        acquired: false,
      }));
  }
  return next;
}
export const validMeal = (m) =>
  !!m &&
  recipes.some(
    (r) => r.id === m.recipeId && r.methods.some((x) => x.id === m.methodId),
  ) &&
  Number.isInteger(m.servings) &&
  m.servings >= 1 &&
  m.servings <= 12;
export function upgradePlan(p) {
  return {
    ...emptyPlan(),
    ...p,
    version: 3,
    meals: p.meals || (p.selected ? [p.selected] : []),
  };
}
export function isValidPlan(p) {
  try {
    const strings = (a) =>
      Array.isArray(a) &&
      a.length <= 200 &&
      a.every((x) => typeof x === 'string' && x.length <= 500);
    return (
      !!p &&
      (p.version === 2 || p.version === 3) &&
      (p.version === 2 ||
        (Number.isInteger(p.householdSize) &&
          p.householdSize >= 1 &&
          p.householdSize <= 12 &&
          ['', '5', '10', '15', '20', '30', '45', '60'].includes(
            p.maxPrepMinutes,
          ) &&
          typeof p.onlyAffordable === 'boolean' &&
          Array.isArray(p.priceQuotes) &&
          p.priceQuotes.length <= 30 &&
          p.priceQuotes.every(
            (q) =>
              q &&
              typeof q.ingredientId === 'string' &&
              !!ingredients[q.ingredientId] &&
              ['price', 'amount', 'unit'].every(
                (k) => typeof q[k] === 'string',
              ),
          ) &&
          new Set(p.priceQuotes.map((q) => q.ingredientId)).size ===
            p.priceQuotes.length &&
          Array.isArray(p.meals) &&
          p.meals.length <= recipes.length &&
          p.meals.every(validMeal) &&
          new Set(p.meals.map((m) => m.recipeId)).size === p.meals.length &&
          p.travel &&
          [
            'unspecified',
            'walking',
            'bicycling',
            'transit',
            'driving',
          ].includes(p.travel.mode) &&
          ['1', '3', '5', '10', '25', '50', '250'].includes(
            p.travel.maxMiles,
          ) &&
          typeof p.travel.needsStepFree === 'boolean' &&
          typeof p.travel.notes === 'string' &&
          p.travel.notes.length <= 300 &&
          (!p.area ||
            (typeof p.area.label === 'string' &&
              p.area.label.length <= 120 &&
              ['community', 'zip'].includes(p.area.kind) &&
              validCoordinates(p.area.coordinates))) &&
          p.finder &&
          ['category', 'service', 'sort'].every(
            (k) => typeof p.finder[k] === 'string',
          ) &&
          typeof p.finder.withPhone === 'boolean' &&
          strings(p.excludedResourceIds))) &&
      ['ingredients', 'equipment', 'storage', 'dietary', 'allergens'].every(
        (k) => strings(p[k]),
      ) &&
      typeof p.reviewNotes === 'string' &&
      typeof p.budget === 'string' &&
      Array.isArray(p.items) &&
      p.items.length <= 200 &&
      p.items.every(
        (i) =>
          i &&
          typeof i.id === 'string' &&
          typeof i.name === 'string' &&
          ['price', 'purchaseQuantity', 'purchaseUnit'].every(
            (k) => typeof i[k] === 'string',
          ) &&
          typeof i.acquired === 'boolean' &&
          ['packageAmount', 'packageMeasure'].every(
            (k) => i[k] === undefined || typeof i[k] === 'string',
          ) &&
          (i.ingredientId === null ||
            (typeof i.ingredientId === 'string' &&
              !!ingredients[i.ingredientId])) &&
          Array.isArray(i.requirements) &&
          i.requirements.every(
            (r) =>
              r &&
              typeof r.recipeId === 'string' &&
              recipes.some((x) => x.id === r.recipeId) &&
              typeof r.unit === 'string' &&
              Number.isFinite(r.quantity) &&
              r.quantity > 0 &&
              Number.isInteger(r.servings) &&
              r.servings > 0 &&
              r.servings <= 12,
          ),
      ) &&
      Array.isArray(p.resources) &&
      p.resources.length <= 30 &&
      p.resources.every(
        (r) =>
          r &&
          typeof r.id === 'string' &&
          typeof r.name === 'string' &&
          Array.isArray(r.provenance) &&
          typeof r.savedAt === 'string' &&
          Array.isArray(r.checks) &&
          r.checks.every((c) => typeof c === 'string') &&
          validateResource(r),
      ) &&
      (!p.selected ||
        (recipes.some(
          (r) =>
            r.id === p.selected.recipeId &&
            r.methods.some((m) => m.id === p.selected.methodId),
        ) &&
          Number.isInteger(p.selected.servings) &&
          p.selected.servings >= 1 &&
          p.selected.servings <= 12))
    );
  } catch {
    return false;
  }
}
export function readPlan(storage) {
  try {
    const saved = storage.getItem(PLAN_KEY) || storage.getItem(previousPlanKey);
    if (saved) {
      const p = JSON.parse(saved);
      return isValidPlan(p)
        ? { plan: upgradePlan(p), blocked: false }
        : { plan: emptyPlan(), blocked: true };
    }
    const parse = (key) => {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : null;
    };
    return {
      plan: migrateLegacy(
        parse('freshroute-demo-profile-v1'),
        parse('freshroute-budget-v1'),
      ),
      blocked: false,
    };
  } catch {
    return { plan: emptyPlan(), blocked: true };
  }
}
export function transferRecipe(plan, recipe, servings, methodId) {
  if (!validMeal({ recipeId: recipe.id, servings, methodId }))
    throw new RangeError('Invalid recipe selection');
  const missing = missingIngredients(recipe, servings, plan.ingredients);
  // A repeated transfer replaces this recipe's requirements, preserving user prices and acquired state.
  let items = plan.items.map((i) => ({
    ...i,
    requirements: i.requirements.filter((r) => r.recipeId !== recipe.id),
  }));
  for (const need of missing) {
    const original = plan.items.find(
      (i) =>
        i.ingredientId === need.id &&
        i.requirements.some(
          (r) => r.recipeId === recipe.id && r.unit === need.unit,
        ),
    );
    const match =
      (original && items.find((i) => i.id === original.id)) ||
      items.find(
        (i) =>
          i.ingredientId === need.id &&
          (!i.packageMeasure || i.packageMeasure === need.unit) &&
          i.requirements.every((r) => r.unit === need.unit),
      );
    const requirement = {
      recipeId: recipe.id,
      servings,
      quantity: need.quantity,
      unit: need.unit,
    };
    if (match) match.requirements = [...match.requirements, requirement];
    else {
      let id = `recipe-${recipe.id}-${need.id}`;
      while (items.some((i) => i.id === id)) id += '-new';
      const quote = quoteFor(need, plan.priceQuotes || []);
      items.push({
        id,
        name: ingredients[need.id].name.en,
        ingredientId: need.id,
        requirements: [requirement],
        price: quote?.quote.price || '',
        purchaseQuantity: quote ? String(quote.packages) : '',
        purchaseUnit: 'package',
        packageAmount: quote?.quote.amount || '',
        packageMeasure: quote?.quote.unit || '',
        acquired: false,
      });
    }
  }
  items = items.filter(
    (i) =>
      i.requirements.length ||
      !plan.items.find((p) => p.id === i.id)?.requirements.length ||
      i.price !== '' ||
      i.purchaseQuantity !== '' ||
      i.acquired,
  );
  return {
    ...plan,
    items,
    selected: { recipeId: recipe.id, servings, methodId },
    meals: [
      ...(plan.meals || (plan.selected ? [plan.selected] : [])).filter(
        (m) => m.recipeId !== recipe.id,
      ),
      { recipeId: recipe.id, servings, methodId },
    ],
  };
}
export function canCombine(a, b) {
  return (
    a.id !== b.id &&
    a.ingredientId === b.ingredientId &&
    normalizeName(a.name) === normalizeName(b.name) &&
    a.purchaseUnit === b.purchaseUnit &&
    a.price === b.price &&
    (a.packageAmount || '') === (b.packageAmount || '') &&
    (a.packageMeasure || '') === (b.packageMeasure || '') &&
    a.acquired === b.acquired &&
    new Set([...a.requirements, ...b.requirements].map((r) => r.unit)).size <= 1
  );
}
export function combineItems(items, first, second) {
  const a = items.find((i) => i.id === first),
    b = items.find((i) => i.id === second);
  if (!a || !b || !canCombine(a, b)) return items;
  const qa = Number(a.purchaseQuantity),
    qb = Number(b.purchaseQuantity);
  if (
    !a.purchaseQuantity ||
    !b.purchaseQuantity ||
    !Number.isFinite(qa + qb) ||
    qa <= 0 ||
    qb <= 0 ||
    qa + qb > 10000
  )
    return items;
  return items
    .filter((i) => i.id !== second)
    .map((i) =>
      i.id === first
        ? {
            ...i,
            purchaseQuantity: String(Math.round((qa + qb) * 1000) / 1000),
            requirements: [...a.requirements, ...b.requirements],
          }
        : i,
    );
}
export function groceryTotals(budget, items) {
  const budgetCents = priceInCents(budget);
  let subtotalCents = 0,
    unpriced = 0;
  const invalid = [];
  for (const i of items) {
    const cents = priceInCents(i.price),
      q = String(i.purchaseQuantity).trim();
    const quantityValid =
      /^(?:\d{1,5}(?:\.\d{1,3})?|\.\d{1,3})$/.test(q) &&
      Number(q) > 0 &&
      Number(q) <= 10000;
    if (cents === null || !quantityValid) {
      unpriced++;
      if (
        (i.price.trim() !== '' && cents === null) ||
        (q !== '' && !quantityValid)
      )
        invalid.push(i.id);
      continue;
    }
    // Integer cents × thousandths of a purchase unit, rounded half-up per line.
    const milli = Math.round(Number(q) * 1000);
    subtotalCents += Math.floor((cents * milli + 500) / 1000);
  }
  const overflow =
    !Number.isSafeInteger(subtotalCents) || subtotalCents > 100000000;
  return {
    budgetCents,
    subtotalCents: overflow ? null : subtotalCents,
    unpriced,
    invalid,
    complete: unpriced === 0 && !overflow,
    remainingCents:
      budgetCents !== null && !overflow ? budgetCents - subtotalCents : null,
    overflow,
  };
}

export function removeMeal(plan, recipeId) {
  const meals = plan.meals.filter((m) => m.recipeId !== recipeId);
  // Preserve entered purchases and prices. Detach requirements rather than deleting purchased/user-priced food.
  const items = plan.items
    .map((i) => ({
      ...i,
      requirements: i.requirements.filter((r) => r.recipeId !== recipeId),
    }))
    .filter(
      (i, n) =>
        i.requirements.length ||
        !plan.items[n].requirements.length ||
        i.price !== '' ||
        i.purchaseQuantity !== '' ||
        i.acquired,
    );
  return {
    ...plan,
    meals,
    items,
    selected:
      plan.selected?.recipeId === recipeId
        ? meals.at(-1) || null
        : plan.selected,
  };
}
