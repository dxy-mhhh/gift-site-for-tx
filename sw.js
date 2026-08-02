const CACHE_NAME = "gift-site-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/content.js",
  "./js/main.js",
  "./js/hanzi-data.js",
  "./libs/gsap.min.js",
  "./libs/ScrollTrigger.min.js",
  "./libs/SplitText.min.js",
  "./libs/hanzi-writer.min.js",
  "./libs/canvas-confetti.min.js",
  "./assets/music/birthday-gentle-loop.mp3",
  "./assets/music/birthday-gentle-loop.ogg",
  "./assets/flowers/rose.jpg",
  "./assets/flowers/sunflower.jpg",
  "./assets/flowers/tulip.jpg",
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

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
          });
        }
        return response;
      }).catch(function () {
        return cached;
      });
    })
  );
});
