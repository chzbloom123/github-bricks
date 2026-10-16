// EO3 — Track the work

export const eo = {
  n: 3,
  id: 'track',
  title: 'Track the work',
  short: 'Track',
  objective:
    'Put every bug, idea, question and plan in the right GitHub container so it can be found, sorted, and closed by the change that resolves it.',
  tool: 'triage',
};

export const bricks = [
  {
    id: 'issue',
    label: 'Issue',
    what:
      'An issue is one tracked unit of work or one reported problem, with a number, a title, a body, comments, and an open or closed state.',
    why:
      'Work that only lives in your head or a chat log cannot be sorted, assigned, linked to the fix, or handed to an agent. The issue number is the handle everything else grabs.',
    where:
      'Issues tab. Reference one anywhere with #number; it autolinks.',
    when:
      'The moment you notice something to fix or build and are not going to do it this minute. One issue per thing.',
    note:
      '“Closes #14” in a PR description closes the issue on merge. That link is the whole point.',
    links: ['pull-request', 'labels-milestones', 'sub-issues', 'copilot-coding-agent', 'projects'],
    check: {
      q: 'Brie reports the Almanac’s calendar skips a day in March. You are mid-build on something else. What do you do?',
      options: ['Fix it from memory later.', 'Open an issue with the steps to reproduce.', 'Start a discussion thread about calendars.'],
      answer: 1,
      why: 'It is a specific defect with a fix at the end: an issue. It will link to the PR that closes it.',
    },
  },
  {
    id: 'labels-milestones',
    label: 'Labels and milestones',
    what:
      'Labels are coloured tags (bug, enhancement, docs). A milestone is a named target with a due date that issues roll up into. An assignee is who owns it.',
    why:
      'Fifty issues with no sorting handles is a pile. These three fields turn the pile into filters: everything tagged bug, everything due in v2, everything assigned to Copilot.',
    where:
      'Right sidebar of any issue or PR. Manage the label set and milestones from the Issues tab.',
    when:
      'Label on creation. Add a milestone when you plan a release. Assign when someone (or something) is working it.',
    links: ['issue', 'projects', 'tags-releases', 'copilot-coding-agent'],
    check: {
      q: 'You want to see every open item that must be done before the v2 launch. Which handle gives you that in one click?',
      options: ['A label named v2.', 'A milestone named v2.', 'Sorting by date.'],
      answer: 1,
      why: 'Milestones are built for “what is left before X”, with a progress bar and due date. A label would also work but has no deadline or progress.',
    },
  },
  {
    id: 'sub-issues',
    label: 'Sub-issues and issue types',
    what:
      'Sub-issues nest issues under a parent issue, with a progress count. Issue types (Bug, Task, Feature) are a typed field that an organization defines once.',
    why:
      'Big work is a tree, not a list. A parent issue “Build the PR gate tool” with five sub-issues shows progress without a spreadsheet.',
    where:
      'Inside an issue: Create sub-issue, or add an existing one. Types are configured at the organization level.',
    when:
      'Any issue you would otherwise write a checklist into. Checklists cannot be assigned or tracked individually; sub-issues can.',
    links: ['issue', 'projects', 'labels-milestones'],
    check: {
      q: 'An issue has grown a twelve-item checklist and three people are working on different items. Better structure?',
      options: ['Keep the checklist; it is fine.', 'Convert items to sub-issues so each can be assigned and closed.', 'Split into twelve milestones.'],
      answer: 1,
      why: 'Sub-issues give each item its own owner, state and PR link while the parent shows rollup progress.',
    },
  },
  {
    id: 'templates',
    label: 'Templates and .github',
    what:
      'Issue templates (forms with required fields), a pull request template, CODEOWNERS, and other repo-level conventions live in a folder named .github at the repo root.',
    why:
      'A template asks the questions you would otherwise ask back in comments: steps to reproduce, browser, screenshot. CODEOWNERS says who must review which paths.',
    where:
      '.github/ISSUE_TEMPLATE/*.yml, .github/pull_request_template.md, .github/CODEOWNERS. Settings, General has an Issues setup button that generates starters.',
    when:
      'When more than one person files issues, or when you keep asking the same follow-up question.',
    note:
      'This repo has one: .github/ISSUE_TEMPLATE/brick-correction.yml, for reporting a brick that is wrong.',
    links: ['issue', 'pull-request', 'code-review', 'workflow'],
    check: {
      q: 'Three people keep filing “it’s broken” issues with no detail. What fixes the intake?',
      options: ['An issue template form with required fields.', 'A longer README.', 'Closing issues faster.'],
      answer: 0,
      why: 'A form template makes the fields required at submission time. The README is not read by people filing bugs.',
    },
  },
  {
    id: 'projects',
    label: 'Projects',
    what:
      'A Project is a spreadsheet-like board over issues and PRs from one or many repos, with Table, Board and Roadmap views, custom fields (status, priority, dates), and built-in automations.',
    why:
      'Issues live per repo. Your fleet is many repos. Projects is the cross-repo view, the kanban, and the place a status field lives without you editing every issue.',
    where:
      'Projects tab on your profile (user-level) or on a repo. Add items with the plus, or let automation auto-add anything with a label.',
    when:
      'When you have more than one repo in flight, or when “what am I doing next” needs a board instead of a list.',
    note:
      'Automation worth switching on: item added to project sets Status to Todo; PR merged sets Status to Done.',
    links: ['issue', 'labels-milestones', 'sub-issues', 'pull-request'],
    check: {
      q: 'You want one board showing work across Chazzip, the Almanac, and the Workshop. Which feature?',
      options: ['Milestones on each repo.', 'A user-level Project pulling issues from all three.', 'A wiki page listing tasks.'],
      answer: 1,
      why: 'Projects are the only container that spans repos and gives board and roadmap views.',
    },
  },
  {
    id: 'discussions',
    label: 'Discussions',
    what:
      'Discussions is a forum attached to the repo: categories like Q&A, Ideas, Announcements, with threaded replies and an accepted answer.',
    why:
      'Not everything is a task. A question, a design argument, or an announcement should not sit as an open issue that never closes.',
    where:
      'Discussions tab, once enabled in Settings, General, Features.',
    when:
      'When strangers or collaborators need somewhere to ask and propose without creating work items. Convert a discussion to an issue when it becomes one.',
    links: ['issue', 'wiki', 'notifications'],
    check: {
      q: 'Someone asks “why did you choose Vercel over Netlify for this one?” in your repo. Best container?',
      options: ['An issue.', 'A discussion.', 'A pull request.'],
      answer: 1,
      why: 'It is a question with no fix to ship. Issues are for work; discussions are for talk.',
    },
  },
  {
    id: 'wiki',
    label: 'Wiki',
    what:
      'A wiki is a set of Markdown pages attached to the repo, with its own git history, for documentation too long for the README.',
    why:
      'The README is a front door, not a manual. When setup notes, architecture, and decisions outgrow it, the wiki keeps them beside the code without cluttering the code.',
    where:
      'Wiki tab, once enabled in Settings, General, Features. Public on public repos.',
    when:
      'When the README passes a screen or two. Alternative: a docs folder in the repo itself, which travels with clones and goes through PRs.',
    links: ['readme', 'discussions', 'repository'],
    check: {
      q: 'Your README is now 600 lines of setup, architecture and decisions. What is the move?',
      options: ['Leave it; long is thorough.', 'Move the long parts to a wiki or docs folder and keep the README as orientation.', 'Delete the history.'],
      answer: 1,
      why: 'The README should stay a quick orientation. Long-form docs belong in a wiki or docs folder.',
    },
  },
  {
    id: 'notifications',
    label: 'Notifications',
    what:
      'The notifications inbox (bell icon, github.com/notifications) collects everything you are subscribed to: mentions, review requests, Dependabot alerts, workflow failures. Watch settings per repo decide the volume.',
    why:
      'GitHub is where the machines talk to you: a failed deploy check, a security alert, an agent asking for review. If the inbox is noise, you miss the signal.',
    where:
      'Bell icon top right. Per-repo: the Watch button. Defaults: account Settings, Notifications. Also GitHub Mobile.',
    when:
      'Set Watch to Participating and @mentions on busy repos. Keep All activity only on repos where every event matters. Check the inbox like email.',
    links: ['fork-star-watch', 'dependabot-alerts', 'workflow', 'copilot-coding-agent'],
    check: {
      q: 'A repo you starred floods your inbox with every comment. Fix?',
      options: ['Unstar it.', 'Set its Watch level to Participating and @mentions.', 'Delete your account notifications.'],
      answer: 1,
      why: 'Watch level controls subscription volume. Star is just a bookmark and does not affect notifications.',
    },
  },
];
