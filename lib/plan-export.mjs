import {
  recipes,
  ingredients,
  equipment,
  storageGuidance,
  recipeProvenance,
} from './recipes.mjs';
import { scaleIngredients, preparationMinutes } from './meal-engine.mjs';
import { groceryTotals } from './plan-model.mjs';
import { packageCoverage, savedMealReview } from './plan-review.mjs';
import { visitQuestions } from './visit-checklist.mjs';
import { travelModes, travelDirections } from './travel.mjs';
export function planText(plan, language = 'en') {
  const es = language === 'es',
    l = (x) => x[es ? 'es' : 'en'];
  const unit = (u) =>
    es
      ? {
          cup: 'taza(s)',
          tbsp: 'cucharada(s)',
          each: 'unidad(es)',
          slice: 'rebanada(s)',
          package: 'paquete(s)',
          unit: 'unidad(es)',
        }[u] || u
      : u;
  const money = (c) =>
    new Intl.NumberFormat(es ? 'es-US' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(c / 100);
  const lines = [
    'FreshRoute MD',
    es
      ? 'Plan personal guardado en este dispositivo'
      : 'Personal plan saved on this device',
    es
      ? 'No es una confirmación de existencias o servicios.'
      : 'This does not confirm stock or services.',
    '',
  ];
  lines.push(
    es
      ? 'Ingredientes declarados (cantidades desconocidas):'
      : 'Reported ingredients (quantities unknown):',
    plan.ingredients
      .map((id) => (ingredients[id] ? l(ingredients[id].name) : id))
      .join(', ') || '—',
  );
  const meals = plan.meals || (plan.selected ? [plan.selected] : []);
  for (const meal of meals) {
    const r = recipes.find((r) => r.id === meal.recipeId),
      method = r?.methods.find((m) => m.id === meal.methodId);
    if (!r || !method) continue;
    const review = savedMealReview(plan, meal);
    lines.push(
      '',
      l(r.name),
      `${meal.servings} ${es ? 'porciones' : 'servings'} · ${l(method.name)} · ${preparationMinutes(r, method, meal.servings)} ${es ? 'minutos estimados por tandas' : 'estimated minutes across batches'}`,
    );
    if (!review.compatible)
      lines.push(
        es
          ? 'REVISAR: no cumple tus restricciones actuales.'
          : 'REVIEW: does not meet your current constraints.',
      );
    if (review.groceriesChanged)
      lines.push(
        es
          ? 'REVISAR: los ingredientes o las compras cambiaron; vuelve a guardar la receta.'
          : 'REVIEW: ingredients or groceries changed; save this recipe again.',
      );
    lines.push(
      `${es ? 'Equipo necesario' : 'Required equipment'}: ${method.equipment.map((id) => equipment.find((e) => e[0] === id)?.[es ? 2 : 1] || id).join(', ')}`,
    );
    if (r.storage.includes('refrigerator'))
      lines.push(es ? 'Requiere refrigerador.' : 'Requires a refrigerator.');
    lines.push(
      ...scaleIngredients(r, meal.servings).map(
        (i) => `${i.quantity} ${unit(i.unit)} — ${l(ingredients[i.id].name)}`,
      ),
      ...method.steps.map((s, n) => `${n + 1}. ${l(s)}`),
    );
  }
  if (meals.length)
    lines.push(
      l(storageGuidance),
      l(recipeProvenance),
      es
        ? 'Revisa etiquetas y contaminación cruzada; no se garantiza seguridad para alergias.'
        : 'Check labels and cross-contact; allergy safety is not guaranteed.',
    );
  const sum = groceryTotals(plan.budget, plan.items);
  lines.push('', es ? 'Lista de compras' : 'Grocery list');
  for (const i of plan.items) {
    const known = ingredients[i.ingredientId];
    lines.push(
      `${i.acquired ? '[x]' : '[ ]'} ${known && i.name === known.name.en ? l(known.name) : i.name}: ${i.purchaseQuantity || '?'} ${unit(i.purchaseUnit)} × $${i.price || '?'}`,
    );
    for (const r of i.requirements)
      lines.push(
        `  ${l(recipes.find((x) => x.id === r.recipeId).name)}: ${r.quantity} ${unit(r.unit)} (${r.servings} ${es ? 'porciones' : 'servings'})`,
      );
    const coverage = packageCoverage(i);
    if (coverage.status === 'short')
      lines.push(
        es
          ? 'REVISAR: la cantidad de compra no alcanza para sus recetas.'
          : 'REVIEW: purchase quantity is insufficient for its recipes.',
      );
    if (coverage.status === 'unknown')
      lines.push(
        es
          ? 'Confirma la cantidad: el contenido del paquete es desconocido o incompatible.'
          : 'Check quantity: package contents are unknown or incompatible.',
      );
    if (coverage.packagesNeeded !== null)
      lines.push(
        `${es ? 'Unidades enteras de compra necesarias' : 'Whole purchase units needed'}: ${coverage.packagesNeeded}`,
      );
  }
  lines.push(
    `${es ? 'Presupuesto' : 'Budget'}: ${sum.budgetCents === null ? '?' : money(sum.budgetCents)}`,
    `${es ? 'Subtotal con precio' : 'Priced subtotal'}: ${sum.subtotalCents === null ? '?' : money(sum.subtotalCents)}${sum.complete ? '' : es ? ' (incompleto)' : ' (incomplete)'}`,
  );
  if (sum.remainingCents !== null)
    lines.push(
      `${sum.remainingCents < 0 ? (es ? 'Por encima del presupuesto' : 'Over budget') : es ? 'Restante tras el subtotal' : 'Remaining after priced subtotal'}: ${money(Math.abs(sum.remainingCents))}`,
    );
  lines.push(
    es
      ? 'Precios estimados por ti. Excluye productos sin precio o cantidad válidos, impuestos, transporte y cargos. Confirma que las cantidades alcancen.'
      : 'Prices estimated by you. Excludes items without valid prices or quantities, taxes, transportation and fees. Confirm quantities are sufficient.',
  );
  if (plan.travel) {
    lines.push(
      '',
      es ? 'Consideraciones para el trayecto' : 'Trip considerations',
      `${es ? 'Zona guardada' : 'Saved search area'}: ${plan.area?.label || '—'}`,
      `${es ? 'Transporte' : 'Transportation'}: ${travelModes.find((m) => m[0] === plan.travel.mode)?.[es ? 2 : 1] || '—'}`,
      `${es ? 'Radio en línea recta' : 'Straight-line radius'}: ${plan.travel.maxMiles} ${es ? 'millas' : 'miles'}`,
      es
        ? 'Ruta, costo del viaje y duración no verificados.'
        : 'Route, travel cost and duration unverified.',
    );
    if (plan.travel.needsStepFree)
      lines.push(
        es
          ? 'Confirma acceso sin escalones antes de ir.'
          : 'Confirm step-free access before visiting.',
      );
    if (plan.travel.notes) lines.push(plan.travel.notes);
  }
  for (const r of plan.resources) {
    lines.push(
      '',
      r.name,
      [r.address, r.city, r.zip].filter(Boolean).join(', '),
      `${es ? 'Tipo de recurso' : 'Resource type'}: ${r.resource_types.join(', ')}`,
      `${es ? 'Horario' : 'Hours'}: ${r.hours || '?'}`,
      `${es ? 'Requisitos' : 'Eligibility'}: ${r.eligibility || '?'}`,
      `${es ? 'Costo' : 'Cost'}: ${r.cost || '?'}`,
      `${es ? 'Teléfono' : 'Phone'}: ${r.phone || '?'}`,
      `${es ? 'Guardado' : 'Saved'}: ${r.savedAt}`,
      es
        ? 'Copia de la fuente original; puede estar desactualizada. Existencias y accesibilidad desconocidas.'
        : 'Saved copy of original source; may be outdated. Stock and accessibility unknown.',
    );
    if (r.notes) lines.push(r.notes);
    for (const p of r.provenance)
      lines.push(
        `${p.source_name}: ${p.source_url}`,
        `${es ? 'Recuperado' : 'Retrieved'}: ${p.date_imported}; ${es ? 'Fuente actualizada' : 'Source updated'}: ${p.source_updated_at || '?'}; ${es ? 'Última verificación' : 'Last verification'}: ${p.date_last_verified || '?'}; ${p.verification_scope || '?'}`,
      );
    for (const c of r.conflicts)
      lines.push(
        `${es ? 'Diferencia entre fuentes' : 'Source difference'}: ${c.field}: ${c.alternate} (${c.source_name})`,
      );
    const directions = travelDirections(r, plan.travel?.mode || 'unspecified');
    if (directions)
      lines.push(
        `${es ? 'Indicaciones externas' : 'External directions'}: ${directions}`,
      );
    lines.push(
      es
        ? 'Preguntas por verificar (marcadas = el usuario las preguntó; no son confirmaciones):'
        : 'Questions to verify (checked = user asked; not confirmations):',
      ...visitQuestions.map(
        (q) => `${r.checks.includes(q.id) ? '[x]' : '[ ]'} ${l(q)}`,
      ),
    );
  }
  if (plan.reviewNotes)
    lines.push(
      '',
      es ? 'Notas no evaluadas:' : 'Notes not evaluated:',
      plan.reviewNotes,
    );
  return lines.join('\n');
}
