// The relationship map, drawn two ways:
//   renderWall   — every brick as a brick in a wall, one course (row) per objective,
//                  edges between linked bricks, laid bricks filled solid.
//   renderNeighborhood — one brick in the centre, its linked bricks around it.
// Both are plain SVG built with DOM calls so the app has no dependencies.

import { eos, bricks, brickById, edges, neighbors } from '../data/index.js';

const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs = {}, children = []) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of children) n.append(c);
  return n;
}
export function eoColor(n) {
  return `var(--eo${n})`;
}

// ---------- Wall geometry ----------
const W = 1000;
const ROW_H = 92;
const BRICK_H = 46;
const GAP = 10;
const PAD_X = 16;
const TOP = 18;

function wallLayout() {
  const pos = {};
  const rows = eos.map((eo, i) => {
    const y = TOP + i * ROW_H + 24;
    const n = eo.bricks.length;
    const indent = i % 2 === 0 ? 0 : 22;
    const width = (W - PAD_X * 2 - indent - GAP * (n - 1)) / n;
    eo.bricks.forEach((id, j) => {
      const x = PAD_X + indent + j * (width + GAP);
      pos[id] = { x, y, w: width, h: BRICK_H, cx: x + width / 2, cy: y + BRICK_H / 2, eo: eo.n };
    });
    return { eo, y, indent };
  });
  return { pos, rows, height: TOP + eos.length * ROW_H + 8 };
}

function edgePath(a, b) {
  // Gentle curve between two brick centres, bowing to the side so it reads as a thread.
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const bow = Math.sign(dx || 1) * Math.min(60, Math.abs(dy) * 0.35);
  const mx = (a.cx + b.cx) / 2 + bow;
  const my = (a.cy + b.cy) / 2;
  return `M ${a.cx} ${a.cy} Q ${mx} ${my} ${b.cx} ${b.cy}`;
}

/**
 * @param {SVGSVGElement} svg
 * @param {{current?:string, laid:Set<string>, compact?:boolean, onSelect:(id:string)=>void}} opts
 */
export function renderWall(svg, opts) {
  const { current = null, laid, compact = false, onSelect } = opts;
  const { pos, rows, height } = wallLayout();
  svg.setAttribute('viewBox', `0 0 ${W} ${height}`);
  svg.replaceChildren();

  const lit = new Set(current ? neighbors(current) : []);

  // Edges first so bricks sit on top.
  const gEdges = el('g');
  for (const [a, b] of edges) {
    const pa = pos[a], pb = pos[b];
    if (!pa || !pb) continue;
    const isLit = current && (a === current || b === current);
    const path = el('path', { d: edgePath(pa, pb), class: 'wall-edge' + (isLit ? ' lit' : '') });
    gEdges.append(path);
  }
  svg.append(gEdges);

  // Row labels.
  if (!compact) {
    for (const r of rows) {
      svg.append(
        el('text', { x: PAD_X + r.indent, y: r.y - 8, class: 'wall-row-label' }, [
          `${r.eo.n}. ${r.eo.title}`,
        ])
      );
    }
  }

  // Bricks.
  const gBricks = el('g');
  for (const b of bricks) {
    const p = pos[b.id];
    const isLaid = laid.has(b.id);
    const cls = ['wall-brick'];
    if (isLaid) cls.push('laid');
    if (b.id === current) cls.push('current');
    else if (lit.has(b.id)) cls.push('lit');
    else if (current && !compact) cls.push('dim');
    const g = el('g', { class: cls.join(' '), tabindex: compact ? '-1' : '0', role: 'link', 'aria-label': b.label });
    const rect = el('rect', {
      x: p.x, y: p.y, width: p.w, height: p.h, rx: 4,
      fill: isLaid ? eoColor(b.eo) : `color-mix(in srgb, ${eoColor(b.eo)} 14%, var(--surface))`,
      stroke: eoColor(b.eo),
    });
    g.append(rect);
    if (b.id === current) {
      g.append(el('rect', { x: p.x - 4, y: p.y - 4, width: p.w + 8, height: p.h + 8, rx: 7, class: 'wall-ring' }));
    }
    if (!compact) {
      const lines = wrapLabel(b.label, p.w);
      const t = el('text', { x: p.cx, y: p.cy + (lines.length === 1 ? 4 : -3), 'text-anchor': 'middle' });
      lines.forEach((line, i) => {
        t.append(el('tspan', { x: p.cx, dy: i === 0 ? 0 : 13 }, [line]));
      });
      g.append(t);
    }
    g.append(el('title', {}, [`${b.label} (${rows.find((r) => r.eo.n === b.eo).eo.title})`]));
    g.addEventListener('click', () => onSelect(b.id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(b.id); } });
    gBricks.append(g);
  }
  svg.append(gBricks);
}

function wrapLabel(label, width) {
  // ~6.1px per character at 11.5px Bricolage. One line if it fits, otherwise the best two-line split.
  const max = Math.floor((width - 10) / 6.1);
  if (label.length <= max) return [label];
  const words = label.split(' ');
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    if (a.length <= max && b.length <= max) {
      const diff = Math.abs(a.length - b.length);
      if (!best || diff < best.diff) best = { a, b, diff };
    }
  }
  if (best) return [best.a, best.b];
  // Nothing fits in two lines: hard-trim the second line.
  const a = words[0].slice(0, max);
  const rest = label.slice(a.length).trim();
  return [a, rest.length > max ? rest.slice(0, max - 1) + '…' : rest];
}

// ---------- Neighborhood ----------
/**
 * @param {SVGSVGElement} svg
 * @param {string} id
 * @param {{laid:Set<string>, onSelect:(id:string)=>void}} opts
 */
export function renderNeighborhood(svg, id, opts) {
  const { laid, onSelect, narrow = false } = opts;
  const centre = brickById[id];
  // Neighbours grouped by objective so the colours cluster; same objective first.
  const ring = neighbors(id).map((n) => brickById[n]).filter(Boolean)
    .sort((a, b) => (a.eo === centre.eo ? -1 : b.eo === centre.eo ? 1 : a.eo - b.eo));
  // Wide: two combed columns either side of the centre. Narrow (phones): one column to the right.
  const right = narrow ? ring : ring.filter((_, i) => i % 2 === 0);
  const left = narrow ? [] : ring.filter((_, i) => i % 2 === 1);
  const ROW = 30;
  const rows = Math.max(right.length, left.length, 2);
  const NW = narrow ? 360 : 640;
  const NH = rows * ROW + 40;
  const cx = narrow ? 44 : NW / 2, cy = NH / 2;
  const xL = 236, xR = narrow ? 128 : 404;
  svg.setAttribute('viewBox', `0 0 ${NW} ${NH}`);
  svg.replaceChildren();

  const column = (list, x, anchor) => list.map((b, i) => {
    const y = cy + (i - (list.length - 1) / 2) * ROW;
    return { b, x, y, anchor };
  });
  const nodes = [...column(right, xR, 'start'), ...column(left, xL, 'end')];

  for (const n of nodes) {
    const bend = n.anchor === 'start' ? 40 : -40;
    svg.append(el('path', { d: `M ${cx} ${cy} C ${cx + bend} ${cy}, ${n.x - bend} ${n.y}, ${n.x} ${n.y}`, class: 'n-edge', fill: 'none' }));
  }

  for (const n of nodes) {
    const g = el('g', { class: 'n-node', tabindex: '0', role: 'link', 'aria-label': n.b.label });
    const isLaid = laid.has(n.b.id);
    const dir = n.anchor === 'start' ? 1 : -1;
    // generous invisible hit area for thumbs
    g.append(el('rect', { x: n.anchor === 'start' ? n.x - 12 : n.x - 236 + 12, y: n.y - ROW / 2, width: 236, height: ROW, fill: 'transparent' }));
    g.append(el('circle', { cx: n.x, cy: n.y, r: 8, fill: isLaid ? eoColor(n.b.eo) : 'var(--surface)', stroke: eoColor(n.b.eo) }));
    g.append(el('text', { x: n.x + dir * 14, y: n.y + 4, 'text-anchor': n.anchor }, [n.b.label]));
    g.append(el('text', { x: n.x + dir * 14, y: n.y + 16, 'text-anchor': n.anchor, class: 'n-eo' }, [eos.find((e) => e.n === n.b.eo).short]));
    g.append(el('title', {}, [n.b.label]));
    g.addEventListener('click', () => onSelect(n.b.id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(n.b.id); } });
    svg.append(g);
  }

  const gc = el('g', { class: 'n-node n-center' });
  gc.append(el('circle', { cx, cy, r: 14, fill: eoColor(centre.eo) }));
  gc.append(el('title', {}, [centre.label]));
  if (narrow) { svg.append(gc); return; }
  const words = centre.label.split(' ');
  const lines = centre.label.length > 16 && words.length > 1
    ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')]
    : [centre.label];
  const t = el('text', { x: cx, y: cy + 32, 'text-anchor': 'middle' });
  lines.forEach((line, i) => t.append(el('tspan', { x: cx, dy: i === 0 ? 0 : 15 }, [line])));
  gc.append(t);
  svg.append(gc);
}
