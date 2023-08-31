import { configDefaults, defineConfig, UserConfig } from 'vitest/config'
import { entries } from './scripts/aliases'

export default defineConfig({
  define: {},
  resolve: {
    alias: entries
  },
  test: {
    globals: true,
    threads: !process.env.GITHUB_ACTIONS,
    setupFiles: 'scripts/setupVitest.ts',
    environmentMatchGlobs: [
      ['packages/{docue,docue-compat,runtime-dom}/**', 'jsdom']
    ],
    sequence: {
      hooks: 'list'
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude!,
        // DOM transitions are tested via e2e so no coverage is collected
        'packages/runtime-dom/src/components/Transition*',
        // mostly entries
        'packages/docue-compat/**'
      ]
    }
  }
}) as UserConfig
