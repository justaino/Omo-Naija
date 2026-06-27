# ROADMAP.md — Omo Naija

Phased build. Work top to bottom. Don't start a phase until the previous one's "Done when" is met.

---

## Phase 0 — Scaffolding
Turn the prototype into a real project skeleton. No game behaviour yet.

- [ ] Create the folder structure (see README).
- [ ] Refactor `index.html`: extract the `<style>` block into `css/` files (base/tokens, components, screens, animations). Keep the rendered look identical.
- [ ] Load a proper display font (replace the `Arial Black` fallback with a real bold display webfont, e.g. Anton or Archivo Black) without changing the visual feel.
- [ ] Create `js/state.js` with the `gameState` shape + `localStorage` load/save (no logic yet).
- [ ] Create `js/app.js` with **state-driven screen routing** to replace the `data-go` stepper. The seven screens must show/hide based on `gameState.phase`.
- [ ] Create the data layer: `data/wordbanks/naija-classic.json` (the starter bank) + `js/data/wordbank-loader.js`.
- [ ] Pull in GSAP, Howler, canvas-confetti (CDN or via Vite). Confirm they load.

**Done when:** the app boots, looks identical to the prototype, screens are shown by changing `gameState.phase` (not a hardcoded index), and the word bank loads from JSON.

---

## Phase 1 — Core game loop
The game becomes playable end to end on one device.

- [ ] **Setup screen wired to state:** add/remove/rename teams (each gets a colour), pick timer (30/60/90), mode (Green/Grey/Mixed), skip rule (Free/Limited/Penalty), win condition (Open-ended/First-to-N/Fixed rounds). "Start game" builds the game from these.
- [ ] **Deck:** shuffle the word bank into a deck; draw cards; reshuffle/handle running out.
- [ ] **Pre-turn handoff** shows the active team + mode reminder; "Start" begins the turn.
- [ ] **Timer:** real timestamp-based countdown that updates the ring + text; buzzer at zero; Wake Lock during play.
- [ ] **Turn engine:** show current word; **Got it** (+1, next card) and **Skip** (respecting the chosen skip rule, next card); track won/skipped this turn.
- [ ] **Turn summary** lists this turn's results and updated scores; "Next team" advances.
- [ ] **Win conditions** evaluated each turn; End Game button works from play + scoreboard.
- [ ] **Persistence:** every change saves to `localStorage`; a refresh resumes the exact game; Home "Continue game" appears only when a saved game exists.

**Done when:** a full multi-team game can be played start to finish on one device, scores are correct, skip/win settings actually take effect, and refreshing mid-game resumes it.

---

## Phase 2 — The visual game (make it sing)
Bring the design to life with motion.

- [ ] **Card-stack scoreboard** built dynamically from each team's won cards (JS-computed offsets; compress / "+N" past a threshold). Tap a pile to expand the word list.
- [ ] **GSAP Flip** fly-to-pile on every "Got it"; deck visibly thins as cards are used.
- [ ] **End-game reveal:** piles animate into the podium ranking, scores count up, winner gets the gold glow + crown + **canvas-confetti**.
- [ ] **Sound** wired via Howler (tick in final seconds, ding on Got it, buzzer at zero) with a global mute.
- [ ] Word card reflects the active mode (green vs charcoal styling, correct mode tag).

**Done when:** won cards visibly stack per team in real time and End Game produces a satisfying, animated reveal.

---

## Phase 3 — Polish
- [ ] Swipe gestures (right = Got it, left = Skip) alongside buttons.
- [ ] Settings screen: default mode/timer/skip/win, sound + haptics toggles.
- [ ] Haptics on mobile (light tap on Got it, stronger on buzzer).
- [ ] PWA: `manifest.json` + service worker (via `vite-plugin-pwa`) — installable + offline.
- [ ] Accessibility pass: `prefers-reduced-motion`, contrast, focus states, labels.
- [ ] Custom word banks: let users add/select banks; "How to play" content.

**Done when:** installable, playable offline, configurable, accessible.

---

## Phase 3.5 — App store distribution
Get the app onto Google Play and (optionally) the Apple App Store.

### Android (Google Play via TWA)
- [ ] Generate a **1024×1024 icon** for the Play Store listing.
- [ ] Write and host a **privacy policy** (a simple page on GitHub Pages is enough).
- [ ] Use **PWABuilder** (pwabuilder.com) to generate the Android App Bundle (AAB) and the `assetlinks.json` file.
- [ ] Host `assetlinks.json` at `justaino.github.io/.well-known/assetlinks.json` to pass Digital Asset Links verification.
- [ ] Capture **Play Store screenshots** (at least 2 phone screenshots).
- [ ] Create a **Google Play Developer account** ($25 one-time fee) and submit.

### Apple App Store (optional, more effort)
- [ ] Wrap the app with **Capacitor** (native iOS shell around the existing HTML/CSS/JS).
- [ ] Set up **Mac + Xcode** and an **Apple Developer account** ($99/year).
- [ ] Generate all required icon sizes (including 1024×1024).
- [ ] Polish for native feel: suppress text selection / long-press menus on game elements; wire haptics to Capacitor's native plugin; style the iOS status bar to match the app.
- [ ] Submit via App Store Connect.

**Done when:** app is live and installable from Google Play (and optionally the App Store).

---

## Phase 4 — Deferred / optional (out of scope for v1)
Online multiplayer across separate devices, themed/era decks, a 300+ word bank, stats/history, shareable result cards. **Do not build toward these in earlier phases.**
