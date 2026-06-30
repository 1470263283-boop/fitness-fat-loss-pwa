const CACHE_NAME = 'fitness-pwa-v2';
const APP_SHELL = ['', 'index.html', 'manifest.json', 'icons/icon.svg'];

const toScopeUrl = (path) => new URL(path, self.registration.scope).toString();

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        const shellUrls = APP_SHELL.map(toScopeUrl);
        const html = await fetch(toScopeUrl('index.html')).then((response) => response.text());
        const assetUrls = Array.from(html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))
          .map((match) => match[1])
          .filter((path) => path.startsWith('assets/'))
          .map(toScopeUrl);
        await cache.addAll([...new Set([...shellUrls, ...assetUrls])]);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(toScopeUrl('index.html'), copy));
          return response;
        })
        .catch(() => caches.match(toScopeUrl('index.html'))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    }),
  );
});
