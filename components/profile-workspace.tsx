'use client';
import Link from 'next/link';

import { useRef, useState } from 'react';
import Header from './header';
import Footer from './footer';
import TravelPreferences from './travel-preferences';
import MealPreferences from './meal-preferences';
import { usePlan, PlanNotice } from './plan-context';
import { useLanguage } from './language-context';
export default function ProfileWorkspace() {
  const { ready } = usePlan();
  const { language } = useLanguage(),
    es = language === 'es';
  const [clearError, setClearError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Header />
      <main id="main" className="app-main task-page">
        <h1>{es ? 'Preferencias y datos' : 'Preferences and device data'}</h1>
        <p className="lead">
          {es
            ? 'El equipo, la refrigeración, la dieta, los alérgenos conocidos, el tamaño del hogar, el tiempo y los precios que indicas cambian las sugerencias de recetas. No filtran los recursos oficiales.'
            : 'Equipment, refrigeration, diet, known allergens, household size, time and entered prices affect recipe suggestions. They do not filter official resource listings.'}
        </p>
        <PlanNotice />
        {ready && (
          <section className="calm-panel workflow-section">
            <MealPreferences />
            <TravelPreferences />
          </section>
        )}
        <section className="calm-panel workflow-section">
          <h2>{es ? 'Lo que se guarda' : 'What is saved'}</h2>
          <p>
            {es
              ? 'Este navegador guarda tus ingredientes, preferencias de cocina, notas, comidas elegidas, precios de paquetes, compras, presupuesto, comunidad o código postal, filtros, consideraciones de viaje y recursos seleccionados. También guarda el idioma, los colores y una copia de listados públicos para tolerar fallos de conexión. Cualquier persona que use el mismo perfil del navegador puede verlo.'
              : 'This browser saves your ingredients, cooking preferences, notes, selected meals, package prices, groceries, budget, community or ZIP, filters, travel considerations and saved resources. It also saves language, colors and a copy of public listings to tolerate connection failures. Anyone using the same browser profile can view this data.'}
          </p>
          <p>
            {es
              ? 'Los datos anteriores de FreshRoute se conservan durante la migración. Las preferencias anteriores de tiempo de viaje, salud y programas de asistencia no se evalúan. Revisa tus nuevas opciones de transporte, tamaño del hogar y tiempo de preparación.'
              : 'Previous FreshRoute data is preserved during migration. Older travel-time, health and assistance-program preferences are not evaluated. Review your new transportation, household-size and preparation-time choices.'}
          </p>
          <p>
            {es
              ? 'No se guardan la ubicación del navegador ni la dirección de búsqueda. La comunidad o el código postal seleccionados sí se conservan. Los mapas y la búsqueda de direcciones siguen siendo opcionales. Borrar los datos no revoca el permiso de ubicación del navegador.'
              : 'Browser location and address searches are not saved. Your selected community or ZIP is retained. Maps and address lookup remain optional. Clearing data does not revoke browser location permission.'}
          </p>
          {clearError && (
            <p role="alert" className="validation">
              {es
                ? 'No se pudieron borrar los datos. Usa la configuración de datos del sitio de tu navegador.'
                : 'Data could not be cleared. Use your browser’s site-data settings.'}
            </p>
          )}
          <div className="location-actions">
            <Link className="secondary" href="/FreshRouteMD/plan">
              {es ? 'Exportar mi plan primero' : 'Export my plan first'}
            </Link>
            <button
              ref={opener}
              className="secondary"
              onClick={() => dialog.current?.showModal()}
            >
              {es
                ? 'Borrar todos los datos de FreshRoute'
                : 'Clear all FreshRoute device data'}
            </button>
          </div>
        </section>
      </main>
      <Footer />
      <dialog
        ref={dialog}
        className="colors-dialog"
        aria-labelledby="clear-title"
        onClose={() => opener.current?.focus()}
      >
        <h2 id="clear-title">
          {es
            ? '¿Borrar los datos de este navegador?'
            : 'Clear data in this browser?'}
        </h2>
        <p>
          {es
            ? 'Esto elimina el plan, los perfiles anteriores, los colores, el idioma y la copia del directorio. No se puede deshacer. Exporta primero lo que necesites conservar.'
            : 'This removes your plan, older profiles, colors, language and cached directory. It cannot be undone. Export anything you want to keep first.'}
        </p>
        <div className="location-actions">
          <button
            className="secondary"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            {es ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            className="primary"
            onClick={() => {
              try {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith('freshroute-'))
                  .forEach((k) => localStorage.removeItem(k));
                window.location.assign('/FreshRouteMD/profile');
              } catch {
                setClearError(true);
                dialog.current?.close();
              }
            }}
          >
            {es ? 'Borrar datos' : 'Clear data'}
          </button>
        </div>
      </dialog>
    </>
  );
}
