// wordbank-loader.js — loads a word bank from data/wordbanks/<id>.json.
// Word banks are data, not code: each bank is a pluggable JSON module.
// Phase 0: just load the bank and return its cards (logs the count to prove it).

const WORDBANK_BASE = 'data/wordbanks';

// Load a word bank by id and return its array of cards.
// Resolves relative to the document (index.html at the project root), so this
// works when the folder is served (e.g. `npx serve`). fetch() of a local file
// won't work over the file:// protocol — serve the folder instead.
export async function loadWordbank(id = 'naija-classic') {
  const url = `${WORDBANK_BASE}/${id}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Word bank "${id}" failed to load: ${res.status} ${res.statusText}`);
  }
  const bank = await res.json();
  const cards = Array.isArray(bank.cards) ? bank.cards : [];
  console.log(`[wordbank-loader] loaded "${bank.name ?? id}" — ${cards.length} cards`);
  return cards;
}
