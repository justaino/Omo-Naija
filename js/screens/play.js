// play.js — the live turn. Word card (styled to its mode), Got it / Skip, the
// timer ring, a thinning deck behind the card, and the urgency bar. On Got it
// the card flies to the team's score pill (GSAP); on Skip it slides away.
import { currentTeam, canSkip, SKIP_LIMIT } from '../game.js';
import { esc, modeLabel, modeRule } from '../util.js';
import * as anim from '../anim.js';
import * as sound from '../sound.js';

export function render(el, ctx) {
  const { state } = ctx;
  const team = currentTeam();
  const card = state.currentCard;
  const mode = card ? card.mode : state.settings.mode;
  const grey = mode === 'grey';
  const deckLeft = state.deck.length;

  // Initial timer text from the timestamp so it doesn't flash a stale value.
  const remaining = Math.max(0, (state.turn.endsAt || 0) - Date.now());
  const initialTime = `${Math.floor(Math.ceil(remaining / 1000) / 60)}:${String(Math.ceil(remaining / 1000) % 60).padStart(2, '0')}`;

  // Skip button label/availability per skip rule.
  let skipLabel = '⤺ Skip';
  let skipDisabled = false;
  if (state.settings.skipRule === 'limited') {
    skipLabel = `⤺ Skip (${Math.max(0, SKIP_LIMIT - state.turn.skipsUsed)})`;
    skipDisabled = !canSkip();
  } else if (state.settings.skipRule === 'penalty') {
    skipLabel = '⤺ Skip (−1)';
  }

  // Deck visibly thins: fewer peek cards as the draw pile empties.
  const peeks = (deckLeft > 1 ? '<div class="peek-card peek-card--one"></div>' : '')
              + (deckLeft > 0 ? '<div class="peek-card peek-card--two"></div>' : '');

  el.innerHTML = `
    <div class="card">
      <div class="texture" aria-hidden="true"></div>
      <div class="play-card">
        <div class="topbar-row">
          <div class="timer" id="timer-ring">
            <div class="timer__inner" id="timer-text">${initialTime}</div>
          </div>
          <div class="team-meta">
            <div class="team-name">${esc(team ? team.name : '')}</div>
            <div class="score-pill" id="score-pill"><span style="color:${team ? team.color : 'currentColor'}">●</span> ${team ? team.score : 0}</div>
          </div>
          <button class="ghost-link" data-end>End game</button>
        </div>

        <div class="play-meta">
          <div class="screen__eyebrow">Live play</div>
          <div class="deck-count" aria-label="Cards left in deck">${deckLeft} in deck</div>
        </div>

        <div class="word-stack">
          ${peeks}
          <div class="word-card${grey ? ' word-card--grey' : ''}" id="word-card">
            <div class="word-card__urgentbar" aria-hidden="true"></div>
            <div class="word-card__tags">
              <span class="tag">${esc(card ? `${card.category} · ${card.era}` : '')}</span>
              <span class="tag" id="mode-tag">${modeLabel(mode)}</span>
            </div>
            <div class="word-card__word">${esc(card ? card.text : '')}</div>
            <div class="word-card__foot">
              <span>${modeRule(mode)}</span>
              <span>●</span>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="action-btn action-btn--success" data-got>✓ Got it!</button>
          <button class="action-btn action-btn--skip" data-skip ${skipDisabled ? 'disabled' : ''}>${skipLabel}</button>
        </div>
      </div>
    </div>`;

  // Animate the outgoing card (cosmetic), then advance the game immediately.
  // Order matters: clone the current card BEFORE the action re-renders the next.
  el.querySelector('[data-got]').addEventListener('click', () => {
    sound.play('ding');
    anim.flyToPile(el.querySelector('#word-card'), el.querySelector('#score-pill'));
    ctx.actions.gotIt();
  });

  el.querySelector('[data-skip]').addEventListener('click', () => {
    anim.skipAway(el.querySelector('#word-card'));
    ctx.actions.skip();
  });

  el.querySelector('[data-end]').addEventListener('click', () => ctx.actions.endGameConfirm());
}
