// EO2 tool — the pull request gate as a working model.
// Toggle rules, try the moves a person makes, watch what gets blocked and what history looks like after.

import { h } from '../dom.js';
import * as progress from '../progress.js';

const NS = 'http://www.w3.org/2000/svg';
function s(name, attrs = {}, children = []) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of children) n.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return n;
}

export function mount(host) {
  const st = {
    rules: { requirePR: true, requireApproval: false, requireChecks: true, blockForcePush: true },
    stage: 'main', // main | branch | pr | merged
    mainExtra: 0, // commits pushed straight to main
    branchCommits: 0,
    approved: false,
    checks: 'none', // none | pending | pass | fail
    strategy: 'squash',
    mergedAs: null,
    learned: { blockedPush: false, blockedMerge: false, merged: false, forceBlocked: false, allowedPush: false },
    log: [],
  };

  const graphSvg = s("svg", { viewBox: "0 0 640 170" });
  const logEl = h('ul', { class: 'log', 'aria-live': 'polite' });
  const mergeBox = h('ul', { class: 'mergebox' });
  const stageLine = h('p', { class: 'score' });
  const doneEl = h('div');
  const strategySel = h('select', { class: 'ui', onChange: (e) => { st.strategy = e.target.value; } },
    h('option', { value: 'squash' }, 'Squash and merge'),
    h('option', { value: 'merge' }, 'Create a merge commit'),
    h('option', { value: 'rebase' }, 'Rebase and merge'));

  function log(text, kind = 'info') { st.log.unshift({ text, kind }); draw(); }

  // ----- rules -----
  const toggles = h('div', { class: 'toggles' },
    toggle('requirePR', 'Require a pull request before merging into main'),
    toggle('requireApproval', 'Require one approving review'),
    toggle('requireChecks', 'Require checks to pass'),
    toggle('blockForcePush', 'Block force pushes'));
  function toggle(key, label) {
    return h('label', { class: 'toggle' },
      h('input', { type: 'checkbox', checked: st.rules[key] ? true : null, onChange: (e) => { st.rules[key] = e.target.checked; log(`Ruleset updated: ${label} is ${e.target.checked ? 'on' : 'off'}.`, 'info'); } }),
      label);
  }

  // ----- actions -----
  const btn = (label, fn, cls = '') => h('button', { type: 'button', class: 'act ' + cls, onClick: fn }, label);
  const actions = {
    pushMain: btn('Push a commit straight to main', () => {
      if (st.rules.requirePR) { st.learned.blockedPush = true; log('Blocked. Ruleset on main: changes must be made through a pull request. Your push was rejected before it landed.', 'blocked'); }
      else { st.mainExtra++; st.learned.allowedPush = true; log('Allowed. The commit is on main with no review and no check. Production deploys from it now. This is how half-finished work goes live.', 'blocked'); }
    }),
    forcePush: btn('Force-push to main (rewrite history)', () => {
      if (st.rules.blockForcePush) { st.learned.forceBlocked = true; log('Blocked. Force pushes to main are not allowed. History stays intact.', 'blocked'); }
      else { log('Allowed. Main’s history was rewritten. Anyone who pulled main before this now has a conflict, and the deploy history no longer matches.', 'blocked'); }
    }),
    branch: btn('Create branch fix-map', () => { st.stage = 'branch'; log('Branch fix-map created from main. Main is untouched: the change is isolated.', 'okay'); }),
    commit: btn('Commit to fix-map', () => { st.branchCommits++; log(`Commit ${st.branchCommits} on fix-map. Still nowhere near main.`, 'okay'); }),
    openPR: btn('Open a pull request', () => { st.stage = 'pr'; st.checks = 'pending'; log('Pull request opened: fix-map into main. Vercel started a preview build; the validate workflow is running. Both will report as checks.', 'okay'); }),
    checksPass: btn('Checks finish: pass', () => { st.checks = 'pass'; log('Checks passed: validate-bricks and the preview build are green.', 'okay'); }),
    checksFail: btn('Checks finish: fail', () => { st.checks = 'fail'; log('A check failed: validate-bricks found a link to a brick that does not exist. Read the log, push a fix to fix-map; the check re-runs on its own.', 'blocked'); }),
    fixPush: btn('Push a fix to fix-map', () => { st.branchCommits++; st.checks = 'pending'; log('Fix pushed to fix-map. Checks re-running.', 'okay'); }),
    approve: btn('Reviewer approves', () => { st.approved = true; log('Review: approved.', 'okay'); }),
    merge: btn('Merge pull request', () => {
      const r = requirements();
      const blocked = r.filter((x) => x.required && x.status !== 'ok');
      if (blocked.length) { st.learned.blockedMerge = true; log(`Merge blocked: ${blocked.map((x) => x.label.toLowerCase()).join('; ')}.`, 'blocked'); return; }
      st.stage = 'merged'; st.mergedAs = st.strategy; st.learned.merged = true;
      const how = { squash: 'one squashed commit on main', merge: 'the branch commits plus a merge commit', rebase: 'the branch commits replayed linearly on main' }[st.strategy];
      log(`Merged as ${how}. Branch fix-map deleted automatically. Production deploys from the new main.`, 'okay');
      if (st.checks === 'fail') log('Note: you merged with a failing check because the rule did not require it. The ruleset is the only thing that makes the gate mandatory.', 'blocked');
    }, 'primary'),
    again: btn('Start another change', () => { st.stage = 'main'; st.branchCommits = 0; st.approved = false; st.checks = 'none'; st.mergedAs = null; log('Back on main. Try a different rule mix or strategy.', 'info'); }),
  };

  function requirements() {
    const inPR = st.stage === 'pr';
    return [
      { label: 'Change comes through a pull request', required: st.rules.requirePR, status: inPR ? 'ok' : 'no' },
      { label: '1 approving review', required: st.rules.requireApproval, status: st.approved ? 'ok' : 'no' },
      { label: 'Required checks pass', required: st.rules.requireChecks, status: st.checks === 'pass' ? 'ok' : st.checks === 'pending' ? 'pending' : 'no' },
    ];
  }

  function draw() {
    // stage line
    stageLine.textContent = { main: 'On main. Nothing in flight.', branch: `On branch fix-map with ${st.branchCommits} commit${st.branchCommits === 1 ? '' : 's'}.`, pr: `Pull request open. Checks: ${st.checks}. Review: ${st.approved ? 'approved' : 'none'}.`, merged: `Merged (${st.mergedAs}).` }[st.stage];

    // which actions show
    const show = {
      pushMain: true, forcePush: true,
      branch: st.stage === 'main',
      commit: st.stage === 'branch' && st.branchCommits < 3,
      openPR: st.stage === 'branch' && st.branchCommits > 0,
      checksPass: st.stage === 'pr' && st.checks === 'pending',
      checksFail: st.stage === 'pr' && st.checks === 'pending',
      fixPush: st.stage === 'pr' && st.checks === 'fail',
      approve: st.stage === 'pr' && !st.approved,
      merge: st.stage === 'pr',
      again: st.stage === 'merged',
    };
    for (const [k, b] of Object.entries(actions)) b.hidden = !show[k];

    // merge box
    mergeBox.replaceChildren(...requirements().map((r) => {
      const cls = r.status === 'ok' ? 'ok' : r.status === 'pending' ? 'na' : r.required ? 'no' : 'na';
      const mark = r.status === 'ok' ? '✓' : r.status === 'pending' ? '•' : r.required ? '✕' : '–';
      return h('li', {}, h('span', { class: 'st ' + cls }, mark), r.label, r.required ? '' : ' (not required by ruleset)');
    }));

    // log
    logEl.replaceChildren(...st.log.slice(0, 12).map((l) => h('li', { class: l.kind }, l.text)));

    drawGraph();

    const L = st.learned;
    const complete = L.blockedPush && L.merged && (L.blockedMerge || L.forceBlocked);
    if (complete) {
      progress.setToolDone(2);
      doneEl.replaceChildren(h('p', { class: 'tool-done' }, 'Tool complete. You saw a direct push rejected, a merge or force-push blocked by a rule, and a change land through the gate. That is the whole mechanism.'));
    }
  }

  function drawGraph() {
    graphSvg.replaceChildren();
    const mainY = 120, brY = 56, x0 = 40, dx = 64;
    const mainColor = 'var(--eo1)', brColor = 'var(--eo2)';
    const baseline = 3;
    const mainCount = baseline + st.mainExtra;
    const commitsOnMainAfter = st.stage === 'merged' ? (st.mergedAs === 'squash' ? 1 : st.branchCommits + (st.mergedAs === 'merge' ? 1 : 0)) : 0;
    const totalMain = mainCount + commitsOnMainAfter;
    const endX = x0 + (totalMain - 1) * dx;
    graphSvg.append(s('line', { x1: x0, y1: mainY, x2: Math.max(endX, x0 + dx * 4), y2: mainY, class: 'g-line', stroke: mainColor }));
    graphSvg.append(s('text', { x: x0, y: mainY + 30, class: 'g-label' }, ['main']));

    const circle = (x, y, color, label) => {
      graphSvg.append(s('circle', { cx: x, cy: y, r: 8, fill: color, class: 'g-commit' }));
      if (label) graphSvg.append(s('text', { x, y: y - 14, 'text-anchor': 'middle', class: 'g-label' }, [label]));
    };
    for (let i = 0; i < mainCount; i++) circle(x0 + i * dx, mainY, mainColor, i >= baseline ? 'direct' : '');

    const forkX = x0 + (mainCount - 1) * dx;
    if (st.stage === 'branch' || st.stage === 'pr') {
      const n = st.branchCommits;
      if (n > 0) {
        graphSvg.append(s('path', { d: `M ${forkX} ${mainY} C ${forkX + 20} ${mainY}, ${forkX + 20} ${brY}, ${forkX + dx} ${brY} L ${forkX + dx * n} ${brY}`, class: 'g-line', stroke: brColor }));
        for (let i = 1; i <= n; i++) circle(forkX + dx * i, brY, brColor, '');
      } else {
        graphSvg.append(s('path', { d: `M ${forkX} ${mainY} C ${forkX + 20} ${mainY}, ${forkX + 20} ${brY}, ${forkX + 40} ${brY}`, class: 'g-line', stroke: brColor, 'stroke-dasharray': '4 4' }));
      }
      graphSvg.append(s('text', { x: forkX + 8, y: brY - 24, class: 'g-label' }, ['fix-map' + (st.stage === 'pr' ? ' (pull request open)' : '')]));
    }
    if (st.stage === 'merged') {
      const n = st.branchCommits;
      if (st.mergedAs === 'squash') {
        circle(forkX + dx, mainY, brColor, 'fix-map (squashed)');
        graphSvg.append(s('path', { d: `M ${forkX} ${mainY} C ${forkX + 20} ${mainY}, ${forkX + 20} ${brY}, ${forkX + dx} ${brY} L ${forkX + dx * n} ${brY}`, class: 'g-line', stroke: brColor, 'stroke-opacity': '0.25' }));
        for (let i = 1; i <= n; i++) graphSvg.append(s('circle', { cx: forkX + dx * i, cy: brY, r: 6, fill: brColor, 'fill-opacity': '0.25' }));
        graphSvg.append(s('text', { x: forkX + 8, y: brY - 24, class: 'g-label' }, ['branch deleted; detail kept on the PR page']));
      } else if (st.mergedAs === 'rebase') {
        for (let i = 1; i <= n; i++) circle(forkX + dx * i, mainY, brColor, i === 1 ? 'replayed' : '');
      } else {
        graphSvg.append(s('path', { d: `M ${forkX} ${mainY} C ${forkX + 20} ${mainY}, ${forkX + 20} ${brY}, ${forkX + dx} ${brY} L ${forkX + dx * n} ${brY} C ${forkX + dx * n + 40} ${brY}, ${forkX + dx * n + 40} ${mainY}, ${forkX + dx * (n + 1)} ${mainY}`, class: 'g-line', stroke: brColor }));
        for (let i = 1; i <= n; i++) circle(forkX + dx * i, brY, brColor, '');
        circle(forkX + dx * (n + 1), mainY, mainColor, 'merge commit');
      }
    }
  }

  host.replaceChildren(
    h('h1', {}, 'The pull request gate'),
    h('p', { class: 'tool-intro' }, 'A working model of one change going from a branch to main. Set the rules, then try the moves. Blocked moves tell you why.'),
    h('div', { class: 'prgate' },
      h('div', { class: 'panel' }, h('h3', {}, 'Ruleset on main'), toggles),
      h('div', { class: 'panel' },
        h('h3', {}, 'Moves'),
        stageLine,
        h('div', { class: 'actions' }, actions.branch, actions.commit, actions.openPR, actions.checksPass, actions.checksFail, actions.fixPush, actions.approve, actions.again),
        h('div', { class: 'actions', style: { marginTop: '10px' } }, h('span', { class: 'ui', style: { fontSize: '14px', alignSelf: 'center', color: 'var(--ink-2)' } }, 'Shortcuts people take:'), actions.pushMain, actions.forcePush)),
      h('div', { class: 'panel graph' }, h('h3', {}, 'History'), graphSvg),
      h('div', { class: 'panel' },
        h('h3', {}, 'Merge box'),
        mergeBox,
        h('div', { class: 'actions' }, strategySel, actions.merge),
        logEl),
      doneEl)
  );
  draw();
}
