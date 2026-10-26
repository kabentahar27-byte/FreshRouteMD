import { fetchLiveResources } from '@/lib/live-resources.mjs';
import { createDirectoryCache } from '@/lib/directory-cache.mjs';
// Public source data only. Cache API is best-effort and never stores user preferences.
const key = new Request('https://freshroute-cache.invalid/directory-v2');
const edge = () =>
  typeof caches !== 'undefined'
    ? (caches as unknown as { default?: Cache }).default
    : undefined;
const read = createDirectoryCache(fetchLiveResources, {
  readSaved: async () => {
    const hit = await edge()?.match(key);
    return hit ? hit.json() : null;
  },
  writeSaved: async (snapshot: unknown) => {
    await edge()?.put(
      key,
      new Response(JSON.stringify(snapshot), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=604800',
        },
      }),
    );
  },
});
export async function GET() {
  try {
    return Response.json(await read(), {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return Response.json(
      {
        error:
          'Official sources are unavailable. Retry or use a provider directory. Stock remains unknown.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
