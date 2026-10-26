'use client';
import Link from 'next/link';

import { useState } from 'react';
import GroceryCoverage from './grocery-coverage';
import { positiveAmount } from '@/lib/money.mjs';
import { savedMealReview, packageCoverage } from '@/lib/plan-review.mjs';
import Header from './header';
import Footer from './footer';
import { useLanguage } from './language-context';
import { usePlan, PlanNotice, type Grocery } from './plan-context';
import { groceryTotals, canCombine, combineItems } from '@/lib/plan-model.mjs';
import { ingredients, recipes } from '@/lib/recipes.mjs';
import {
  ingredientName,
  quantityText,
  localized,
  purchaseUnitName,
} from './meal-planner';
export default function ManualBudget() {
  const { language, t } = useLanguage(),
    es = language === 'es';
  const { plan, setPlan, ready } = usePlan();
  const [message, setMessage] = useState('');
  const totals = groceryTotals(plan.budget, plan.items);
  const money = (n: number) =>
    new Intl.NumberFormat(es ? 'es-US' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(n / 100);
  const edit = (id: string, key: keyof Grocery, value: string | boolean) =>
    setPlan((p) => ({
      ...p,
      items: p.items.map((i) =>
        i.id === id
          ? {
              ...i,
              [key]: value,
              ...(key === 'purchaseUnit'
                ? { packageAmount: '', packageMeasure: '' }
                : {}),
            }
          : i,
      ),
    }));
  return (
    <>
      <Header />
      <main id="main" className="app-main task-page">
        <h1>{t('Plan your spending')}</h1>
        <p className="lead">
          {t('Enter your budget to see what is left after groceries.')}
        </p>
        <PlanNotice />
        {ready && (
          <>
            <p className="notice">
              {es
                ? 'Usa precios de tu recibo o comercio. Las cantidades de recetas no equivalen a paquetes. Comprueba el tamaño del paquete o la unidad de venta antes de fijar la cantidad a comprar.'
                : 'Use prices from your receipt or retailer. Recipe quantities do not equal packages. Check package size or the selling unit before setting the quantity to buy.'}
            </p>
            {plan.meals.some(
              (m) => savedMealReview(plan, m).groceriesChanged,
            ) && (
              <p className="notice warning">
                {es
                  ? 'Los ingredientes o las compras cambiaron. Vuelve a guardar las comidas afectadas para actualizar la lista.'
                  : 'Ingredients or groceries changed. Save affected meals again to refresh the grocery list.'}{' '}
                <Link href="/FreshRouteMD/meals#saved-meals">
                  {es ? 'Revisar comidas' : 'Review meals'}
                </Link>
              </p>
            )}
            <div className="manual-budget-layout">
              <section className="calm-panel">
                <label className="budget-label">
                  {t('Budget ($)')}
                  <input
                    type="text"
                    inputMode="decimal"
                    maxLength={12}
                    value={plan.budget}
                    onChange={(e) =>
                      setPlan((p) => ({ ...p, budget: e.target.value }))
                    }
                    aria-invalid={totals.budgetCents === null}
                    aria-describedby="budget-help"
                  />
                </label>
                <p
                  id="budget-help"
                  className={
                    totals.budgetCents === null ? 'validation' : 'supporting'
                  }
                >
                  {es
                    ? 'De 0 a 1,000,000 USD; máximo dos decimales.'
                    : '0 to 1,000,000 USD; up to two decimal places.'}
                </p>
                {plan.items.length === 0 && (
                  <div className="empty-state">
                    <p>{t('No groceries added yet.')}</p>
                    <Link className="secondary" href="/FreshRouteMD/meals">
                      {t('Choose a meal')} →
                    </Link>
                  </div>
                )}
                <div className="manual-items">
                  {plan.items.map((item, index) => {
                    const known =
                      item.ingredientId &&
                      ingredients[
                        item.ingredientId as keyof typeof ingredients
                      ];
                    const name =
                      known && item.name === known.name.en
                        ? ingredientName(item.ingredientId!, language)
                        : item.name;
                    const matches = plan.items.filter(
                      (other) =>
                        canCombine(item, other) &&
                        Number(item.purchaseQuantity) > 0 &&
                        Number(other.purchaseQuantity) > 0,
                    );
                    return (
                      <fieldset key={item.id}>
                        <legend>
                          {name || `${t('Grocery item')} ${index + 1}`}
                        </legend>
                        <label>
                          {t('Grocery item')}
                          <input
                            maxLength={100}
                            value={name}
                            onChange={(e) =>
                              edit(item.id, 'name', e.target.value)
                            }
                          />
                        </label>
                        {item.requirements.length > 0 && (
                          <div className="item-requirements">
                            <strong>
                              {es
                                ? 'Cantidad requerida en recetas'
                                : 'Recipe requirements'}
                            </strong>
                            <ul>
                              {item.requirements.map((r, j) => (
                                <li key={j}>
                                  {quantityText(r.quantity, r.unit, language)} ·{' '}
                                  {localized(
                                    recipes.find((x) => x.id === r.recipeId)!
                                      .name,
                                    language,
                                  )}{' '}
                                  ({r.servings} {es ? 'porciones' : 'servings'})
                                </li>
                              ))}
                            </ul>
                            <p className="supporting">
                              {es
                                ? 'Compra suficiente para estas cantidades. No convertimos tazas a latas ni gramos a paquetes.'
                                : 'Buy enough for these quantities. We do not convert cups to cans or grams to packages.'}
                            </p>
                          </div>
                        )}
                        {item.requirements.length > 0 && (
                          <div className="full-row package-contents">
                            <details>
                              <summary>
                                {es
                                  ? 'Contenido de cada unidad de compra (opcional)'
                                  : 'Contents of each purchase unit (optional)'}
                              </summary>
                              <p className="supporting">
                                {es
                                  ? 'Indica el contenido utilizable en la misma unidad de la receta. Cambiar la unidad de compra borra estos datos para evitar conversiones incorrectas.'
                                  : 'Enter usable contents in the recipe’s unit. Changing the purchase unit clears these contents to prevent incorrect conversions.'}
                              </p>
                              <div className="two-fields">
                                <label className="stack-label">
                                  {es ? 'Cantidad utilizable' : 'Usable amount'}
                                  <input
                                    value={item.packageAmount || ''}
                                    inputMode="decimal"
                                    maxLength={12}
                                    aria-invalid={
                                      !!item.packageAmount &&
                                      positiveAmount(item.packageAmount) ===
                                        null
                                    }
                                    aria-describedby={`contents-help-${item.id}`}
                                    onChange={(e) =>
                                      edit(
                                        item.id,
                                        'packageAmount',
                                        e.target.value,
                                      )
                                    }
                                  />
                                </label>
                                <label className="stack-label">
                                  {es ? 'Unidad de contenido' : 'Content unit'}
                                  <select
                                    value={item.packageMeasure || ''}
                                    onChange={(e) =>
                                      edit(
                                        item.id,
                                        'packageMeasure',
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">
                                      {es ? 'Selecciona' : 'Choose'}
                                    </option>
                                    {[
                                      ...new Set(
                                        item.requirements.map((r) => r.unit),
                                      ),
                                    ].map((u) => (
                                      <option key={u} value={u}>
                                        {quantityText(1, u, language)}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                              <p
                                className="supporting"
                                id={`contents-help-${item.id}`}
                              >
                                {es
                                  ? 'Mayor que 0 hasta 10,000; hasta tres decimales. No se convierten unidades.'
                                  : 'Above 0 to 10,000; up to three decimals. No unit conversions are made.'}
                              </p>
                            </details>
                          </div>
                        )}
                        <GroceryCoverage
                          item={item}
                          onAdjust={(n) =>
                            edit(item.id, 'purchaseQuantity', String(n))
                          }
                        />
                        <label>
                          {es
                            ? 'Unidad de compra (paquete, libra…)'
                            : 'Purchase unit (package, pound…)'}
                          <input
                            value={purchaseUnitName(
                              item.purchaseUnit,
                              language,
                            )}
                            maxLength={50}
                            onChange={(e) =>
                              edit(item.id, 'purchaseUnit', e.target.value)
                            }
                          />
                        </label>
                        <label>
                          {es
                            ? 'Cantidad de unidades a comprar'
                            : 'Purchase quantity'}
                          <input
                            type="text"
                            inputMode="decimal"
                            maxLength={12}
                            value={item.purchaseQuantity}
                            aria-invalid={
                              item.purchaseQuantity !== '' &&
                              positiveAmount(item.purchaseQuantity) === null
                            }
                            onChange={(e) =>
                              edit(item.id, 'purchaseQuantity', e.target.value)
                            }
                            aria-describedby={`item-help-${item.id}`}
                          />
                        </label>
                        <label>
                          {es
                            ? 'Precio por unidad de compra ($)'
                            : 'Price per purchase unit ($)'}
                          <input
                            type="text"
                            inputMode="decimal"
                            maxLength={12}
                            value={item.price}
                            onChange={(e) =>
                              edit(item.id, 'price', e.target.value)
                            }
                            aria-describedby={`item-help-${item.id}`}
                            aria-invalid={totals.invalid.includes(item.id)}
                          />
                        </label>
                        <p
                          id={`item-help-${item.id}`}
                          className={
                            totals.invalid.includes(item.id)
                              ? 'validation full-row'
                              : 'supporting full-row'
                          }
                        >
                          {es
                            ? 'Precio: 0–1,000,000, hasta 2 decimales. Cantidad: mayor que 0 hasta 10,000, hasta 3 decimales. Un precio vacío queda pendiente.'
                            : 'Price: 0–1,000,000, up to 2 decimals. Quantity: above 0 to 10,000, up to 3 decimals. A blank price stays unpriced.'}
                        </p>
                        <label className="check-label full-row">
                          <input
                            type="checkbox"
                            checked={item.acquired}
                            onChange={(e) =>
                              edit(item.id, 'acquired', e.target.checked)
                            }
                          />
                          {es
                            ? 'Ya lo adquirí (el costo permanece incluido)'
                            : 'I acquired this (cost stays included)'}
                        </label>
                        <button
                          className="text-button"
                          onClick={() =>
                            setPlan((p) => ({
                              ...p,
                              items: p.items.filter((i) => i.id !== item.id),
                            }))
                          }
                        >
                          {t('Remove')}
                        </button>
                        {matches.map((other) => (
                          <button
                            key={other.id}
                            className="text-button"
                            onClick={() => {
                              setPlan((p) => ({
                                ...p,
                                items: combineItems(p.items, item.id, other.id),
                              }));
                              setMessage('combined');
                            }}
                          >
                            {es ? 'Combinar con' : 'Combine with'} {other.name}{' '}
                            (#{plan.items.indexOf(other) + 1})
                          </button>
                        ))}
                      </fieldset>
                    );
                  })}
                </div>
                <button
                  className="secondary"
                  disabled={plan.items.length >= 200}
                  onClick={() =>
                    setPlan((p) => ({
                      ...p,
                      items: [
                        ...p.items,
                        {
                          id: crypto.randomUUID(),
                          name: '',
                          ingredientId: null,
                          requirements: [],
                          price: '',
                          purchaseQuantity: '',
                          purchaseUnit: 'package',
                          acquired: false,
                        },
                      ],
                    }))
                  }
                >
                  {t('Add item')} +
                </button>
                <p className="supporting">
                  {es
                    ? 'Solo se pueden combinar el mismo producto, unidades compatibles, precio y estado iguales.'
                    : 'Combine is offered only for the same product, compatible units, identical prices and acquired status.'}
                </p>
                <p role="status">
                  {message === 'combined'
                    ? es
                      ? 'Productos compatibles combinados; revisa la cantidad de compra.'
                      : 'Compatible items combined; review purchase quantity.'
                    : ''}
                </p>
              </section>
              <aside
                className={
                  'budget-summary calm-panel ' +
                  (totals.remainingCents !== null && totals.remainingCents < 0
                    ? 'over-budget'
                    : '')
                }
                aria-live="polite"
              >
                <p>
                  {totals.complete
                    ? t('Total groceries')
                    : es
                      ? 'Subtotal con precio — incompleto'
                      : 'Priced subtotal — incomplete'}
                </p>
                <strong>
                  {totals.subtotalCents === null
                    ? '—'
                    : money(totals.subtotalCents)}
                </strong>
                {plan.items.some(
                  (i) => packageCoverage(i).status === 'short',
                ) && (
                  <p className="notice warning">
                    {es
                      ? 'Hay cantidades insuficientes para las recetas. El gasto aumentará si compras lo que falta.'
                      : 'Some quantities do not cover recipe requirements. Spending will increase if you buy the shortfall.'}
                  </p>
                )}
                {totals.unpriced > 0 && (
                  <p>
                    {totals.unpriced}{' '}
                    {es
                      ? 'producto(s) sin precio o cantidad válidos; no incluidos.'
                      : 'item(s) lack a valid price or quantity; excluded.'}
                  </p>
                )}
                {totals.overflow && (
                  <p role="alert" className="validation">
                    {es
                      ? 'El total excede el límite de cálculo de 1,000,000 USD. Revisa las entradas.'
                      : 'Total exceeds the 1,000,000 USD calculation limit. Review your entries.'}
                  </p>
                )}
                {totals.remainingCents !== null ? (
                  <>
                    <h2>
                      {totals.remainingCents < 0
                        ? t('Over budget')
                        : totals.complete
                          ? t('Remaining')
                          : es
                            ? 'Restante después del subtotal'
                            : 'Remaining after priced subtotal'}
                    </h2>
                    <output>{money(Math.abs(totals.remainingCents))}</output>
                    {!totals.complete && (
                      <p>
                        {es
                          ? 'Provisional: los productos pendientes pueden aumentar el gasto.'
                          : 'Provisional: unpriced items may increase spending.'}
                      </p>
                    )}
                  </>
                ) : (
                  <p>
                    {es
                      ? 'Ingresa un presupuesto válido para calcular el restante.'
                      : 'Enter a valid budget to calculate what remains.'}
                  </p>
                )}
                <p className="supporting">
                  {es
                    ? 'Incluye las cantidades de compra con precios válidos, también los productos marcados como adquiridos. Excluye impuestos, transporte, cargos y otros gastos del hogar. No se proporcionan precios de demostración ni en tiempo real.'
                    : 'Includes explicitly priced purchase quantities, including items marked acquired. Excludes taxes, transportation, fees and other household expenses. No demo or live prices are supplied.'}
                </p>
                <Link className="primary" href="/FreshRouteMD/plan">
                  {es ? 'Ver o imprimir mi plan' : 'View or print my plan'} →
                </Link>
                <Link className="underlined" href="/FreshRouteMD/meals">
                  {t('Choose a meal')}
                </Link>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
