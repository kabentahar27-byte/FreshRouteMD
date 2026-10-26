'use client';
import { ingredients, recipes } from '@/lib/recipes.mjs';
import { positiveAmount, priceInCents } from '@/lib/money.mjs';
import { usePlan } from './plan-context';
import { useLanguage } from './language-context';
export default function PriceQuotes() {
  const { plan, setPlan } = usePlan();
  const { language } = useLanguage(),
    es = language === 'es';
  const ids = Object.keys(ingredients);
  const name = (id: string) =>
    ingredients[id as keyof typeof ingredients].name[es ? 'es' : 'en'];
  const units = (id: string) => [
    ...new Set(
      recipes.flatMap((r) =>
        r.ingredients.filter((i) => i.id === id).map((i) => i.unit),
      ),
    ),
  ];
  const unitName = (u: string) =>
    es
      ? (
          {
            cup: 'taza(s)',
            tbsp: 'cucharada(s)',
            slice: 'rebanada(s)',
            each: 'unidad(es)',
          } as Record<string, string>
        )[u] || u
      : u;
  const edit = (id: string, key: string, value: string) =>
    setPlan((p) => ({
      ...p,
      priceQuotes: p.priceQuotes.map((q) =>
        q.ingredientId === id ? { ...q, [key]: value } : q,
      ),
    }));
  return (
    <details className="price-quotes">
      <summary>
        {es
          ? 'Precios de paquetes que conoces (opcional)'
          : 'Package prices you know (optional)'}
        {plan.priceQuotes.length ? ` (${plan.priceQuotes.length})` : ''}
      </summary>
      <p>
        {es
          ? 'Copia el precio y la cantidad utilizable del envase o recibo. La estimación compra paquetes enteros y usa solo unidades iguales; no deduce cuántas tazas hay en una lata. Los precios son estimaciones tuyas y pueden cambiar.'
          : 'Copy the price and usable contents from the package or receipt. Estimates buy whole packages and use matching units only; they do not infer how many cups a can holds. Prices are your estimates and may change.'}
      </p>
      {plan.priceQuotes.map((q) => (
        <fieldset key={q.ingredientId}>
          <legend>{name(q.ingredientId)}</legend>
          <div className="constraint-fields">
            <label className="stack-label">
              {es ? 'Precio por paquete ($)' : 'Price per package ($)'}
              <input
                value={q.price}
                inputMode="decimal"
                maxLength={12}
                onChange={(e) => edit(q.ingredientId, 'price', e.target.value)}
                aria-invalid={q.price !== '' && priceInCents(q.price) === null}
                aria-describedby={`quote-${q.ingredientId}`}
              />
            </label>
            <label className="stack-label">
              {es
                ? 'Cantidad utilizable por paquete'
                : 'Usable amount per package'}
              <input
                value={q.amount}
                inputMode="decimal"
                maxLength={12}
                onChange={(e) => edit(q.ingredientId, 'amount', e.target.value)}
                aria-invalid={
                  q.amount !== '' && positiveAmount(q.amount) === null
                }
                aria-describedby={`quote-${q.ingredientId}`}
              />
            </label>
            <label className="stack-label">
              {es ? 'Unidad de contenido' : 'Content unit'}
              <select
                value={q.unit}
                onChange={(e) => edit(q.ingredientId, 'unit', e.target.value)}
              >
                {units(q.ingredientId).map((u) => (
                  <option key={u} value={u}>
                    {unitName(u)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p id={`quote-${q.ingredientId}`} className="supporting">
            {es
              ? 'Precio de 0–1,000,000, hasta 2 decimales; contenido mayor que 0 hasta 10,000, hasta 3 decimales. Los datos vacíos o no válidos no se usan.'
              : 'Price 0–1,000,000, up to 2 decimals; contents above 0 to 10,000, up to 3 decimals. Blank or invalid quotes are not used.'}
          </p>
          <button
            className="text-button"
            onClick={() =>
              setPlan((p) => ({
                ...p,
                priceQuotes: p.priceQuotes.filter(
                  (x) => x.ingredientId !== q.ingredientId,
                ),
              }))
            }
          >
            {es ? 'Eliminar precio' : 'Remove quote'}
          </button>
        </fieldset>
      ))}
      <label className="stack-label">
        {es ? 'Añadir un precio' : 'Add a price quote'}
        <select
          value=""
          onChange={(e) => {
            const id = e.target.value;
            if (id)
              setPlan((p) => ({
                ...p,
                priceQuotes: [
                  ...p.priceQuotes,
                  {
                    ingredientId: id,
                    price: '',
                    amount: '',
                    unit: units(id)[0],
                  },
                ],
              }));
          }}
        >
          <option value="">
            {es ? 'Elige un ingrediente' : 'Choose an ingredient'}
          </option>
          {ids
            .filter(
              (id) => !plan.priceQuotes.some((q) => q.ingredientId === id),
            )
            .map((id) => (
              <option key={id} value={id}>
                {name(id)}
              </option>
            ))}
        </select>
      </label>
      <p className="supporting">
        {es
          ? 'Cambiar un precio aquí no sobrescribe las cantidades o precios de compras ya guardadas. Revísalos en el presupuesto.'
          : 'Changing a quote here does not overwrite saved grocery quantities or prices. Review them in the spending plan.'}
      </p>
    </details>
  );
}
