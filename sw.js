const CACHE_NAME = 'tandiyu-v4';
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

// 这些资源必须始终走网络（避免被旧缓存卡住）
// HTML、SW 脚本必须 network-first，否则刷新永远拿到旧 HTML → 引用旧 hash 的 JS
const NETWORK_FIRST = [
  '/',
  '/index.html',
  '/sw.js',
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

  // HTML / SW / 图标：network-first（保证能更新，避免被旧缓存卡住）
  if (NETWORK_FIRST.includes(url.pathname) || url.pathname === '/' || url.pathname.endsWith('.html')) {
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

  // 带 hash 的静态资源：stale-while-revalidate（hash 变了自然失效）
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
