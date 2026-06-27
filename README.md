# Omo Naija

A Nigerian party word-guessing game for mobile, desktop, and web. Pass one device around the room: teams take turns describing Nigerian slang and phrases while their teammates guess as many as possible before the timer runs out. Won cards pile up per team, and the winner is revealed when you end the game.

> *Omo Naija* — "child of Nigeria." How well do you really sabi your slang?

## Status
In development. Design is locked (see `index.html`); the app is being built phase by phase per `ROADMAP.md`.

## How to play (the game)
1. Set up teams, timer length, mode, skip rule, and win condition.
2. Pass the phone to the active team's clue-giver.
3. **Green mode:** clue with 3 words + gestures only. **Grey mode:** describe however you like. **Mixed:** both.
4. Tap **Got it!** for each correct guess (+1), **Skip** to pass.
5. When the timer ends, the phone moves to the next team.
6. Tap **End game** anytime to reveal the final stacks and the winner.

## Tech
- Vanilla HTML / CSS / JavaScript (no UI framework, no build step).
- GSAP (+ Flip) for animation, Howler.js for sound, canvas-confetti for the win — all vendored locally in `assets/vendor/` (no CDN), so the app works offline.
- `localStorage` for game state + settings (no backend, no accounts).
- Buildless PWA: hand-written `manifest.json` + `service-worker.js` — installable and fully offline.

## Run it
Serve the folder over HTTP (ES-module imports and the word-bank `fetch` don't work from `file://`):

```
npx serve          # or: python3 -m http.server
```

Then open the printed `http://localhost:…` URL. The PWA installs over **HTTPS or localhost** (browsers block service workers on plain `file://`/LAN-HTTP).

### Test on your phone
Deploy to **GitHub Pages** (Settings → Pages → deploy from a branch). Pages serves over HTTPS, so on your phone you can open the URL and **Add to Home Screen** to install it and run it offline. No build needed — Pages serves the static files as-is.

> Note: after changing files, bump `CACHE` in `service-worker.js` so installed devices pick up the new version.

## Structure
```
omo-naija/
  index.html              # entry (design source of truth)
  css/                    # base/tokens, components, screens, animations
  js/
    app.js                # bootstrap + state-driven screen routing
    state.js              # gameState + localStorage persistence
    game.js               # turn engine, scoring, win conditions
    timer.js              # timestamp countdown + wake lock
    deck.js               # shuffle / draw
    screens/              # render fn per screen
    components/           # card, pile, scoreboard, timer ring
    data/wordbank-loader.js
  data/wordbanks/
    naija-classic.json    # starter word bank
  assets/sounds/  assets/icons/  assets/fonts/
  manifest.json  service-worker.js   # PWA (Phase 3)
  CLAUDE.md  ROADMAP.md  README.md
```

## Design system (from `index.html`)
Green `#008751`, gold `#F2C94C`, coral `#FF6B3D`, charcoal `#1E1E1E`, cream surface `#FFFDF7`. Bold display font for words, clean sans for UI. Rounded cards, pill buttons, segmented controls, conic-gradient timer ring, and the signature stacked-card piles.

## Contributing notes
Read `CLAUDE.md` first — it has the non-negotiable guardrails. Build only the current `ROADMAP.md` phase and meet its "Done when" before moving on.
