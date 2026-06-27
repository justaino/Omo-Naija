# CLAUDE.md — Omo Naija

Persistent guardrails for this repo. Read before any work. These don't change between phases.

## What this is
**Omo Naija** — a Nigerian party word-guessing game (Taboo / Heads Up family). One device, passed around a room. Teams take turns; a clue-giver describes Nigerian slang/phrases; their team guesses as many as they can before the timer runs out. Cards won pile up per team; the winner is revealed when the game ends.

## Status (living — update as you go)
As of 2026-06-27: **Phases 0–3 are complete, plus a buildless PWA.** The app is a full pass-and-play game — setup wired to state, deck shuffle/draw, timestamp timer + Wake Lock, turn engine (scoring, skip rules, win conditions), persistence/resume, dynamic JS card-stack scoreboard with "+N", animated end-game reveal (GSAP + canvas-confetti), Howler sound + mute, swipe gestures, haptics, Settings (defaults + sound/haptics), custom + bundled word banks, How-to screen, install button (with iOS instructions), dark mode (system-aware, persisted), and a Nigerian-flag tricolour **"ON"** brand mark + PWA icons.

- **Repo:** github.com/justaino/Omo-Naija. **Deployed to GitHub Pages from `main`.**
- **Workflow:** work on `dev`; merge to `main` only when explicitly asked. Bump `CACHE` in `service-worker.js` on any app-shell change. Ops details: `documentation/RUNBOOK.md`; player-facing notes: `documentation/WHATS-NEW.md`.
- **Recently added:** word **meanings** now surface from the `hint` field (won cards on the turn summary; expanded piles on the scoreboard show "Word — meaning"); a **Back** button on the Setup screen (→ Home); and a **full-bleed** card layout on phones (≤480px: edge-to-edge card + safe-area insets via `viewport-fit=cover`). The `hint` "surface vs remove" question is now **resolved → surfaced.**
- **Next / in progress:** editing existing custom word banks (currently add/delete only).
- **Phase 4 is deferred** (online multiplayer, themed/era decks, 300+ bank, stats/history, shareable result cards) — don't build toward it unless asked.

## The golden rule
**Preserve the look in `index.html` exactly.** That file is the agreed visual source of truth (design tokens, components, all seven screens). We are building the *application* underneath that design — not redesigning it. Refactor it into a clean structure, but the rendered result should look the same.

## Stack — fixed
- **Vanilla HTML / CSS / JavaScript.** No React, Vue, Svelte, or any UI framework.
- **GSAP (+ Flip plugin)** for animation — card fly-to-pile, deck shrink, end-game reveal sequencing.
- **canvas-confetti** for the win celebration.
- **Howler.js** for sound (final-seconds tick, "got it" ding, end-of-turn buzzer).
- **Buildless — no build step, no bundler.** The app is plain ES modules served statically; it must keep running by serving the folder over HTTP. (Vite was evaluated for the PWA and deliberately not adopted — see ROADMAP/runbook.)
- Libraries are **vendored locally** in `assets/vendor/` (loaded via `<script>` in `index.html`) so the app works offline — no CDN at runtime. The Anton display font is self-hosted in `assets/fonts/`. Keep dependencies minimal and justified.

## PWA / service worker
- The PWA is hand-written: `manifest.json` + `service-worker.js` (cache-first precache of the app shell). It is installable and fully offline.
- **Bump `CACHE` in `service-worker.js` on every deploy that changes any file** (e.g. `omo-naija-v1` → `-v2`). The `activate` handler deletes old caches, so bumping is how installed devices pick up new files — forget it and phones keep serving the stale cached version. When you add/remove a file in the shell, also update the `PRECACHE` list.

## Architecture rules
- **Single source of truth: one `gameState` object.** Screens render from state; never drive navigation by a hardcoded screen index. The prototype's linear `data-go` stepper is throwaway scaffolding — replace it with state-driven routing.
- **Words are data, not code.** The word bank lives in `data/wordbanks/*.json` and is loaded through a small loader (provider-abstraction style — a word bank is a pluggable module, like the bin app's providers).
- **Persist to `localStorage`** on every state change so a game survives a refresh / accidental tab close. This powers "Continue game".
- **No backend, no accounts, no network calls.** Single-device pass-and-play only. Online multiplayer is explicitly deferred (see ROADMAP Phase 4) — do not build toward it.
- **Timer must be timestamp-based** (compare `Date.now()` against a turn-start timestamp), never naive `setInterval` tick-counting — backgrounding the tab must not drift the clock.
- **Use the Screen Wake Lock API** during a live turn so the screen doesn't sleep mid-play.

## Game rules to honour
- Two modes: **Green** (clue with 3 words + gestures), **Grey** (describe freely), plus **Mixed**. This is **honour-system** — the app displays the rule prominently but cannot enforce it. Don't try to.
- **Scoring is even**: every correct guess = +1, regardless of mode.
- **Skips** are configurable at setup: Free (default), Limited, or Penalty.
- **Win condition** is configurable at setup: Open-ended (default), First-to-N, or Fixed rounds.
- **End Game is always reachable** during play and on the scoreboard; it jumps straight to the reveal.

## The signature card-stack (get this right)
- Each team's won cards render as a physical-looking pile (offset + slight rotation per card).
- **Stacking must be JS-computed**, not fixed CSS `nth-child` rules (the prototype caps at 6 — real games go higher). Beyond a threshold (~8–10 visible), compress the offset and/or show a "+N" count so the pile never grows unusably tall.
- On "Got it", the current word card animates flying onto the active team's pile (GSAP Flip).

## Quality bar
- **Accessibility:** honour `prefers-reduced-motion` (skip/shorten animations), maintain high contrast, keep tap targets >= 56px, label interactive elements.
- **Touch + desktop:** support tap and swipe (swipe right = Got it, left = Skip) plus the on-screen buttons.
- **No accidental taps:** confirm before End Game; keep Got it / Skip well separated.
- **ASCII-safe** word data and hints (no emoji in the bank) for clean rendering across platforms.

## Scope discipline
Build phase by phase per ROADMAP.md. Each phase has "done when" criteria — meet them before moving on. Don't pull future-phase work forward. If a change isn't covered by the current phase, flag it rather than silently expanding scope.

## Working with the user
When a request is ambiguous enough that you restate or clarify your understanding before acting, **stop and let the user confirm that interpretation first** — don't restate it and then implement in the same turn. Wait for sign-off, then build. If the request is unambiguous, just implement.
