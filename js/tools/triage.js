// EO3 tool — triage desk (decide engine) followed by a small Projects board with automation.

import { h } from '../dom.js';
import { triage as spec } from '../../data/tools.js';
import { renderDecide } from './decide.js';
import * as progress from '../progress.js';

export function mount(host) {
  const boardHost = h('div');
  let triageDone = false, boardDone = false;
  const doneEl = h('div');

  function maybeDone() {
    if (triageDone && boardDone) {
      progress.setToolDone(3);
      doneEl.replaceChildren(h('p', { class: 'tool-done' }, 'Tool complete. Eight containers chosen, and you watched a merged pull request close its issue and move the card on its own.'));
    }
  }

  host.replaceChildren(
    h('h1', {}, spec.title),
    renderDecide({ intro: spec.intro, cards: spec.cards }, { onComplete: () => { triageDone = true; renderBoard(); maybeDone(); } }),
    boardHost,
    doneEl
  );

  function renderBoard() {
    const items = spec.board.items.map((it) => ({ ...it }));
    const note = h('p', { class: 'feedback', hidden: true });
    const cols = spec.board.columns.map((c, ci) => h('div', { class: 'col' }, h('h4', {}, c), h('div', { dataset: { col: String(ci) } })));
    const wrap = h('div', { class: 'board' }, cols);

    function draw() {
      cols.forEach((col, ci) => {
        const body = col.querySelector('[data-col]');
        body.replaceChildren(...items.filter((it) => it.col === ci).map((it) => {
          const card = h('div', { class: 'bcard' }, it.title);
          if (it.col < 2) card.append(h('button', { type: 'button', class: 'bbtn', onClick: () => { it.col++; draw(); } }, it.col === 0 ? 'Move to In progress' : 'Move to Done (by hand)'));
          if (it.pr && it.col < 2) card.append(h('button', { type: 'button', class: 'bbtn', onClick: () => {
            it.col = 2;
            note.hidden = false; note.className = 'feedback good';
            note.replaceChildren('The PR said “Closes #14”. Merging it closed the issue, and the Project automation “item closed → Status: Done” moved the card. Nobody dragged anything.');
            boardDone = true; draw(); maybeDone();
          } }, 'Merge the PR that closes this issue'));
          return card;
        }));
      });
    }
    draw();
    boardHost.replaceChildren(
      h('h2', {}, 'The board'),
      h('p', { class: 'tool-intro' }, spec.board.intro),
      wrap,
      note
    );
  }
}
