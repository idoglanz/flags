// Simple offline-first service worker for the Flags app.
const CACHE = "flags-v3";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-180.png", "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // App pages: network-first so content stays fresh, fall back to cached shell offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); return r; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Everything else (flags, fonts, icons): cache-first, then fill the cache in the background.
  // Only cache successful (r.ok) or opaque cross-origin responses (flag images load no-cors),
  // never transient errors — otherwise a 5xx would be served from cache indefinitely.
  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((r) => {
        if (r && (r.ok || r.type === "opaque")) {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return r;
      }).catch(() => cached)
    )
  );
});
