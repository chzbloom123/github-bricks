// One transfer tool per enabling objective. app.js calls mountTool(n, host).

import * as sorter from './sorter.js';
import * as prgate from './prgate.js';
import * as triage from './triage.js';
import * as workflow from './workflow.js';
import * as security from './security.js';
import * as release from './release.js';
import * as dispatch from './dispatch.js';

const tools = { 1: sorter, 2: prgate, 3: triage, 4: workflow, 5: security, 6: release, 7: dispatch };

export function mountTool(n, host) {
  const t = tools[n];
  if (!t) { host.textContent = 'No tool for this objective yet.'; return; }
  t.mount(host);
}
