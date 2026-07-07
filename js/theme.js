// theme.js — visual theming. Two axes:
//   • skin  — 'classic' | 'owambe' | 'highlife' (chosen in Settings). Non-classic
//             skins are single committed looks defined in css/skins.css.
//   • theme — light/dark, but ONLY for the Classic skin (topbar toggle).
// Both are applied via attributes on <html>: data-skin + data-theme. A fixed skin
// forces data-theme back to the neutral light base so its rules layer cleanly.
import { preferences, savePrefs } from './preferences.js';

const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

// True when a non-Classic skin is active (light/dark toggle then doesn't apply).
export function isFixedSkin() {
  return !!preferences.skin && preferences.skin !== 'classic';
}

// The effective light/dark theme right now ('light' | 'dark').
export function resolved() {
  const t = preferences.theme || 'system';
  if (t === 'light' || t === 'dark') return t;
  return mq && mq.matches ? 'dark' : 'light';
}

export function isDark() {
  return !isFixedSkin() && resolved() === 'dark';
}

export function apply() {
  const root = document.documentElement;
  if (isFixedSkin()) {
    root.setAttribute('data-skin', preferences.skin);
    root.setAttribute('data-theme', 'light'); // fixed skins sit on the light base
  } else {
    root.removeAttribute('data-skin');
    root.setAttribute('data-theme', resolved());
  }
}

// Switch skin ('classic' | 'owambe' | 'highlife'), persist, and re-apply.
export function setSkin(skin) {
  preferences.skin = skin || 'classic';
  savePrefs();
  apply();
}

// Flip to the opposite of what's showing now (becomes an explicit choice).
export function toggle() {
  preferences.theme = resolved() === 'dark' ? 'light' : 'dark';
  savePrefs();
  apply();
  return resolved();
}

// Keep following the OS while the preference is still 'system'.
export function initSystemListener(onChange) {
  mq?.addEventListener?.('change', () => {
    if ((preferences.theme || 'system') === 'system') {
      apply();
      onChange?.();
    }
  });
}
