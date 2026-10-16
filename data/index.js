// Assembles the seven enabling objectives into one structure the app reads.
// Terminal objective → enabling objectives → semantic bricks.

import * as e1 from './eo1-repo.js';
import * as e2 from './eo2-change.js';
import * as e3 from './eo3-track.js';
import * as e4 from './eo4-automate.js';
import * as e5 from './eo5-secure.js';
import * as e6 from './eo6-ship.js';
import * as e7 from './eo7-agents.js';

export const terminalObjective =
  'When something needs to happen to one of your repos — track it, change it, check it, ship it, secure it, or hand it to an agent — name the GitHub.com feature for the job, say why it exists, and use it without a tutorial.';

const modules = [e1, e2, e3, e4, e5, e6, e7];

export const eos = modules.map((m) => ({ ...m.eo, bricks: m.bricks.map((b) => b.id) }));

export const bricks = modules.flatMap((m) => m.bricks.map((b) => ({ ...b, eo: m.eo.n })));

export const brickById = Object.fromEntries(bricks.map((b) => [b.id, b]));
export const eoByN = Object.fromEntries(eos.map((e) => [e.n, e]));

// Edges for the relationship map: every link, de-duplicated as an unordered pair.
const seen = new Set();
export const edges = [];
for (const b of bricks) {
  for (const to of b.links) {
    if (!brickById[to]) continue;
    const key = [b.id, to].sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push([b.id, to]);
  }
}

export function neighbors(id) {
  const out = new Set();
  for (const [a, b] of edges) {
    if (a === id) out.add(b);
    if (b === id) out.add(a);
  }
  return [...out];
}
