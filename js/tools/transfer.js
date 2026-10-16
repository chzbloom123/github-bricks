// Transfer run — twelve brick checks drawn at random across all seven objectives.
// A right answer lays that brick. Best score is kept.

import { h, shuffle } from '../dom.js';
import { bricks, eos } from '../../data/index.js';
import { renderDecide } from './decide.js';
import * as progress from '../progress.js';

export function renderTransferRun(host) {
  host.replaceChildren(
    h('h1', {}, 'Transfer run'),
    h('p', { class: 'lede' }, 'Twelve scenarios, at least one from every objective, in random order. A right answer lays that brick. Best so far: ', String(progress.transferBest()), ' of 12.'),
    h('div', { class: 'tool-actions' }, h('button', { type: 'button', class: 'cta', onClick: () => start(host) }, 'Draw twelve'))
  );
}

function pick() {
  // One per EO first, then fill to twelve from the rest.
  const chosen = [];
  for (const eo of eos) {
    const pool = shuffle(bricks.filter((b) => b.eo === eo.n));
    chosen.push(pool[0]);
  }
  const rest = shuffle(bricks.filter((b) => !chosen.includes(b)));
  while (chosen.length < 12 && rest.length) chosen.push(rest.pop());
  return shuffle(chosen);
}

function start(host) {
  const set = pick();
  const cards = set.map((b) => ({
    text: `${eos.find((e) => e.n === b.eo).short}: ${b.check.q}`,
    options: b.check.options.map((label, i) => ({ label, ok: i === b.check.answer, why: b.check.why, brick: b.id })),
    brick: b,
  }));
  const summary = h('div');
  host.replaceChildren(
    h('h1', {}, 'Transfer run'),
    renderDecide({ cards }, {
      onAnswer: (card, opt, ok) => { if (ok) progress.layBrick(card.brick.id); },
      onComplete: (score, total) => {
        progress.setTransferBest(score);
        summary.replaceChildren(
          h('p', { class: score === total ? 'tool-done' : 'warn' }, `${score} of ${total}. ${score === total ? 'Clean run.' : 'Every miss links to its brick above.'}`),
          h('div', { class: 'tool-actions' },
            h('button', { type: 'button', class: 'cta', onClick: () => start(host) }, 'Draw twelve more'),
            h('a', { class: 'cta secondary', href: '#/' }, 'Back to the wall'))
        );
      },
    }),
    summary
  );
  window.scrollTo({ top: 0 });
}
