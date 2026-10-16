// EO7 tool — agent dispatcher.

import { h } from '../dom.js';
import { dispatch as spec } from '../../data/tools.js';
import { renderDecide } from './decide.js';
import * as progress from '../progress.js';

export function mount(host) {
  const doneEl = h('div');
  host.replaceChildren(
    h('h1', {}, spec.title),
    renderDecide({ intro: spec.intro, cards: spec.cards }, { onComplete: (score, total) => {
      if (score === total) {
        progress.setToolDone(7);
        doneEl.replaceChildren(h('p', { class: 'tool-done' }, 'Tool complete. Seven tasks, each in the right seat, every one landing through a pull request.'));
      } else {
        doneEl.replaceChildren(h('p', { class: 'warn' }, `${score} of ${total}. Reread the linked bricks and reopen the tool for a clean run.`));
      }
    } }),
    doneEl
  );
}
