'use client';
import Link from 'next/link';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { emptyPlan, readPlan, PLAN_KEY } from '@/lib/plan-model.mjs';
import type { Resource } from '@/lib/resources';
import { useLanguage } from './language-context';
export type Grocery = {
  id: string;
  name: string;
  ingredientId: string | null;
  requirements: {
    recipeId: string;
    servings: number;
    quantity: number;
    unit: string;
  }[];
  price: string;
  purchaseQuantity: string;
  purchaseUnit: string;
  acquired: boolean;
  packageAmount?: string;
  packageMeasure?: string;
};
export type SavedResource = Resource & { savedAt: string; checks: string[] };
export type Plan = {
  version: 3;
  householdSize: number;
  maxPrepMinutes: string;
  onlyAffordable: boolean;
  priceQuotes: {
    ingredientId: string;
    price: string;
    amount: string;
    unit: string;
  }[];
  meals: { recipeId: string; servings: number; methodId: string }[];
  travel: {
    mode: string;
    maxMiles: string;
    needsStepFree: boolean;
    notes: string;
  };
  area: {
    label: string;
    coordinates: [number, number];
    kind: 'community' | 'zip';
  } | null;
  finder: {
    category: string;
    service: string;
    withPhone: boolean;
    sort: string;
  };
  excludedResourceIds: string[];
  ingredients: string[];
  equipment: string[];
  storage: string[];
  dietary: string[];
  allergens: string[];
  reviewNotes: string;
  budget: string;
  items: Grocery[];
  selected: { recipeId: string; servings: number; methodId: string } | null;
  resources: SavedResource[];
};
type Context = {
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
  ready: boolean;
  storageError: boolean;
  blocked: boolean;
  saveResource: (r: Resource) => void;
};
const Context = createContext<Context | null>(null);
export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>(() => emptyPlan() as Plan),
    [ready, setReady] = useState(false),
    [storageError, setStorageError] = useState(false),
    [blocked, setBlocked] = useState(false);
  useEffect(() => {
    try {
      const loaded = readPlan(localStorage);
      setPlan(loaded.plan as Plan);
      setBlocked(loaded.blocked);
    } catch {
      setBlocked(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || blocked) return;
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [plan, ready, blocked]);
  const saveResource = useCallback(
    (r: Resource) =>
      setPlan((p) =>
        p.resources.some((x) => x.id === r.id)
          ? p
          : {
              ...p,
              resources: [
                ...p.resources,
                { ...r, savedAt: new Date().toISOString(), checks: [] },
              ].slice(0, 30),
            },
      ),
    [],
  );
  return (
    <Context.Provider
      value={{ plan, setPlan, ready, storageError, blocked, saveResource }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePlan() {
  const value = useContext(Context);
  if (!value) throw new Error('PlanProvider is required');
  return value;
}
export function PlanNotice() {
  const { storageError, blocked, ready } = usePlan();
  const { language } = useLanguage();
  const es = language === 'es';
  if (!ready)
    return (
      <p role="status">{es ? 'Cargando tu plan…' : 'Loading your plan…'}</p>
    );
  if (blocked)
    return (
      <p className="notice warning" role="alert">
        {es
          ? 'No se pudieron leer los datos guardados. Se han conservado sin cambios; este plan solo está en memoria. Exporta tu plan antes de salir. Puedes borrar los datos desde Preferencias.'
          : 'Saved data could not be read. It has been preserved unchanged; this plan is in memory only. Export your plan before leaving. You can clear saved data from Preferences.'}
      </p>
    );
  if (storageError)
    return (
      <p className="notice warning" role="alert">
        {es
          ? 'El navegador no pudo guardar el plan. Exporta una copia antes de salir.'
          : 'Your browser could not save the plan. Export a copy before leaving.'}
      </p>
    );
  return (
    <p className="supporting">
      {es
        ? 'Se guarda automáticamente en este navegador. Puedes exportarlo o borrarlo desde Preferencias.'
        : 'Saved automatically in this browser. You can export it or clear it from Preferences.'}{' '}
      <Link href="/FreshRouteMD/plan">{es ? 'Ver mi plan' : 'View my plan'}</Link>
    </p>
  );
}
