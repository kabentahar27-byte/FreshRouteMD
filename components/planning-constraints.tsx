'use client';
import { usePlan } from './plan-context';
import { useLanguage } from './language-context';
import { priceInCents } from '@/lib/money.mjs';
export default function PlanningConstraints() {
  const { plan, setPlan } = usePlan();
  const { language } = useLanguage(),
    es = language === 'es';
  return (
    <fieldset className="planning-constraints">
      <legend>
        {es ? 'Personas, tiempo y presupuesto' : 'People, time and budget'}
      </legend>
      <div className="constraint-fields">
        <label className="stack-label">
          {es
            ? 'Personas / porciones por comida'
            : 'People / servings per meal'}
          <select
            value={plan.householdSize}
            onChange={(e) =>
              setPlan((p) => ({ ...p, householdSize: Number(e.target.value) }))
            }
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="stack-label">
          {es ? 'Tiempo máximo estimado' : 'Maximum estimated preparation time'}
          <select
            value={plan.maxPrepMinutes}
            onChange={(e) =>
              setPlan((p) => ({ ...p, maxPrepMinutes: e.target.value }))
            }
          >
            <option value="">{es ? 'Sin límite' : 'No limit'}</option>
            {['5', '10', '15', '20', '30', '45', '60'].map((n) => (
              <option key={n} value={n}>
                {n} {es ? 'minutos' : 'minutes'}
              </option>
            ))}
          </select>
        </label>
        <label className="stack-label">
          {es
            ? 'Presupuesto total para compras ($)'
            : 'Total grocery budget ($)'}
          <input
            value={plan.budget}
            inputMode="decimal"
            maxLength={12}
            aria-invalid={
              plan.budget !== '' && priceInCents(plan.budget) === null
            }
            aria-describedby="constraint-budget-help"
            onChange={(e) => setPlan((p) => ({ ...p, budget: e.target.value }))}
          />
        </label>
      </div>
      <p
        id="constraint-budget-help"
        className={
          plan.budget !== '' && priceInCents(plan.budget) === null
            ? 'validation'
            : 'supporting'
        }
        role={
          plan.budget !== '' && priceInCents(plan.budget) === null
            ? 'alert'
            : undefined
        }
      >
        {es
          ? 'Presupuesto opcional: de 0 a 1,000,000 USD, hasta dos decimales. Las porciones nuevas usan el tamaño del hogar; puedes editarlas por receta.'
          : 'Optional budget: 0–1,000,000 USD, up to two decimals. New recipe choices use your household size; you can edit each recipe’s servings.'}
      </p>
      <p className="supporting">
        {es
          ? 'El tiempo es una estimación conservadora por tanda, no una promesa. Las tandas adicionales cuentan por separado.'
          : 'Time is a conservative estimate per batch, not a promise. Additional batches count separately.'}
      </p>
      <label className="check-label">
        <input
          type="checkbox"
          checked={plan.onlyAffordable}
          onChange={(e) =>
            setPlan((p) => ({ ...p, onlyAffordable: e.target.checked }))
          }
        />
        {es
          ? 'Mostrar solo recetas con estimaciones completas dentro de mi presupuesto'
          : 'Only show recipes with complete estimates within my budget'}
      </label>
      {plan.onlyAffordable && (
        <p className="notice" role="status">
          {es
            ? 'Este filtro oculta recetas con precios desconocidos. Introduce precios de paquetes o desmarca la casilla para explorar comidas antes de calcular su costo.'
            : 'This filter hides recipes with unknown prices. Enter package prices, or uncheck it to explore meals before pricing groceries.'}
        </p>
      )}
    </fieldset>
  );
}
