// EO5 — Secure the supply chain

export const eo = {
  n: 5,
  id: 'secure',
  title: 'Secure the supply chain',
  short: 'Secure',
  objective:
    'Read a security alert and know what kind it is, what GitHub already blocked for you, which token or key is the right one for a job, and where the account-level locks are.',
  tool: 'security',
};

export const bricks = [
  {
    id: 'dependabot-alerts',
    label: 'Dependabot alerts',
    what:
      'An alert fires when a package in your dependency manifest (package.json, requirements.txt) matches a published vulnerability. Each alert has a severity, the affected version range, and the version that fixes it.',
    why:
      'You did not write most of the code that runs your site. A years-old dependency with a new vulnerability is your vulnerability. Alerts are the only way to hear about it without reading security feeds.',
    where:
      'Security tab, Dependabot. Also in the notifications inbox. Switched on in Settings, Advanced Security (or Code security).',
    when:
      'Turn on for every repo. Read the severity and whether the package is a runtime dependency (ships to users) or dev-only (runs on your machine).',
    links: ['dependabot-updates', 'notifications', 'commit', 'insights'],
    check: {
      q: 'An alert says a dev-only dependency has a high-severity vulnerability. What matters first?',
      options: ['Panic: users are exposed.', 'Dev-only means it runs on your machine and in CI, not in the shipped site; still update it, but it is not a user-facing hole.', 'Ignore; dev dependencies do not count.'],
      answer: 1,
      why: 'Scope decides urgency. Dev dependencies can still compromise your build, so update, but the shipped site is not what is exposed.',
    },
  },
  {
    id: 'dependabot-updates',
    label: 'Dependabot updates',
    what:
      'Security updates open a PR to bump a vulnerable package to a fixed version automatically. Version updates, configured in .github/dependabot.yml, open PRs on a schedule for any outdated dependency, including GitHub Actions.',
    why:
      'Alerts tell you; updates do the typing. A PR with the diff, the changelog, and your checks already run is the safest way to take a dependency forward.',
    where:
      'Pull requests tab, author dependabot[bot]. Config: .github/dependabot.yml.',
    when:
      'Enable security updates everywhere. Add version updates for the github-actions ecosystem on any repo with workflows (this repo does).',
    note:
      'Read the diff before merging. A bump that changes files you did not expect is the moment to slow down.',
    links: ['dependabot-alerts', 'pull-request', 'checks', 'pinning-actions', 'semantic-versioning'],
    check: {
      q: 'Dependabot opened a PR bumping a package by a major version and your check failed. Right move?',
      options: ['Merge; Dependabot is always safe.', 'Read the changelog and the failing check; a major bump can break things and needs your change too.', 'Close it and disable Dependabot.'],
      answer: 1,
      why: 'Major versions can change behaviour. The failed check did its job; fix your side or hold the bump.',
    },
  },
  {
    id: 'secret-scanning',
    label: 'Secret scanning and push protection',
    what:
      'Secret scanning looks for known key formats (AWS, Stripe, Anthropic, GitHub tokens) in your code. Push protection blocks the push before the secret lands in history. Since October 2026, Anthropic API keys are blocked by default.',
    why:
      'A key in a public repo is found by scrapers in minutes. A key in history stays there after you delete the file. Blocking at push is the only version of this that works.',
    where:
      'Security tab, Secret scanning. Push protection for your account across all your repos: account Settings, Code security, Push protection for yourself.',
    when:
      'Turn on account-level push protection today. If a push is blocked, do not bypass; move the value to a secret or .env and retry.',
    links: ['ignore-license', 'secrets-variables', 'tokens-keys', 'account-security'],
    check: {
      q: 'git push is rejected: “push protection: Anthropic API key found in config.js”. What do you do?',
      options: ['Use the bypass link; it is your own key.', 'Remove the key from the file, put it in .env (ignored) or a secret, amend the commit, push again.', 'Make the repo private and push.'],
      answer: 1,
      why: 'The key would be in history forever. Fix the commit so the key was never there, then push.',
    },
  },
  {
    id: 'code-scanning',
    label: 'Code scanning',
    what:
      'Code scanning runs an analyzer (GitHub’s CodeQL) over your code to find vulnerability patterns: injection, unsafe HTML, path traversal. Findings appear as alerts with the exact line and a fix suggestion.',
    why:
      'It is a reviewer that has read every known bug class. For sites that take user input, it catches the mistakes a tired human and a fast model both make.',
    where:
      'Security tab, Code scanning. Enable with Default setup in Settings, Advanced Security. Free on public repos.',
    when:
      'Any public repo with JavaScript that handles input (forms, URL parameters, innerHTML). Results also post on PRs as a check.',
    links: ['checks', 'pull-request', 'about-panel', 'copilot-review'],
    check: {
      q: 'Code scanning flags innerHTML = userText in your chat board. What is it worried about?',
      options: ['Performance.', 'Cross-site scripting: user text rendered as HTML can run script.', 'Spelling.'],
      answer: 1,
      why: 'Untrusted text into innerHTML is the classic XSS pattern. Use textContent or sanitize.',
    },
  },
  {
    id: 'tokens-keys',
    label: 'Tokens and keys',
    what:
      'Ways to prove to GitHub that a machine is you: fine-grained personal access tokens (scoped to chosen repos and permissions, with expiry), classic tokens (broad, being phased down), SSH keys (for git over SSH), deploy keys (one repo, often read-only), and GitHub App tokens (short-lived, least privilege).',
    why:
      'Every automation and every terminal on another machine needs credentials. The wrong kind is either too broad (a classic token that can touch everything) or too long-lived (never expires, never rotated).',
    where:
      'Account Settings, Developer settings, Personal access tokens. SSH and GPG keys: account Settings. Deploy keys: repo Settings, Deploy keys.',
    when:
      'Terminal on a new PC: SSH key. A script that needs one repo: fine-grained token with only that repo and only the permissions it uses, 90-day expiry. A server that only reads: deploy key.',
    note:
      'Grant late, grant narrow. Make the token when the step needs it, for only what it needs.',
    links: ['secrets-variables', 'github-apps', 'account-security', 'secret-scanning', 'packages'],
    check: {
      q: 'A script on a second machine needs to push to one repo for the next month. Which credential?',
      options: ['A classic token with repo scope, no expiry.', 'A fine-grained token limited to that repo, Contents read and write, 30-day expiry.', 'Your password.'],
      answer: 1,
      why: 'Narrow scope and short life limit the blast radius if it leaks.',
    },
  },
  {
    id: 'account-security',
    label: 'Account security',
    what:
      'Two-factor authentication (required for most accounts now), passkeys, active sessions, SSH keys, and commit signing (SSH or GPG) that gives commits a Verified badge.',
    why:
      'The account owns every repo and every deploy. Everything downstream, including the sites Brie uses, hangs off this one login.',
    where:
      'Account Settings: Password and authentication, Sessions, SSH and GPG keys. Vigilant mode (flag unsigned commits) is under SSH and GPG keys.',
    when:
      'Set 2FA and a passkey once. Review sessions whenever a device is lost. Sign commits if you want a cryptographic “this was really me” on the history.',
    links: ['tokens-keys', 'secret-scanning', 'commit', 'settings-tab'],
    check: {
      q: 'What does the Verified badge next to a commit mean?',
      options: ['The code passed tests.', 'The commit was signed with a key registered to that account.', 'GitHub reviewed it.'],
      answer: 1,
      why: 'Verified is about authorship, not correctness. Anyone can set an author name; a signature proves the key.',
    },
  },
  {
    id: 'security-policy',
    label: 'Security policy and advisories',
    what:
      'SECURITY.md tells people how to report a vulnerability privately. Private vulnerability reporting lets them do it through GitHub instead of email. A security advisory is the repo’s own published notice of a fixed issue.',
    why:
      'A public repo with users will eventually get a report. Without a channel it arrives as a public issue, which tells attackers before it tells you.',
    where:
      'Security tab, Overview shows what is enabled. Settings, Advanced Security, Private vulnerability reporting.',
    when:
      'Any public repo that people other than you run. For personal training sites, enable private reporting and skip the ceremony.',
    links: ['templates', 'code-scanning', 'discussions'],
    check: {
      q: 'A stranger finds an XSS hole in a public tool you shipped. What should they be able to do?',
      options: ['Post it as a public issue.', 'Report it privately through the Security tab.', 'Email Brie.'],
      answer: 1,
      why: 'Private vulnerability reporting gives you time to fix before disclosure.',
    },
  },
];
