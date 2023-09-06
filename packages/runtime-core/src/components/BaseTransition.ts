import { RendererElement } from '../renderer'
import { VNode } from '../vnode'

export interface BaseTransitionProps<HostElement = RendererElement> {
  mode?: 'in-out' | 'out-in' | 'default'
  appear?: boolean

  // If true, indicates this is a transition that doesn't actually insert/remove
  // the element, but toggles the show / hidden status instead.
  // The transition hooks are injected, but will be skipped by the renderer.
  // Instead, a custom directive can control the transition by calling the
  // injected hooks (e.g. v-show).
  persisted?: boolean

  // // Hooks. Using camel case for easier usage in render functions & JSX.
  // // In templates these can be written as @before-enter="xxx" as prop names
  // // are camelized.
  // onBeforeEnter?: Hook<(el: HostElement) => void>
  // onEnter?: Hook<(el: HostElement, done: () => void) => void>
  // onAfterEnter?: Hook<(el: HostElement) => void>
  // onEnterCancelled?: Hook<(el: HostElement) => void>
  // // leave
  // onBeforeLeave?: Hook<(el: HostElement) => void>
  // onLeave?: Hook<(el: HostElement, done: () => void) => void>
  // onAfterLeave?: Hook<(el: HostElement) => void>
  // onLeaveCancelled?: Hook<(el: HostElement) => void> // only fired in persisted mode
  // // appear
  // onBeforeAppear?: Hook<(el: HostElement) => void>
  // onAppear?: Hook<(el: HostElement, done: () => void) => void>
  // onAfterAppear?: Hook<(el: HostElement) => void>
  // onAppearCancelled?: Hook<(el: HostElement) => void>
}

export interface TransitionHooks<HostElement = RendererElement> {
  mode: BaseTransitionProps['mode']
  persisted: boolean
  beforeEnter(el: HostElement): void
  enter(el: HostElement): void
  leave(el: HostElement, remove: () => void): void
  clone(vnode: VNode): TransitionHooks<HostElement>
  // optional
  afterLeave?(): void
  delayLeave?(
    el: HostElement,
    earlyRemove: () => void,
    delayedLeave: () => void
  ): void
  delayedLeave?(): void
}
