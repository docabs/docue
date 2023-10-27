import {
  createRenderer,
  createHydrationRenderer,
  warn,
  RootRenderFunction,
  CreateAppFunction,
  Renderer,
  HydrationRenderer,
  App,
  RootHydrateFunction,
  isRuntimeOnly
  // DeprecationTypes,
  // compatUtils
} from '@docue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
// Importing from the compiler, will be tree-shaken in prod
import {
  isFunction,
  isString,
  isHTMLTag,
  isSVGTag,
  extend,
  NOOP
} from '@docue/shared'

// declare module '@docue/reactivity' {
//   export interface RefUnwrapBailTypes {
//     runtimeDOMBailTypes: Node | Window
//   }
// }

const rendererOptions = /*#__PURE__*/ extend({ patchProp }, nodeOps)

// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Docue.
let renderer: Renderer<Element | ShadowRoot> | HydrationRenderer

// let enabledHydration = false

function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  )
}

// use explicit type casts here to avoid import() calls in rolled-up d.ts
export const render = ((...args) => {
  ensureRenderer().render(...args)
}) as RootRenderFunction<Element | ShadowRoot>

export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return

    const component = app._component

    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML
      // // 2.x compat check
      // if (__COMPAT__ && __DEV__) {
      //   for (let i = 0; i < container.attributes.length; i++) {
      //     const attr = container.attributes[i]
      //     if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
      //       compatUtils.warnDeprecation(
      //         DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
      //         null
      //       )
      //       break
      //     }
      //   }
      // }
    }

    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container, false, container instanceof SVGElement)

    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      // container.setAttribute('data-v-app', '')
    }

    return proxy
  }

  return app
}) as CreateAppFunction<Element>

// export const createSSRApp = ((...args) => {
//   const app = ensureHydrationRenderer().createApp(...args)

//   if (__DEV__) {
//     injectNativeTagCheck(app)
//     injectCompilerOptionsCheck(app)
//   }

//   const { mount } = app
//   app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
//     const container = normalizeContainer(containerOrSelector)
//     if (container) {
//       return mount(container, true, container instanceof SVGElement)
//     }
//   }

//   return app
// }) as CreateAppFunction<Element>

// function injectNativeTagCheck(app: App) {
//   // Inject `isNativeTag`
//   // this is used for component name validation (dev only)
//   Object.defineProperty(app.config, 'isNativeTag', {
//     value: (tag: string) => isHTMLTag(tag) || isSVGTag(tag),
//     writable: false
//   })
// }

// // dev only
// function injectCompilerOptionsCheck(app: App) {
//   if (isRuntimeOnly()) {
//     const isCustomElement = app.config.isCustomElement
//     Object.defineProperty(app.config, 'isCustomElement', {
//       get() {
//         return isCustomElement
//       },
//       set() {
//         warn(
//           `The \`isCustomElement\` config option is deprecated. Use ` +
//             `\`compilerOptions.isCustomElement\` instead.`
//         )
//       }
//     })

//     const compilerOptions = app.config.compilerOptions
//     const msg =
//       `The \`compilerOptions\` config option is only respected when using ` +
//       `a build of Docue.js that includes the runtime compiler (aka "full build"). ` +
//       `Since you are using the runtime-only build, \`compilerOptions\` ` +
//       `must be passed to \`@docue/compiler-dom\` in the build setup instead.\n` +
//       `- For docue-loader: pass it via docue-loader's \`compilerOptions\` loader option.\n` +
//       `- For docue-cli: see https://cli.docuejs.org/guide/webpack.html#modifying-options-of-a-loader\n` +
//       `- For vite: pass it via @vitejs/plugin-docue options. See https://github.com/vitejs/vite-plugin-docue/tree/main/packages/plugin-docue#example-for-passing-options-to-docuecompiler-sfc`

//     Object.defineProperty(app.config, 'compilerOptions', {
//       get() {
//         warn(msg)
//         return compilerOptions
//       },
//       set() {
//         warn(msg)
//       }
//     })
//   }
// }

function normalizeContainer(
  container: Element | ShadowRoot | string
): Element | null {
  if (isString(container)) {
    const res = document.querySelector(container)
    if (__DEV__ && !res) {
      warn(
        `Failed to mount app: mount target selector "${container}" returned null.`
      )
    }
    return res
  }
  if (
    __DEV__ &&
    window.ShadowRoot &&
    container instanceof window.ShadowRoot &&
    container.mode === 'closed'
  ) {
    warn(
      `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
    )
  }
  return container as any
}

// Custom element support
export {
  defineCustomElement,
  // defineSSRCustomElement,
  DocueElement,
  type DocueElementConstructor
} from './apiCustomElement'

// SFC CSS utilities
export { useCssModule } from './helpers/useCssModule'
export { useCssVars } from './helpers/useCssVars'

// DOM-only components
export { Transition, type TransitionProps } from './components/Transition'
// export {
//   TransitionGroup,
//   type TransitionGroupProps
// } from './components/TransitionGroup'

// // **Internal** DOM-only runtime directive helpers
export {
  vModelText,
  vModelCheckbox,
  vModelRadio,
  vModelSelect,
  vModelDynamic
} from './directives/vModel'
export { withModifiers, withKeys } from './directives/vOn'
export { vShow } from './directives/vShow'

import { initVModelForSSR } from './directives/vModel'
import { initVShowForSSR } from './directives/vShow'

let ssrDirectiveInitialized = false

/**
 * @internal
 */
export const initDirectivesForSSR = __SSR__
  ? () => {
      if (!ssrDirectiveInitialized) {
        ssrDirectiveInitialized = true
        initVModelForSSR()
        initVShowForSSR()
      }
    }
  : NOOP

// re-export everything from core
// h, Component, reactivity API, nextTick, flags & types
export * from '@docue/runtime-core'

// export * from './jsx'
