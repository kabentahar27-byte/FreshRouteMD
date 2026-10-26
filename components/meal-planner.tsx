'use client';
import Link from 'next/link';

import { useRef, useState } from 'react';
import Header from './header';
import PlanJourney from './plan-journey';
import Footer from './footer';
import { useLanguage } from './language-context';
import { usePlan, PlanNotice, type Plan } from './plan-context';
import MealPreferences from './meal-preferences';
import RecipeCost from './recipe-cost';
import {
  ingredients,
  recipes,
  recipeProvenance,
  storageGuidance,
  safetySource,
  equipment,
} from '@/lib/recipes.mjs';
import {
  suggestRecipes,
  evaluateRecipe,
  identifyIngredient,
  scaleIngredients,
  missingIngredients,
  preparationMinutes,
} from '@/lib/meal-engine.mjs';
import { transferRecipe } from '@/lib/plan-model.mjs';
export const localized = (
  value: { en: string; es: string },
  language: string,
) => (language === 'es' ? value.es : value.en);
export function ingredientName(id: string, language: string) {
  const i = ingredients[id as keyof typeof ingredients];
  return i ? localized(i.name, language) : id;
}
export function quantityText(quantity: number, unit: string, language: string) {
  const units: Record<string, string> = {
    cup: 'taza(s)',
    tbsp: 'cucharada(s)',
    each: 'unidad(es)',
    slice: 'rebanada(s)',
  };
  return `${new Intl.NumberFormat(language === 'es' ? 'es-US' : 'en-US', { maximumFractionDigits: 3 }).format(quantity)} ${language === 'es' ? units[unit] || unit : unit + (quantity === 1 ? '' : 's')}`;
}
export function purchaseUnitName(unit: string, language: string) {
  return language === 'es'
    ? ({ package: 'paquete', unit: 'unidad' } as Record<string, string>)[
        unit
      ] || unit
    : unit;
}
export default function MealPlanner() {
  const { language, t } = useLanguage(),
    es = language === 'es';
  const { plan, setPlan, ready } = usePlan();
  const [setupOpen, setSetupOpen] = useState(true);
  const [entry, setEntry] = useState(''),
    [entryError, setEntryError] = useState(''),
    [recipeId, setRecipeId] = useState(''),
    [servings, setServings] = useState('1'),
    [methodId, setMethodId] = useState(''),
    [notice, setNotice] = useState('');
  const results = useRef<HTMLHeadingElement>(null);
  function showSuggestions() {
    setSetupOpen(false);
    results.current?.focus();
    results.current?.scrollIntoView({ block: 'start' });
  }
  const dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLElement | null>(null);
  const validServing =
    /^\d+$/.test(servings) && Number(servings) >= 1 && Number(servings) <= 12;
  const suggestions = suggestRecipes(plan),
    recipe = recipes.find((r) => r.id === recipeId),
    evaluation =
      recipe && validServing
        ? evaluateRecipe(recipe, { ...plan, householdSize: Number(servings) })
        : null;
  const method = evaluation?.methods.find((m) => m.id === methodId);
  const scaled =
    recipe && validServing ? scaleIngredients(recipe, Number(servings)) : [];
  const missing =
    recipe && validServing
      ? missingIngredients(recipe, Number(servings), plan.ingredients)
      : [];
  function open(id: string, event: React.MouseEvent<HTMLButtonElement>) {
    const r = recipes.find((x) => x.id === id)!;
    const saved = plan.meals.find((m) => m.recipeId === id);
    const count = saved?.servings || plan.householdSize;
    setRecipeId(id);
    setServings(String(count));
    const methods = evaluateRecipe(r, {
      ...plan,
      householdSize: count,
    }).methods;
    setMethodId(
      methods.some((m) => m.id === saved?.methodId)
        ? saved!.methodId
        : methods[0]?.id || '',
    );
    opener.current = event.currentTarget;
    dialog.current?.showModal();
  }
  function add(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = entry.trim();
    if (!v) {
      setEntryError('empty');
      return;
    }
    const id = identifyIngredient(v) || v;
    if (plan.ingredients.includes(id)) {
      setEntryError('duplicate');
      return;
    }
    setPlan((p) => ({
      ...p,
      ingredients: [...p.ingredients, id].slice(0, 100),
    }));
    setEntry('');
    setEntryError('');
  }
  const priceHidden = plan.onlyAffordable
    ? suggestRecipes({ ...plan, onlyAffordable: false }).filter(
        (x) =>
          x.budgetConflict === false &&
          evaluateRecipe(x.recipe, plan).budgetConflict,
      )
    : [];
  const excluded = recipes
    .map((r) => evaluateRecipe(r, plan))
    .filter((r) => !r.compatible);
  return (
    <>
      <Header />
      <main id="main" className="app-main task-page">
        <h1>{t('Choose a meal')}</h1>
        <p className="lead">
          {es
            ? 'Empieza con lo que tienes. Elige una receta y planifica las compras que faltan.'
            : 'Start with what you have. Choose a recipe and plan the groceries you still need.'}
        </p>
        <PlanJourney current="meals" />
        <PlanNotice />
        <p className="notice">
          {es
            ? 'Diez recetas sencillas según tu cocina. Añade una comida para crear tu lista de compras; los precios son desconocidos hasta que los ingreses.'
            : 'Ten simple recipes matched to your kitchen. Add a meal to build your grocery list; prices stay unknown until you enter them.'}
        </p>
        <button className="primary" onClick={showSuggestions} disabled={!ready}>
          {es ? 'Ver sugerencias de comidas' : 'Show meal suggestions'} (
          {suggestions.length})
        </button>
        {ready && (
          <>
            <details className="calm-panel workflow-section ingredient-setup">
              <summary>
                {es ? 'Ingredientes que tienes' : 'Ingredients you have'} ·{' '}
                {plan.ingredients.length} {es ? 'seleccionados' : 'selected'}
              </summary>
              <p>
                {es
                  ? 'Opcional: marca lo que ya tienes para reducir la lista de compras.'
                  : 'Optional: select what you already have to shorten your grocery list.'}
              </p>
              <p className="supporting">
                {es
                  ? 'Selecciona solo alimentos que tienes. Las cantidades disponibles no se conocen; comprueba que alcancen para las porciones elegidas.'
                  : 'Select only food you have. Available quantities are unknown; check you have enough for your selected servings.'}
              </p>
              <div className="check-grid ingredient-options">
                {Object.keys(ingredients).map((id) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={plan.ingredients.some(
                        (v) => identifyIngredient(v) === id,
                      )}
                      onChange={() =>
                        setPlan((p) => ({
                          ...p,
                          ingredients: p.ingredients.some(
                            (v) => identifyIngredient(v) === id,
                          )
                            ? p.ingredients.filter(
                                (v) => identifyIngredient(v) !== id,
                              )
                            : [...p.ingredients, id],
                        }))
                      }
                    />
                    {ingredientName(id, language)}
                  </label>
                ))}
              </div>
              <form className="inline-form" onSubmit={add}>
                <label className="stack-label">
                  {es ? 'Añadir otro ingrediente' : 'Add another ingredient'}
                  <input
                    maxLength={80}
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    aria-invalid={!!entryError}
                    aria-describedby="ingredient-error"
                  />
                </label>
                <button className="secondary">{es ? 'Añadir' : 'Add'}</button>
              </form>
              <p id="ingredient-error" className="validation" role="alert">
                {entryError === 'empty'
                  ? es
                    ? 'Escribe un ingrediente.'
                    : 'Enter an ingredient.'
                  : entryError === 'duplicate'
                    ? es
                      ? 'Ese ingrediente ya está en la lista.'
                      : 'That ingredient is already listed.'
                    : ''}
              </p>
              {plan.ingredients.filter((v) => !identifyIngredient(v)).length >
                0 && (
                <div>
                  <p className="supporting">
                    {es
                      ? 'Guardados como notas; no hay una coincidencia exacta en esta colección:'
                      : 'Saved as notes; no exact match in this collection:'}
                  </p>
                  {plan.ingredients
                    .filter((v) => !identifyIngredient(v))
                    .map((v) => (
                      <div className="inline-row" key={v}>
                        {v}
                        <button
                          className="text-button"
                          onClick={() =>
                            setPlan((p) => ({
                              ...p,
                              ingredients: p.ingredients.filter((x) => x !== v),
                            }))
                          }
                        >
                          {t('Remove')}
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </details>
            <details
              className="calm-panel workflow-section kitchen-setup"
              open={setupOpen}
              onToggle={(event) => setSetupOpen(event.currentTarget.open)}
            >
              <summary>
                {es
                  ? 'Tu cocina y tus preferencias'
                  : 'Your kitchen and preferences'}{' '}
                · {plan.equipment.length}{' '}
                {es ? 'utensilios seleccionados' : 'tools selected'}
              </summary>
              <p>
                {es
                  ? 'Marca solo el equipo que tienes. Las recetas necesitan utensilios además de una estufa o microondas.'
                  : 'Select only equipment you have. Recipes need utensils as well as a stove or microwave.'}
              </p>
              <p className="supporting">
                {es
                  ? 'Selección rápida: tazón, cuchara, tenedor, abrelatas, tazas y cucharas medidoras.'
                  : 'Quick selection: mixing bowl, spoon, fork, can opener, measuring cups and spoons.'}
              </p>
              <button
                className="secondary"
                onClick={() =>
                  setPlan((p) => ({
                    ...p,
                    equipment: [
                      ...new Set([
                        ...p.equipment,
                        'bowl',
                        'spoon',
                        'fork',
                        'can-opener',
                        'measuring-cup',
                        'measuring-spoon',
                      ]),
                    ],
                  }))
                }
              >
                {es
                  ? 'Tengo todos estos utensilios'
                  : 'I have all these utensils'}
              </button>
              <MealPreferences />
              <button className="primary" onClick={showSuggestions}>
                {es ? 'Ver sugerencias de comidas' : 'Show meal suggestions'} (
                {suggestions.length})
              </button>
            </details>
            <section
              className="workflow-section"
              aria-labelledby="suggestion-title"
            >
              <h2 id="suggestion-title" ref={results} tabIndex={-1}>
                {es ? 'Recetas compatibles' : 'Compatible recipes'}{' '}
                <span className="supporting">({suggestions.length})</span>
              </h2>
              <p className="supporting">
                {es
                  ? 'Primero las estimaciones completas dentro del presupuesto; después las desconocidas y las que lo exceden. Entre opciones comparables: menor costo conocido, menos ingredientes nuevos y menor tiempo. La coincidencia no confirma cantidades disponibles.'
                  : 'Complete estimates within budget appear first, followed by unknown and over-budget estimates. Among comparable options: lower known cost, fewer missing ingredients, then less time. Ingredient matches do not confirm available quantities.'}
              </p>
              <p className="notice">
                {es
                  ? 'Las recetas usan tus ingredientes declarados. No indican existencias de ninguna despensa o tienda.'
                  : 'Recipes use the ingredients you report. They do not indicate stock at any pantry or store.'}
              </p>
              {plan.reviewNotes && (
                <p className="notice warning">
                  {es
                    ? 'Revisión pendiente de tus notas (no evaluadas):'
                    : 'Your notes need review (not evaluated):'}{' '}
                  {plan.reviewNotes}
                </p>
              )}
              <p role="status">
                {notice === 'saved'
                  ? es
                    ? 'Receta guardada y lista actualizada. Revisa las cantidades y el total combinado en Mi plan.'
                    : 'Recipe saved and grocery list updated. Review quantities and the combined total in My plan.'
                  : notice === 'limit'
                    ? es
                      ? 'La lista admite hasta 200 productos. Elimina productos innecesarios antes de guardar.'
                      : 'The list supports up to 200 items. Remove unnecessary items before saving.'
                    : ''}
              </p>
              {notice === 'saved' && (
                <Link className="primary" href="/FreshRouteMD/plan">
                  {es ? 'Revisar mi plan' : 'Review my plan'} →
                </Link>
              )}
              {plan.meals.length > 0 && (
                <div id="saved-meals" className="calm-panel workflow-section">
                  <h3>
                    {es ? 'Editar comidas guardadas' : 'Edit saved meals'}
                  </h3>
                  <div className="location-actions">
                    {plan.meals.map((m) => (
                      <button
                        className="secondary"
                        key={m.recipeId}
                        onClick={(e) => open(m.recipeId, e)}
                      >
                        {localized(
                          recipes.find((r) => r.id === m.recipeId)!.name,
                          language,
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="supporting">
                    {es
                      ? 'Las comidas anteriores se conservan cuando cambias preferencias. Revisa cualquier incompatibilidad antes de prepararlas.'
                      : 'Previous meals remain saved when preferences change. Review any incompatibilities before preparing them.'}
                  </p>
                </div>
              )}
              {priceHidden.length > 0 && (
                <div className="notice warning" role="status">
                  <p>
                    {es
                      ? `${priceHidden.length} recetas coinciden con tu cocina y preferencias, pero el filtro de presupuesto las oculta. Faltan precios, no hay un presupuesto válido o el costo lo supera.`
                      : `${priceHidden.length} recipes match your kitchen and preferences, but the budget filter hides them. Prices are missing, a valid budget is missing, or the cost exceeds it.`}
                  </p>
                  <button
                    className="secondary"
                    onClick={() =>
                      setPlan((p) => ({ ...p, onlyAffordable: false }))
                    }
                  >
                    {es
                      ? 'Mostrar también recetas sin costo confirmado o sobre el presupuesto'
                      : 'Show recipes with unknown or over-budget costs too'}
                  </button>
                  <p className="supporting">
                    {es
                      ? 'Se mantienen tus restricciones de dieta, alergias, equipo y tiempo.'
                      : 'Your dietary, allergy, equipment and time restrictions stay applied.'}
                  </p>
                </div>
              )}
              {suggestions.length === 0 && (
                <div className="empty-state">
                  <h3>
                    {es
                      ? 'Ninguna receta coincide con esta selección'
                      : 'No recipe matches this selection'}
                  </h3>
                  <p>
                    {es
                      ? 'Revisa equipo, tiempo, precios, refrigeración y preferencias. No cambies una alergia solo para obtener resultados.'
                      : 'Review equipment, time, prices, refrigeration and preferences. Do not change an allergy just to get results.'}
                  </p>
                </div>
              )}
              <div className="recipe-list">
                {suggestions.map(
                  ({
                    recipe: r,
                    have,
                    missing: m,
                    methods,
                    servings: count,
                    minutes,
                    cost,
                  }) => (
                    <article className="calm-panel recipe-row" key={r.id}>
                      <h3>{localized(r.name, language)}</h3>
                      <p>{localized(r.description, language)}</p>
                      <p className="supporting">
                        {es ? 'Tiempo estimado' : 'Estimated time'}: {minutes}{' '}
                        {es ? 'minutos' : 'minutes'} · {count}{' '}
                        {es
                          ? 'porción(es) para tu hogar'
                          : 'serving(s) for your household'}
                      </p>
                      <p>
                        <strong>
                          {es
                            ? 'Tienes (revisa cantidades)'
                            : 'Have (check quantities)'}
                          :
                        </strong>{' '}
                        {have.length
                          ? have
                              .map((i) => ingredientName(i.id, language))
                              .join(', ')
                          : es
                            ? 'Ninguno indicado'
                            : 'None listed'}
                      </p>
                      <p>
                        <strong>{es ? 'Por comprar' : 'Need to get'}:</strong>{' '}
                        {m.length
                          ? m
                              .map((i) => ingredientName(i.id, language))
                              .join(', ')
                          : es
                            ? 'Revisa que tus cantidades alcancen'
                            : 'Check your quantities are sufficient'}
                      </p>
                      <p className="supporting">
                        {methods
                          .map((m) => localized(m.name, language))
                          .join(' / ')}
                      </p>
                      <RecipeCost cost={cost} />
                      <button
                        className="secondary"
                        onClick={(e) => open(r.id, e)}
                      >
                        {es ? 'Abrir receta' : 'Open recipe'} →
                      </button>
                    </article>
                  ),
                )}
              </div>
              {excluded.length > 0 && (
                <details
                  className="excluded-recipes"
                  open={suggestions.length === 0 ? true : undefined}
                >
                  <summary>
                    {es
                      ? 'Qué necesitan las otras recetas'
                      : 'What the other recipes need'}
                  </summary>
                  {excluded.map((e) => (
                    <div key={e.recipe.id}>
                      <strong>{localized(e.recipe.name, language)}</strong>
                      <ul>
                        {e.conflicts.length > 0 && (
                          <li>
                            {es ? 'Conflicto conocido' : 'Known conflict'}:{' '}
                            {e.conflicts
                              .map((a) =>
                                t(
                                  a === 'egg'
                                    ? 'Eggs'
                                    : a[0].toUpperCase() + a.slice(1),
                                ),
                              )
                              .join(', ')}
                          </li>
                        )}
                        {e.dietaryConflict && (
                          <li>
                            {es
                              ? 'No coincide con la dieta seleccionada.'
                              : 'Does not match selected diet.'}
                          </li>
                        )}
                        {e.missingStorage.length > 0 && (
                          <li>
                            {es
                              ? 'Requiere refrigerador.'
                              : 'Requires a refrigerator.'}
                          </li>
                        )}
                        {e.timeConflict && (
                          <li>
                            {es
                              ? 'Supera el tiempo máximo estimado para estas porciones.'
                              : 'Exceeds the maximum estimated time for these servings.'}
                          </li>
                        )}
                        {e.budgetConflict && (
                          <li>
                            {es
                              ? 'No tiene una estimación completa dentro del presupuesto.'
                              : 'Does not have a complete estimate within budget.'}
                          </li>
                        )}
                        {!e.equipmentMethods.length &&
                          e.recipe.methods.map((m) => (
                            <li key={m.id}>
                              {localized(m.name, language)}:{' '}
                              {es ? 'falta' : 'missing'}{' '}
                              {m.equipment
                                .filter((id) => !plan.equipment.includes(id))
                                .map((id) => {
                                  const v = equipment.find((e) => e[0] === id)!;
                                  return es ? v[2] : v[1];
                                })
                                .join(', ')}
                            </li>
                          ))}
                      </ul>
                      <button
                        className="secondary"
                        onClick={(event) => open(e.recipe.id, event)}
                      >
                        {es
                          ? 'Revisar receta y requisitos'
                          : 'Review recipe and requirements'}
                      </button>
                    </div>
                  ))}
                </details>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
      <dialog
        ref={dialog}
        className="recipe-dialog"
        aria-labelledby="recipe-title"
        onClose={() => opener.current?.focus()}
      >
        {recipe && (
          <>
            <div className="dialog-heading">
              <h2 id="recipe-title">{localized(recipe.name, language)}</h2>
              <button
                className="secondary"
                onClick={() => dialog.current?.close()}
              >
                {t('Close')}
              </button>
            </div>
            <p>{localized(recipe.description, language)}</p>
            <div className="two-fields">
              <label className="stack-label">
                {es ? 'Porciones (1–12)' : 'Servings (1–12)'}
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  aria-invalid={!validServing}
                  aria-describedby={!validServing ? 'serving-error' : undefined}
                />
              </label>
              <label className="stack-label">
                {es ? 'Método' : 'Method'}
                <select
                  value={methodId}
                  onChange={(e) => setMethodId(e.target.value)}
                >
                  {!method && (
                    <option value="">
                      {es
                        ? 'Elige un método compatible'
                        : 'Choose a compatible method'}
                    </option>
                  )}
                  {evaluation?.methods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {localized(m.name, language)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {!validServing && (
              <p id="serving-error" className="validation" role="alert">
                {es
                  ? 'Ingresa un número entero de 1 a 12.'
                  : 'Enter a whole number from 1 to 12.'}
              </p>
            )}
            {validServing && method && (
              <p className="supporting">
                {es
                  ? 'Tiempo total estimado por tandas'
                  : 'Estimated total time across batches'}
                : {preparationMinutes(recipe, method, Number(servings))}{' '}
                {es
                  ? 'minutos. El tiempo real puede variar.'
                  : 'minutes. Actual time may vary.'}
              </p>
            )}
            {validServing && (!evaluation?.compatible || !method) && (
              <p className="notice warning" role="alert">
                {es
                  ? 'Esta selección no cumple tus restricciones actuales de equipo, dieta, alérgenos, refrigeración, tiempo o presupuesto. Revisa tus preferencias o selecciona otro método compatible.'
                  : 'This selection does not meet your current equipment, diet, allergen, refrigeration, time or budget constraints. Review your preferences or choose another compatible method.'}
              </p>
            )}
            {evaluation && <RecipeCost cost={evaluation.cost} />}
            <h3>
              {es
                ? 'Ingredientes para estas porciones'
                : 'Ingredients for these servings'}
            </h3>
            <ul className="ingredient-list">
              {scaled.map((i) => (
                <li key={i.id}>
                  {quantityText(i.quantity, i.unit, language)} —{' '}
                  {ingredientName(i.id, language)}
                  <span>
                    {missing.some((m) => m.id === i.id)
                      ? es
                        ? 'Por comprar'
                        : 'Need to get'
                      : es
                        ? 'Lo tienes; verifica la cantidad'
                        : 'You have this; check quantity'}
                  </span>
                </li>
              ))}
            </ul>
            <p className="notice">
              {es
                ? 'La información del producto y la contaminación cruzada son desconocidas. Revisa todas las etiquetas; no es una garantía para alergias.'
                : 'Product information and cross-contact are unknown. Check all labels; this is not an allergy guarantee.'}
            </p>
            {method && (
              <>
                <h3>{es ? 'Preparación' : 'Preparation'}</h3>
                <p className="supporting">
                  {es ? 'Necesitas' : 'You need'}:{' '}
                  {method.equipment
                    .map((id) => {
                      const e = equipment.find((e) => e[0] === id)!;
                      return es ? e[2] : e[1];
                    })
                    .join(', ')}
                </p>
                <ol className="recipe-steps">
                  {method.steps.map((step, i) => (
                    <li key={i}>{localized(step, language)}</li>
                  ))}
                </ol>
              </>
            )}
            <h3>
              {es ? 'Preparación y conservación' : 'Handling and storage'}
            </h3>
            <p>{localized(storageGuidance, language)}</p>
            <a
              className="underlined"
              href={safetySource}
              target="_blank"
              rel="noreferrer"
            >
              {es
                ? 'Guía de seguridad del USDA (inglés)'
                : 'USDA food safety guidance'}{' '}
              ↗
            </a>
            <p className="supporting">
              {localized(recipeProvenance, language)}
            </p>
            {notice === 'limit' && (
              <p className="validation" role="alert">
                {es
                  ? 'El plan admite 200 productos. Reduce la lista antes de guardar.'
                  : 'The plan supports 200 grocery items. Reduce the list before saving.'}
              </p>
            )}
            <button
              className="primary"
              disabled={!validServing || !method || !evaluation?.compatible}
              onClick={() => {
                const next = transferRecipe(
                  plan,
                  recipe,
                  Number(servings),
                  methodId,
                ) as Plan;
                if (next.items.length > 200) {
                  setNotice('limit');
                  return;
                }
                setPlan(next);
                setNotice('saved');
                dialog.current?.close();
              }}
            >
              {es
                ? 'Guardar receta y añadir ingredientes faltantes'
                : 'Save recipe and add missing ingredients'}
            </button>
            <p className="supporting">
              {es
                ? 'Repetir esta acción actualiza esta receta sin duplicarla. No marca alimentos como adquiridos.'
                : 'Repeating this updates this recipe without duplicating it. It does not mark food as acquired.'}
            </p>
            <Link className="secondary" href="/FreshRouteMD/budget">
              {t('Plan your spending')} →
            </Link>
          </>
        )}
      </dialog>
    </>
  );
}
