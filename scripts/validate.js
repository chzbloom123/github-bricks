// Validates the brick data. Run with: node scripts/validate.js
// The Actions workflow runs this on every push and pull request, so a brick that
// links to a brick that does not exist fails the check before it reaches main.

import { eos, bricks, brickById } from '../data/index.js';
import * as tools from '../data/tools.js';

const errors = [];
const ids = new Set();

for (const b of bricks) {
  if (ids.has(b.id)) errors.push(`duplicate brick id: ${b.id}`);
  ids.add(b.id);
  for (const part of ['label', 'what', 'why', 'where', 'when']) {
    if (!b[part] || !String(b[part]).trim()) errors.push(`${b.id}: missing ${part}`);
  }
  if (!Array.isArray(b.links) || b.links.length === 0) errors.push(`${b.id}: no links`);
  for (const l of b.links || []) {
    if (!brickById[l]) errors.push(`${b.id}: links to unknown brick "${l}"`);
    if (l === b.id) errors.push(`${b.id}: links to itself`);
  }
  const c = b.check;
  if (!c || !c.q || !Array.isArray(c.options) || c.options.length < 2) errors.push(`${b.id}: malformed check`);
  else if (typeof c.answer !== 'number' || c.answer < 0 || c.answer >= c.options.length) errors.push(`${b.id}: check answer out of range`);
  else if (!c.why) errors.push(`${b.id}: check has no why`);
}

for (const eo of eos) {
  if (!eo.bricks.length) errors.push(`EO${eo.n}: no bricks`);
  if (!eo.tool) errors.push(`EO${eo.n}: no tool`);
}

function scanCards(name, cards) {
  for (const card of cards) {
    if (!card.options.some((o) => o.ok)) errors.push(`${name}: card "${card.text.slice(0, 40)}" has no acceptable option`);
    for (const o of card.options) if (o.brick && !brickById[o.brick]) errors.push(`${name}: option "${o.label}" points at unknown brick "${o.brick}"`);
  }
}
scanCards('triage', tools.triage.cards);
scanCards('security', tools.security.cards);
scanCards('security.tokens', tools.security.tokens.cards);
scanCards('release.targets', tools.release.targets.cards);
scanCards('dispatch', tools.dispatch.cards);
for (const it of tools.sorter.items) if (!brickById[it.brick]) errors.push(`sorter: item "${it.text}" points at unknown brick "${it.brick}"`);
if (!tools.release.bumps.some((b) => b.ok)) errors.push('release: no acceptable bump');

if (errors.length) {
  console.error(`validate-bricks: ${errors.length} problem(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`validate-bricks: ${bricks.length} bricks across ${eos.length} objectives, all links resolve.`);
