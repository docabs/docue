import { ComponentInternalInstance } from '../component'
import { MoveType, SetupRenderEffectFn } from '../renderer'
import { RendererElement, RendererNode, VNode } from '../vnode'

export interface SuspenseProps {
  onResolve?: () => void
  onPending?: () => void
  onFallback?: () => void
  timeout?: string | number
  /**
   * Allow suspense to be captured by parent suspense
   *
   * @default false
   */
  suspensible?: boolean
}

export const isSuspense = (type: any): boolean => type.__isSuspense

export interface SuspenseBoundary {
  vnode: VNode<RendererNode, RendererElement, SuspenseProps>
  parent: SuspenseBoundary | null
  parentComponent: ComponentInternalInstance | null
  isSVG: boolean
  container: RendererElement
  hiddenContainer: RendererElement
  anchor: RendererNode | null
  activeBranch: VNode | null
  pendingBranch: VNode | null
  deps: number
  pendingId: number
  timeout: number
  isInFallback: boolean
  isHydrating: boolean
  isUnmounted: boolean
  effects: Function[]
  resolve(force?: boolean, sync?: boolean): void
  fallback(fallbackVNode: VNode): void
  move(
    container: RendererElement,
    anchor: RendererNode | null,
    type: MoveType
  ): void
  next(): RendererNode | null
  registerDep(
    instance: ComponentInternalInstance,
    setupRenderEffect: SetupRenderEffectFn
  ): void
  unmount(parentSuspense: SuspenseBoundary | null, doRemove?: boolean): void
}
