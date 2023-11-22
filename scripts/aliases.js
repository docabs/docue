// @ts-check
// these aliases are shared between vitest and rollup
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const resolveEntryForPkg = p =>
  path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages/${p}/src/index.ts`
  )

const dirs = readdirSync(new URL('../packages', import.meta.url))

const entries = {
  docue: resolveEntryForPkg('docue'),
  'docue/compiler-sfc': resolveEntryForPkg('compiler-sfc'),
  'docue/server-renderer': resolveEntryForPkg('server-renderer')
  // '@docue/compat': resolveEntryForPkg('docue-compat')
}

const nonSrcPackages = ['sfc-playground', 'template-explorer', 'dts-test']

for (const dir of dirs) {
  const key = `@docue/${dir}`
  if (
    dir !== 'docue' &&
    !nonSrcPackages.includes(dir) &&
    !(key in entries) &&
    statSync(new URL(`../packages/${dir}`, import.meta.url)).isDirectory()
  ) {
    entries[key] = resolveEntryForPkg(dir)
  }
}

export { entries }
