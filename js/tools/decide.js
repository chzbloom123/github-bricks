// Generic decide engine: a stack of scenario cards, each with options.
// Options carry ok (acceptable or not), why (feedback) and brick (where to read more).
// Resolves with the score when every card is answered.

import { h } from '../dom.js';
import { brickLink } from '../check.js';

/**
 * @param {{title?:string, intro?:string, cards:Array}} spec
 * @param {{onComplete?:(score:number,total:number)=>void, onAnswer?:(card,option,ok)=>void}} opts
 * @returns {HTMLElement}
 */
export function renderDecide(spec, opts = {}) {
  const { onComplete = () => {}, onAnswer = () => {} } = opts;
  const total = spec.cards.length;
  let answered = 0;
  let score = 0;
  const scoreLine = h('p', { class: 'score' }, `0 of ${total} decided`);

  const cards = spec.cards.map((card) => {
    const feedback = h('p', { class: 'feedback', hidden: true });
    let done = false;
    const opts = card.options.map((o) =>
      h('button', { type: 'button', class: 'opt', onClick: () => {
        if (done) return;
        done = true;
        answered++;
        if (o.ok) score++;
        opts.forEach((btn) => { btn.disabled = true; });
        const idx = card.options.indexOf(o);
        opts[idx].classList.add(o.ok ? 'right' : 'wrong');
        if (!o.ok) {
          // show the first acceptable option
          const bestIdx = card.options.findIndex((x) => x.ok);
          if (bestIdx >= 0) opts[bestIdx].classList.add('right');
        }
        feedback.hidden = false;
        feedback.className = 'feedback ' + (o.ok ? 'good' : 'bad');
        feedback.replaceChildren(o.ok ? 'Yes. ' : 'No. ', o.why);
        const link = brickLink(o.brick);
        if (link) feedback.append(' Brick: ', link, '.');
        scoreLine.textContent = `${score} of ${answered} right, ${total - answered} to go`;
        onAnswer(card, o, o.ok);
        if (answered === total) {
          scoreLine.textContent = `${score} of ${total} right.`;
          onComplete(score, total);
        }
      } }, o.label)
    );
    return h('div', { class: 'card' },
      h('p', { class: 'card-text' }, card.text),
      h('div', { class: 'options' }, opts),
      feedback
    );
  });

  return h('div', {},
    spec.title ? h('h2', { style: { marginTop: '8px' } }, spec.title) : null,
    spec.intro ? h('p', { class: 'tool-intro' }, spec.intro) : null,
    scoreLine,
    h('div', { class: 'cards' }, cards)
  );
}
