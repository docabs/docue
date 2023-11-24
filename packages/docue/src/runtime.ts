// This entry exports the runtime only, and is built as
// `dist/docue.esm-bundler.js` which is used by default for bundlers.
import { initDev } from './dev'
import { warn } from '@docue/runtime-dom'

if (__DEV__) {
  initDev()
}

export * from '@docue/runtime-dom'

export const compile = () => {
  if (__DEV__) {
    warn(
      `Runtime compilation is not supported in this build of Docue.` +
        (__ESM_BUNDLER__
          ? ` Configure your bundler to alias "docue" to "docue/dist/docue.esm-bundler.js".`
          : __ESM_BROWSER__
            ? ` Use "docue.esm-browser.js" instead.`
            : __GLOBAL__
              ? ` Use "docue.global.js" instead.`
              : ``) /* should not happen */
    )
  }
}
