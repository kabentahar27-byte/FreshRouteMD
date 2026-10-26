'use client';
import Link from 'next/link';

import Header from './header';
import PlanJourney from './plan-journey';
import Footer from './footer';
import { usePlan, PlanNotice } from './plan-context';
import { useLanguage } from './language-context';
import { ingredients } from '@/lib/recipes.mjs';
import { visitQuestions } from '@/lib/visit-checklist.mjs';
import { planText } from '@/lib/plan-export.mjs';
import {
  localized,
  ingredientName,
  quantityText,
  purchaseUnitName,
} from './meal-planner';
import { groceryTotals } from '@/lib/plan-model.mjs';
import { travelDirections, travelModes } from '@/lib/travel.mjs';
import SavedMeals from './saved-meals';
import GroceryCoverage from './grocery-coverage';
export default function SavedPlan() {
  const { plan, setPlan, ready } = usePlan();
  const { language, t } = useLanguage(),
    es = language === 'es';
  const totals = groceryTotals(plan.budget, plan.items);
  const money = (c: number) =>
    new Intl.NumberFormat(es ? 'es-US' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(c / 100);
  function download() {
    const url = URL.createObjectURL(
      new Blob([planText(plan, language)], {
        type: 'text/plain;charset=utf-8',
      }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FreshRoute-MD-plan.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <Header />
      <main id="main" className="app-main task-page saved-plan">
        <h1>{es ? 'Mi plan' : 'My plan'}</h1>
        <p className="lead">
          {es
            ? 'Tus comidas, compras y consideraciones para la visita, en un solo lugar.'
            : 'Your meals, groceries and visit considerations in one place.'}
        </p>
        <PlanJourney current="plan" />
        <div className="no-print">
          <PlanNotice />
          <div className="location-actions">
            <button
              className="primary"
              disabled={!ready}
              onClick={() => window.print()}
            >
              {es ? 'Imprimir / guardar PDF' : 'Print / save PDF'}
            </button>
            <button className="secondary" disabled={!ready} onClick={download}>
              {es ? 'Exportar texto' : 'Export text'}
            </button>
            <Link className="underlined" href="/FreshRouteMD/profile">
              {es
                ? 'Preferencias y datos del dispositivo'
                : 'Preferences and device data'}
            </Link>
          </div>
        </div>
        {ready && (
          <>
            <SavedMeals />
            <section className="calm-panel workflow-section">
              <h2>{es ? 'Lista de compras' : 'Grocery list'}</h2>
              <ul className="plan-groceries">
                {plan.items.map((i) => (
                  <li key={i.id}>
                    <strong>
                      {i.ingredientId &&
                      i.name ===
                        ingredients[i.ingredientId as keyof typeof ingredients]
                          ?.name.en
                        ? ingredientName(i.ingredientId, language)
                        : i.name}
                    </strong>{' '}
                    ·{' '}
                    {i.acquired
                      ? es
                        ? 'Adquirido'
                        : 'Acquired'
                      : es
                        ? 'Pendiente'
                        : 'Still needed'}
                    <br />
                    {i.purchaseQuantity || '?'}{' '}
                    {purchaseUnitName(i.purchaseUnit, language)} × $
                    {i.price || '?'}
                    <GroceryCoverage item={i} />
                    {i.requirements.map((r, j) => (
                      <p className="supporting" key={j}>
                        {es ? 'La receta necesita' : 'Recipe needs'}:{' '}
                        {quantityText(r.quantity, r.unit, language)} (
                        {r.servings} {es ? 'porciones' : 'servings'})
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
              {!plan.items.length && <p>{t('No groceries added yet.')}</p>}
              <p>
                {t('Budget ($)')}:{' '}
                {totals.budgetCents === null ? '—' : money(totals.budgetCents)}
              </p>
              <p>
                <strong>
                  {totals.complete
                    ? t('Total groceries')
                    : es
                      ? 'Subtotal incompleto'
                      : 'Incomplete subtotal'}
                  :{' '}
                  {totals.subtotalCents === null
                    ? '—'
                    : money(totals.subtotalCents)}
                </strong>
              </p>
              {totals.remainingCents !== null && (
                <p className={totals.remainingCents < 0 ? 'validation' : ''}>
                  {totals.remainingCents < 0
                    ? t('Over budget')
                    : es
                      ? 'Restante tras el subtotal'
                      : 'Remaining after priced subtotal'}
                  : {money(Math.abs(totals.remainingCents))}
                </p>
              )}
              <p className="supporting">
                {es
                  ? 'Los precios son estimaciones tuyas. Excluye productos sin precio o cantidad válidos, impuestos, transporte y cargos. Confirma que las compras alcancen; los paquetes solo se calculan con el contenido que indicaste.'
                  : 'Prices are your estimates. Excludes items without valid prices or quantities, taxes, transportation and fees. Check purchases are sufficient; packages are calculated only from contents you entered.'}
              </p>
              <Link className="underlined no-print" href="/FreshRouteMD/budget">
                {t('Plan your spending')} →
              </Link>
            </section>
            <section className="calm-panel workflow-section">
              <h2>
                {es
                  ? 'Consideraciones para el trayecto'
                  : 'Trip considerations'}
              </h2>
              <p>
                {es ? 'Zona guardada' : 'Saved search area'}:{' '}
                {plan.area?.label || (es ? 'No indicada' : 'Not supplied')}
              </p>
              <p>
                {es ? 'Transporte' : 'Transportation'}:{' '}
                {
                  travelModes.find((m) => m[0] === plan.travel.mode)?.[
                    es ? 2 : 1
                  ]
                }{' '}
                · {plan.travel.maxMiles}{' '}
                {es
                  ? 'millas de radio en línea recta'
                  : 'mile straight-line radius'}
              </p>
              {plan.travel.needsStepFree && (
                <p className="notice">
                  {es
                    ? 'Confirma acceso sin escalones antes de ir; la fuente no lo verifica.'
                    : 'Confirm step-free access before visiting; the source does not verify it.'}
                </p>
              )}
              {plan.travel.notes && <p>{plan.travel.notes}</p>}
              <p className="supporting">
                {es
                  ? 'La ruta, el costo y la duración del viaje no están verificados ni incluidos en el presupuesto. Elige indicaciones para consultar opciones externas.'
                  : 'Route, travel cost and duration are unverified and excluded from your budget. Choose directions to check external options.'}
              </p>
              <Link className="underlined no-print" href="/FreshRouteMD/profile">
                {es
                  ? 'Editar preferencias de viaje'
                  : 'Edit travel preferences'}
              </Link>
            </section>
            <section className="workflow-section">
              <h2>
                {es
                  ? 'Recursos guardados y lista para la visita'
                  : 'Saved resources and visit checklist'}
              </h2>
              <p>
                {es
                  ? 'Guardar un lugar no significa haber obtenido alimentos. Las preguntas marcadas solo indican que tú las hiciste; FreshRoute no confirma respuestas.'
                  : 'Saving a place does not mean you obtained food. Checked questions only indicate that you asked them; FreshRoute does not confirm answers.'}
              </p>
              {!plan.resources.length && (
                <p>
                  {es
                    ? 'No hay recursos guardados. Abre los detalles de un resultado y elige Guardar en mi plan.'
                    : 'No saved resources. Open a result’s details and choose Save to my plan.'}
                </p>
              )}
              {plan.resources.map((r) => (
                <article className="calm-panel saved-resource" key={r.id}>
                  <h3>{r.name}</h3>
                  <p className="supporting">
                    {t('Source information is shown in its original language.')}
                  </p>
                  <p>{[r.address, r.city, r.zip].filter(Boolean).join(', ')}</p>
                  <p>
                    <strong>{t('Hours')}:</strong>{' '}
                    {r.hours || t('Not supplied')}
                  </p>
                  <p>
                    <strong>{t('Eligibility & visit instructions')}:</strong>{' '}
                    {r.eligibility || t('Not supplied')}
                  </p>
                  <p>
                    <strong>{t('Cost')}:</strong>{' '}
                    {r.cost || t('Not confirmed by source')}
                  </p>
                  <p>{r.phone || t('Not supplied')}</p>
                  <p>{r.notes}</p>
                  <p className="notice">
                    {es
                      ? 'Existencias, accesibilidad y transporte: no confirmados. Esta es una copia guardada; puede estar desactualizada.'
                      : 'Stock, accessibility and transportation: unconfirmed. This is a saved copy and may be outdated.'}
                  </p>
                  <p className="supporting">
                    {es ? 'Guardado' : 'Saved'}:{' '}
                    {new Date(r.savedAt).toLocaleString(es ? 'es-US' : 'en-US')}
                  </p>
                  {r.provenance.map((p, i) => (
                    <div className="source-lines" key={i}>
                      <a
                        className="underlined"
                        href={p.source_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p.source_name} ↗
                      </a>
                      <p>
                        {es ? 'Recuperado' : 'Retrieved'}: {p.date_imported}
                        <br />
                        {t('Source updated')}:{' '}
                        {p.source_updated_at || t('Not supplied')}
                        <br />
                        {t('Last verification')}:{' '}
                        {p.date_last_verified || t('Not supplied')}
                        <br />
                        {p.verification_scope || t('Not supplied')}
                      </p>
                    </div>
                  ))}
                  {r.conflicts.length > 0 && (
                    <p>
                      {t('Source differences — verify directly')}:{' '}
                      {r.conflicts
                        .map(
                          (c) =>
                            `${c.field}: ${c.alternate} (${c.source_name})`,
                        )
                        .join('; ')}
                    </p>
                  )}
                  <fieldset className="visit-checklist">
                    <legend>
                      {es
                        ? 'Preguntas para el proveedor'
                        : 'Questions for the provider'}
                    </legend>
                    {visitQuestions.map((q) => (
                      <label key={q.id}>
                        <input
                          type="checkbox"
                          checked={r.checks.includes(q.id)}
                          onChange={() =>
                            setPlan((p) => ({
                              ...p,
                              resources: p.resources.map((x) =>
                                x.id === r.id
                                  ? {
                                      ...x,
                                      checks: x.checks.includes(q.id)
                                        ? x.checks.filter((k) => k !== q.id)
                                        : [...x.checks, q.id],
                                    }
                                  : x,
                              ),
                            }))
                          }
                        />
                        {localized(q, language)}
                      </label>
                    ))}
                  </fieldset>
                  <div className="location-actions no-print">
                    {travelDirections(r, plan.travel.mode) && (
                      <a
                        className="secondary"
                        href={travelDirections(r, plan.travel.mode)!}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('Get directions')}
                      </a>
                    )}
                    <button
                      className="text-button"
                      onClick={() =>
                        setPlan((p) => ({
                          ...p,
                          resources: p.resources.filter((x) => x.id !== r.id),
                        }))
                      }
                    >
                      {t('Remove')}
                    </button>
                  </div>
                </article>
              ))}
              <Link className="secondary no-print" href="/FreshRouteMD/find-food">
                {t('Find food')} →
              </Link>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
