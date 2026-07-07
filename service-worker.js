// service-worker.js — buildless PWA offline support.
//
// Precaches the whole app shell (relative paths, so it works under any base —
// including GitHub Pages' /Omo-Naija/ subpath).
//
// Serving strategy depends on the host:
//   • Production — cache-FIRST (offline-first); runtime-caches anything new.
//   • Local dev (localhost / 127.0.0.1) — network-FIRST, so file edits show on
//     reload without fighting the cache; falls back to cache when offline.
//
// IMPORTANT: bump CACHE on every deploy that changes files, so installed
// devices pick up the new version (the old cache is cleaned on activate).
const CACHE = 'omo-naija-v24';

// Local dev hosts get the network-first strategy (see the fetch handler).
const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  // styles
  'css/base.css', 'css/components.css', 'css/screens.css', 'css/animations.css', 'css/dark.css', 'css/skins.css',
  // app modules
  'js/app.js', 'js/state.js', 'js/preferences.js', 'js/game.js', 'js/deck.js',
  'js/timer.js', 'js/sound.js', 'js/haptics.js', 'js/anim.js', 'js/banks.js',
  'js/theme.js', 'js/install.js',
  'js/util.js', 'js/data/wordbank-loader.js', 'js/components/card-stack.js',
  'js/screens/home.js', 'js/screens/setup.js', 'js/screens/preturn.js',
  'js/screens/play.js', 'js/screens/summary.js', 'js/screens/scoreboard.js',
  'js/screens/reveal.js', 'js/screens/settings.js', 'js/screens/howto.js',
  'js/screens/banks-browser.js',
  // vendored libs
  'assets/vendor/gsap.min.js', 'assets/vendor/Flip.min.js',
  'assets/vendor/howler.min.js', 'assets/vendor/confetti.browser.min.js',
  // fonts (Anton = classic display; Playfair/Alfa Slab = skin display fonts), word banks, sounds, icons
  'assets/fonts/anton-latin.woff2',
  'assets/fonts/playfair-display-700-latin.woff2', 'assets/fonts/alfa-slab-one-latin.woff2',
  'data/wordbanks/naija-classic.json', 'data/wordbanks/naija-genz.json',
  'data/wordbanks/naija-artists.json',
  'assets/sounds/ding.wav', 'assets/sounds/tick.wav', 'assets/sounds/buzzer.wav',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-1024.png',
  'screenshots/1-home.png', 'screenshots/2-how-to-play.png', 'screenshots/3-setup.png',
  'screenshots/4-play.png', 'screenshots/5-scoreboard.png', 'screenshots/6-celebration.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return; // ignore cross-origin

  // Shared offline fallback: for navigations, serve the cached app shell.
  const shellFallback = async () => {
    if (req.mode === 'navigate') {
      const shell = (await caches.match('index.html')) || (await caches.match('./'));
      if (shell) return shell;
    }
    return null;
  };

  event.respondWith((async () => {
    if (DEV) {
      // Network-first, and bypass the HTTP cache too ({cache:'no-store'}): a
      // plain fetch(req) can still be served stale from Chrome's heuristic HTTP
      // cache (dev servers send no Cache-Control), so edits wouldn't show on
      // reload. Fetch by URL to sidestep navigate-mode Request quirks. Falls
      // back to the cache (or app shell) only when offline.
      try {
        const res = await fetch(req.url, { cache: 'no-store' });
        if (res && res.ok) (await caches.open(CACHE)).put(req, res.clone());
        return res;
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        const shell = await shellFallback();
        if (shell) return shell;
        throw err;
      }
    }

    // Production — cache-first, runtime-caching anything new.
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      const shell = await shellFallback();
      if (shell) return shell;
      throw err;
    }
  })());
});
