import { estimateGroceries } from './price-estimates.mjs';
import { ingredients, recipes } from './recipes.mjs';
export const normalizeName = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ');
const lookup = new Map(
  Object.entries(ingredients).flatMap(([id, i]) =>
    [id, ...i.aliases, i.name.en, i.name.es].map((a) => [normalizeName(a), id]),
  ),
);
export const identifyIngredient = (name) =>
  lookup.get(normalizeName(name)) ?? null;
export function scaleIngredients(recipe, servings) {
  if (!Number.isInteger(servings) || servings < 1 || servings > 12)
    throw new RangeError('Servings must be 1–12');
  return recipe.ingredients.map((i) => ({
    ...i,
    quantity: (i.quantity * servings) / recipe.servings,
  }));
}
export function preparationMinutes(recipe, method, servings) {
  // Conservative planning estimate: base time per base-serving batch; microwave oats require one serving per batch.
  const batchSize =
    recipe.id === 'banana-oats' && method.id === 'microwave'
      ? 1
      : recipe.servings;
  return recipe.minutes * Math.ceil(servings / batchSize);
}
export function evaluateRecipe(recipe, preferences) {
  const servings =
    Number.isInteger(preferences.householdSize) &&
    preferences.householdSize >= 1 &&
    preferences.householdSize <= 12
      ? preferences.householdSize
      : recipe.servings;

  const equipment = new Set(preferences.equipment || []),
    storage = new Set(preferences.storage || []),
    have = new Set(
      (preferences.ingredients || [])
        .map((x) => identifyIngredient(x))
        .filter(Boolean),
    );
  const conflicts = recipe.ingredients.flatMap((i) =>
    (ingredients[i.id]?.allergens || []).filter((a) =>
      (preferences.allergens || []).includes(a),
    ),
  );
  const equipmentMethods = recipe.methods.filter((m) =>
    m.equipment.every((e) => equipment.has(e)),
  );
  const maxMinutes = Number(preferences.maxPrepMinutes) || Infinity;
  const methods = equipmentMethods.filter(
    (m) => preparationMinutes(recipe, m, servings) <= maxMinutes,
  );
  const timeConflict = equipmentMethods.length > 0 && methods.length === 0;
  const missingStorage = recipe.storage.filter((s) => !storage.has(s));
  const dietaryConflict = (preferences.dietary || []).some(
    (d) => !recipe.dietary.includes(d),
  );
  const missing = scaleIngredients(recipe, servings).filter(
    (i) => !have.has(i.id),
  );
  const cost = estimateGroceries(
    missing,
    preferences.priceQuotes || [],
    preferences.budget || '',
  );
  const budgetConflict =
    !!preferences.onlyAffordable && cost.status !== 'within';
  return {
    recipe,
    servings,
    cost,
    budgetConflict,
    timeConflict,
    equipmentMethods,
    minutes: methods.length
      ? Math.min(...methods.map((m) => preparationMinutes(recipe, m, servings)))
      : null,
    methods,
    missing,
    have: recipe.ingredients.filter((i) => have.has(i.id)),
    conflicts: [...new Set(conflicts)],
    missingStorage,
    dietaryConflict,
    productInformationUnknown: recipe.ingredients.some(
      (i) => !ingredients[i.id] || ingredients[i.id].product,
    ),
    compatible:
      methods.length > 0 &&
      !conflicts.length &&
      !missingStorage.length &&
      !dietaryConflict &&
      !budgetConflict,
  };
}
export function suggestRecipes(preferences) {
  return recipes
    .map((r) => evaluateRecipe(r, preferences))
    .filter((x) => x.compatible)
    .sort(
      (a, b) =>
        ({ within: 0, unknown: 1, over: 2 })[a.cost.status] -
          { within: 0, unknown: 1, over: 2 }[b.cost.status] ||
        (a.cost.complete && b.cost.complete
          ? a.cost.subtotalCents - b.cost.subtotalCents
          : 0) ||
        a.missing.length - b.missing.length ||
        (a.minutes || 0) - (b.minutes || 0) ||
        a.recipe.id.localeCompare(b.recipe.id),
    );
}
export function missingIngredients(recipe, servings, owned) {
  const have = new Set(owned.map(identifyIngredient).filter(Boolean));
  return scaleIngredients(recipe, servings).filter((i) => !have.has(i.id));
}
