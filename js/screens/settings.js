// settings.js — global preferences: sound/haptics toggles, the defaults that
// seed a new game, and custom word-bank management. Edits persist immediately.
import { preferences, savePrefs } from '../preferences.js';
import { availableBanks, customBanks, addCustomBank, deleteCustomBank, parseWords } from '../banks.js';
import * as sound from '../sound.js';
import { esc } from '../util.js';

export function render(el, ctx) {
  const rerender = () => render(el, ctx);
  const p = preferences;
  const seg = (a) => (a ? ' class="active"' : '');
  const showStepper = p.defaultWinCondition !== 'open';
  const stepperLabel = p.defaultWinCondition === 'fixedRounds' ? 'Rounds to play' : 'Score to win';
  const banks = availableBanks();
  const custom = customBanks();

  el.innerHTML = `
    <div class="card">
      <div class="texture" aria-hidden="true"></div>
      <div class="screen__header">
        <div>
          <div class="screen__eyebrow">Settings</div>
          <h2 class="screen__title">Settings</h2>
        </div>
      </div>

      <div>
        <div class="screen__eyebrow" style="margin-bottom:10px;">Sound &amp; haptics</div>
        <div class="setting-row">
          <span>Sound</span>
          <div class="segmented segmented--2">
            <button data-sound="on"${seg(p.soundEnabled)}>On</button>
            <button data-sound="off"${seg(!p.soundEnabled)}>Off</button>
          </div>
        </div>
        <div class="setting-row">
          <span>Haptics</span>
          <div class="segmented segmented--2">
            <button data-haptics="on"${seg(p.hapticsEnabled)}>On</button>
            <button data-haptics="off"${seg(!p.hapticsEnabled)}>Off</button>
          </div>
        </div>
      </div>

      <div>
        <div class="screen__eyebrow" style="margin-bottom:10px;">Game defaults</div>
        <div class="screen__copy" style="font-size:0.86rem; margin-bottom:8px;">These pre-fill a new game's setup.</div>
        <div class="segmented segmented--3" style="margin-bottom:10px;">
          <button data-timer="30"${seg(p.defaultTimerSeconds === 30)}>30s</button>
          <button data-timer="60"${seg(p.defaultTimerSeconds === 60)}>60s</button>
          <button data-timer="90"${seg(p.defaultTimerSeconds === 90)}>90s</button>
        </div>
        <div class="mode-grid" style="margin-bottom:10px;">
          <button class="mode-card mode-card--green${p.defaultMode === 'green' ? ' active' : ''}" data-mode="green"><span>Green (3 words + gestures)</span><span>✓</span></button>
          <button class="mode-card mode-card--charcoal${p.defaultMode === 'grey' ? ' active' : ''}" data-mode="grey"><span>Grey (describe freely)</span><span>●</span></button>
          <button class="mode-card mode-card--mixed${p.defaultMode === 'mixed' ? ' active' : ''}" data-mode="mixed"><span>Mixed</span><span>✦</span></button>
        </div>
        <div class="segmented segmented--3" style="margin-bottom:10px;">
          <button data-skip="free"${seg(p.defaultSkipRule === 'free')}>Free</button>
          <button data-skip="limited"${seg(p.defaultSkipRule === 'limited')}>Limited</button>
          <button data-skip="penalty"${seg(p.defaultSkipRule === 'penalty')}>Penalty</button>
        </div>
        <div class="segmented segmented--3">
          <button data-win="open"${seg(p.defaultWinCondition === 'open')}>Open-ended</button>
          <button data-win="firstToN"${seg(p.defaultWinCondition === 'firstToN')}>First to score</button>
          <button data-win="fixedRounds"${seg(p.defaultWinCondition === 'fixedRounds')}>Fixed rounds</button>
        </div>
        ${showStepper ? `
        <div class="screen__copy" style="margin-top:8px; font-size:0.86rem;">${stepperLabel}</div>
        <div class="stepper">
          <button data-step="-1">−</button>
          <input type="number" value="${p.defaultWinTarget}" min="1" max="99" data-target />
          <button data-step="1">+</button>
        </div>` : ''}
        <div class="screen__copy" style="margin:10px 0 6px; font-size:0.86rem;">Default word bank</div>
        <select class="bank-select" data-defbank aria-label="Default word bank">
          ${banks.map((b) => `<option value="${b.id}"${b.id === p.defaultWordbankId ? ' selected' : ''}>${esc(b.name)}${b.custom ? ' (custom)' : ''}</option>`).join('')}
        </select>
      </div>

      <div>
        <div class="screen__eyebrow" style="margin-bottom:10px;">Word banks</div>
        ${custom.length ? custom.map((b) => `
          <div class="setting-row">
            <span>${esc(b.name)} · ${b.cards.length} cards</span>
            <button class="icon-btn" data-delbank="${b.id}" aria-label="Delete ${esc(b.name)}">×</button>
          </div>`).join('') : '<div class="screen__copy" style="font-size:0.86rem;">No custom banks yet.</div>'}
        <div style="margin-top:10px;">
          <input class="field" data-bankname placeholder="New bank name" aria-label="New bank name" />
          <textarea class="field" data-bankwords rows="4" placeholder="One word per line. Optional hint after a | e.g. Wahala | trouble" aria-label="Words, one per line"></textarea>
          <button class="btn btn--ghost" data-addbank style="min-height:44px;">+ Add word bank</button>
          <div class="screen__copy" data-bankerr style="font-size:0.82rem; color:var(--color-coral); margin-top:6px; display:none;"></div>
        </div>
      </div>

      <div class="button-stack" style="margin-top:8px;">
        <button class="btn btn--secondary" data-back>Back</button>
      </div>
    </div>`;

  const set = (fn) => { fn(); savePrefs(); rerender(); };

  el.querySelectorAll('[data-sound]').forEach((b) => b.addEventListener('click', () => set(() => {
    p.soundEnabled = b.dataset.sound === 'on'; sound.refreshMute(); ctx.actions.syncMute();
  })));
  el.querySelectorAll('[data-haptics]').forEach((b) => b.addEventListener('click', () => set(() => {
    p.hapticsEnabled = b.dataset.haptics === 'on';
  })));
  el.querySelectorAll('[data-timer]').forEach((b) => b.addEventListener('click', () => set(() => { p.defaultTimerSeconds = Number(b.dataset.timer); })));
  el.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => set(() => { p.defaultMode = b.dataset.mode; })));
  el.querySelectorAll('[data-skip]').forEach((b) => b.addEventListener('click', () => set(() => { p.defaultSkipRule = b.dataset.skip; })));
  el.querySelectorAll('[data-win]').forEach((b) => b.addEventListener('click', () => set(() => { p.defaultWinCondition = b.dataset.win; })));
  el.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => set(() => {
    p.defaultWinTarget = Math.min(99, Math.max(1, p.defaultWinTarget + Number(b.dataset.step)));
  })));
  el.querySelector('[data-target]')?.addEventListener('change', (e) => set(() => {
    p.defaultWinTarget = Math.min(99, Math.max(1, Number(e.target.value) || 1));
  }));
  el.querySelector('[data-defbank]')?.addEventListener('change', (e) => { p.defaultWordbankId = e.target.value; savePrefs(); });

  el.querySelector('[data-addbank]')?.addEventListener('click', () => {
    const name = el.querySelector('[data-bankname]').value.trim();
    const words = parseWords(el.querySelector('[data-bankwords]').value);
    const err = el.querySelector('[data-bankerr]');
    if (!name) return showErr(err, 'Give the bank a name.');
    if (words.length < 1) return showErr(err, 'Add at least one word.');
    addCustomBank(name, words);
    rerender();
  });

  el.querySelectorAll('[data-delbank]').forEach((b) => b.addEventListener('click', () => {
    deleteCustomBank(b.dataset.delbank);
    if (p.defaultWordbankId === b.dataset.delbank) { p.defaultWordbankId = 'naija-classic'; savePrefs(); }
    rerender();
  }));

  el.querySelector('[data-back]').addEventListener('click', () => ctx.actions.goHome());
}

function showErr(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}
