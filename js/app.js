// App shell: hash router, page renderers, the two map surfaces, progress wiring.

import { terminalObjective, eos, bricks, brickById, eoByN, neighbors } from '../data/index.js';
import { renderWall, renderNeighborhood, eoColor } from './map.js';
import * as progress from './progress.js';
import { h, clear } from './dom.js';
import { renderCheck } from './check.js';
import { mountTool } from './tools/index.js';
import { renderTransferRun } from './tools/transfer.js';

const content = document.getElementById('content');
const railSvg = document.querySelector('[data-wall="rail"]');
const overlaySvg = document.querySelector('[data-wall="overlay"]');
const overlay = document.getElementById('map-overlay');
const mapToggle = document.querySelector('.map-toggle');

// ---------- Router ----------
function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [a, b] = hash.split('/');
  if (!a) return { page: 'home' };
  if (a === 'eo' && eoByN[Number(b)]) return { page: 'eo', n: Number(b) };
  if (a === 'brick' && brickById[b]) return { page: 'brick', id: b };
  if (a === 'tool' && eoByN[Number(b)]) return { page: 'tool', n: Number(b) };
  if (a === 'transfer') return { page: 'transfer' };
  return { page: 'home' };
}

export function go(hash) { location.hash = hash; }

let currentBrick = null;

function render() {
  const route = parseRoute();
  currentBrick = route.page === 'brick' ? route.id : null;
  clear(content);
  content.style.removeProperty('--eo-color');
  switch (route.page) {
    case 'home': renderHome(); break;
    case 'eo': renderEo(route.n); break;
    case 'brick': renderBrick(route.id); break;
    case 'tool': renderToolPage(route.n); break;
    case 'transfer': renderTransferRun(content); break;
  }
  updateNav(route);
  drawMaps();
  closeOverlay();
  window.scrollTo({ top: 0 });
  content.focus({ preventScroll: true });
}

function updateNav(route) {
  const key = route.page === 'home' ? 'home'
    : route.page === 'transfer' ? 'transfer'
    : route.page === 'brick' ? `eo-${brickById[route.id].eo}`
    : `eo-${route.n}`;
  document.querySelectorAll('.site-nav a').forEach((a) => {
    if (a.dataset.nav === key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ---------- Maps ----------
function drawMaps() {
  const laid = progress.laidSet();
  renderWall(railSvg, { current: currentBrick, laid, compact: true, onSelect: (id) => go(`#/brick/${id}`) });
  renderWall(overlaySvg, { current: currentBrick, laid, compact: false, onSelect: (id) => go(`#/brick/${id}`) });
  const txt = `${laid.size} of ${bricks.length} laid`;
  document.querySelectorAll('[data-progress]').forEach((n) => (n.textContent = txt));
}
progress.onChange(() => { drawMaps(); });

function openOverlay() { overlay.hidden = false; mapToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
function closeOverlay() { overlay.hidden = true; mapToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
mapToggle.addEventListener('click', () => (overlay.hidden ? openOverlay() : closeOverlay()));
overlay.querySelector('.overlay-close').addEventListener('click', closeOverlay);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeOverlay(); });

document.querySelector('[data-reset]').addEventListener('click', () => {
  if (confirm('Clear every laid brick and tool result on this device?')) { progress.reset(); render(); }
});

// ---------- Pages ----------
function eoLink(eo, laid) {
  const done = eo.bricks.filter((id) => laid.has(id)).length;
  return h('li', {},
    h('a', { href: `#/eo/${eo.n}`, style: { '--eo-color': eoColor(eo.n) } },
      h('span', { class: 'swatch', 'aria-hidden': 'true' }),
      h('span', { class: 'eo-name' }, `${eo.n}. ${eo.title}`),
      h('span', { class: 'eo-count' }, `${done} of ${eo.bricks.length}${progress.toolDone(eo.n) ? ', tool done' : ''}`)
    )
  );
}

function renderHome() {
  const laid = progress.laidSet();
  content.append(
    h('h1', {}, 'GitHub, brick by brick'),
    h('p', { class: 'home-to' }, h('strong', {}, 'Terminal objective. '), terminalObjective),
    h('p', { class: 'lede' },
      'Seven enabling objectives, ', String(bricks.length), ' bricks. Each brick is one unit of understanding; its label is the handle you retrieve it by. The wall shows every brick and the threads between them. Pass a brick’s check and it is laid.'),
    h('div', { class: 'neigh wall-scroll', style: { maxWidth: 'none' } },
      h('p', { class: 'neigh-title' }, 'The wall. Tap a brick to open it.'),
      (() => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.classList.add('wall-svg'); s.dataset.wall = 'home'; return s; })()
    ),
    h('h2', {}, 'Enabling objectives'),
    h('ul', { class: 'eo-list' }, eos.map((eo) => eoLink(eo, laid))),
    h('h2', {}, 'Transfer run'),
    h('p', {}, 'Twelve mixed scenarios drawn from every objective. Best so far: ', String(progress.transferBest()), ' of 12.'),
    h('a', { class: 'cta', href: '#/transfer' }, 'Start a transfer run')
  );
  const homeSvg = content.querySelector('[data-wall="home"]');
  renderWall(homeSvg, { laid, compact: false, onSelect: (id) => go(`#/brick/${id}`) });
}

function renderEo(n) {
  const eo = eoByN[n];
  const laid = progress.laidSet();
  content.style.setProperty('--eo-color', eoColor(n));
  content.append(
    h('a', { class: 'eyebrow-eo', href: '#/' }, h('span', { class: 'swatch' }), `Enabling objective ${n} of ${eos.length}`),
    h('h1', {}, eo.title),
    h('p', { class: 'lede' }, eo.objective),
    h('h2', {}, 'Bricks'),
    h('ul', { class: 'brick-list' }, eo.bricks.map((id) => {
      const b = brickById[id];
      return h('li', { class: laid.has(id) ? 'laid' : '' },
        h('a', { href: `#/brick/${id}` }, h('span', { class: 'laid-mark', 'aria-hidden': 'true' }), b.label));
    })),
    h('h2', {}, 'Apply it'),
    h('p', {}, toolBlurb(n)),
    h('a', { class: 'cta', href: `#/tool/${n}` }, progress.toolDone(n) ? 'Open the tool again' : 'Open the tool')
  );
}

function toolBlurb(n) {
  return {
    1: 'Sort a new repo’s files and settings into commit, never commit, or set it in the panel.',
    2: 'Run a change through the gate: toggle rules, try pushes, see what gets blocked and what the history looks like after each merge strategy.',
    3: 'Triage eight things that arrived overnight into the right containers, then watch the project board move.',
    4: 'Assemble a workflow from blocks, read the YAML it makes, and fire events at it to see when it runs.',
    5: 'Work a security inbox: six alerts, then pick the right credential for three jobs.',
    6: 'Cut a release: choose the version bump from the merged PRs, then route each artifact to where it publishes.',
    7: 'Dispatch seven tasks to the right worker: Copilot agent, Copilot review, Copilot chat, or Claude Code on your machine.',
  }[n];
}

function renderBrick(id) {
  const b = brickById[id];
  const eo = eoByN[b.eo];
  const idx = eo.bricks.indexOf(id);
  const laid = progress.laidSet();
  content.style.setProperty('--eo-color', eoColor(b.eo));

  const neighSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const ring = neighbors(id).map((n) => brickById[n]);

  content.append(
    h('div', { class: 'brick-head' },
      h('a', { class: 'eyebrow-eo', href: `#/eo/${eo.n}` }, h('span', { class: 'swatch' }), `${eo.n}. ${eo.title}`),
      h('h1', {}, b.label),
      h('div', { class: 'brick-pos' }, `Brick ${idx + 1} of ${eo.bricks.length}`, laid.has(id) ? ' · laid' : '')
    ),
    h('dl', { class: 'parts' },
      h('dt', {}, 'What it is'), h('dd', {}, b.what),
      h('dt', {}, 'Why it exists'), h('dd', {}, b.why),
      h('dt', {}, 'Where it lives'), h('dd', {}, b.where),
      h('dt', {}, 'When you reach for it'), h('dd', {}, b.when)
    ),
    b.note ? h('aside', { class: 'note' }, h('p', {}, b.note)) : null,
    h('div', { class: 'neigh' }, h('p', { class: 'neigh-title' }, `Neighbourhood: ${ring.length} linked brick${ring.length === 1 ? '' : 's'}. Tap one to go there.`), neighSvg),
    renderCheck(b, { onPass: () => { progress.layBrick(id); content.querySelector('.brick-pos').textContent = `Brick ${idx + 1} of ${eo.bricks.length} · laid`; } }),
    h('nav', { class: 'pager', 'aria-label': 'Previous and next brick' },
      idx > 0 ? h('a', { href: `#/brick/${eo.bricks[idx - 1]}` }, '← ', brickById[eo.bricks[idx - 1]].label) : h('a', { href: `#/eo/${eo.n}` }, '← ', eo.title),
      idx < eo.bricks.length - 1 ? h('a', { href: `#/brick/${eo.bricks[idx + 1]}` }, brickById[eo.bricks[idx + 1]].label, ' →') : h('a', { href: `#/tool/${eo.n}` }, 'Apply it: open the tool →')
    )
  );
  const narrow = window.matchMedia('(max-width: 599px)').matches;
  renderNeighborhood(neighSvg, id, { laid, narrow, onSelect: (nid) => go(`#/brick/${nid}`) });
}

function renderToolPage(n) {
  const eo = eoByN[n];
  content.style.setProperty('--eo-color', eoColor(n));
  content.append(
    h('a', { class: 'eyebrow-eo', href: `#/eo/${n}` }, h('span', { class: 'swatch' }), `${n}. ${eo.title} · apply it`)
  );
  const host = h('div', { class: 'tool' });
  content.append(host);
  mountTool(n, host);
}

window.addEventListener('hashchange', render);
render();
