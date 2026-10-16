// One scenario check per brick. Pass it and the brick is laid.

import { h } from './dom.js';
import { brickById } from '../data/index.js';

/**
 * @param {object} brick
 * @param {{onPass:()=>void, heading?:string}} opts
 */
export function renderCheck(brick, opts = {}) {
  const { onPass = () => {}, heading = 'Check' } = opts;
  const c = brick.check;
  const box = h('section', { class: 'check', 'aria-label': `${heading}: ${brick.label}` });
  const feedback = h('p', { class: 'feedback', hidden: true });
  const buttons = c.options.map((text, i) =>
    h('button', { type: 'button', class: 'opt', onClick: () => choose(i) }, text)
  );
  function choose(i) {
    const right = i === c.answer;
    buttons.forEach((btn, j) => {
      btn.disabled = true;
      if (j === c.answer) btn.classList.add('right');
      else if (j === i) btn.classList.add('wrong');
    });
    feedback.hidden = false;
    feedback.className = 'feedback ' + (right ? 'good' : 'bad');
    feedback.replaceChildren(right ? 'Right. ' : 'Not that one. ', c.why);
    if (right) onPass();
    else {
      const retry = h('button', { type: 'button', class: 'act', style: { marginLeft: '10px' }, onClick: () => {
        buttons.forEach((btn) => { btn.disabled = false; btn.classList.remove('right', 'wrong'); });
        feedback.hidden = true;
      } }, 'Try again');
      feedback.append(' ', retry);
    }
  }
  box.append(
    h('h3', { class: 'check-q', style: { marginTop: 0 } }, heading, ': ', c.q),
    h('div', { class: 'options' }, buttons),
    feedback
  );
  return box;
}

/** A link to a brick, for use inside feedback text. */
export function brickLink(id) {
  const b = brickById[id];
  if (!b) return null;
  return h('a', { href: `#/brick/${id}` }, b.label);
}
