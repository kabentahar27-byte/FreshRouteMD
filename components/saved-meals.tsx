'use client';
import Link from 'next/link';

import { usePlan, type Plan } from './plan-context';
import { useLanguage } from './language-context';
import {
  recipes,
  equipment,
  storageGuidance,
  recipeProvenance,
} from '@/lib/recipes.mjs';
import { scaleIngredients, preparationMinutes } from '@/lib/meal-engine.mjs';
import { removeMeal } from '@/lib/plan-model.mjs';
import { savedMealReview } from '@/lib/plan-review.mjs';
import { localized, ingredientName, quantityText } from './meal-planner';
export default function SavedMeals() {
  const { plan, setPlan } = usePlan();
  const { language, t } = useLanguage(),
    es = language === 'es';
  return (
    <section className="calm-panel workflow-section">
      <h2>{es ? 'Tus comidas' : 'Your meals'}</h2>
      <p>
        <strong>
          {es
            ? 'Ingredientes declarados; verifica las cantidades'
            : 'Reported ingredients; check quantities'}
          :
        </strong>{' '}
        {plan.ingredients.map((i) => ingredientName(i, language)).join(', ') ||
          t('Not supplied')}
      </p>
      {!plan.meals.length && (
        <p>
          {es
            ? 'Aún no has guardado una receta.'
            : 'You have not saved a recipe yet.'}
        </p>
      )}
      {plan.meals.map((meal) => {
        const recipe = recipes.find((r) => r.id === meal.recipeId)!,
          method = recipe.methods.find((m) => m.id === meal.methodId)!;
        const review = savedMealReview(plan, meal);
        return (
          <article className="saved-meal" key={meal.recipeId}>
            <h3>{localized(recipe.name, language)}</h3>
            {!review.compatible && (
              <p className="notice warning">
                {es
                  ? 'Esta receta o método no cumple tus restricciones actuales. Revisa las preferencias antes de prepararla.'
                  : 'This recipe or method does not meet your current constraints. Review preferences before preparing it.'}
              </p>
            )}
            {review.groceriesChanged && (
              <p className="notice warning">
                {es
                  ? 'Los ingredientes o las compras cambiaron. Edita y vuelve a guardar esta receta para actualizar sus ingredientes faltantes.'
                  : 'Ingredients or groceries changed. Edit and save this recipe again to refresh its missing ingredients.'}
              </p>
            )}
            <p>
              {meal.servings} {es ? 'porciones' : 'servings'} ·{' '}
              {localized(method.name, language)} ·{' '}
              {preparationMinutes(recipe, method, meal.servings)}{' '}
              {es
                ? 'minutos estimados por tandas'
                : 'estimated minutes across batches'}
            </p>
            <p>
              <strong>{es ? 'Equipo necesario' : 'Required equipment'}:</strong>{' '}
              {method.equipment
                .map((id) => {
                  const e = equipment.find((e) => e[0] === id)!;
                  return es ? e[2] : e[1];
                })
                .join(', ')}
            </p>
            {recipe.storage.includes('refrigerator') && (
              <p>
                {es ? 'Requiere refrigerador.' : 'Requires a refrigerator.'}
              </p>
            )}
            <ul>
              {scaleIngredients(recipe, meal.servings).map((i) => (
                <li key={i.id}>
                  {quantityText(i.quantity, i.unit, language)} —{' '}
                  {ingredientName(i.id, language)}
                </li>
              ))}
            </ul>
            <details className="preparation-details">
              <summary>
                {es ? 'Pasos de preparación' : 'Preparation steps'}
              </summary>
              <ol className="recipe-steps">
                {method.steps.map((s, i) => (
                  <li key={i}>{localized(s, language)}</li>
                ))}
              </ol>
            </details>
            <ol className="recipe-steps print-only">
              {method.steps.map((s, i) => (
                <li key={i}>{localized(s, language)}</li>
              ))}
            </ol>
            <div className="location-actions no-print">
              <Link className="underlined" href="/FreshRouteMD/meals#saved-meals">
                {es ? 'Editar porciones o método' : 'Edit servings or method'}
              </Link>
              <button
                className="text-button"
                onClick={() =>
                  setPlan((p) => removeMeal(p, meal.recipeId) as Plan)
                }
              >
                {es ? 'Quitar comida' : 'Remove meal'}
              </button>
            </div>
          </article>
        );
      })}
      {plan.meals.length > 0 && (
        <>
          <p className="supporting">
            {es
              ? 'Quitar una comida conserva compras con precios, cantidades o estado adquirido. Revísalas en el presupuesto.'
              : 'Removing a meal keeps purchases with entered prices, quantities or acquired status. Review them in the spending plan.'}
          </p>
          <p className="supporting">{localized(storageGuidance, language)}</p>
          <p className="supporting">{localized(recipeProvenance, language)}</p>
          <p className="notice">
            {es
              ? 'Revisa las etiquetas y la contaminación cruzada. No se garantiza seguridad para alergias.'
              : 'Check labels and cross-contact. Allergy safety is not guaranteed.'}
          </p>
        </>
      )}
      <Link className="secondary no-print" href="/FreshRouteMD/meals">
        {t('Choose a meal')} →
      </Link>
      {plan.reviewNotes && (
        <p>
          {es ? 'Notas no evaluadas' : 'Notes not evaluated'}:{' '}
          {plan.reviewNotes}
        </p>
      )}
    </section>
  );
}
