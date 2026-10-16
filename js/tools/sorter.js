// EO1 tool — tap an item, tap a bucket. Check sorts the right from the wrong.

import { h, shuffle } from '../dom.js';
import { sorter as spec } from '../../data/tools.js';
import { brickLink } from '../check.js';
import * as progress from '../progress.js';

export function mount(host) {
  const items = shuffle(spec.items).map((it, i) => ({ ...it, key: i, bucket: null }));
  let armed = null; // key of the selected item
  let checked = false;

  const pool = h('div', { class: 'sorter-items', 'aria-label': 'Items to sort' });
  const bucketEls = {};
  const bucketsWrap = h('div', { class: 'buckets' });
  const result = h('div');
  const checkBtn = h('button', { type: 'button', class: 'cta', onClick: check }, 'Check the sort');
  const resetBtn = h('button', { type: 'button', class: 'cta secondary', onClick: () => mount(host) }, 'Start over');

  function draw() {
    pool.replaceChildren(...items.filter((it) => it.bucket === null).map((it) =>
      h('button', { type: 'button', class: 'sort-item', 'aria-pressed': String(armed === it.key), onClick: () => { armed = armed === it.key ? null : it.key; draw(); } }, it.text)
    ));
    for (const b of spec.buckets) {
      const list = bucketEls[b.id].querySelector('ul');
      list.replaceChildren(...items.filter((it) => it.bucket === b.id).map((it) =>
        h('li', { class: checked ? (it.bucket === it.bucketTruth() ? 'right' : 'wrong') : '' },
          it.text,
          !checked ? h('button', { type: 'button', class: 'bbtn', style: { display: 'inline', marginLeft: '8px', marginTop: 0 }, onClick: (e) => { e.stopPropagation(); it.bucket = null; draw(); } }, 'put back') : null
        )
      ));
      bucketEls[b.id].classList.toggle('armed', armed !== null);
      bucketEls[b.id].querySelector('.place').hidden = armed === null || checked;
    }
    checkBtn.disabled = items.some((it) => it.bucket === null) || checked;
  }
  for (const it of items) it.bucketTruth = () => spec.items.find((s) => s.text === it.text).bucket;

  function place(bucketId) {
    if (armed === null || checked) return;
    const it = items.find((x) => x.key === armed);
    it.bucket = bucketId;
    armed = null;
    draw();
  }
  for (const b of spec.buckets) {
    const placeBtn = h('button', { type: 'button', class: 'act place', onClick: (e) => { e.stopPropagation(); place(b.id); } }, 'Place here');
    bucketEls[b.id] = h('div', { class: 'bucket', onClick: (e) => { if (e.target.closest('button')) return; place(b.id); } },
      h('h4', {}, b.label), placeBtn, h('ul', {}));
    bucketsWrap.append(bucketEls[b.id]);
  }

  function check() {
    checked = true;
    const wrong = items.filter((it) => it.bucket !== it.bucketTruth());
    draw();
    const right = items.length - wrong.length;
    result.replaceChildren(
      h('p', { class: 'score' }, `${right} of ${items.length} in the right place.`),
      wrong.length ? h('ul', { class: 'sorter-why' }, wrong.map((it) => {
        const truth = spec.items.find((s) => s.text === it.text);
        const li = h('li', {}, h('strong', {}, it.text), ': ', spec.buckets.find((b) => b.id === truth.bucket).label, '. ', truth.why, ' ');
        const link = brickLink(truth.brick); if (link) li.append('Brick: ', link, '.');
        return li;
      })) : h('p', { class: 'tool-done' }, 'Clean sort. Tool complete.'),
      wrong.length ? resetBtn : null
    );
    if (!wrong.length) progress.setToolDone(1);
  }

  host.replaceChildren(
    h('h1', {}, spec.title),
    h('p', { class: 'tool-intro' }, spec.intro),
    pool,
    bucketsWrap,
    h('div', { class: 'tool-actions' }, checkBtn),
    result
  );
  draw();
}
