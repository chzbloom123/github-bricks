// EO6 — Ship and publish

export const eo = {
  n: 6,
  id: 'ship',
  title: 'Ship and publish',
  short: 'Ship',
  objective:
    'Mark a version, publish it to the right place (a release, Pages, a package, a deploy service), work on it from any machine, and retire it cleanly when done.',
  tool: 'release',
};

export const bricks = [
  {
    id: 'tags-releases',
    label: 'Tags and releases',
    what:
      'A tag is a named pointer at one commit (v1.2.0). A release wraps a tag with a title, notes, and optional downloadable files, and gets its own page and a Latest badge.',
    why:
      'Main moves every day. A tag is the frozen point you can name, link to, and roll back to. A release is that point with a story attached, which is what users and future-you read.',
    where:
      'Releases link in the Code tab sidebar. Draft a new release, pick or create a tag, click Generate release notes to list merged PRs since the last one.',
    when:
      'Any time a site reaches a state you would send someone. Even solo, a release per milestone makes the history navigable.',
    links: ['semantic-versioning', 'merge-strategies', 'labels-milestones', 'triggers'],
    check: {
      q: 'A site is in a state you want to be able to return to even after a month of changes. What do you create?',
      options: ['A new branch called backup.', 'A tag and a release.', 'A gist with the files.'],
      answer: 1,
      why: 'Tags are the designed mechanism for a named, permanent point in history. Branches move; tags do not.',
    },
  },
  {
    id: 'semantic-versioning',
    label: 'Semantic versioning',
    what:
      'MAJOR.MINOR.PATCH. Patch: fixes, nothing new. Minor: new features, nothing breaks. Major: something existing breaks or changes meaning.',
    why:
      'It is the shared vocabulary between you, Dependabot, npm, and anyone reading your releases. A major bump in a dependency PR is a warning; a patch bump is routine.',
    where:
      'Your tag names, your package.json version field, and every Dependabot PR title.',
    when:
      'Every tag. Ask: did anything break for a user of the previous version? Then it is major.',
    links: ['tags-releases', 'dependabot-updates', 'packages'],
    check: {
      q: 'You changed the URL structure of a site; old bookmarks now 404. Bump?',
      options: ['Patch.', 'Minor.', 'Major.'],
      answer: 2,
      why: 'Existing behaviour broke for existing users. That is the definition of major.',
    },
  },
  {
    id: 'github-pages',
    label: 'GitHub Pages',
    what:
      'Pages serves static files straight from a repo at <user>.github.io/<repo>, from a branch, a folder, or an Actions workflow. No build service in between.',
    why:
      'For a plain HTML site it removes Vercel and Netlify from the loop entirely: the repo is the host. One fewer account, one fewer dashboard.',
    where:
      'Settings, Pages. Free for public repos on a personal account; private Pages needs an organization on a paid plan.',
    when:
      'Brickyard-style single-file sites and small static builds with no backend. Keep Vercel or Netlify for anything needing serverless functions, redirects, or a custom build.',
    links: ['about-panel', 'default-branch', 'environments', 'workflow'],
    check: {
      q: 'A single-file HTML training site, public, no backend. Simplest host?',
      options: ['A Postgres server.', 'GitHub Pages from the repo.', 'Codespaces.'],
      answer: 1,
      why: 'Pages is built for exactly this: static files from a public repo, no extra service.',
    },
  },
  {
    id: 'packages',
    label: 'Packages',
    what:
      'GitHub Packages is a registry attached to your repos for npm packages, container images, and more. Publishing puts a versioned artifact beside the code that built it.',
    why:
      'The path you learned in October: a repo owner publishes to a registry, you npm install, you npx. Packages is that registry on GitHub’s side, so a tool you build in one repo can be installed into another.',
    where:
      'Packages link on the repo sidebar and your profile. Publishing needs a token with packages:write.',
    when:
      'When a helper you wrote is used by two or more of your repos. Until then, a shared file is simpler.',
    links: ['tokens-keys', 'semantic-versioning', 'tags-releases', 'workflow'],
    check: {
      q: 'You wrote a brick-renderer module three sites now copy by hand. What does Packages change?',
      options: ['Nothing.', 'Publish it once; each site installs a versioned copy and Dependabot tells them when it changes.', 'It hosts the sites.'],
      answer: 1,
      why: 'A registry turns copy-paste into a dependency with a version, which is what makes updates trackable.',
    },
  },
  {
    id: 'codespaces',
    label: 'Codespaces',
    what:
      'A Codespace is a full development machine in the cloud, opened in the browser or VS Code, created from a repo. A .devcontainer file describes what to install. Free plan: 120 core-hours and 15 GB a month.',
    why:
      'Your PC is not the only place you can work. A codespace has the repo, a terminal, and a running preview, from any laptop, and it is thrown away when you are done.',
    where:
      'Code button on the repo, Codespaces tab, Create codespace on main. Manage at github.com/codespaces.',
    when:
      'Working from the work laptop without installing anything, trying a stranger’s repo without polluting your machine, or pairing with Brie on a branch.',
    note:
      'Core-hours count per core: a 2-core machine gives 60 hours a month. Stop codespaces you are not using.',
    links: ['repository', 'branch', 'actions-usage'],
    check: {
      q: 'You want to test a forked repo without installing its toolchain on your PC. Which feature?',
      options: ['Fork and clone anyway.', 'Open it in a Codespace.', 'GitHub Pages.'],
      answer: 1,
      why: 'A codespace is a disposable machine with the repo already checked out.',
    },
  },
  {
    id: 'archive-transfer',
    label: 'Archive, transfer, delete',
    what:
      'Archive makes a repo read-only with a banner (history, issues and deploys stay). Transfer moves it to another account or organization. Delete removes it, with a short window to restore.',
    why:
      'A fleet of shipped sites needs a retirement path. Archive says “done, not deleted”. Transfer is how a project that became Brie’s becomes Brie’s.',
    where:
      'Settings, General, Danger Zone, at the bottom.',
    when:
      'Archive when a site is finished and you will not touch the code again. Transfer when ownership should change. Delete almost never; archive is reversible and keeps the links alive.',
    links: ['settings-tab', 'repository', 'insights'],
    check: {
      q: 'A site is finished, still live, and you want the repo to stop accepting changes but keep working as a reference. Action?',
      options: ['Delete it.', 'Archive it.', 'Make it private.'],
      answer: 1,
      why: 'Archive freezes the repo read-only while keeping history, issues and deploy links intact.',
    },
  },
  {
    id: 'insights',
    label: 'Insights',
    what:
      'The Insights tab holds the repo’s meters: traffic (views and clones, last 14 days), contributors, commit frequency, the dependency graph, network (forks and branches), and community standards.',
    why:
      'It is where you find out whether anyone used the thing, what you depend on, and whether the repo has the README, license and policy files that make it look maintained.',
    where:
      'Insights tab. Traffic is owner-only. The Dependency graph is what Dependabot reads.',
    when:
      'After a launch, for traffic. Before a security review, for the dependency graph. When cleaning up a public repo, for Community standards.',
    links: ['dependabot-alerts', 'about-panel', 'archive-transfer', 'readme'],
    check: {
      q: 'You want to know if a training site’s repo was actually visited after you shared it. Where?',
      options: ['Insights, Traffic.', 'The Actions tab.', 'Settings, Pages.'],
      answer: 0,
      why: 'Traffic shows views and unique visitors for the last two weeks. Only the owner sees it.',
    },
  },
];
