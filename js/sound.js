// sound.js — Howler-backed sound effects (synthesized WAVs in assets/sounds/).
// Honours the global mute stored in gameState.settings.soundEnabled.
import { gameState, saveState } from './state.js';

let sounds = {};
let ready = false;

// Create the Howl instances once. Safe to call before/after a user gesture;
// the audio context unlocks on the first real play (a tap on Got it / Start).
export function initSound() {
  if (ready || typeof Howl === 'undefined') return;
  sounds = {
    ding:   new Howl({ src: ['assets/sounds/ding.wav'],   volume: 0.5 }),
    tick:   new Howl({ src: ['assets/sounds/tick.wav'],   volume: 0.35 }),
    buzzer: new Howl({ src: ['assets/sounds/buzzer.wav'], volume: 0.55 }),
  };
  ready = true;
  applyMute();
}

function applyMute() {
  if (typeof Howler !== 'undefined') Howler.mute(!gameState.settings.soundEnabled);
}

// Play a named effect, unless muted.
export function play(name) {
  if (!ready || !gameState.settings.soundEnabled) return;
  sounds[name]?.play();
}

export function isMuted() {
  return !gameState.settings.soundEnabled;
}

// Flip global mute, persist it, return the new muted state.
export function toggleMute() {
  gameState.settings.soundEnabled = !gameState.settings.soundEnabled;
  applyMute();
  saveState();
  return isMuted();
}
