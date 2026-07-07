// preturn.js — the "pass the phone" handoff. Shows the active team and a mode
// reminder; "Start" begins the turn.
import { currentTeam } from '../game.js';
import { esc } from '../util.js';

const MODE_CHIP = {
  green: 'Green — 3 words + gestures',
  grey: 'Grey — describe freely',
  mixed: 'Mixed — each card sets the rule',
};

export function render(el, ctx) {
  const team = currentTeam();
  const { settings, round } = ctx.state;
  const name = team ? team.name : 'Team';

  el.innerHTML = `
    <div class="card" style="background: linear-gradient(135deg, var(--turn-grad-a, var(--color-primary)) 0%, var(--turn-grad-b, #00a15f) 100%); color: var(--turn-grad-fg, var(--color-white));">
      <div class="texture" aria-hidden="true"></div>
      <div class="turn-card">
        <h2 class="turn-card__title">${esc(name)}'s turn</h2>
        <p class="turn-card__subtitle">Round ${round} · pass the phone to your clue-giver</p>
        <div class="chip">${MODE_CHIP[settings.mode] || MODE_CHIP.mixed}</div>
        <p class="rule-line">Keep it simple, keep it loud, and keep the next team from peeking.</p>
        <button class="btn start-btn" data-start>Start</button>
      </div>
    </div>`;

  el.querySelector('[data-start]').addEventListener('click', () => ctx.actions.startTurn());
}
