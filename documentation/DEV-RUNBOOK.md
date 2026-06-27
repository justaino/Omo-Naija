# Omo Naija — Dev Runbook (run & test)

A short, practical guide to running the app on your machine and testing changes
while you work. For full operational/deploy detail see `RUNBOOK.md`; for
guardrails see `CLAUDE.md`.

---

## 1. What you need

- **Python 3** (already on macOS) — to serve the folder. *Or* Node (`npx serve`).
- A modern browser (Chrome recommended for the DevTools below).
- That's it. **There is no build step** — the app is plain static files
  (vanilla HTML/CSS/JS, ES modules). No `npm install`, no bundler.

---

## 2. Run it locally

The app uses ES-module `import`s and `fetch`es the word-bank JSON. Browsers
**block both from `file://`**, so you must serve the folder over HTTP — opening
`index.html` by double-clicking will show a blank page.

```bash
cd "Omo Naija"
python3 -m http.server 8731      # pick any free port; or: npx serve
```

Then open the printed URL, e.g. **http://localhost:8731/** .

`localhost` counts as a secure context, so the service worker registers and the
PWA is even installable there.

To stop the server: `Ctrl-C` in that terminal.

---

## 3. Testing in dev (the important part)

### ⚠️ The service-worker cache will hide your edits
This app ships a service worker (`service-worker.js`) that **precaches the app
shell and serves it cache-first** — great for offline, annoying in dev, because
after the first load the browser keeps serving the *old* cached files even after
you edit them. If you change a file and "nothing happens," this is almost always
why.

Fixes, easiest first:

1. **DevTools → Application → Service Workers** → tick **"Update on reload"** and
   **"Bypass for network"**. Leave DevTools open while you work. (Recommended.)
2. Or **DevTools → Network** → tick **"Disable cache"** (also needs DevTools open).
3. Or a **hard reload**: Cmd-Shift-R.
4. Nuclear option (stuck install): **Application → Service Workers → Unregister**,
   then **Application → Storage → Clear site data**, then reload.

### Bump the cache when you change shell files
On any change to an app-shell file (HTML/CSS/JS/asset that the SW precaches),
bump `CACHE` in `service-worker.js` (e.g. `omo-naija-v7` → `-v8`). That string is
what makes an *installed* device pick up the new version — the `activate` handler
deletes the old cache. Forget it and phones keep serving the stale version. If
you add/remove a shell file, also update the `PRECACHE` list.

### Reset game state between tests
The whole game persists to `localStorage`, so a half-played game resumes on
reload. To start clean: **Application → Local Storage → clear**, or in the
console:

```js
localStorage.removeItem('omo-naija:state');   // the in-progress game
localStorage.removeItem('omo-naija:banks');   // custom word banks
localStorage.removeItem('omo-naija:prefs');   // settings + theme
```

### Test mobile / the full-bleed layout
Use **DevTools → device toolbar** (Cmd-Shift-M) and pick a phone (e.g. iPhone
12, 390px). The card goes **full-bleed** (edge-to-edge) at ≤480px; above that
it's a centered card. Verify both widths after layout changes.

### Quick sanity checklist for a change
- Open at a phone width *and* a desktop width.
- Toggle **dark mode** (🌙 in the topbar) — check contrast on anything new.
- If you touched the game flow: play a full turn, hit the turn summary and the
  scoreboard, and refresh mid-game to confirm it resumes.
- Watch the **console** — there should be no errors; the libs log
  `[libs] … ready` and the bank logs `[app] word bank ready: N cards`.

---

## 4. Deploy (summary)

Static files on **GitHub Pages**. Work on **`dev`**; merge to **`main`** only
when asked — Pages serves `main`, so merging is the deploy. After deploy, bump
`CACHE` so installed devices refresh. Full steps in `RUNBOOK.md` §5–6.

---

## 5. Quick reference

| I want to… | Do this |
|---|---|
| Run the app | `python3 -m http.server 8731` then open `localhost:8731` |
| See my edits (not the cache) | DevTools → Application → SW → "Update on reload" + "Bypass for network" |
| Start a fresh game | Clear `localStorage` (or just key `omo-naija:state`) |
| Test mobile / full-bleed | DevTools device toolbar at ≤480px |
| Ship a change to installed devices | Bump `CACHE` in `service-worker.js` |
| Deploy to production | Merge `dev` → `main` (see `RUNBOOK.md`) |
