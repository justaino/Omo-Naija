# CLAUDE.md — Omo Naija

Persistent guardrails for this repo. Read before any work. These don't change between phases.

## What this is
**Omo Naija** — a Nigerian party word-guessing game (Taboo / Heads Up family). One device, passed around a room. Teams take turns; a clue-giver describes Nigerian slang/phrases; their team guesses as many as they can before the timer runs out. Cards won pile up per team; the winner is revealed when the game ends.

## The golden rule
**Preserve the look in `index.html` exactly.** That file is the agreed visual source of truth (design tokens, components, all seven screens). We are building the *application* underneath that design — not redesigning it. Refactor it into a clean structure, but the rendered result should look the same.

## Stack — fixed
- **Vanilla HTML / CSS / JavaScript.** No React, Vue, Svelte, or any UI framework.
- **GSAP (+ Flip plugin)** for animation — card fly-to-pile, deck shrink, end-game reveal sequencing.
- **canvas-confetti** for the win celebration.
- **Howler.js** for sound (final-seconds tick, "got it" ding, end-of-turn buzzer).
- **Vite** is the only permitted build tool, and only for dev server + PWA (`vite-plugin-pwa`). No other bundsize/tooling. If in doubt, stay buildless.
- Libraries load via npm (with Vite) or CDN/ESM. Keep dependencies minimal and justified.

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
