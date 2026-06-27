// home.js — landing screen. "Play" starts setup; "Continue game" appears only
// when a resumable in-progress game exists on disk.
import { hasResumableGame } from '../state.js';

export function render(el, ctx) {
  const canContinue = hasResumableGame();
  el.innerHTML = `
    <div class="card">
      <div class="texture" aria-hidden="true"></div>
      <div class="hero">
        <div class="brand-mark">N</div>
        <div>
          <div class="screen__eyebrow">Nigerian party game</div>
          <h1 class="screen__title">Omo Naija</h1>
        </div>
        <p class="screen__copy">A loud, social word game made for passing a phone around the room and building a big, joyful pile of cards.</p>
      </div>
      <div class="button-stack">
        <button class="btn btn--primary" data-act="play">Play</button>
        ${canContinue ? '<button class="btn btn--secondary" data-act="continue">Continue game</button>' : ''}
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <button class="btn btn--ghost" disabled>How to play</button>
          <button class="btn btn--ghost" disabled>Settings</button>
        </div>
      </div>
    </div>`;

  el.querySelector('[data-act="play"]').addEventListener('click', () => ctx.actions.openSetup());
  el.querySelector('[data-act="continue"]')?.addEventListener('click', () => ctx.actions.continueGame());
}
