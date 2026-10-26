'use client';
import { useEffect, useRef, useState } from 'react';
import type { Resource } from '@/lib/resources';
import { resourceProvider, validateSnapshot } from '@/lib/resource-provider';
import {
  DIRECTORY_TTL,
  MAX_STALE,
  applyDirectorySuccess,
  applyDirectoryFailure,
} from '@/lib/directory-cache.mjs';
type State = {
  resources: Resource[];
  selected: Resource | null;
  importedAt: string;
  loading: boolean;
  stale: boolean;
  error: boolean;
  sequence: number;
  selectionNotice: string;
};
const key = 'freshroute-directory-cache-v2';
export function useDirectory() {
  const [state, setState] = useState<State>({
    resources: [],
    selected: null,
    importedAt: '',
    loading: true,
    stale: false,
    error: false,
    sequence: 0,
    selectionNotice: '',
  });
  const sequence = useRef(0),
    active = useRef<AbortController | null>(null),
    lastAttempt = useRef(0);
  async function load() {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    const id = ++sequence.current;
    lastAttempt.current = Date.now();
    setState((s) => ({ ...s, loading: true, sequence: id }));
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const snapshot = await resourceProvider.list(controller.signal);
      if (sequence.current !== id) return;
      setState((s) => applyDirectorySuccess(s, snapshot, id) as State);
      try {
        localStorage.setItem(key, JSON.stringify(snapshot));
      } catch {}
    } catch {
      if (sequence.current === id)
        setState((s) => applyDirectoryFailure(s, id) as State);
    } finally {
      clearTimeout(timeout);
      if (sequence.current === id) active.current = null;
    }
  }
  useEffect(() => {
    try {
      const cached = validateSnapshot(
        JSON.parse(localStorage.getItem(key) || 'null'),
      );
      if (Date.now() - Date.parse(cached.imported_at) <= MAX_STALE)
        setState((s) => ({
          ...s,
          resources: cached.resources,
          importedAt: cached.imported_at,
          stale: true,
        }));
    } catch {}
    load();
    const check = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastAttempt.current >= DIRECTORY_TTL
      )
        load();
    };
    const timer = setInterval(check, DIRECTORY_TTL);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
      sequence.current++;
      active.current?.abort();
      active.current = null;
    };
  }, []);
  return {
    ...state,
    load,
    setSelected: (selected: Resource | null) =>
      setState((s) => ({ ...s, selected, selectionNotice: '' })),
  };
}
