const CACHE_NAME = "gift-site-v5";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/content.js",
  "./js/main.js",
  "./js/hanzi-data.js",
  "./js/galaxy.js",
  "./js/light-rays.js",
  "./libs/gsap.min.js",
  "./libs/ScrollTrigger.min.js",
  "./libs/SplitText.min.js",
  "./libs/hanzi-writer.min.js",
  "./libs/canvas-confetti.min.js",
  "./assets/flowers/rose.jpg",
  "./assets/flowers/sunflower.jpg",
  "./assets/flowers/tulip.jpg",
  "./assets/flowers/money.jpg",
  "./assets/photos/photo-1.jpg",
  "./assets/photos/photo-2.jpg",
  "./assets/photos/photo-3.jpg",
  "./assets/photos/photo-4.jpg",
  "./assets/photos/photo-5.jpg",
  "./assets/photos/photo-6.jpg",
  "./assets/fonts/fonts.css",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, copy);
        });
        return response;
      }).catch(function () {
        return caches.match(request);
      })
    );
    return;
  }

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
  if (isImage) {
    event.respondWith(
      fetch(request).then(function (response) {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
          });
        }
        return response;
      }).catch(function () {
        return caches.match(request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      const fetchUpdate = function () {
        return fetch(request).then(function (response) {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        });
      };
      if (cached) {
        fetchUpdate();
        return cached;
      }
      return fetchUpdate().catch(function () {
        return cached;
      });
    })
  );
});
