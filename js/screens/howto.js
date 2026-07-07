// howto.js — a static "How to play" content screen, reached from Home.
export function render(el, ctx) {
  el.innerHTML = `
    <div class="card">
      <div class="texture" aria-hidden="true"></div>
      <div class="screen__header">
        <div>
          <h2 class="screen__title">How to play</h2>
        </div>
      </div>

      <p class="screen__copy">Omo Naija is a loud, pass-the-phone party game. Teams take turns: one person is the clue-giver, and their teammates guess as many words as they can before the timer runs out.</p>

      <div>
        <div class="screen__eyebrow" style="margin-bottom:8px;">The flow</div>
        <ol class="howto-list">
          <li>Set up teams, timer, mode, skip rule, win condition, and a word bank.</li>
          <li>Pass the phone to the active team's clue-giver.</li>
          <li>Tap <strong>Got it!</strong> (or swipe right) for each correct guess — that's +1.</li>
          <li>Tap <strong>Skip</strong> (or swipe left) to pass on a word.</li>
          <li>When time's up, review the turn and hand off to the next team.</li>
          <li>Tap <strong>End game</strong> any time to reveal the winner.</li>
        </ol>
      </div>

      <div>
        <div class="screen__eyebrow" style="margin-bottom:8px;">Modes (honour system)</div>
        <p class="screen__copy"><strong>Green</strong> — describe with 3 words + gestures only. <strong>Grey</strong> — describe however you like. <strong>Mixed</strong> — each card tells you which. The app shows the rule but trusts you to keep it.</p>
      </div>

      <div>
        <div class="screen__eyebrow" style="margin-bottom:8px;">Skips &amp; winning</div>
        <p class="screen__copy"><strong>Skips:</strong> Free (no cost), Limited (3 per turn), or Penalty (−1). <strong>Win:</strong> Open-ended (play until you End game), First to a score, or a Fixed number of rounds.</p>
      </div>

      <div class="button-stack" style="margin-top:8px;">
        <button class="btn btn--primary" data-back>Got it</button>
      </div>
    </div>`;

  el.querySelector('[data-back]').addEventListener('click', () => ctx.actions.goHome());
}
