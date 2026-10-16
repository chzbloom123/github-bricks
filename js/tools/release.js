// EO6 tool — pick the bump from the merged PRs, see the release GitHub would draft, route the artifacts.

import { h } from '../dom.js';
import { release as spec } from '../../data/tools.js';
import { renderDecide } from './decide.js';
import * as progress from '../progress.js';

export function mount(host) {
  const feedback = h('p', { class: 'feedback', hidden: true });
  const preview = h('div');
  const targets = h('div');
  const doneEl = h('div');
  let bumpRight = false;

  const bumpBtns = spec.bumps.map((b) => h('button', { type: 'button', class: 'opt', onClick: () => {
    bumpBtns.forEach((x) => { x.disabled = true; });
    const btn = bumpBtns[spec.bumps.indexOf(b)];
    btn.classList.add(b.ok ? 'right' : 'wrong');
    if (!b.ok) bumpBtns[spec.bumps.findIndex((x) => x.ok)].classList.add('right');
    feedback.hidden = false; feedback.className = 'feedback ' + (b.ok ? 'good' : 'bad');
    feedback.textContent = (b.ok ? 'Yes. ' : 'No. ') + b.why;
    bumpRight = b.ok;
    showPreview();
  } }, b.label));

  function showPreview() {
    preview.replaceChildren(
      h('h2', {}, 'What Generate release notes would draft'),
      h('div', { class: 'release-preview' },
        h('h4', {}, 'v2.0.0'),
        h('div', { class: 'tag' }, 'tag v2.0.0 on main · compare v1.4.2...v2.0.0'),
        h('p', { style: { margin: '8px 0 0', fontFamily: 'var(--font-ui)', fontSize: '14.5px' } }, h('strong', {}, 'Breaking changes')),
        h('ul', {}, spec.prs.filter((p) => p.kind === 'breaking').map((p) => h('li', {}, p.title))),
        h('p', { style: { margin: '8px 0 0', fontFamily: 'var(--font-ui)', fontSize: '14.5px' } }, h('strong', {}, 'What’s changed')),
        h('ul', {}, spec.prs.filter((p) => p.kind !== 'breaking').map((p) => h('li', {}, p.title))),
        h('p', { style: { margin: '10px 0 0', fontFamily: 'var(--font-ui)', fontSize: '13.5px', color: 'var(--ink-2)' } }, 'Release notes are generated from merged PR titles and labels. Clear PR titles are future release notes.')
      )
    );
    targets.replaceChildren(
      renderDecide({ title: 'Where does it publish?', intro: spec.targets.intro, cards: spec.targets.cards }, { onComplete: (score, total) => {
        if (bumpRight && score === total) {
          progress.setToolDone(6);
          doneEl.replaceChildren(h('p', { class: 'tool-done' }, 'Tool complete. Right bump, right destinations.'));
        } else {
          doneEl.replaceChildren(h('p', { class: 'warn' }, `${bumpRight ? 'Bump right' : 'Bump wrong'}; destinations ${score} of ${total}. Reopen the tool for a clean run after rereading the linked bricks.`));
        }
      } })
    );
  }

  host.replaceChildren(
    h('h1', {}, spec.title),
    h('p', { class: 'tool-intro' }, spec.intro),
    h('ul', { class: 'pr-list' }, spec.prs.map((p) => h('li', {}, h('span', { class: 'kind ' + p.kind }, p.kind), p.title))),
    h('div', { class: 'check' }, h('p', { class: 'check-q' }, 'Which bump?'), h('div', { class: 'options' }, bumpBtns), feedback),
    preview,
    targets,
    doneEl
  );
}
