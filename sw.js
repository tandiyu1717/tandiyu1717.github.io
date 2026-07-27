const CACHE_NAME = 'tandiyu-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/mascot.png',
];

// 这类资源必须始终走网络（避免 manifest/图标被旧缓存卡住）
const NETWORK_FIRST = [
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/mascot.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  // 立即激活，不等旧 SW 释放
  self.skipWaiting();
});

// 接收到主页面发来的"立即接管"消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
  // 立即接管所有客户端
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // manifest 和图标：network-first（保证能更新）
  if (NETWORK_FIRST.includes(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              try { cache.put(request, clone); } catch {}
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 其他资源：stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              try { cache.put(request, clone); } catch {}
            });
          }
          return response;
        })
        .catch(() => cached || caches.match('/index.html'));

      return cached || fetchPromise;
    })
  );
});
