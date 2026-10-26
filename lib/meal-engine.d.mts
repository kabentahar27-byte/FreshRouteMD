import { recipes } from './recipes.mjs';
type Recipe = (typeof recipes)[number];
type Preferences = {
  ingredients: string[];
  equipment: string[];
  storage: string[];
  allergens: string[];
  dietary: string[];
  householdSize?: number;
  maxPrepMinutes?: string;
  onlyAffordable?: boolean;
  priceQuotes?: {
    ingredientId: string;
    price: string;
    amount: string;
    unit: string;
  }[];
  budget?: string;
};
type Ingredient = { id: string; quantity: number; unit: string };
export function normalizeName(value: string): string;
export function identifyIngredient(value: string): string | null;
export function scaleIngredients(
  recipe: Recipe,
  servings: number,
): Ingredient[];
export function preparationMinutes(
  recipe: Recipe,
  method: Recipe['methods'][number],
  servings: number,
): number;
export function evaluateRecipe(
  recipe: Recipe,
  preferences: Preferences,
): {
  recipe: Recipe;
  servings: number;
  minutes: number | null;
  cost: ReturnType<typeof import('./price-estimates.mjs').estimateGroceries>;
  timeConflict: boolean;
  budgetConflict: boolean;
  equipmentMethods: Recipe['methods'];
  methods: Recipe['methods'];
  missing: Ingredient[];
  have: Ingredient[];
  conflicts: string[];
  missingStorage: string[];
  dietaryConflict: boolean;
  productInformationUnknown: boolean;
  compatible: boolean;
};
export function suggestRecipes(
  preferences: Preferences,
): ReturnType<typeof evaluateRecipe>[];
export function missingIngredients(
  recipe: Recipe,
  servings: number,
  owned: string[],
): Ingredient[];
