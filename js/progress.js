// Progress lives in the browser only (localStorage). Nothing leaves the page.

const KEY = 'gh-bricks-progress-v1';
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* storage may be unavailable; fall through */ }
  return { laid: {}, tools: {}, transferBest: 0 };
}
let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* ignore */ }
  for (const fn of listeners) fn(state);
}

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function laidSet() { return new Set(Object.keys(state.laid)); }
export function isLaid(id) { return Boolean(state.laid[id]); }
export function layBrick(id) { if (!state.laid[id]) { state.laid[id] = Date.now(); save(); } }
export function toolDone(n) { return Boolean(state.tools[n]); }
export function setToolDone(n) { if (!state.tools[n]) { state.tools[n] = Date.now(); save(); } }
export function transferBest() { return state.transferBest || 0; }
export function setTransferBest(score) { if (score > (state.transferBest || 0)) { state.transferBest = score; save(); } }
export function reset() { state = { laid: {}, tools: {}, transferBest: 0 }; save(); }
