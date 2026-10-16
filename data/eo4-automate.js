// EO4 — Automate

export const eo = {
  n: 4,
  id: 'automate',
  title: 'Automate',
  short: 'Automate',
  objective:
    'Make the repo do its own checking and deploying: write a workflow, pick its trigger, give it secrets safely, and read what a deploy service does on your behalf.',
  tool: 'workflow',
};

export const bricks = [
  {
    id: 'workflow',
    label: 'Workflow',
    what:
      'A workflow is a YAML file in .github/workflows that tells GitHub Actions what to run and when. One repo can have many.',
    why:
      'This is the repo acting on its own. A check that runs on every PR, a script that runs nightly, a deploy that runs on merge, all without you remembering to.',
    where:
      '.github/workflows/<name>.yml. Runs appear in the Actions tab with logs per step.',
    when:
      'The first time you think “I should remember to run this before I push.”',
    note:
      'This repo has one: .github/workflows/validate-bricks.yml runs scripts/validate.js on every push and PR to make sure every brick link points at a real brick.',
    links: ['triggers', 'jobs-steps-runners', 'checks', 'secrets-variables', 'pinning-actions'],
    check: {
      q: 'Where does GitHub look for automation definitions?',
      options: ['Any file ending in .yml.', '.github/workflows/', 'The Settings tab.'],
      answer: 1,
      why: 'Only YAML files in that folder are workflows. The Actions tab shows their runs.',
    },
  },
  {
    id: 'triggers',
    label: 'Triggers',
    what:
      'The on: block of a workflow lists the events that start it: push, pull_request, schedule (cron), workflow_dispatch (a manual button), release, and dozens more. Each can be filtered by branch or path.',
    why:
      'A workflow with the wrong trigger either never runs or runs constantly. The trigger is the sentence “run this when…”.',
    where:
      'Top of the YAML. Manual runs appear as a Run workflow button in the Actions tab when workflow_dispatch is set.',
    when:
      'Checks: pull_request plus push to main. Deploys: push to main. Housekeeping: schedule. Anything you want a button for: workflow_dispatch.',
    note:
      'A pull_request trigger runs on the PR’s merged state, which is what you want for a check. A push trigger runs on the branch itself.',
    links: ['workflow', 'checks', 'pull-request', 'default-branch'],
    check: {
      q: 'You want a validation script to run on every PR and also be clickable by hand. Which triggers?',
      options: ['pull_request and workflow_dispatch.', 'schedule only.', 'release only.'],
      answer: 0,
      why: 'pull_request covers the gate; workflow_dispatch adds the manual button.',
    },
  },
  {
    id: 'jobs-steps-runners',
    label: 'Jobs, steps, runners, actions',
    what:
      'A workflow has jobs; each job runs on a runner (a fresh virtual machine, usually ubuntu-latest); each job is a list of steps that either run a shell command or use a published action like actions/checkout.',
    why:
      'The runner is a blank computer every time, so a workflow must build its own world: check out the code, install the runtime, then do the work. Published actions are the reusable bricks for that.',
    where:
      'Actions tab shows each run; click into a job to see every step’s log. The Marketplace lists published actions.',
    when:
      'Reading a failed run is a step-by-step log. The failing step’s name tells you where to look.',
    links: ['workflow', 'pinning-actions', 'actions-usage', 'secrets-variables'],
    check: {
      q: 'A workflow step runs node scripts/validate.js and fails with “no such file”. Most likely cause?',
      options: ['Node is broken.', 'There is no actions/checkout step, so the code is not on the runner.', 'The repo is private.'],
      answer: 1,
      why: 'Runners start empty. Without checkout, your files are not there to run.',
    },
  },
  {
    id: 'secrets-variables',
    label: 'Secrets and variables',
    what:
      'Secrets are encrypted values (API keys, tokens) that workflows read as ${{ secrets.NAME }} and that are masked in logs. Variables are plain, non-sensitive settings. Both can be scoped to the repo or to an environment.',
    why:
      'Automation needs keys. Keys in the YAML are keys in the repo history. Secrets exist so a workflow can deploy or call an API without the value ever being readable.',
    where:
      'Settings, Secrets and variables, Actions. Environment-scoped ones live under Settings, Environments.',
    when:
      'Any time a workflow needs a value you would not post publicly. Never echo a secret in a step.',
    note:
      'Secrets are for Actions. A deploy integration like Vercel keeps your keys on its side; the repo never holds them.',
    links: ['workflow', 'environments', 'secret-scanning', 'tokens-keys'],
    check: {
      q: 'Your workflow needs an Anthropic API key to run a script. Where does the key go?',
      options: ['In the YAML as an env value.', 'In a repository secret, referenced as ${{ secrets.ANTHROPIC_API_KEY }}.', 'In the README so collaborators can find it.'],
      answer: 1,
      why: 'The secret store encrypts it and masks it from logs. The other two publish it.',
    },
  },
  {
    id: 'environments',
    label: 'Environments and deployments',
    what:
      'An environment is a named deploy target (production, preview) that can hold its own secrets and protection rules. Deployments are the records a workflow or integration writes when it ships to one.',
    why:
      'Deploy history needs a home on the repo. The Deployments list in the Code tab sidebar is where you see every production and preview deploy, who made it, and whether it is active.',
    where:
      'Settings, Environments. Deploy history: Code tab right column, Deployments. Deploy bots also comment on PRs with the preview URL.',
    when:
      'Vercel and Netlify create these for you. Create your own when a workflow deploys somewhere and you want approval before production.',
    links: ['secrets-variables', 'github-apps', 'checks', 'default-branch'],
    check: {
      q: 'You want to see the last ten production deploys of a site and who triggered them. Where on the repo?',
      options: ['The Insights tab.', 'The Deployments list in the Code tab sidebar.', 'The Wiki.'],
      answer: 1,
      why: 'Deployments is the per-environment history written by your deploy integration or workflow.',
    },
  },
  {
    id: 'github-apps',
    label: 'GitHub Apps and integrations',
    what:
      'A GitHub App is an installed service with its own identity and permissions: the Vercel app, the Netlify app, Dependabot, Copilot. Apps read events from your repo and write back statuses, comments and deployments.',
    why:
      'This is how “push to main and it is live” works without a workflow. The app is told about the push, builds on its own machines, and reports a check and a deployment back.',
    where:
      'Account Settings, Applications, Installed GitHub Apps. Per repo: Settings, Integrations. You pick which repos an app may see.',
    when:
      'Installing a deploy service, a security scanner, or any tool that should react to your repo. Grant it only the repos it needs.',
    note:
      'Two deploy paths exist: the app path (service watches the repo) and the Actions path (your workflow pushes to the service). Most of your sites use the app path.',
    links: ['environments', 'checks', 'tokens-keys', 'dependabot-alerts'],
    check: {
      q: 'Netlify builds your site on every push without any workflow file in the repo. How?',
      options: ['A hidden workflow.', 'The Netlify GitHub App is installed on the repo and reacts to push events.', 'Netlify polls your laptop.'],
      answer: 1,
      why: 'App installations receive repo events directly. No YAML needed for the app path.',
    },
  },
  {
    id: 'pinning-actions',
    label: 'Pinning actions',
    what:
      'uses: actions/checkout@v4 follows a moving tag. Pinning means referencing the exact commit hash instead, so what runs cannot change under you. Workflow lockfiles (public preview, October 2026) record resolved versions the way a package lockfile does.',
    why:
      'A published action is code from a stranger that runs with your secrets. If the tag moves to malicious code, your workflow runs it. Pinning makes a change to that code a visible diff in your repo.',
    where:
      'In the uses: line of each step. Dependabot can keep pinned versions updated for the github-actions ecosystem.',
    when:
      'Any workflow that touches a secret. For a validate-only workflow with no secrets, tag pinning is an acceptable trade.',
    links: ['jobs-steps-runners', 'dependabot-updates', 'secrets-variables', 'workflow'],
    check: {
      q: 'Why pin an action to a commit hash instead of a version tag?',
      options: ['Hashes are shorter.', 'A tag can be moved to different code; a hash cannot.', 'GitHub requires it.'],
      answer: 1,
      why: 'Pinning turns a silent upstream change into a reviewable diff in your repo.',
    },
  },
  {
    id: 'actions-usage',
    label: 'Actions minutes and usage',
    what:
      'Public repos get unlimited Actions minutes. Private repos on the Free plan get 2,000 minutes a month and 500 MB of artifact storage. Minutes are billed per runner type.',
    why:
      'A nightly job on a private repo is 30 runs a month; a job on every push is however many pushes you make. Knowing the budget stops a surprise.',
    where:
      'Account Settings, Billing and licensing, Usage. Per-run time is at the top of each run in the Actions tab.',
    when:
      'Before adding a schedule trigger to a private repo, or a heavy build step to anything.',
    links: ['workflow', 'triggers', 'about-panel'],
    check: {
      q: 'You add a workflow that runs on every push to a private repo. What is the first thing worth knowing?',
      options: ['Nothing; it is free.', 'Private repos have a monthly minute quota on the Free plan.', 'It will run on your PC.'],
      answer: 1,
      why: 'Public is unlimited; private draws down a monthly quota. Check usage after a week.',
    },
  },
];
