import assert from 'node:assert/strict';
import { recipes, ingredients, equipment } from '../lib/recipes.mjs';
import {
  evaluateRecipe,
  scaleIngredients,
  preparationMinutes,
  identifyIngredient,
} from '../lib/meal-engine.mjs';
import { emptyPlan, transferRecipe, isValidPlan } from '../lib/plan-model.mjs';
const additions = recipes.slice(4);
assert.equal(additions.length, 6);
assert.equal(new Set(recipes.map((r) => r.id)).size, 10);
assert.deepEqual(additions.map((r) => r.methods[0].id).sort(), [
  'microwave',
  'microwave',
  'no-cook',
  'no-cook',
  'stove',
  'stove',
]);
const plan = {
  ...emptyPlan(),
  equipment: equipment.map((e) => e[0]),
  storage: ['refrigerator'],
};
for (const r of additions) {
  assert.ok(evaluateRecipe(r, plan).compatible, r.id);
  for (const tool of r.methods[0].equipment)
    assert.equal(
      evaluateRecipe(r, {
        ...plan,
        equipment: plan.equipment.filter((e) => e !== tool),
      }).compatible,
      false,
      `${r.id} missing ${tool}`,
    );
  for (const item of r.ingredients)
    for (const allergen of ingredients[item.id].allergens)
      assert.equal(
        evaluateRecipe(r, { ...plan, allergens: [allergen] }).compatible,
        false,
      );
  for (const servings of [1, 2, 4, 12]) {
    const scaled = scaleIngredients(r, servings);
    const saved = transferRecipe(plan, r, servings, r.methods[0].id);
    assert.ok(isValidPlan(JSON.parse(JSON.stringify(saved))), r.id);
    for (const need of scaled)
      assert.equal(
        saved.items.find((i) => i.ingredientId === need.id).requirements[0]
          .quantity,
        need.quantity,
      );
    assert.ok(saved.items.every((i) => i.price === ''));
    assert.equal(
      transferRecipe(saved, r, servings, r.methods[0].id).items.length,
      saved.items.length,
    );
  }
  const owned = { ...plan, ingredients: r.ingredients.map((i) => i.id) };
  assert.equal(transferRecipe(owned, r, 1, r.methods[0].id).items.length, 0);
  assert.equal(
    evaluateRecipe(r, { ...plan, onlyAffordable: true, budget: '20' })
      .compatible,
    false,
  );
  if (r.methods[0].id === 'microwave')
    assert.equal(preparationMinutes(r, r.methods[0], 4), r.minutes * 4);
}
assert.equal(identifyIngredient('dry rice'), null);
assert.notEqual(
  identifyIngredient('dry red lentils'),
  identifyIngredient('canned chickpeas'),
);
const tuna = recipes.find((r) => r.id === 'tuna-chickpea-bowl');
assert.equal(
  evaluateRecipe(tuna, { ...plan, dietary: ['vegan'] }).compatible,
  false,
);
assert.equal(
  evaluateRecipe(tuna, { ...plan, dietary: ['vegetarian'] }).compatible,
  false,
);
console.log(
  'Six added meals: equipment, allergens, dietary restrictions, scaling, batching, persistence, owned ingredients, unknown prices and repeat transfers passed.',
);
