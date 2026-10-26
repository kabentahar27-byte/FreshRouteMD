'use client';
import Link from 'next/link';
import { usePlan } from './plan-context';
import { useLanguage } from './language-context';
export default function PlanJourney({
  current,
}: {
  current: 'food' | 'meals' | 'plan';
}) {
  const { plan, ready } = usePlan();
  const { language } = useLanguage();
  const es = language === 'es';
  const steps = [
    {
      id: 'food',
      href: '/FreshRouteMD/find-food',
      title: es ? 'Encuentra comida' : 'Find food',
      detail:
        ready && plan.resources.length
          ? `${plan.resources.length} ${es ? 'recursos guardados' : 'resources saved'}`
          : es
            ? 'Elige un recurso cercano'
            : 'Choose a nearby resource',
    },
    {
      id: 'meals',
      href: '/FreshRouteMD/meals',
      title: es ? 'Elige una comida' : 'Choose a meal',
      detail:
        ready && plan.meals.length
          ? `${plan.meals.length} ${es ? 'comidas guardadas' : 'meals saved'}`
          : es
            ? 'Usa lo que tienes'
            : 'Use what you have',
    },
    {
      id: 'plan',
      href: '/FreshRouteMD/plan',
      title: es ? 'Revisa tu plan' : 'Review your plan',
      detail: es
        ? 'Compras, presupuesto y exportación'
        : 'Groceries, budget and export',
    },
  ];
  return (
    <nav
      className="plan-journey no-print"
      aria-label={es ? 'Tu plan de comida' : 'Your food plan'}
    >
      {steps.map((step) => (
        <Link
          key={step.id}
          href={step.href}
          aria-current={current === step.id ? 'page' : undefined}
        >
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </Link>
      ))}
    </nav>
  );
}
