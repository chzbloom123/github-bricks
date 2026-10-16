// EO5 tool — the security inbox, then the credential picker.

import { h } from '../dom.js';
import { security as spec } from '../../data/tools.js';
import { renderDecide } from './decide.js';
import * as progress from '../progress.js';

export function mount(host) {
  const second = h('div');
  const doneEl = h('div');
  let s1 = 0, s2 = 0;
  const need1 = spec.cards.length, need2 = spec.tokens.cards.length;

  host.replaceChildren(
    h('h1', {}, spec.title),
    renderDecide({ intro: spec.intro, cards: spec.cards }, { onComplete: (score) => {
      s1 = score;
      second.replaceChildren(
        h('h2', {}, 'Which credential?'),
        renderDecide({ intro: spec.tokens.intro, cards: spec.tokens.cards }, { onComplete: (score2) => {
          s2 = score2;
          if (s1 === need1 && s2 === need2) {
            progress.setToolDone(5);
            doneEl.replaceChildren(h('p', { class: 'tool-done' }, 'Tool complete. Every alert handled the way the mechanism intends, and the right key for each job.'));
          } else {
            doneEl.replaceChildren(h('p', { class: 'warn' }, `Inbox ${s1} of ${need1}, credentials ${s2} of ${need2}. Reread the bricks linked in the feedback and reopen the tool for a clean run.`));
          }
        } })
      );
    } }),
    second,
    doneEl
  );
}
