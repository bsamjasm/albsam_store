// استراتيجية العرض الفوري مع التحديث اللحظي بالخلفية (Stale-While-Revalidate)
const CACHE = 'albsam-v4';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(req).then(cachedRes => {
        const netFetch = fetch(req).then(netRes => {
          if (netRes && netRes.status === 200) cache.put(req, netRes.clone());
          return netRes;
        }).catch(() => cachedRes || caches.match('./'));
        return cachedRes || netFetch;
      })
    )
  );
});
