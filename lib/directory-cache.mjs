export const DIRECTORY_TTL = 60 * 60 * 1000;
export const MAX_STALE = 7 * 24 * DIRECTORY_TTL;
// Per-isolate coalescing plus an optional public-data cache adapter. No search terms are stored.
export function createDirectoryCache(
  fetchSnapshot,
  {
    now = Date.now,
    readSaved = async () => null,
    writeSaved = async (_snapshot) => {},
  } = {},
) {
  let last = null,
    inFlight = null,
    lastAttempt = 0;
  return async function get() {
    if (inFlight) return inFlight;
    inFlight = (async () => {
      if (!last)
        try {
          const saved = await readSaved();
          if (
            saved?.schema_version === 2 &&
            Array.isArray(saved.resources) &&
            now() - Date.parse(saved.imported_at) <= MAX_STALE
          )
            last = saved;
        } catch {}
      if (last && now() - Date.parse(last.imported_at) < DIRECTORY_TTL)
        return { ...last, stale: false };
      if (last && now() - lastAttempt < 60000) return { ...last, stale: true };
      lastAttempt = now();
      try {
        const fresh = await fetchSnapshot();
        last = fresh;
        try {
          await writeSaved(fresh);
        } catch {}
        return { ...fresh, stale: false };
      } catch (error) {
        if (last && now() - Date.parse(last.imported_at) <= MAX_STALE)
          return { ...last, stale: true };
        throw error;
      }
    })();
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  };
}
export function applyDirectorySuccess(state, snapshot, sequence) {
  if (sequence !== state.sequence) return state;
  const found = state.selected
    ? snapshot.resources.find((r) => r.id === state.selected.id)
    : null;
  const changed =
    !!found &&
    JSON.stringify({
      ...found,
      provenance: found.provenance.map((p) => ({ ...p, date_imported: null })),
    }) !==
      JSON.stringify({
        ...state.selected,
        provenance: state.selected.provenance.map((p) => ({
          ...p,
          date_imported: null,
        })),
      });
  return {
    ...state,
    resources: snapshot.resources,
    importedAt: snapshot.imported_at,
    stale: !!snapshot.stale,
    error: false,
    loading: false,
    selected: found || state.selected,
    selectionNotice: state.selected
      ? found
        ? changed
          ? 'updated'
          : ''
        : 'missing'
      : '',
  };
}
export function applyDirectoryFailure(state, sequence) {
  return sequence === state.sequence
    ? {
        ...state,
        error: true,
        stale: state.resources.length > 0,
        loading: false,
      }
    : state;
}
