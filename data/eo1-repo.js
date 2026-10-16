// EO1 — Know the repo's rooms
// Each brick: id (retrieval handle, kebab-case), label (the words you say),
// what / why / where / when (the four parts), note (optional gotcha),
// links (ids of connected bricks), check (one scenario question).

export const eo = {
  n: 1,
  id: 'repo',
  title: "Know the repo's rooms",
  short: 'Repo',
  objective:
    'Walk into any repository on GitHub.com and know what each panel, tab and file is for before you click anything.',
  tool: 'sorter',
};

export const bricks = [
  {
    id: 'repository',
    label: 'Repository',
    what:
      'A repository (repo) is one project’s folder, its full change history, and everything GitHub attaches to that folder: issues, pull requests, settings, automation.',
    why:
      'Git on your PC only knows the folder and its history. GitHub wraps that in a shared home with a URL, so a second machine, a collaborator, a deploy service, or an agent can all point at the same thing.',
    where:
      'github.com/<owner>/<name>. The Code tab is the folder. The other tabs are the rooms GitHub built around it.',
    when:
      'Every project you intend to keep, deploy, or share gets one. The repo on GitHub is the “remote” your local folder pushes to.',
    note:
      'Your local clone and the GitHub repo are two copies that you keep in sync with push and pull. Vercel and Netlify only ever see the GitHub copy.',
    links: ['default-branch', 'readme', 'settings-tab', 'commit'],
    check: {
      q: 'You edited a file on your PC and saved it. Vercel did not redeploy. Why?',
      options: [
        'Vercel is slow; wait longer.',
        'Vercel watches the GitHub copy, and you have not pushed yet.',
        'You need to restart the Vercel project.',
      ],
      answer: 1,
      why: 'Deploy services watch the remote, not your disk. Nothing happens until the commit is pushed to GitHub.',
    },
  },
  {
    id: 'readme',
    label: 'README',
    what:
      'README.md is a Markdown file at the top of the repo that GitHub renders under the file list. It is the repo’s front door.',
    why:
      'A folder of files does not explain itself. The README is where you say what the project is, how to run it, and where it lives when deployed, so future-you and anyone else can orient in thirty seconds.',
    where:
      'Code tab, below the file list. Also shown on your profile when the repo is pinned.',
    when:
      'Write it before you forget what you built. Update it when the deploy URL or the run command changes.',
    note:
      'A README that says what the folder tree means is also how a model orients when you hand it the repo.',
    links: ['repository', 'about-panel', 'wiki'],
    check: {
      q: 'Which of these belongs in the README rather than somewhere else?',
      options: [
        'The API key the site uses.',
        'How to run the site locally and where it is deployed.',
        'A list of every bug ever found.',
      ],
      answer: 1,
      why: 'Keys never go in the repo (see Secrets). Bugs live in Issues. The README is orientation: what, how, where.',
    },
  },
  {
    id: 'about-panel',
    label: 'About panel and visibility',
    what:
      'The About box on the right of the Code tab holds a one-line description, a website link, and topics (tags). Visibility is whether the repo is public or private.',
    why:
      'The description and website link are what people see before they read anything. Putting the live Vercel or Netlify URL there turns the repo into a signpost to the running site. Visibility decides who can see the code at all.',
    where:
      'Code tab, right column, gear icon on About. Visibility is set at creation and changed in Settings, General, Danger Zone.',
    when:
      'Set the website link the moment a site goes live. Choose public for anything meant for strangers; private for anything with personal data or unfinished thinking.',
    note:
      'Several features (Pages, rulesets, code scanning) are free only on public repos for a personal account. Private repos on the Free plan lose those.',
    links: ['readme', 'repository', 'rulesets', 'github-pages', 'settings-tab'],
    check: {
      q: 'A training site is live on Netlify. Where should the Netlify URL go so a visitor to the repo finds it?',
      options: [
        'In a commit message.',
        'In the About panel’s website field (and the README).',
        'In an issue titled “URL”.',
      ],
      answer: 1,
      why: 'The About website field is shown on the repo page itself. The README is the second place. Commits and issues scroll away.',
    },
  },
  {
    id: 'default-branch',
    label: 'Default branch',
    what:
      'The default branch (almost always named main) is the branch GitHub shows first, the one pull requests target by default, and the one deploy services treat as production.',
    why:
      'Every repo needs one agreed line of truth. Everything else branches off it and merges back into it.',
    where:
      'The branch dropdown at the top of the Code tab. Changed in Settings, General, Default branch.',
    when:
      'You rarely change it. You protect it (rulesets) and you deploy from it.',
    links: ['branch', 'rulesets', 'environments', 'repository'],
    check: {
      q: 'Vercel’s production deployment comes from which branch by default?',
      options: ['Whichever branch was pushed most recently.', 'The default branch (main).', 'A branch named production.'],
      answer: 1,
      why: 'Deploy integrations treat the default branch as production and every other branch as a preview.',
    },
  },
  {
    id: 'ignore-license',
    label: '.gitignore and LICENSE',
    what:
      '.gitignore lists paths git should never track (node_modules, .env, build output). LICENSE is the file that says what other people may legally do with your code.',
    why:
      'Without .gitignore, one push drags in megabytes of dependencies and your secrets. Without a LICENSE, a public repo is technically all-rights-reserved and nobody can reuse it, even if you wanted them to.',
    where:
      'Both sit at the top level of the repo. GitHub offers templates for both when you create a repo, and shows the license name in the About panel.',
    when:
      'Add .gitignore before the first commit. Add a LICENSE when you decide the repo is for others (MIT is the common permissive choice; no license means private by default).',
    note:
      'Once a secret is committed it is in the history even if you delete the file later. Push protection (EO5) exists for exactly this reason.',
    links: ['secret-scanning', 'repository', 'about-panel'],
    check: {
      q: 'Which file should be listed in .gitignore?',
      options: ['index.html', '.env (holds your API keys)', 'README.md'],
      answer: 1,
      why: 'Site files and the README are the project. .env is local configuration with secrets and must never be tracked.',
    },
  },
  {
    id: 'settings-tab',
    label: 'Settings tab',
    what:
      'The Settings tab is the repo’s control panel: general options, collaborators, branch rules, Pages, Actions permissions, secrets and variables, security features, and the Danger Zone (archive, transfer, delete).',
    why:
      'Almost every “should I be using this?” feature is switched on or configured here. Knowing the left-hand menu is knowing where the levers are.',
    where:
      'Rightmost tab on the repo (owners and admins only). The left menu groups: General, Access, Code and automation, Security, Integrations.',
    when:
      'Visit once when you create a repo (visibility, features, branch rules) and again whenever you add a deploy, a secret, or a collaborator.',
    note:
      'Repo Settings is different from your account Settings (profile menu, top right). Account settings hold 2FA, SSH keys, tokens, and notification defaults.',
    links: ['rulesets', 'secrets-variables', 'github-pages', 'dependabot-alerts', 'archive-transfer', 'account-security'],
    check: {
      q: 'You want to add a collaborator to a private repo. Which menu?',
      options: ['Repo Settings, Access, Collaborators.', 'Account Settings, Emails.', 'The Insights tab.'],
      answer: 0,
      why: 'Access to one repo is a repo setting. Account settings are about you, not a project.',
    },
  },
  {
    id: 'fork-star-watch',
    label: 'Fork, star, watch, gist',
    what:
      'Fork copies someone’s repo into your account. Star bookmarks it. Watch subscribes you to its activity. A gist is a tiny repo for a single file or snippet.',
    why:
      'These are the social verbs. Fork is how you change code you do not own (then propose it back with a pull request). Star is your reading list. Watch controls how much a repo talks to your inbox.',
    where:
      'Top right of any repo. Gists live at gist.github.com and your profile.',
    when:
      'Fork to contribute or to keep your own variant. Star anything you might want again. Set Watch to Participating on repos that are noisy. Gist for a config snippet you want to share with one link.',
    links: ['pull-request', 'notifications', 'repository'],
    check: {
      q: 'You want to change a tool someone else published on GitHub and keep using your changed version. First step?',
      options: ['Star it.', 'Fork it into your account.', 'Open an issue asking them to change it.'],
      answer: 1,
      why: 'A fork is your own copy with full write access. A star only bookmarks; an issue only asks.',
    },
  },
];
