// banks.js — the registry of word banks. Bundled banks ship as JSON under
// data/wordbanks/; custom banks are user-created and live in localStorage.
const CUSTOM_KEY = 'omo-naija:banks';

const BUNDLED = [
  { id: 'naija-classic', name: 'Naija Classic' },
  { id: 'naija-genz', name: 'Naija Gen-Z' },
];

export function isBundled(id) {
  return BUNDLED.some((b) => b.id === id);
}

export function customBanks() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// All banks for the picker: bundled first, then custom (tagged).
export function availableBanks() {
  return [
    ...BUNDLED.map((b) => ({ ...b, custom: false })),
    ...customBanks().map((b) => ({ id: b.id, name: b.name, custom: true })),
  ];
}

export function getCustomBank(id) {
  return customBanks().find((b) => b.id === id) || null;
}

// Create a custom bank from parsed word entries: [{ text, hint }].
// Cards default to both modes; data is kept ASCII-clean by the caller.
export function addCustomBank(name, words) {
  const banks = customBanks();
  const id = `custom-${Date.now()}`;
  const cards = words.map((w, i) => ({
    id: `${id}-${i}`,
    text: w.text,
    hint: w.hint || '',
    category: 'custom',
    era: 'custom',
    difficulty: 'medium',
    modes: ['green', 'grey'],
  }));
  banks.push({ id, name, cards });
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(banks));
  return id;
}

export function deleteCustomBank(id) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(customBanks().filter((b) => b.id !== id)));
}

// Parse a textarea into word entries. One per line; "word | hint" is supported.
export function parseWords(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [word, ...rest] = line.split('|');
      return { text: word.trim(), hint: rest.join('|').trim() };
    })
    .filter((w) => w.text);
}
