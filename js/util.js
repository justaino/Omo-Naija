// util.js — tiny shared helpers for the screen renderers.

// Escape text before dropping it into innerHTML (team names are user input).
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Human label + foot text for a card mode.
export function modeLabel(mode) {
  return mode === 'green' ? 'Green mode' : 'Grey mode';
}
export function modeRule(mode) {
  return mode === 'green' ? '3 words + gestures' : 'Describe freely';
}
