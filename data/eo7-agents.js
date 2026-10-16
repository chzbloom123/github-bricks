// EO7 — Hand work to agents

export const eo = {
  n: 7,
  id: 'agents',
  title: 'Hand work to agents',
  short: 'Agents',
  objective:
    'Decide which jobs to hand to Copilot on GitHub.com, which to keep in Claude Code on your machine, and see that both land through the same pull request gate.',
  tool: 'dispatch',
};

export const bricks = [
  {
    id: 'copilot-coding-agent',
    label: 'Copilot coding agent',
    what:
      'Assign an issue to Copilot, or @copilot in a comment, and GitHub spins up a sandboxed machine, works the task, and opens a draft pull request on a branch named copilot/… with a checklist of what it did. It asks for your review when done.',
    why:
      'It is an asynchronous worker that lives inside the repo’s rules. It cannot push to main, cannot bypass checks, and leaves a PR you read like any other.',
    where:
      'Any issue, Assignees, pick Copilot. A 👀 reaction confirms it started. Progress and the PR appear in Pull requests. Needs a Copilot subscription (Pro or above).',
    when:
      'Well-specified, bounded tasks: a typo sweep, a small feature with clear acceptance criteria, a test for a known bug. The issue text is the prompt; vague issue, vague PR.',
    links: ['issue', 'pull-request', 'agent-guardrails', 'code-review', 'notifications'],
    check: {
      q: 'You assign an issue to Copilot. What arrives?',
      options: ['A commit on main.', 'A draft PR on a copilot/ branch asking for your review.', 'A wiki page.'],
      answer: 1,
      why: 'The agent only produces PRs on its own branches. Merging is still your call.',
    },
  },
  {
    id: 'copilot-review',
    label: 'Copilot code review',
    what:
      'Request Copilot as a reviewer on a pull request and it reads the diff, leaves line comments and suggestions, and summarises risks. It can be set to review every PR automatically.',
    why:
      'A second reader on every PR, at 2 a.m., on a solo repo. It is not a human reviewer and it is not a security scan; it is a careful first pass that catches the obvious.',
    where:
      'PR page, Reviewers, Copilot. Automatic reviews: repo Settings, Rules or Copilot settings, depending on plan.',
    when:
      'Every PR before you read it yourself, so you read with the easy issues already flagged. Pair it with code scanning for security.',
    links: ['code-review', 'pull-request', 'code-scanning', 'rulesets'],
    check: {
      q: 'What is the difference between Copilot code review and code scanning?',
      options: ['None.', 'Copilot review is an LLM reading the diff for anything; code scanning is a static analyzer matching known vulnerability patterns.', 'Code scanning is newer.'],
      answer: 1,
      why: 'Different mechanisms, different blind spots. Use both on anything public.',
    },
  },
  {
    id: 'copilot-chat',
    label: 'Copilot chat on GitHub.com',
    what:
      'A chat panel on GitHub.com that can be pointed at a repo, a file, a PR, or an issue and asked questions: explain this file, summarise this PR, where is X handled.',
    why:
      'Orientation without cloning. When you are looking at a stranger’s repo, or your own from six months ago, the chat reads it with you.',
    where:
      'Copilot icon in the top bar, or Ask Copilot buttons on files and PRs.',
    when:
      'Before forking something, before reviewing a large PR, when deciding whether a dependency is worth trusting.',
    links: ['fork-star-watch', 'pull-request', 'readme', 'copilot-review'],
    check: {
      q: 'You open a 2,000-line PR from Dependabot and want the one-paragraph version before reading the diff. Tool?',
      options: ['Copilot chat: summarise this PR.', 'Insights.', 'A new issue.'],
      answer: 0,
      why: 'Summarise first, then read the diff with the summary in mind.',
    },
  },
  {
    id: 'agent-guardrails',
    label: 'Agent guardrails',
    what:
      'The limits an agent works inside: it pushes only to copilot/ branches, your rulesets still apply to its PRs, checks must still pass, premium requests are metered, and a .github/copilot-instructions.md or AGENTS.md file tells it your house rules.',
    why:
      'The gate from EO2 is what makes delegation safe. An agent with the same PR, review, and ruleset constraints as a human contributor cannot do more damage than one.',
    where:
      'Rulesets in Settings, Rules. Instructions file at the repo root or in .github. Copilot usage in account Settings, Billing.',
    when:
      'Before the first assignment: write the instructions file (stack, conventions, what never to touch) and confirm a ruleset protects main.',
    note:
      'Same shape as your Claude Code CLAUDE.md: one file that says how this repo works, read by whatever model shows up.',
    links: ['rulesets', 'copilot-coding-agent', 'checks', 'templates', 'claude-code-fit'],
    check: {
      q: 'What stops a coding agent from merging its own work into main?',
      options: ['Nothing; it has write access.', 'It can only push to its own branches, and a ruleset on main requires a PR with review and passing checks.', 'A CAPTCHA.'],
      answer: 1,
      why: 'Branch restriction plus rulesets plus required checks: the same gate a human passes through.',
    },
  },
  {
    id: 'claude-code-fit',
    label: 'Where Claude Code fits',
    what:
      'Claude Code works in your local clone with full tool access and pushes branches you then open as PRs. Copilot coding agent works in GitHub’s sandbox from an issue and opens the PR itself. Both land on main only through the PR gate.',
    why:
      'They are two workers with different seats. Local for deep multi-file builds where you are present; GitHub-side for bounded tasks you want done while you are away. The repo is the ledger both write to.',
    where:
      'Claude Code: your terminal and clone. Copilot agent: the Issues tab. The meeting point: the Pull requests tab.',
    when:
      'Build sessions and anything touching secrets or local data: Claude Code. Chores from a clear issue while you are at work: Copilot agent. Reading a PR either one produced: you, with Copilot review as the first pass.',
    note:
      'Your division of labor already matches: you specify the need, the agent picks the path, you review coverage. The PR is where coverage gets checked.',
    links: ['copilot-coding-agent', 'pull-request', 'branch', 'agent-guardrails', 'issue'],
    check: {
      q: 'A three-hour multi-file build with you at the keyboard, or a one-line README fix from an issue while you are at work. Which worker for which?',
      options: ['Copilot agent for both.', 'Claude Code for the build; Copilot coding agent for the README fix.', 'Claude Code for both, always.'],
      answer: 1,
      why: 'Presence and scope decide the seat. Both still go through a PR.',
    },
  },
];
