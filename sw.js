const CACHE_NAME = 'quran-cache-v1';
const ASSETS = [
  './',
  './index.html'
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// تفعيل وتشغيل التطبيق أوفلاين حتى لو انقطع النت تماماً
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // إذا كان أوفلاين، يفتح النسخة المحفوظة فوراً
      }
      return fetch(e.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // حفظ الأصوات والسور تلقائياً فور تشغيلها أول مرة
          if (e.request.url.startsWith('http')) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    }).catch(() => {
      // منع ظهور أي شاشة خطأ بيضاء أو برتقالية
      return caches.match('./index.html');
    })
  );
});
