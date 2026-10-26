'use client';
import PlanningConstraints from './planning-constraints';
import PriceQuotes from './price-quotes';
import { equipment, allergens } from '@/lib/recipes.mjs';
import { usePlan } from './plan-context';
import { useLanguage } from './language-context';
export default function MealPreferences() {
  const { plan, setPlan } = usePlan();
  const { language, t } = useLanguage();
  const es = language === 'es';
  const toggle = (
    key: 'equipment' | 'storage' | 'dietary' | 'allergens',
    value: string,
  ) =>
    setPlan((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((x) => x !== value)
        : [...p[key], value],
    }));
  return (
    <div className="meal-preferences">
      <PlanningConstraints />
      <fieldset>
        <legend>{es ? 'Equipo disponible' : 'Available equipment'}</legend>
        <div className="check-grid">
          {equipment.map(([id, en, sp]) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={plan.equipment.includes(id)}
                onChange={() => toggle('equipment', id)}
              />
              {es ? sp : en}
            </label>
          ))}
        </div>
        <p className="supporting">
          {es
            ? 'Se necesitan todos los utensilios de un método. Los métodos alternativos tienen sus propias instrucciones.'
            : 'Every tool in a method is required. Alternative methods have their own instructions.'}
        </p>
      </fieldset>
      <fieldset>
        <legend>{es ? 'Conservación de alimentos' : 'Food storage'}</legend>
        <label className="check-label">
          <input
            type="checkbox"
            checked={plan.storage.includes('refrigerator')}
            onChange={() => toggle('storage', 'refrigerator')}
          />
          {es
            ? 'Tengo refrigerador (40°F / 4°C o menos)'
            : 'I have a refrigerator (40°F / 4°C or below)'}
        </label>
      </fieldset>
      <details>
        <summary>
          {es
            ? 'Preferencias de dieta y alergias'
            : 'Dietary preferences and allergies'}
          {plan.dietary.length + plan.allergens.length > 0
            ? ` (${plan.dietary.length + plan.allergens.length})`
            : ''}
        </summary>
        <fieldset>
          <legend>
            {es ? 'Preferencias de dieta' : 'Dietary preferences'}
          </legend>
          <div className="check-grid">
            {['vegetarian', 'vegan'].map((d) => (
              <label key={d}>
                <input
                  type="checkbox"
                  checked={plan.dietary.includes(d)}
                  onChange={() => toggle('dietary', d)}
                />
                {t(d[0].toUpperCase() + d.slice(1))}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>
            {es
              ? 'Excluir alérgenos conocidos en la receta'
              : 'Exclude known recipe allergens'}
          </legend>
          <div className="check-grid">
            {allergens.map((a) => (
              <label key={a}>
                <input
                  type="checkbox"
                  checked={plan.allergens.includes(a)}
                  onChange={() => toggle('allergens', a)}
                />
                {t(a === 'egg' ? 'Eggs' : a[0].toUpperCase() + a.slice(1))}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="stack-label">
          {es
            ? 'Otras necesidades que debes revisar por tu cuenta'
            : 'Other needs for your own review'}
          <textarea
            maxLength={500}
            value={plan.reviewNotes}
            onChange={(e) =>
              setPlan((p) => ({ ...p, reviewNotes: e.target.value }))
            }
          />
        </label>
        <p className="supporting">
          {es
            ? 'Esta nota no filtra recetas. No evaluamos certificaciones halal, kosher o sin gluten, ni necesidades médicas.'
            : 'This note does not filter recipes. We do not evaluate halal, kosher or gluten-free certification, or medical needs.'}
        </p>
      </details>
      <PriceQuotes />
      <p className="notice">
        {es
          ? 'Las marcas y la contaminación cruzada son desconocidas. Ninguna receta se identifica como segura para alergias. Revisa los ingredientes, sustituciones y etiquetas de cada producto.'
          : 'Brands and cross-contact are unknown. No recipe is identified as allergy-safe. Check ingredients, substitutions and every product label.'}
      </p>
    </div>
  );
}
