// deck.js — turning the word bank into a playable deck.
// Pure-ish helpers: shuffle, build a deck for a chosen mode, and draw the next
// card (reshuffling skips, or rebuilding from the bank, when the deck runs dry).

// The two playable modes a single card can be shown in.
const PLAYABLE = ['green', 'grey'];

// Fisher-Yates shuffle, returns a NEW array.
export function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Which modes a given card actually supports (defaults to grey if unspecified).
function supported(card) {
  const modes = Array.isArray(card.modes) ? card.modes.filter((m) => PLAYABLE.includes(m)) : [];
  return modes.length ? modes : ['grey'];
}

// Decide the mode a card is shown in, honouring the chosen game mode and what
// the card itself supports.
//   green  -> 'green'   grey -> 'grey'   mixed -> random of the card's modes
export function pickMode(card, gameMode) {
  const modes = supported(card);
  if (gameMode === 'green') return modes.includes('green') ? 'green' : 'grey';
  if (gameMode === 'grey') return modes.includes('grey') ? 'grey' : modes[0];
  // mixed
  return modes[Math.floor(Math.random() * modes.length)];
}

// Slim a bank card down to what play needs, tagging it with its display mode.
function toDeckCard(card, gameMode) {
  return {
    id: card.id,
    text: card.text,
    hint: card.hint,
    category: card.category,
    era: card.era,
    mode: pickMode(card, gameMode),
  };
}

// Build a shuffled deck for the chosen mode. In green mode only green-capable
// cards are included; grey/mixed use everything.
export function buildDeck(cards, gameMode) {
  const usable = gameMode === 'green'
    ? cards.filter((c) => supported(c).includes('green'))
    : cards.slice();
  return shuffle(usable).map((c) => toDeckCard(c, gameMode));
}

// Draw the next card off the deck, mutating gameState. When the deck empties,
// reshuffle the skipped pile back in; if that's empty too (everything won),
// rebuild a fresh deck from the full bank so play never hard-stops.
export function drawCard(gameState, bankCards) {
  if (gameState.deck.length === 0) {
    if (gameState.discard.length > 0) {
      gameState.deck = shuffle(gameState.discard);
      gameState.discard = [];
    } else {
      gameState.deck = buildDeck(bankCards, gameState.settings.mode);
    }
  }
  return gameState.deck.pop() || null;
}
