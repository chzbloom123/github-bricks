// Scenario data for the transfer-stage tools. Each tool's renderer lives in js/tools/.

// EO1 — Repo setup sorter: tap an item, then tap the bucket it belongs in.
export const sorter = {
  title: 'Set up a new repo',
  intro:
    'A new training site is going public and will deploy on Netlify. Sort each item into where it belongs. Tap an item, then tap a bucket.',
  buckets: [
    { id: 'commit', label: 'Commit it' },
    { id: 'never', label: 'Never commit it' },
    { id: 'panel', label: 'Set it in About or Settings' },
  ],
  items: [
    { text: 'README.md', bucket: 'commit', why: 'The front door. Always in the repo.', brick: 'readme' },
    { text: 'index.html and the js folder', bucket: 'commit', why: 'The site itself.', brick: 'repository' },
    { text: '.env holding an API key', bucket: 'never', why: 'Secrets never enter history. List it in .gitignore.', brick: 'ignore-license' },
    { text: 'node_modules/', bucket: 'never', why: 'Installed dependencies are rebuilt from package.json; megabytes of noise otherwise.', brick: 'ignore-license' },
    { text: 'LICENSE (MIT)', bucket: 'commit', why: 'It is a file at the root; GitHub reads it and shows the license in About.', brick: 'ignore-license' },
    { text: '.gitignore', bucket: 'commit', why: 'The ignore list is itself tracked so every clone ignores the same things.', brick: 'ignore-license' },
    { text: 'The live Netlify URL', bucket: 'panel', why: 'About panel, website field (and mention it in the README).', brick: 'about-panel' },
    { text: 'Public or private', bucket: 'panel', why: 'Visibility is a setting, chosen at creation or in Settings, Danger Zone.', brick: 'about-panel' },
    { text: 'dist/ build output', bucket: 'never', why: 'Generated files are rebuilt by the deploy service; committing them causes conflicts.', brick: 'ignore-license' },
    { text: 'images/hero.png used by the README', bucket: 'commit', why: 'Assets the repo references belong in the repo.', brick: 'readme' },
    { text: 'Brie as a collaborator', bucket: 'panel', why: 'Settings, Access, Collaborators.', brick: 'settings-tab' },
    { text: 'Topic tags: training, loto, hanford', bucket: 'panel', why: 'Topics live in the About panel.', brick: 'about-panel' },
  ],
};

// Generic decide-engine format: cards, each with options; one or more acceptable.
// { title, intro, cards:[{ text, options:[{label, ok, why, brick}] }] }

// EO3 — Triage desk
export const triage = {
  title: 'Triage desk',
  intro:
    'Eight things arrived overnight. Put each one in the right container. Then watch the board.',
  cards: [
    {
      text: 'Brie: “The Almanac calendar skips March 31.”',
      options: [
        { label: 'Issue, label bug', ok: true, why: 'A defect with a fix at the end. Label it so it is filterable.', brick: 'issue' },
        { label: 'Discussion', ok: false, why: 'There is nothing to discuss; it is a bug.', brick: 'discussions' },
        { label: 'Wiki page', ok: false, why: 'The wiki is documentation, not a tracker.', brick: 'wiki' },
      ],
    },
    {
      text: 'Z: “Why Vercel here and Netlify on the other site?”',
      options: [
        { label: 'Issue', ok: false, why: 'No work item; it would sit open forever.', brick: 'issue' },
        { label: 'Discussion, Q&A', ok: true, why: 'A question with an answer, not a task.', brick: 'discussions' },
        { label: 'Close it', ok: false, why: 'Rude, and the answer is useful to others.', brick: 'discussions' },
      ],
    },
    {
      text: 'You: “Add a release tool to EO6” (five sub-steps you can already name)',
      options: [
        { label: 'One issue with a checklist', ok: false, why: 'Works, but checklist items cannot be assigned or linked to PRs.', brick: 'sub-issues' },
        { label: 'Parent issue with five sub-issues', ok: true, why: 'Each step gets an owner, a state, and a PR link; parent shows progress.', brick: 'sub-issues' },
        { label: 'A milestone named Release tool', ok: false, why: 'Milestones group issues toward a date; they do not nest.', brick: 'labels-milestones' },
      ],
    },
    {
      text: 'Setup notes that have grown to 400 lines in the README',
      options: [
        { label: 'Leave in README', ok: false, why: 'The README is orientation; this is a manual.', brick: 'readme' },
        { label: 'Wiki or a docs folder', ok: true, why: 'Long-form documentation beside the code.', brick: 'wiki' },
        { label: 'Discussion thread', ok: false, why: 'Threads are conversation; docs need to be findable and editable.', brick: 'discussions' },
      ],
    },
    {
      text: 'Everything you must finish before the EFCOG demo in March',
      options: [
        { label: 'A milestone with a due date', ok: true, why: 'Issues roll up into it with a progress bar and a deadline.', brick: 'labels-milestones' },
        { label: 'A label named march', ok: false, why: 'Filterable, but no deadline or progress rollup.', brick: 'labels-milestones' },
        { label: 'A branch named march', ok: false, why: 'Branches hold code, not plans.', brick: 'branch' },
      ],
    },
    {
      text: 'A view of open work across Chazzip, the Almanac, and the Workshop',
      options: [
        { label: 'Milestones on each repo', ok: false, why: 'Milestones are per repo; three repos means three separate lists.', brick: 'labels-milestones' },
        { label: 'A user-level Project', ok: true, why: 'The only container that spans repos, with board and roadmap views.', brick: 'projects' },
        { label: 'A wiki page of links', ok: false, why: 'Manual and instantly stale.', brick: 'wiki' },
      ],
    },
    {
      text: 'People keep filing “it’s broken” with no browser, no steps',
      options: [
        { label: 'Reply asking for details each time', ok: false, why: 'The question should be asked by the form, not by you.', brick: 'templates' },
        { label: 'Add an issue template form with required fields', ok: true, why: 'Required fields at submission. Lives in .github/ISSUE_TEMPLATE.', brick: 'templates' },
        { label: 'Disable issues', ok: false, why: 'Then the reports arrive by text message instead.', brick: 'issue' },
      ],
    },
    {
      text: 'A fix you already made on a branch for issue #14',
      options: [
        { label: 'Open a PR with “Closes #14” in the description', ok: true, why: 'The PR is the container for a change; the phrase closes the issue on merge.', brick: 'pull-request' },
        { label: 'Comment on #14 that it is fixed and close it', ok: false, why: 'The fix is not on main until the PR merges; closing early loses the link.', brick: 'issue' },
        { label: 'Open a discussion', ok: false, why: 'Discussions do not carry diffs.', brick: 'discussions' },
      ],
    },
  ],
  board: {
    intro: 'Now the Projects board. Three of those became issues. Move them by hand, or let automation do it.',
    columns: ['Todo', 'In progress', 'Done'],
    items: [
      { id: 14, title: '#14 Calendar skips March 31', col: 0, pr: true },
      { id: 15, title: '#15 Release tool (parent, 0/5)', col: 0, pr: false },
      { id: 16, title: '#16 Issue template form', col: 0, pr: false },
    ],
  },
};

// EO5 — Security inbox
export const security = {
  title: 'Security inbox',
  intro: 'Six notifications in the inbox. Decide the action for each.',
  cards: [
    {
      text: 'Dependabot alert: high severity in a dev-only dependency (used by the build script).',
      options: [
        { label: 'Merge the Dependabot security PR after reading the diff and checks', ok: true, why: 'Dev-only lowers urgency but the build runs it; update through the PR gate.', brick: 'dependabot-updates' },
        { label: 'Dismiss: dev dependencies do not matter', ok: false, why: 'Build tooling with a hole can compromise what it builds.', brick: 'dependabot-alerts' },
        { label: 'Delete package.json', ok: false, why: 'That removes the project, not the risk.', brick: 'dependabot-alerts' },
      ],
    },
    {
      text: 'Push rejected: push protection found an Anthropic API key in config.js.',
      options: [
        { label: 'Bypass; it is your own key', ok: false, why: 'The key would be in history forever, scrapable in minutes on a public repo.', brick: 'secret-scanning' },
        { label: 'Move the key to .env (ignored) or a repo secret, amend the commit, push again', ok: true, why: 'Fix the commit so the key was never there.', brick: 'secret-scanning' },
        { label: 'Make the repo private and push', ok: false, why: 'Private is not secret; collaborators, apps and future flips to public all see history.', brick: 'about-panel' },
      ],
    },
    {
      text: 'Code scanning: innerHTML assigned from a URL parameter in the chat board.',
      options: [
        { label: 'Fix it: use textContent or sanitize before inserting', ok: true, why: 'Classic cross-site scripting. The alert shows the line.', brick: 'code-scanning' },
        { label: 'Dismiss as false positive', ok: false, why: 'Untrusted text into innerHTML is the textbook case; it is real.', brick: 'code-scanning' },
        { label: 'Turn off code scanning', ok: false, why: 'Removes the messenger.', brick: 'code-scanning' },
      ],
    },
    {
      text: 'Reminder: your classic personal access token (full repo scope, no expiry) is used by an old script.',
      options: [
        { label: 'Leave it; it works', ok: false, why: 'Broad and immortal is the worst combination if it ever leaks.', brick: 'tokens-keys' },
        { label: 'Replace it with a fine-grained token scoped to that repo with an expiry, then revoke the classic one', ok: true, why: 'Grant narrow, grant with an end date.', brick: 'tokens-keys' },
        { label: 'Put the token in the README so you do not lose it', ok: false, why: 'That publishes it.', brick: 'secret-scanning' },
      ],
    },
    {
      text: 'A stranger emails: “found an XSS in your public tool.” There is no SECURITY.md.',
      options: [
        { label: 'Enable private vulnerability reporting and add SECURITY.md; thank them; fix on a branch', ok: true, why: 'Give the next reporter a channel; fix through the gate.', brick: 'security-policy' },
        { label: 'Ask them to open a public issue', ok: false, why: 'That tells attackers before you fix it.', brick: 'security-policy' },
        { label: 'Ignore', ok: false, why: 'The next email goes to someone else.', brick: 'security-policy' },
      ],
    },
    {
      text: 'A new device signed in to your account last night. You were asleep.',
      options: [
        { label: 'Account Settings, Sessions: revoke it; rotate tokens; confirm 2FA and a passkey', ok: true, why: 'The account owns every repo and deploy. Lock it first, investigate second.', brick: 'account-security' },
        { label: 'Change the repo visibility to private', ok: false, why: 'The intruder is in the account, not a repo.', brick: 'account-security' },
        { label: 'Wait and see', ok: false, why: 'Every minute is a minute with your deploy keys.', brick: 'account-security' },
      ],
    },
  ],
  tokens: {
    intro: 'One more: pick the credential for each job.',
    cards: [
      {
        text: 'Git from the terminal on a new PC, for years.',
        options: [
          { label: 'SSH key', ok: true, why: 'Per-machine, revocable from account Settings, no expiry needed.', brick: 'tokens-keys' },
          { label: 'Classic token', ok: false, why: 'Too broad; being phased down.', brick: 'tokens-keys' },
          { label: 'Deploy key', ok: false, why: 'Deploy keys are per repo, usually read-only.', brick: 'tokens-keys' },
        ],
      },
      {
        text: 'A nightly script that reads one repo and nothing else.',
        options: [
          { label: 'Deploy key (read-only) or a fine-grained token with Contents: read on that repo', ok: true, why: 'Least privilege: one repo, read only.', brick: 'tokens-keys' },
          { label: 'Your password', ok: false, why: 'Passwords are not accepted for git and would expose everything.', brick: 'account-security' },
          { label: 'Classic token with full scope', ok: false, why: 'Can touch every repo you own.', brick: 'tokens-keys' },
        ],
      },
      {
        text: 'Netlify needs to react to pushes and write deploy statuses.',
        options: [
          { label: 'Install the Netlify GitHub App on just that repo', ok: true, why: 'Apps use short-lived tokens and you choose the repos.', brick: 'github-apps' },
          { label: 'Give Netlify a classic token', ok: false, why: 'Hands a service a key to everything.', brick: 'tokens-keys' },
          { label: 'Add Netlify as a collaborator', ok: false, why: 'Collaborators are people with full write; services use apps.', brick: 'settings-tab' },
        ],
      },
    ],
  },
};

// EO6 — Release cutter
export const release = {
  title: 'Release cutter',
  intro:
    'Last tag: v1.4.2. These pull requests merged since. Pick the bump, then choose where each artifact publishes.',
  prs: [
    { title: 'Fix map overlap on narrow phones', kind: 'fix' },
    { title: 'Add release tool to EO6', kind: 'feature' },
    { title: 'Rename all URLs from #/brick/x to #/b/x (old links 404)', kind: 'breaking' },
    { title: 'Bump actions/checkout v4 to v5 (Dependabot)', kind: 'chore' },
  ],
  bumps: [
    { id: 'patch', label: 'Patch: v1.4.3', ok: false, why: 'There is a new feature and a breaking change. Patch is only for fixes.' },
    { id: 'minor', label: 'Minor: v1.5.0', ok: false, why: 'Close, but one PR broke existing links. That is major.' },
    { id: 'major', label: 'Major: v2.0.0', ok: true, why: 'Existing users’ bookmarks break. Major means “something that worked changes meaning.”' },
  ],
  targets: {
    intro: 'Where does each thing publish?',
    cards: [
      {
        text: 'The site itself: static HTML, public repo, no backend.',
        options: [
          { label: 'GitHub Pages', ok: true, why: 'Repo as host; no extra service.', brick: 'github-pages' },
          { label: 'Vercel or Netlify', ok: true, why: 'Also fine; use it when you want previews per PR, redirects or functions.', brick: 'github-apps' },
          { label: 'GitHub Packages', ok: false, why: 'Packages is a registry for libraries and images, not a web host.', brick: 'packages' },
        ],
      },
      {
        text: 'A zip of the single-file Brickyard version for strangers to download.',
        options: [
          { label: 'Release asset on the v2.0.0 release', ok: true, why: 'Releases hold downloadable files beside the notes.', brick: 'tags-releases' },
          { label: 'Commit the zip to main', ok: false, why: 'Binary blobs in history bloat every clone.', brick: 'commit' },
          { label: 'GitHub Pages', ok: false, why: 'Pages serves a site, not a download catalogue.', brick: 'github-pages' },
        ],
      },
      {
        text: 'The brick-renderer module two other sites want to install.',
        options: [
          { label: 'GitHub Packages (npm registry)', ok: true, why: 'Versioned, installable, Dependabot-tracked.', brick: 'packages' },
          { label: 'Copy the file into each repo', ok: false, why: 'Works until the third copy drifts.', brick: 'packages' },
          { label: 'A gist', ok: false, why: 'No versions, no install path.', brick: 'fork-star-watch' },
        ],
      },
      {
        text: 'A finished site you will not change again, still live for reference.',
        options: [
          { label: 'Archive the repo', ok: true, why: 'Read-only with history and links intact.', brick: 'archive-transfer' },
          { label: 'Delete the repo', ok: false, why: 'Kills the deploy and the history.', brick: 'archive-transfer' },
          { label: 'Make it private', ok: false, why: 'Hides it; does not freeze it.', brick: 'about-panel' },
        ],
      },
    ],
  },
};

// EO7 — Agent dispatcher
export const dispatch = {
  title: 'Agent dispatcher',
  intro: 'Seven tasks. Pick the worker and the seat.',
  cards: [
    {
      text: 'Fix a typo in the README while you are at work.',
      options: [
        { label: 'Assign the issue to Copilot coding agent', ok: true, why: 'Bounded, clear, no secrets. A draft PR arrives for review.', brick: 'copilot-coding-agent' },
        { label: 'Wait until you are home and use Claude Code', ok: false, why: 'Works, but you paid a day for a one-line change.', brick: 'claude-code-fit' },
        { label: 'Edit main directly on GitHub.com', ok: false, why: 'Bypasses the gate; a ruleset should stop you anyway.', brick: 'rulesets' },
      ],
    },
    {
      text: 'Rebuild the authentication layer across twelve files.',
      options: [
        { label: 'Claude Code in your clone, with you present, on a branch', ok: true, why: 'Deep multi-file work with local testing and your judgment on each step.', brick: 'claude-code-fit' },
        { label: 'Assign to Copilot coding agent', ok: false, why: 'Too large and too risky for an unattended sandbox pass.', brick: 'copilot-coding-agent' },
        { label: 'Copilot chat', ok: false, why: 'Chat explains; it does not build.', brick: 'copilot-chat' },
      ],
    },
    {
      text: 'A 900-line PR from Dependabot: is it safe to merge?',
      options: [
        { label: 'Copilot chat to summarise, Copilot review for the diff, then read it yourself', ok: true, why: 'Summary first, flags second, your eyes last.', brick: 'copilot-review' },
        { label: 'Merge; bots are trustworthy', ok: false, why: 'Bots are consistent, not infallible; a major bump can break you.', brick: 'dependabot-updates' },
        { label: 'Close it', ok: false, why: 'The vulnerability stays.', brick: 'dependabot-alerts' },
      ],
    },
    {
      text: 'Understand what a stranger’s repo does before forking it.',
      options: [
        { label: 'Copilot chat on the repo: explain the structure', ok: true, why: 'Orientation without cloning.', brick: 'copilot-chat' },
        { label: 'Assign an issue to Copilot', ok: false, why: 'You do not have write access to a stranger’s repo, and there is no task.', brick: 'copilot-coding-agent' },
        { label: 'Fork first, read later', ok: false, why: 'Fine, but slower than asking.', brick: 'fork-star-watch' },
      ],
    },
    {
      text: 'Add alt text to 40 images in the Almanac, which holds Brie’s private data.',
      options: [
        { label: 'Claude Code locally on a branch; keep private data off cloud agents', ok: true, why: 'Private repo, personal data: do it where you control the environment.', brick: 'claude-code-fit' },
        { label: 'Assign to Copilot coding agent', ok: false, why: 'Mechanical work suits it, but the repo holds private data and the Free plan has no ruleset on private repos.', brick: 'agent-guardrails' },
        { label: 'Skip alt text', ok: false, why: 'No.', brick: 'issue' },
      ],
    },
    {
      text: 'Before the first Copilot assignment on a public repo.',
      options: [
        { label: 'Write .github/copilot-instructions.md and confirm a ruleset protects main', ok: true, why: 'House rules plus the gate. Same idea as CLAUDE.md.', brick: 'agent-guardrails' },
        { label: 'Give Copilot admin', ok: false, why: 'It does not need it and cannot use it well.', brick: 'agent-guardrails' },
        { label: 'Nothing; just assign', ok: false, why: 'Vague instructions make vague PRs.', brick: 'copilot-coding-agent' },
      ],
    },
    {
      text: 'A Copilot PR arrived. Checks pass. What next?',
      options: [
        { label: 'Read the diff, request changes or approve, then merge through the PR', ok: true, why: 'Same gate as a human contributor.', brick: 'code-review' },
        { label: 'Merge without reading; checks passed', ok: false, why: 'Checks prove it runs, not that it is right.', brick: 'checks' },
        { label: 'Cherry-pick its commits onto main from your PC', ok: false, why: 'Bypasses the record of review.', brick: 'merge-strategies' },
      ],
    },
  ],
};

// EO4 — Workflow assembler blocks
export const workflow = {
  triggers: [
    { id: 'push', label: 'push to main', yaml: '  push:\n    branches: [main]' },
    { id: 'pull_request', label: 'pull_request', yaml: '  pull_request:' },
    { id: 'schedule', label: 'schedule (nightly 3am)', yaml: "  schedule:\n    - cron: '0 3 * * *'" },
    { id: 'workflow_dispatch', label: 'workflow_dispatch (manual button)', yaml: '  workflow_dispatch:' },
    { id: 'release', label: 'release published', yaml: '  release:\n    types: [published]' },
  ],
  steps: [
    { id: 'checkout', label: 'Check out the code', yaml: '      - uses: actions/checkout@v4', need: null },
    { id: 'node', label: 'Set up Node', yaml: "      - uses: actions/setup-node@v4\n        with:\n          node-version: '22'", need: null },
    { id: 'validate', label: 'Run scripts/validate.js', yaml: '      - run: node scripts/validate.js', need: 'checkout' },
    { id: 'deploy', label: 'Deploy with a token', yaml: '      - run: npx deploy-tool --token ${{ secrets.DEPLOY_TOKEN }}', need: 'checkout' },
    { id: 'echo', label: 'Print the token (debug)', yaml: '      - run: echo ${{ secrets.DEPLOY_TOKEN }}', need: null },
  ],
  events: [
    { id: 'push', label: 'Someone pushes to main' },
    { id: 'push-branch', label: 'You push to a feature branch (no PR)' },
    { id: 'pull_request', label: 'A PR is opened' },
    { id: 'schedule', label: 'It is 3am on Tuesday' },
    { id: 'workflow_dispatch', label: 'You click Run workflow' },
    { id: 'release', label: 'You publish a release' },
  ],
};
