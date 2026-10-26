'use client';
import { useLanguage } from './language-context';
import type { evaluateRecipe } from '@/lib/meal-engine.mjs';
export default function RecipeCost({
  cost,
}: {
  cost: ReturnType<typeof evaluateRecipe>['cost'];
}) {
  const { language } = useLanguage(),
    es = language === 'es';
  const amount =
    cost.subtotalCents === null
      ? '—'
      : new Intl.NumberFormat(es ? 'es-US' : 'en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(cost.subtotalCents / 100);
  return (
    <div
      className={
        cost.status === 'over'
          ? 'recipe-cost notice warning'
          : 'recipe-cost supporting'
      }
    >
      <p>
        <strong>
          {es
            ? 'Compra estimada para esta receta'
            : 'Estimated purchase for this recipe'}
          : {amount}
        </strong>
        {!cost.complete ? (es ? ' · incompleta' : ' · incomplete') : ''}
      </p>
      {cost.unpriced > 0 && (
        <p>
          {cost.unpriced}{' '}
          {es
            ? 'ingrediente(s) sin precio y contenido válidos.'
            : 'ingredient(s) need a valid price and package contents.'}
        </p>
      )}
      <p>
        {cost.status === 'over'
          ? es
            ? 'Por encima del presupuesto indicado.'
            : 'Over your entered budget.'
          : cost.status === 'within'
            ? es
              ? 'Dentro del presupuesto indicado para esta receta.'
              : 'Within your entered budget for this recipe.'
            : es
              ? 'No se puede confirmar si cabe en el presupuesto.'
              : 'Cannot confirm whether this fits your budget.'}
      </p>
      <p>
        {es
          ? 'Usa tus precios por paquete; excluye alimentos declarados disponibles, impuestos, transporte y otras comidas guardadas. Revisa el total combinado en Mi plan.'
          : 'Uses your package prices; excludes food you report having, taxes, transportation and other saved meals. Review the combined total in My plan.'}
      </p>
    </div>
  );
}
