# GitHub, brick by brick

A semantic-brick learning site for the features of GitHub.com. One terminal objective, seven enabling objectives, fifty bricks, one relationship map, seven transfer tools, and a mixed transfer run.

Static site. No build step, no backend, no dependencies. Progress is kept in the browser's localStorage only.

## Run it

- Locally: open `index.html` through any static server (`npm run serve` starts one on port 8080; ES modules do not load from `file://`).
- Deployed: point Vercel or Netlify at the repo root with no build command and no output directory. Everything is served as-is.

## How it is organised

```
index.html            shell: header, nav, content area, the map rail (desktop) and map overlay (mobile)
css/styles.css        tokens, type, layout, map, tools. Light and dark via prefers-color-scheme.
js/app.js             hash router (#/, #/eo/N, #/brick/ID, #/tool/N, #/transfer) and page renderers
js/map.js             the wall map and the per-brick neighbourhood map (plain SVG)
js/check.js           the one-question check on every brick page
js/progress.js        localStorage: laid bricks, tool completions, best transfer score
js/dom.js             tiny DOM builder and a shuffle
js/tools/             one transfer tool per objective; decide.js is the shared scenario engine
data/eo1-repo.js …    the bricks, one file per enabling objective
data/eo7-agents.js
data/index.js         assembles objectives, bricks, and the edge list for the map
data/tools.js         scenario data for the tools
scripts/validate.js   checks every brick link resolves; run by the workflow below
```

## The repo is also a specimen

The site teaches GitHub, so the repo demonstrates what it teaches:

- `.github/workflows/validate-bricks.yml` runs `scripts/validate.js` on every push and pull request (EO4 Workflow, EO2 Checks).
- `.github/dependabot.yml` keeps the actions in that workflow current (EO5 Dependabot updates, EO4 Pinning actions).
- `.github/ISSUE_TEMPLATE/brick-correction.yml` is an issue form for reporting a wrong brick (EO3 Templates).

Suggested after the first push: a ruleset on `main` requiring a pull request and the `validate-bricks` check (EO2 Rulesets).

## Brick format

Every brick has a label (the retrieval handle), four parts (what it is, why it exists, where it lives, when you reach for it), optional note, a list of linked bricks, and one scenario check. The map is drawn from the links. Add a brick by appending to the right `data/eoN-*.js` file; the validator will tell you if a link is misspelled.

## Content date

Feature names and facts were checked against GitHub's docs and changelog in October 2026. Stacked pull requests (generally available October 2026) and workflow lockfiles (public preview) are described as such.
