# Creation
1. `pnpm create svelte@latest liveScheduler`
2. `cd liveScheduler`
3. `pnpm i`  (faced unsupported engine error -> `pnpm add -g pnpm` and then add `use-node-version=20.18.0` to .npmrc file)

# pnpm add package
* use `pnpm add -D <pkgname>`
* it may not install the types, need also `pnpm add -D @type/<pkgname>`