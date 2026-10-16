// EO4 tool — assemble a workflow from blocks, read the YAML, fire events at it.

import { h } from '../dom.js';
import { workflow as spec } from '../../data/tools.js';
import * as progress from '../progress.js';

export function mount(host) {
  const chosen = { triggers: new Set(['pull_request']), steps: new Set(['checkout']) };
  const fired = new Set();
  const yamlEl = h('pre', {});
  const warnEl = h('div');
  const firedEl = h('div');
  const doneEl = h('div');

  function box(group, item) {
    return h('label', { class: 'toggle' },
      h('input', { type: 'checkbox', checked: chosen[group].has(item.id) ? true : null, onChange: (e) => { e.target.checked ? chosen[group].add(item.id) : chosen[group].delete(item.id); draw(); } }),
      item.label);
  }

  function yaml() {
    const trig = spec.triggers.filter((t) => chosen.triggers.has(t.id));
    const steps = spec.steps.filter((st) => chosen.steps.has(st.id));
    return [
      'name: validate-bricks',
      'on:' + (trig.length ? '' : ' {}   # no triggers: this never runs'),
      ...trig.map((t) => t.yaml),
      'jobs:',
      '  check:',
      '    runs-on: ubuntu-latest',
      '    steps:' + (steps.length ? '' : ' []'),
      ...steps.map((st) => st.yaml),
    ].join('\n');
  }

  function warnings() {
    const out = [];
    if (!chosen.triggers.size) out.push('No trigger: the file is valid YAML and will never run.');
    for (const st of spec.steps) {
      if (chosen.steps.has(st.id) && st.need && !chosen.steps.has(st.need)) out.push(`“${st.label}” will fail with “no such file”: the runner starts empty, and nothing checked the code out first.`);
    }
    if (chosen.steps.has('echo')) out.push('Printing a secret: GitHub masks the value in logs, but a step that echoes a secret is one typo away from leaking it. Remove it.');
    if (chosen.steps.has('deploy') && !chosen.triggers.has('push')) out.push('A deploy step with no push-to-main trigger deploys from previews or by hand only. Usually you want push to main for a deploy.');
    if (chosen.steps.has('deploy') && chosen.triggers.has('pull_request')) out.push('Deploying on pull_request means every PR, including a stranger’s on a public repo, could trigger a deploy. Gate deploys behind push to main or an environment with approval.');
    return out;
  }

  function fires(ev) {
    switch (ev) {
      case 'push': return chosen.triggers.has('push') ? [true, 'push trigger, branches: [main] matches.'] : [false, 'no push trigger.'];
      case 'push-branch': return [false, chosen.triggers.has('push') ? 'the push trigger is filtered to branches: [main]; a feature branch does not match. Open a PR and the pull_request trigger covers it.' : 'no push trigger, and no PR yet so pull_request does not apply.'];
      case 'pull_request': return chosen.triggers.has('pull_request') ? [true, 'pull_request trigger; runs on the merged state of the PR and reports as a check.'] : [false, 'no pull_request trigger. The PR shows no check.'];
      case 'schedule': return chosen.triggers.has('schedule') ? [true, "schedule trigger: cron '0 3 * * *' means 03:00 UTC daily."] : [false, 'no schedule trigger.'];
      case 'workflow_dispatch': return chosen.triggers.has('workflow_dispatch') ? [true, 'workflow_dispatch: the Run workflow button exists because of this line.'] : [false, 'without workflow_dispatch there is no Run workflow button to click.'];
      case 'release': return chosen.triggers.has('release') ? [true, 'release trigger, types: [published].'] : [false, 'no release trigger.'];
    }
    return [false, ''];
  }

  function valid() {
    return chosen.steps.has('checkout') && chosen.steps.has('validate') && !chosen.steps.has('echo') && chosen.triggers.has('pull_request');
  }

  function draw() {
    yamlEl.textContent = yaml();
    warnEl.replaceChildren(...warnings().map((w) => h('p', { class: 'warn' }, w)));
    if (fired.size >= 5 && valid()) {
      progress.setToolDone(4);
      doneEl.replaceChildren(h('p', { class: 'tool-done' }, 'Tool complete. You built a workflow that checks out the code, runs the validator on every pull request, keeps secrets out of the log, and you can predict which events start it.'));
    }
  }

  host.replaceChildren(
    h('h1', {}, 'Workflow assembler'),
    h('p', { class: 'tool-intro' }, 'Pick triggers and steps. The file panel shows the YAML that would live at .github/workflows/validate-bricks.yml. Then fire events at it.'),
    h('div', { class: 'wf' },
      h('div', { class: 'wf-cols' },
        h('div', { class: 'panel' },
          h('h3', {}, 'Triggers (on:)'),
          h('div', { class: 'toggles' }, spec.triggers.map((t) => box('triggers', t))),
          h('h3', {}, 'Steps'),
          h('div', { class: 'toggles' }, spec.steps.map((st) => box('steps', st)))),
        h('div', { class: 'panel' }, h('h3', {}, 'The file'), yamlEl, warnEl)),
      h('div', { class: 'panel' },
        h('h3', {}, 'Fire an event'),
        h('div', { class: 'actions' }, spec.events.map((ev) =>
          h('button', { type: 'button', class: 'act', onClick: () => {
            const [yes, why] = fires(ev.id);
            fired.add(ev.id);
            firedEl.replaceChildren(h('p', { class: 'fired ' + (yes ? 'yes' : 'no') }, h('strong', {}, ev.label), ': ', yes ? 'runs. ' : 'does not run: ', why));
            draw();
          } }, ev.label))),
        firedEl),
      doneEl)
  );
  draw();
}
