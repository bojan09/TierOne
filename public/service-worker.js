// Minimal runtime-caching service worker for offline/flaky-connection support.
//
// Deliberately hand-written rather than a build-plugin-generated one — the
// app doesn't need offline-first behavior, just "don't go completely blank
// on a bad connection" for a mostly-static SPA. Two strategies only:
//
//  - HTML navigations: network-first, falling back to the cached shell when
//    offline. Never cache-first for HTML — this app's JS/CSS chunk filenames
//    are content-hashed per build, so a stale cached index.html could point
//    at chunks that no longer exist on the server after a deploy (the
//    classic PWA "blank screen after release" bug).
//  - Everything else same-origin (hashed JS/CSS/image assets): cache-first,
//    revalidating in the background. Safe because the filename changes
//    whenever the content does.
//
// Cross-origin requests (Supabase auth/RPC calls) are never touched — all
// progress/grading/auth must always hit the network fresh.

const CACHE = 'tierone-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/'))),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
