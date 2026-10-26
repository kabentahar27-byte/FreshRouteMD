import { recipes } from './recipes.mjs';
import { evaluateRecipe, missingIngredients } from './meal-engine.mjs';
import { positiveAmount } from './money.mjs';

// A price alone is not evidence that a purchase covers the recipe quantities.
export function packageCoverage(item) {
  if (!item.requirements.length)
    return { status: 'manual', packagesNeeded: null };
  const amount = positiveAmount(item.packageAmount || '');
  const quantity = positiveAmount(item.purchaseQuantity);
  if (
    amount === null ||
    !item.packageMeasure ||
    item.requirements.some((r) => r.unit !== item.packageMeasure)
  )
    return { status: 'unknown', packagesNeeded: null };
  const required = item.requirements.reduce(
    (n, r) => n + Math.round(r.quantity * 1000),
    0,
  );
  const packagesNeeded = Math.ceil(required / amount);
  if (quantity === null) return { status: 'unknown', packagesNeeded };
  return {
    status: quantity * amount >= required * 1000 ? 'covered' : 'short',
    packagesNeeded,
  };
}

export function savedMealReview(plan, meal) {
  const recipe = recipes.find((r) => r.id === meal.recipeId);
  if (!recipe) return { compatible: false, groceriesChanged: true };
  const evaluation = evaluateRecipe(recipe, {
    ...plan,
    householdSize: meal.servings,
  });
  const expected = missingIngredients(recipe, meal.servings, plan.ingredients);
  const actual = plan.items.flatMap((i) =>
    i.requirements
      .filter((r) => r.recipeId === meal.recipeId)
      .map((r) => ({ id: i.ingredientId, quantity: r.quantity, unit: r.unit })),
  );
  const key = (rows) =>
    JSON.stringify(
      rows
        .map((i) => `${i.id}|${i.unit}|${Math.round(i.quantity * 1000)}`)
        .sort(),
    );
  return {
    compatible:
      evaluation.compatible &&
      evaluation.methods.some((m) => m.id === meal.methodId),
    groceriesChanged: key(expected) !== key(actual),
  };
}
