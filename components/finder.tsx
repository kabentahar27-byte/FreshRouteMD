'use client';
import Link from 'next/link';

import { requestCoarseLocation, roundedLocation } from '@/lib/location';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LocateFixed,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useLanguage } from './language-context';
import Header from './header';
import PlanJourney from './plan-journey';
import Footer from './footer';
import ResourceMap from './resource-map';
import {
  categories,
  places,
  milesBetween,
  quality,
  displayDate,
  type Resource,
} from '@/lib/resources';
import { phoneKey } from '@/lib/data-utils.mjs';
import { useDirectory } from '@/hooks/use-directory';
import { usePlan, PlanNotice } from './plan-context';
import TravelPreferences from './travel-preferences';
import { relevantResources, travelDirections } from '@/lib/travel.mjs';
import { visitQuestions } from '@/lib/visit-checklist.mjs';
import { locateAddress, type AddressMatch } from '@/lib/geocoder';
const PAGE_SIZE = 24;
const quickTypes = [
  'All resources',
  'Food Pantry',
  'SNAP-Authorized Retailer',
  'Community Meal / Soup Kitchen',
];
export default function Finder() {
  const { t, language } = useLanguage();
  const { plan, setPlan, saveResource, ready: planReady } = usePlan();
  const {
    resources: data,
    loading,
    error,
    importedAt,
    stale,
    selected,
    setSelected,
    selectionNotice,
    load,
  } = useDirectory();
  const checkedAt = importedAt
    ? new Date(importedAt).toLocaleString(language === 'es' ? 'es-US' : 'en-US')
    : '';
  const [input, setInput] = useState(''),
    [query, setQuery] = useState('');
  const [temporaryArea, setTemporaryArea] = useState<{
    coordinates: [number, number];
    label: string;
  } | null>(null);
  const origin =
    temporaryArea?.coordinates ||
    plan.area?.coordinates ||
    places['owings mills'].coordinates;
  const location =
    temporaryArea?.label || plan.area?.label || 'Owings Mills, MD';
  const category = plan.finder.category,
    withPhone = plan.finder.withPhone,
    service = plan.finder.service,
    sort = plan.finder.sort,
    radius = plan.travel.maxMiles;
  const setCategory = (v: string) =>
    setPlan((p) => ({ ...p, finder: { ...p.finder, category: v } }));
  const setWithPhone = (v: boolean) =>
    setPlan((p) => ({ ...p, finder: { ...p.finder, withPhone: v } }));
  const setService = (v: string) =>
    setPlan((p) => ({ ...p, finder: { ...p.finder, service: v } }));
  const setSort = (v: string) =>
    setPlan((p) => ({ ...p, finder: { ...p.finder, sort: v } }));
  const [message, setMessage] = useState(''),
    [locating, setLocating] = useState(false),
    [mapEnabled, setMapEnabled] = useState(false),
    [pagination, setPagination] = useState({ key: '', page: 1 });
  const [address, setAddress] = useState(''),
    [addressConsent, setAddressConsent] = useState(false),
    [addressBusy, setAddressBusy] = useState(false),
    [addressMatches, setAddressMatches] = useState<AddressMatch[]>([]);
  const requestSequence = useRef(0),
    detailOpener = useRef<HTMLElement | null>(null),
    resultsHeading = useRef<HTMLHeadingElement>(null);
  function openResource(r: Resource) {
    detailOpener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelected(r);
  }

  useEffect(
    () => () => {
      requestSequence.current++;
    },
    [],
  );
  const filtered = useMemo(
    () =>
      relevantResources(
        data,
        {
          category,
          withPhone,
          service,
          query,
          origin,
          radius: Number(radius),
          sort,
        },
        plan.excludedResourceIds,
      ) as Resource[],
    [
      data,
      category,
      withPhone,
      service,
      query,
      origin,
      radius,
      sort,
      plan.excludedResourceIds,
    ],
  );
  const filterKey = JSON.stringify([
    category,
    withPhone,
    service,
    query,
    origin,
    radius,
    sort,
    plan.excludedResourceIds,
  ]);
  const page = pagination.key === filterKey ? pagination.page : 1;
  function setPage(next: number | ((p: number) => number)) {
    setPagination({
      key: filterKey,
      page: typeof next === 'function' ? next(page) : next,
    });
  }
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );
  function changeOrigin(c: [number, number], label: string) {
    setTemporaryArea({ coordinates: c, label });
    setQuery('');
    setPage(1);
  }
  function search(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    resultsHeading.current?.focus();
    resultsHeading.current?.scrollIntoView({ block: 'start' });
    requestSequence.current++;
    setLocating(false);
    setAddressBusy(false);
    setAddressMatches([]);
    const q = input
      .trim()
      .toLowerCase()
      .replace(/,?\s+md$/, '');
    const place = places[q];
    if (place) {
      changeOrigin(place.coordinates, place.label);
      setPlan((p) => ({
        ...p,
        area: {
          coordinates: place.coordinates,
          label: place.label,
          kind: 'community',
        },
      }));
      setMessage(
        'Nearby results use an approximate community center. Closest does not mean available or eligible.',
      );
      return;
    }
    if (/^\d{5}$/.test(q)) {
      const inZip = data.filter((r) => r.zip === q && r.coordinates);
      if (!inZip.length) {
        setQuery(q);
        setMessage(
          'No listed locations for that ZIP. Try another Maryland ZIP, community or optional address lookup.',
        );
        return;
      }
      const lat =
          inZip.reduce((s, r) => s + r.coordinates![0], 0) / inZip.length,
        lon = inZip.reduce((s, r) => s + r.coordinates![1], 0) / inZip.length;
      changeOrigin([lat, lon], `ZIP ${q}`);
      setPlan((p) => ({
        ...p,
        area: { coordinates: [lat, lon], label: `ZIP ${q}`, kind: 'zip' },
      }));
      setMessage(
        'ZIP center estimated from listed resource locations, not an official ZIP boundary or your address.',
      );
      return;
    }
    setQuery(q);
    setMessage(
      q
        ? 'Searching names and listed addresses locally. To find resources near a different street address, use the optional address lookup below.'
        : 'Search cleared.',
    );
  }
  function locate() {
    const sequence = ++requestSequence.current;
    setAddressBusy(false);
    setAddressMatches([]);
    setLocating(true);
    setMessage('Waiting for your browser’s location permission…');
    requestCoarseLocation(navigator.geolocation)
      .then((coarse) => {
        if (sequence !== requestSequence.current) return;
        changeOrigin(coarse, 'Your approximate location');
        setPlan((p) => ({ ...p, area: null }));
        setInput('');
        setMessage(
          'Location rounded to about 1 km before use and kept in memory only. If the map is loaded, map-area requests can reveal an approximate location.',
        );
      })
      .catch((e) => {
        if (sequence === requestSequence.current) setMessage(e.message);
      })
      .finally(() => {
        if (sequence === requestSequence.current) setLocating(false);
      });
  }
  function clearLocation() {
    requestSequence.current++;
    setLocating(false);
    setAddressBusy(false);
    setAddress('');
    setAddressConsent(false);
    setAddressMatches([]);
    setInput('');
    changeOrigin(places['owings mills'].coordinates, 'Owings Mills, MD');
    setPlan((p) => ({ ...p, area: null }));
    setMessage(
      'Search location cleared. Browser location permission can be revoked in your browser settings.',
    );
  }
  async function lookup(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!addressConsent || addressBusy) return;
    if (!/^\d+\s+\S+/.test(address.trim()) || address.trim().length < 8) {
      setMessage(
        'Enter a street number, street, Maryland city and ZIP for address lookup.',
      );
      return;
    }
    const sequence = ++requestSequence.current;
    setAddressBusy(true);
    setAddressMatches([]);
    try {
      const matches = await locateAddress(address.trim());
      if (sequence !== requestSequence.current) return;
      setAddressMatches(matches);
      setMessage(
        matches.length
          ? 'Choose the matching address below. Coordinates are approximate.'
          : 'No matching Maryland address found. Check the street number, city and ZIP, or use ZIP search.',
      );
    } catch (e) {
      if (sequence === requestSequence.current)
        setMessage(
          e instanceof Error ? e.message : 'Address lookup unavailable.',
        );
    } finally {
      if (sequence === requestSequence.current) setAddressBusy(false);
    }
  }
  function reset() {
    setPlan((p) => ({
      ...p,
      finder: {
        category: 'All resources',
        withPhone: false,
        service: 'all',
        sort: 'distance',
      },
      travel: { ...p.travel, maxMiles: '25' },
      excludedResourceIds: [],
    }));
    setQuery('');
    setInput('');
    setPage(1);
    setMessage('Filters cleared.');
  }
  return (
    <>
      <Header />
      <main id="main" className="forest-finder">
        <section className="finder-intro">
          <h1>
            {t('Find food.')}
            <br />
            <em>{t('Plan your next meal.')}</em>
          </h1>
          <p>
            {t(
              'Maryland food resources and meal planning based on your ingredients, kitchen and budget.',
            )}
          </p>
        </section>
        <PlanJourney current="food" />
        <PlanNotice />
        <section className="search-zone" aria-labelledby="finder-title">
          <h2 id="finder-title">{t('Find food near you.')}</h2>
          <form className="forest-search" onSubmit={search}>
            <label>
              {t('Location or resource')}
              <input
                placeholder={t(
                  'ZIP, community, resource name or listed address',
                )}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </label>
            <button type="submit" className="primary" disabled={!planReady}>
              {t('Find food')} <ArrowRight size={18} />
            </button>
          </form>
          <TravelPreferences />
          <p className="supporting">
            {language === 'es'
              ? 'Los recursos se ordenan por distancia aproximada y los filtros que eliges. El inventario, las dietas y el acceso no están verificados; confirma los requisitos con cada proveedor.'
              : 'Resources are ranked by approximate distance and your selected filters. Inventory, dietary suitability and access are unverified; confirm requirements with each provider.'}
          </p>
          <div className="location-actions">
            <button
              className="text-button"
              onClick={locate}
              disabled={locating}
            >
              <LocateFixed size={18} />
              {t(locating ? 'Locating…' : 'Use my location')}
            </button>
            <button className="text-button" onClick={clearLocation}>
              {t('Clear location')}
            </button>
          </div>
          <p className="supporting">
            {language === 'es'
              ? 'Tu comunidad o código postal y los filtros se guardan en este navegador. Las ubicaciones de dirección y navegador solo se usan durante esta visita.'
              : 'Your community or ZIP and filters are saved in this browser. Address and browser locations are only used during this visit.'}{' '}
            <Link href="/FreshRouteMD/privacy">{t('Privacy')}</Link>
          </p>
          <div className="categories">
            {quickTypes.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                className={category === c ? 'active' : ''}
                onClick={() => setCategory(c)}
              >
                {t(c)}
              </button>
            ))}
          </div>
          <details className="advanced-filters">
            <summary>
              <SlidersHorizontal size={18} />
              {t('Filters')}{' '}
              {category !== 'All resources' ||
              radius !== '25' ||
              withPhone ||
              service !== 'all'
                ? ' · ✓'
                : ''}
            </summary>
            <div className="filter-fields">
              <label>
                {t('Resource type')}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All resources">{t('All resources')}</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {t(c)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t('Service')}
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {['all', 'SNAP accepted', 'Benefits information'].map((v) => (
                    <option key={v} value={v}>
                      {t(v === 'all' ? 'All services' : v)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={withPhone}
                  onChange={(e) => setWithPhone(e.target.checked)}
                />
                {t('Phone listed')}
              </label>
            </div>
          </details>
          <div className="active-filters">
            <span>
              {t(category)} · {radius} {t('mi')}
              {withPhone ? ' · ' + t('Phone listed') : ''}
              {service !== 'all' ? ' · ' + t(service) : ''}
            </span>
            <button className="text-button" onClick={reset}>
              {t('Reset')}
            </button>
          </div>
          {plan.excludedResourceIds.length > 0 && (
            <p className="notice">
              {plan.excludedResourceIds.length}{' '}
              {language === 'es'
                ? 'recurso(s) excluidos por ti.'
                : 'resource(s) excluded by you.'}{' '}
              <button
                className="text-button"
                onClick={() =>
                  setPlan((p) => ({ ...p, excludedResourceIds: [] }))
                }
              >
                {language === 'es'
                  ? 'Restaurar recursos excluidos'
                  : 'Restore excluded resources'}
              </button>
            </p>
          )}
          <details className="address-lookup">
            <summary>{t('Find near a street address')}</summary>
            <p>
              {t(
                'Optional: this sends your typed address to the U.S. Census Bureau. ZIP search stays local.',
              )}
            </p>
            <form onSubmit={lookup}>
              <label>
                {t('Maryland street address')}
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={180}
                />
              </label>
              <label className="check-label">
                <Checkbox
                  checked={addressConsent}
                  onCheckedChange={setAddressConsent}
                />
                {t('Send this address to Census for this lookup')}
              </label>
              <button
                className="primary"
                disabled={!addressConsent || addressBusy}
              >
                {t(addressBusy ? 'Looking up…' : 'Locate address')}
              </button>
            </form>
            {addressMatches.map((m) => (
              <button
                className="address-choice"
                key={m.address}
                onClick={() => {
                  changeOrigin(
                    roundedLocation(m.coordinates[0], m.coordinates[1]),
                    'Selected address · approximate area',
                  );
                  setPlan((p) => ({ ...p, area: null }));
                  setAddressMatches([]);
                  setAddress('');
                  setAddressConsent(false);
                  setInput('');
                  setMessage('Address matched; approximate location.');
                }}
              >
                {m.address} <ArrowRight size={16} />
              </button>
            ))}
          </details>
        </section>
        <aside className="source-notice">
          <ShieldCheck size={21} />
          <div>
            <strong>{t('Official source listings')}</strong>
            <p>
              {t(
                'Official listings are refreshed hourly by GitHub Actions when source services are available. Hours, eligibility and stock must be confirmed with the provider. No stock feed is connected.',
              )}
            </p>
            <Link href="/FreshRouteMD/data-sources">{t('Sources & dates')} ↗</Link>
          </div>
        </aside>
        <div className="status-message" role="status" aria-live="polite">
          {message && <p>{t(message)}</p>}
          {checkedAt && (
            <span>
              {t('Last successful source retrieval')}: {checkedAt}
            </span>
          )}
          <button className="text-button" onClick={load} disabled={loading}>
            {t('Refresh listings')}
          </button>
        </div>
        {(stale || (error && data.length > 0)) && (
          <p className="notice warning" role="status">
            {t(
              'Showing the last successful retrieval. These listings may be outdated; the latest refresh is pending or unavailable.',
            )}{' '}
            <button className="text-button" disabled={loading} onClick={load}>
              {t('Retry')}
            </button>
          </p>
        )}
        <section className="forest-results">
          <div className="results-heading">
            <div>
              <h2 ref={resultsHeading} tabIndex={-1}>
                {loading && data.length === 0
                  ? t('Loading resources…')
                  : t('Resources to explore') +
                    ` (${filtered.length.toLocaleString()})`}
              </h2>
              <p>
                {t('Near')} {t(location)} · {t('up to')} {radius} {t('mi')}
              </p>
            </div>
            <label className="sort-control">
              {t('Sort resources')}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="distance">{t('Nearest first')}</option>
                <option value="name">{t('Name A–Z')}</option>
              </select>
            </label>
          </div>
          <p className="supporting">
            {t('Straight-line distance · not travel time')} ·{' '}
            {language === 'es'
              ? 'Los recursos sin coordenadas se mantienen; la distancia es desconocida.'
              : 'Resources without coordinates remain listed; their distance is unknown.'}
            {language === 'es'
              ? ' · ' +
                t('Source information is shown in its original language.')
              : ''}
          </p>
          <div className="cards" aria-busy={loading}>
            {error && data.length === 0 ? (
              <div className="empty-state" role="alert">
                <h3>{t('Resources couldn’t load')}</h3>
                <p>
                  {t(
                    'Please retry or use the official directory linked below.',
                  )}
                </p>
                <button className="primary" onClick={load}>
                  {t('Retry')}
                </button>
              </div>
            ) : !loading && filtered.length === 0 ? (
              <div className="empty-state">
                <h3>{t('No matches in this view')}</h3>
                <p>
                  {t(
                    'Try another ZIP, a larger distance or fewer filters. No matches does not mean no help exists.',
                  )}
                </p>
                <button className="primary" onClick={reset}>
                  {t('Clear filters')}
                </button>
              </div>
            ) : (
              visible.map((r) => {
                const retailer = r.resource_types.includes(
                  'SNAP-Authorized Retailer',
                );
                return (
                  <article
                    className="resource-card"
                    data-resource-id={r.id}
                    key={r.id}
                  >
                    <div className="resource-content">
                      <div className="row-kicker">
                        {t(r.category)} ·{' '}
                        {r.coordinates
                          ? `${milesBetween(origin, r.coordinates).toFixed(1)} ${t('mi')}`
                          : t(
                              r.serviceMode === 'online'
                                ? 'Online'
                                : 'Distance unknown',
                            )}
                      </div>
                      <h3>{r.name}</h3>
                      <p className="resource-description">{r.description}</p>
                      <p className="card-address">
                        <MapPin size={17} />
                        {[r.address, r.city, r.zip]
                          .filter(Boolean)
                          .join(' · ') || t('Address not supplied')}
                      </p>
                      <p className="card-hours">
                        <Clock size={17} />
                        {r.hours ||
                          t('Hours not supplied — verify with provider')}
                      </p>
                      <p className="card-eligibility">
                        <Users size={17} />
                        {r.eligibility ||
                          t('Eligibility and visit requirements not supplied.')}
                      </p>
                      <p className="supporting">
                        {t('Cost')}: {r.cost || t('Not confirmed by source')}.{' '}
                        {retailer
                          ? t('Purchases are not free food assistance.')
                          : ''}
                      </p>
                      <p className="supporting">
                        {t(quality(r))} · {r.provenance[0].source_name}
                      </p>
                    </div>
                    <div className="resource-action">
                      <button
                        className="secondary"
                        onClick={() => openResource(r)}
                        aria-label={`${t('View details')}: ${r.name}`}
                      >
                        {t('View details')} <ArrowRight size={17} />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
          {!loading && filtered.length > 0 && (
            <nav
              className="result-pagination"
              aria-label={t('Resources to explore')}
            >
              <button
                className="secondary"
                disabled={currentPage === 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  document
                    .querySelector('.results-heading')
                    ?.scrollIntoView({ block: 'start' });
                }}
              >
                {t('Previous')}
              </button>
              <span role="status">
                {t('Page')} {currentPage} {t('of')} {totalPages}
              </span>
              <button
                className="secondary"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setPage((p) => p + 1);
                  document
                    .querySelector('.results-heading')
                    ?.scrollIntoView({ block: 'start' });
                }}
              >
                {t('Next')}
              </button>
            </nav>
          )}
        </section>
        <section className="optional-map">
          <h2>{t('Optional map')}</h2>
          <p>
            {t(
              'Loading the map shares your IP address and the displayed area with OpenStreetMap.',
            )}
          </p>
          <button
            className="secondary"
            onClick={() => setMapEnabled(!mapEnabled)}
          >
            {t(mapEnabled ? 'Hide map' : 'Show map')}
          </button>
          {mapEnabled && (
            <div className="map-shell">
              <ResourceMap
                resources={visible}
                origin={origin}
                onSelect={openResource}
              />
            </div>
          )}
        </section>
        <aside className="help-panel">
          <div>
            <h2>{t('Need food assistance now?')}</h2>
            <p>
              {t(
                'Confirm options through the Maryland Food Bank directory or 211 Maryland.',
              )}
            </p>
            <div className="location-actions">
              <a
                href="https://mdfoodbank.org/find-food/"
                target="_blank"
                rel="noreferrer"
              >
                Maryland Food Bank ↗
              </a>
              <a href="https://211md.org/" target="_blank" rel="noreferrer">
                211 Maryland ↗
              </a>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent
          className="detail-sheet"
          closeLabel={t('Close')}
          finalFocus={() =>
            detailOpener.current?.isConnected
              ? detailOpener.current
              : resultsHeading.current
          }
        >
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="detail-title">
                  {selected.name}
                </SheetTitle>
                <SheetDescription>
                  {selected.resource_types.map(t).join(' · ')} · {selected.city}
                </SheetDescription>
              </SheetHeader>
              <div className="detail-body">
                {selectionNotice && (
                  <p className="notice warning" role="status">
                    {t(
                      selectionNotice === 'missing'
                        ? 'This resource is absent from the newest snapshot. Its previous details remain here for reference; verify directly.'
                        : 'This resource changed in the newest retrieval. Review its updated details.',
                    )}
                  </p>
                )}
                <p className="supporting">
                  {t('Source information is shown in its original language.')}
                </p>
                <p>{selected.description}</p>
                <p className="source-notice">
                  {t('Stock unknown — contact provider before visiting.')}
                </p>
                <section>
                  <h3>{t('Location')}</h3>
                  <p>
                    {[selected.address, selected.city, 'MD', selected.zip]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </section>
                <section>
                  <h3>{t('Hours')}</h3>
                  <p>
                    {selected.hours ||
                      t('Not supplied. Check with the provider.')}
                  </p>
                  <p className="supporting">
                    {t('Published schedule. Not live availability.')}
                  </p>
                </section>
                <section>
                  <h3>{t('Eligibility & visit instructions')}</h3>
                  <p>
                    {selected.eligibility ||
                      t('Not supplied. Check with the provider.')}
                  </p>
                  <p>
                    <strong>{t('Cost')}:</strong>{' '}
                    {selected.cost || t('Not confirmed by source')}
                  </p>
                  <p>
                    <strong>{t('Services explicitly listed')}:</strong>{' '}
                    {selected.services.join(', ') || t('Not supplied')}
                  </p>
                </section>
                <section className="detail-source">
                  <h3>{t('Sources & dates')}</h3>
                  <p>{selected.notes}</p>
                  {selected.provenance.map((p, i) => (
                    <div className="provenance-entry" key={i}>
                      <a href={p.source_url} target="_blank" rel="noreferrer">
                        {p.source_name} ↗
                      </a>
                      <p className="supporting">
                        {t('Imported')}: {displayDate(p.date_imported)}
                        <br />
                        {t('Source updated')}:{' '}
                        {p.source_updated_at
                          ? displayDate(p.source_updated_at)
                          : t('Not supplied')}
                        <br />
                        {t('Last verification')}:{' '}
                        {p.date_last_verified
                          ? displayDate(p.date_last_verified)
                          : t('Not supplied')}
                        <br />
                        {p.verification_scope || t('Not supplied')}
                      </p>
                      {p.license_url && (
                        <Link href="/FreshRouteMD/data-sources#county-disclaimer">
                          {t('County disclaimer & attribution')}
                        </Link>
                      )}
                    </div>
                  ))}
                </section>
                {selected.conflicts.length > 0 && (
                  <section>
                    <h3>{t('Source differences — verify directly')}</h3>
                    {selected.conflicts.map((c, i) => (
                      <p key={i}>
                        <strong>{c.field}:</strong> {c.alternate} ·{' '}
                        {c.source_name}
                      </p>
                    ))}
                  </section>
                )}
                <section>
                  <h3>{t('Visit checklist')}</h3>
                  <p>
                    {t('These are questions to ask, not confirmed answers.')}
                  </p>
                  <ul>
                    {visitQuestions.map((q) => (
                      <li key={q.id}>{language === 'es' ? q.es : q.en}</li>
                    ))}
                  </ul>
                  <p>
                    {t(
                      'Accessibility and transportation information: not supplied.',
                    )}
                  </p>
                  <button
                    className="primary"
                    disabled={
                      !planReady ||
                      plan.resources.some((r) => r.id === selected.id) ||
                      plan.resources.length >= 30
                    }
                    onClick={() => saveResource(selected)}
                  >
                    {t(
                      plan.resources.some((r) => r.id === selected.id)
                        ? 'Saved to my plan'
                        : 'Save to my plan',
                    )}
                  </button>
                  <button
                    className="text-button"
                    disabled={
                      !planReady || plan.excludedResourceIds.length >= 200
                    }
                    onClick={() => {
                      const id = selected.id;
                      setPlan((p) => ({
                        ...p,
                        excludedResourceIds: [
                          ...new Set([...p.excludedResourceIds, id]),
                        ],
                      }));
                      setSelected(null);
                    }}
                  >
                    {language === 'es'
                      ? 'Este recurso no me sirve: ocultarlo'
                      : 'This resource does not work for me: hide it'}
                  </button>
                  <p className="supporting">
                    {language === 'es'
                      ? 'Ocultarlo es una preferencia tuya; no cambia la información oficial. Puedes restaurarlo con Restablecer.'
                      : 'Hiding is your preference; it does not change official information. Restore it with Reset.'}
                  </p>
                  <Link className="underlined" href="/FreshRouteMD/plan">
                    {t('My plan')} →
                  </Link>
                  <p className="supporting">
                    {t(
                      'Saving a resource does not add ingredients or mark groceries acquired. Up to 30 resources can be saved.',
                    )}
                  </p>
                </section>
                <div className="detail-actions">
                  {travelDirections(selected, plan.travel.mode) && (
                    <a
                      className="primary"
                      href={travelDirections(selected, plan.travel.mode)!}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Get directions')}
                    </a>
                  )}
                  {selected.phone && (
                    <a
                      className="secondary"
                      href={`tel:${phoneKey(selected.phone).slice(0, 10)}`}
                    >
                      {t('Call')} {selected.phone}
                    </a>
                  )}
                  {selected.serviceMode === 'online' && (
                    <a
                      className="primary"
                      href={selected.provenance[0].source_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Visit official resource')} ↗
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
