const CACHE_NAME = 'hirameki365-v1';
const ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/sounds/correct.mp3',
  '/sounds/incorrect.mp3',
  '/sounds/perfect.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
