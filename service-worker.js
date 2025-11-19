const CACHE_NAME = "cafe-pos-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/admin.html",
  "/checkout.html",
  "/orders.html",
  "/style.css",
  "/menu.js",
  "/firebase-config.js",
  "/manifest.json"
];

// INSTALL SW
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
