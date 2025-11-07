Nutrition Tracker — Project Template Snapshot

This file is a small guide for reusing this repository as a skeleton for future side projects.

What this snapshot contains
- Vite 7 + React 19 setup (TypeScript support)
- Vitest 4 testing setup
- ESLint 9 flat config and .eslintignore
- tsconfig.json with safe defaults and `@/*` path alias

How to use this template locally
1) Download the ZIP archive `template-snapshot-2025-11-06.zip` (present in repo root) or clone this repo and checkout the `template-skeleton-2025-11-06` branch.

2) Create a new project from the template (option A: using the zip)
   - unzip template-snapshot-2025-11-06.zip into a new folder
   - run `npm install`
   - review `package.json` and change `name`, `version`, and any metadata

   Option B: using git
   - git clone <this-repo>
   - git checkout template-skeleton-2025-11-06
   - copy files into a new repo or use `git clone --branch template-skeleton-2025-11-06 --single-branch <url>` to clone the branch directly

3) Cleanup / reset the template
   - Remove `.git` directory if you copied files (to start a fresh git repo)
   - Run `npm install`
   - Run `npm run lint` and `npm run typecheck` to ensure everything passes

Recommended quick commands after copying
```bash
# create a fresh git repo
rm -rf .git
git init
git add .
git commit -m "Initial commit — project from nutrition-tracker template"

# install deps
npm install

# run dev server
npm run dev
```

Notes
- The template includes a `vite.config.ts` and `vitest.config.ts` (TypeScript). If you prefer JS-only configs, adapt accordingly.
- The `tsconfig.json` uses `moduleResolution: NodeNext` and `module: NodeNext` to match `type: "module"` in package.json.

If you want, I can also:
- create a small `create-from-template.sh` script to clone+setup a new repo automatically
- push the branch to a remote repo (if you provide access or do it yourself)
