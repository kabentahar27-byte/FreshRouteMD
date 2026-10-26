'use client';
import Link from 'next/link';

import Header from './header';
import Footer from './footer';
import { useLanguage } from './language-context';
export default function CommunityGuide() {
  const { language, t } = useLanguage(),
    es = language === 'es';
  return (
    <>
      <Header />
      <main id="main" className="app-main task-page">
        <h1>{t('Community')}</h1>
        <p className="lead">
          {es
            ? 'Ayuda a alguien a preparar una visita y una comida.'
            : 'Help someone plan a visit and a meal.'}
        </p>
        <section className="calm-panel workflow-section">
          <h2>{es ? 'Planifiquen juntos' : 'Make a plan together'}</h2>
          <ol className="recipe-steps">
            <li>
              {es
                ? 'Pregunta qué información quiere compartir. No necesitas su ingreso, documentos, diagnóstico o estado de beneficios.'
                : 'Ask what they want to share. You do not need their income, documents, diagnosis or benefits status.'}
            </li>
            <li>
              {es
                ? 'Busca un recurso por comunidad o código postal. Comprueben horarios, requisitos y contacto en los detalles.'
                : 'Find a resource by community or ZIP. Read its hours, requirements and contact details together.'}
            </li>
            <li>
              {es
                ? 'Guarda el recurso y usen la lista de preguntas antes de viajar. No des por hecho que tiene alimentos específicos.'
                : 'Save the resource and use the visit questions before traveling. Do not assume it has specific foods.'}
            </li>
            <li>
              {es
                ? 'Si desean planificar una comida, usen ingredientes que ya tienen. Impriman el plan y borren los datos de un dispositivo compartido al terminar.'
                : 'If they want a meal plan, use ingredients they already have. Print the plan and clear data from a shared device when finished.'}
            </li>
          </ol>
          <div className="location-actions">
            <Link className="primary" href="/FreshRouteMD/find-food">
              {t('Find food')}
            </Link>
            <Link className="secondary" href="/FreshRouteMD/plan">
              {es ? 'Mi plan' : 'My plan'}
            </Link>
          </div>
        </section>
        <section className="calm-panel">
          <h2>{es ? 'Comprobar información' : 'Check information'}</h2>
          <p>
            {es
              ? 'Contacta directamente al proveedor para confirmar servicios. FreshRoute no tiene publicaciones comunitarias, mensajes, informes de existencias ni un formulario de correcciones gestionado.'
              : 'Contact the provider directly to confirm services. FreshRoute has no community posts, messages, stock reports or staffed corrections form.'}
          </p>
          <Link className="underlined" href="/FreshRouteMD/data-sources">
            {t('Data & methodology')} →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
