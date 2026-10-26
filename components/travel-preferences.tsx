'use client';
import { usePlan } from './plan-context';
import { useLanguage } from './language-context';
import { travelModes } from '@/lib/travel.mjs';
export default function TravelPreferences() {
  const { plan, setPlan, ready } = usePlan();
  const { language } = useLanguage(),
    es = language === 'es';
  if (!ready) return null;
  const edit = (key: keyof typeof plan.travel, value: string | boolean) =>
    setPlan((p) => ({ ...p, travel: { ...p.travel, [key]: value } }));
  return (
    <fieldset className="travel-preferences">
      <legend>{es ? 'Planifica el trayecto' : 'Plan your trip'}</legend>
      <div className="two-fields">
        <label className="stack-label">
          {es ? 'Transporte' : 'Transportation'}
          <select
            value={plan.travel.mode}
            onChange={(e) => edit('mode', e.target.value)}
          >
            {travelModes.map(([id, en, sp]) => (
              <option key={id} value={id}>
                {es ? sp : en}
              </option>
            ))}
          </select>
        </label>
        <label className="stack-label">
          {es
            ? 'Radio máximo en línea recta (millas)'
            : 'Maximum straight-line radius (miles)'}
          <select
            value={plan.travel.maxMiles}
            onChange={(e) => edit('maxMiles', e.target.value)}
          >
            {['1', '3', '5', '10', '25', '50', '250'].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="check-label">
        <input
          type="checkbox"
          checked={plan.travel.needsStepFree}
          onChange={(e) => edit('needsStepFree', e.target.checked)}
        />
        {es
          ? 'Necesito confirmar acceso sin escalones'
          : 'I need to confirm step-free access'}
      </label>
      <label className="stack-label">
        {es
          ? 'Consideraciones para la visita (opcional)'
          : 'Visit considerations (optional)'}
        <textarea
          maxLength={300}
          value={plan.travel.notes}
          onChange={(e) => edit('notes', e.target.value)}
        />
      </label>
      <p className="supporting">
        {es
          ? 'El radio filtra distancias aproximadas. El transporte se usa en los enlaces externos de indicaciones y en tu plan; no verifica rutas, horarios, accesibilidad ni tiempo de viaje. Confirma esas condiciones antes de ir.'
          : 'The radius filters approximate distances. Transportation is used in external directions links and your plan; it does not verify routes, schedules, accessibility or travel time. Confirm those conditions before visiting.'}
      </p>
    </fieldset>
  );
}
