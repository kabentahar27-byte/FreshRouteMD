'use client';
import { packageCoverage } from '@/lib/plan-review.mjs';
import { useLanguage } from './language-context';
import type { Grocery } from './plan-context';
export default function GroceryCoverage({
  item,
  onAdjust,
}: {
  item: Grocery;
  onAdjust?: (n: number) => void;
}) {
  const { language } = useLanguage(),
    es = language === 'es';
  const c = packageCoverage(item);
  if (c.status === 'manual') return null;
  return (
    <div
      className={
        c.status === 'short' ? 'notice warning full-row' : 'supporting full-row'
      }
    >
      <p>
        {c.status === 'short'
          ? es
            ? 'La cantidad de esta fila no alcanza para sus recetas.'
            : 'This row’s purchase quantity is too small for its recipes.'
          : c.status === 'covered'
            ? es
              ? 'El contenido que indicaste cubre las cantidades de esta fila.'
              : 'Your entered package contents cover this row’s recipe quantities.'
            : es
              ? 'Confirma que la cantidad de compra alcance; falta información del contenido del paquete.'
              : 'Check that the purchase quantity is enough; package contents are not fully specified.'}
      </p>
      {c.packagesNeeded !== null && (
        <p>
          {es
            ? 'Unidades enteras de compra necesarias'
            : 'Whole purchase units needed'}
          : {c.packagesNeeded}
        </p>
      )}
      {onAdjust &&
        c.packagesNeeded !== null &&
        c.packagesNeeded <= 10000 &&
        c.status !== 'covered' && (
          <button
            className="secondary"
            onClick={() => onAdjust(c.packagesNeeded!)}
          >
            {es ? 'Usar esta cantidad de compra' : 'Use this purchase quantity'}
          </button>
        )}
    </div>
  );
}
