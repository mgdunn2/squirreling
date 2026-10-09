const CACHE = 'squirreling-shell-v20';
const IMAGE_CACHE = 'squirreling-taxa-v2';
const SDK_CACHE = 'squirreling-firebase-v1';
const LIBRARY_CACHE = 'squirreling-libraries-v1';
const SHELL = ['./', './index.html', './styles.css', './app.js', './firebase-config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![CACHE,IMAGE_CACHE,SDK_CACHE,LIBRARY_CACHE].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim())));

async function cachedFirst(request, cacheName, event) {
  const cache=await caches.open(cacheName);
  const cached=await cache.match(request,{ ignoreSearch:true });
  const fresh=fetch(request).then(response => {
    if (response.ok || response.type === 'opaque') cache.put(request,response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(fresh.catch(()=>{}));
    return cached;
  }
  return fresh;
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/12.19.0/')) {
    event.respondWith(cachedFirst(event.request,SDK_CACHE,event));
    return;
  }
  if (url.hostname === 'unpkg.com' && url.pathname.startsWith('/leaflet@1.9.4/')) {
    event.respondWith(cachedFirst(event.request,LIBRARY_CACHE,event));
    return;
  }
  if (event.request.destination === 'image' && url.hostname.endsWith('wikimedia.org')) {
    event.respondWith(caches.open(IMAGE_CACHE).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(async cache => {
      const cached=await cache.match('./index.html');
      const fresh=fetch(event.request).then(response => {
        if (response.ok) cache.put('./index.html',response.clone());
        return response;
      });
      if (cached) { event.waitUntil(fresh.catch(()=>{})); return cached; }
      return fresh;
    }));
    return;
  }
  event.respondWith(cachedFirst(event.request,CACHE,event).catch(()=>Response.error()));
});
