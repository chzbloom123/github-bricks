// EO2 — Control change

export const eo = {
  n: 2,
  id: 'change',
  title: 'Control change',
  short: 'Change',
  objective:
    'Move a change from an idea to the default branch through a gate you control: branch, commit, pull request, review, checks, merge.',
  tool: 'prgate',
};

export const bricks = [
  {
    id: 'branch',
    label: 'Branch',
    what:
      'A branch is a parallel line of commits with its own name. Work on a branch does not touch main until it is merged.',
    why:
      'Isolation before work. The same reason you isolate a system before maintenance: the live line keeps running while you change things on the side, and nothing reaches it until the work is verified.',
    where:
      'Branch dropdown on the Code tab; the Branches page lists them all. Created locally (git switch -c name) or from the dropdown on GitHub.',
    when:
      'Any change larger than a typo. Name the branch for the job: fix-map-overlap, add-release-tool.',
    note:
      'Deploy services build a preview for every branch that has a pull request, so a branch is also how you get a shareable test URL.',
    links: ['default-branch', 'commit', 'pull-request', 'rulesets'],
    check: {
      q: 'You are about to rework the navigation on a live site. What do you create first?',
      options: ['A new repo.', 'A branch off main.', 'A release.'],
      answer: 1,
      why: 'The branch isolates the rework. Main stays deployable the whole time.',
    },
  },
  {
    id: 'commit',
    label: 'Commit and diff',
    what:
      'A commit is a saved snapshot with a message and an author. A diff is the line-by-line difference between two snapshots.',
    why:
      'Commits are the audit trail. Each one answers “what changed and why”, which is what makes rollback, review, and blame possible.',
    where:
      'Commits page (the clock icon on the Code tab) and every pull request’s Files changed tab. Click any commit hash to see its diff.',
    when:
      'Commit whenever a coherent step is done. Write the message as the sentence that completes “This commit will…”.',
    note:
      'Reading a diff is the skill under everything else here. A dependency bump that touches four files you did not expect is visible only in the diff.',
    links: ['branch', 'pull-request', 'code-review', 'account-security'],
    check: {
      q: 'Dependabot opened a pull request bumping one package. Where do you look to see exactly which lines changed?',
      options: ['The repo README.', 'The pull request’s Files changed tab (the diff).', 'The Insights tab.'],
      answer: 1,
      why: 'The diff is the only place the actual change is shown line by line.',
    },
  },
  {
    id: 'pull-request',
    label: 'Pull request',
    what:
      'A pull request (PR) proposes merging one branch into another. It bundles the diff, a conversation, review, and automated checks into one page with a merge button.',
    why:
      'It is the gate. Nothing reaches main without passing through a place where the change can be read, discussed, tested, and approved.',
    where:
      'Pull requests tab. GitHub offers to open one the moment you push a new branch.',
    when:
      'Every branch that is meant to land in main. Open it as a draft early if you want the preview URL and the checks before the work is finished.',
    note:
      'Write “Closes #12” in the description and the issue closes itself when the PR merges.',
    links: ['branch', 'code-review', 'checks', 'merge-strategies', 'issue', 'stacked-prs'],
    check: {
      q: 'You pushed a branch and want a shareable preview URL before the work is done. What do you open?',
      options: ['A release.', 'A draft pull request.', 'A discussion.'],
      answer: 1,
      why: 'A draft PR triggers the deploy preview and checks while signalling it is not ready to merge.',
    },
  },
  {
    id: 'code-review',
    label: 'Code review',
    what:
      'Review is commenting on a PR’s diff, line by line if needed, and ending with Approve, Request changes, or Comment. Suggestions are comments that can be applied as commits with one click.',
    why:
      'A second reader catches what the author cannot. On a solo repo the second reader can be you a day later, or an agent.',
where:
      'PR page, Files changed tab, hover a line and click the plus. Reviewers are chosen in the right sidebar.',
    when:
      'Before merging anything you would not want to explain at 2 a.m. Ask Copilot for a review when no human is around.',
    links: ['pull-request', 'copilot-review', 'rulesets', 'commit'],
    check: {
      q: 'A reviewer wants to fix a typo in your PR without a round trip. What does GitHub offer?',
      options: ['A suggestion comment you can apply as a commit.', 'Direct edit rights to your laptop.', 'Nothing; they must open their own PR.'],
      answer: 0,
      why: 'Suggestions become commits on the PR branch with one click, keeping authorship and history intact.',
    },
  },
  {
    id: 'checks',
    label: 'Checks',
    what:
      'Checks are the pass or fail results that services attach to a commit or PR: an Actions workflow, a Vercel preview build, a code scan.',
    why:
      'They are the verification step with no opinion. A rule can require them to pass before the merge button lights up.',
    where:
      'Bottom of the PR page (the merge box) and the Checks tab on the PR. A green tick, red cross, or yellow dot next to each commit.',
    when:
      'Add at least one check to every repo that deploys: a build, a validation script, a test. Then require it.',
    links: ['pull-request', 'workflow', 'rulesets', 'environments'],
    check: {
      q: 'The PR merge button is grey and says a required check failed. What is the correct next move?',
      options: ['Delete the check so you can merge.', 'Open the failing check, read why, push a fix to the branch.', 'Merge from your PC with git to bypass it.'],
      answer: 1,
      why: 'The check is the gate working as designed. Fix the cause; the PR re-runs the check automatically.',
    },
  },
  {
    id: 'merge-strategies',
    label: 'Merge strategies',
    what:
      'Three ways to land a PR: merge commit (keeps every commit plus a join commit), squash (collapses the branch into one commit), rebase (replays the commits onto main with no join).',
    why:
      'The strategy decides what the history looks like forever. Squash gives a clean one-line-per-PR history. Merge commits preserve the detail. Rebase keeps it linear.',
    where:
      'The dropdown on the merge button. Which ones are allowed, and whether branches auto-delete after merge, is in Settings, General, Pull Requests.',
    when:
      'Pick one per repo and stick to it. For solo sites, squash and auto-delete branch keeps the history readable.',
    note:
      'Auto-merge lets you say “merge when checks pass” and walk away.',
    links: ['pull-request', 'commit', 'default-branch', 'tags-releases'],
    check: {
      q: 'You want main to show one tidy commit per feature even though your branches have twenty messy commits each. Strategy?',
      options: ['Merge commit.', 'Squash and merge.', 'Rebase and merge.'],
      answer: 1,
      why: 'Squash collapses the branch to a single commit on main; the messy detail stays in the PR page if you ever need it.',
    },
  },
  {
    id: 'rulesets',
    label: 'Rulesets',
    what:
      'A ruleset is a named list of rules applied to branches or tags: require a pull request, require approvals, require checks to pass, block force pushes, restrict who can push. Push rules can also block certain file paths or sizes repo-wide.',
    why:
      'This is the procedure that makes the gate mandatory instead of polite. Without it, anyone with write access, including you in a hurry, can push straight to main.',
    where:
      'Settings, Rules, Rulesets. The older Branch protection rules page still exists; rulesets are the current tool and several can layer on one branch.',
    when:
      'The day a repo gets a deploy from main, add a ruleset on main: require PR, require your one check, block force push.',
    note:
      'On a personal Free plan, rulesets work in public repos only. Private repos need GitHub Pro for rulesets or branch protection.',
    links: ['default-branch', 'pull-request', 'checks', 'code-review', 'agent-guardrails', 'about-panel'],
    check: {
      q: 'You keep accidentally pushing half-finished work to main on a public site. Which fix stops it at the source?',
      options: ['A README warning.', 'A ruleset on main requiring a pull request before merging.', 'Setting Watch to Ignore.'],
      answer: 1,
      why: 'The ruleset rejects the direct push. You are forced onto a branch and through the PR gate every time.',
    },
  },
  {
    id: 'stacked-prs',
    label: 'Stacked pull requests',
    what:
      'A stack is a chain of PRs where each branch builds on the one below it. GitHub tracks the stack, shows the dependency, and retargets the upper PRs when the bottom one merges.',
    why:
      'Big changes are easier to review as a sequence of small PRs than as one wall of diff, but managing the chain by hand was painful. Native stacking (generally available October 2026) does the bookkeeping.',
    where:
      'Open a PR whose base branch is another PR’s branch; the merge box shows the stack.',
    when:
      'A feature that is really three steps (data file, then renderer, then tool) and you want each step reviewed and deployed in order.',
    links: ['pull-request', 'branch', 'merge-strategies'],
    check: {
      q: 'You have PR B built on PR A. A merges. What happens to B under stacked PRs?',
      options: ['B is closed and must be recreated.', 'B is retargeted onto main automatically.', 'B is merged automatically too.'],
      answer: 1,
      why: 'Stacking retargets the next PR in the chain; it still waits for its own review and checks.',
    },
  },
];
