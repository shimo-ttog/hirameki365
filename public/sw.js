const CACHE_NAME = 'hirameki365-v0.7.2';
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
  self.skipWaiting(); // 新しいSWをすぐに待機状態からアクティブにする
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // すべてのクライアント（タブ）をすぐに制御下におく
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // HTMLファイルやルートへのリクエストは「Network First」戦略
  // まずネットワークを試し、失敗したらキャッシュを出す
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 成功したらキャッシュを更新
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          // 失敗（オフライン）ならキャッシュを返す
          return caches.match(event.request);
        })
    );
    return;
  }

  // 音声やアイコンなどの静的資産は「Cache First」戦略
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
