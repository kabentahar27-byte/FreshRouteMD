import type { Resource } from './resources';
import { validateResource } from './data-utils.mjs';
export type DirectorySnapshot = {
  schema_version: 2;
  resources: Resource[];
  imported_at: string;
  stale: boolean;
};
export function validateSnapshot(value: unknown): DirectorySnapshot {
  const s = value as DirectorySnapshot;
  if (
    !s ||
    s.schema_version !== 2 ||
    !Array.isArray(s.resources) ||
    !Number.isFinite(Date.parse(s.imported_at))
  )
    throw new Error('Unsupported snapshot');
  return {
    ...s,
    stale: !!s.stale,
    resources: s.resources.map(validateResource) as Resource[],
  };
}
export const resourceProvider = {
  async list(signal?: AbortSignal): Promise<DirectorySnapshot> {
    const response = await fetch(import.meta.env.BASE_URL + 'data/resources.json', {
      credentials: 'same-origin',
      cache: 'no-store',
      signal,
    });
    if (!response.ok) throw new Error('Official sources unavailable');
    const snapshot = validateSnapshot(await response.json());
    snapshot.stale = Date.now() - Date.parse(snapshot.imported_at) > 2 * 60 * 60 * 1000;
    return snapshot;
  },
};
