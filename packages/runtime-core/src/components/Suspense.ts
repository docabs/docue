import { isArray } from '@docue/shared'
import { ComponentInternalInstance } from '../component'
import { MoveType, SetupRenderEffectFn } from '../renderer'
import { RendererElement, RendererNode, VNode } from '../vnode'
import { queuePostFlushCb } from '../scheduler'

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

export function queueEffectWithSuspense(
  fn: Function | Function[],
  suspense: SuspenseBoundary | null
): void {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn)
    } else {
      suspense.effects.push(fn)
    }
  } else {
    queuePostFlushCb(fn)
  }
}

// function setActiveBranch(suspense: SuspenseBoundary, branch: VNode) {
//   suspense.activeBranch = branch
//   const { vnode, parentComponent } = suspense
//   const el = (vnode.el = branch.el)
//   // in case suspense is the root node of a component,
//   // recursively update the HOC el
//   if (parentComponent && parentComponent.subTree === vnode) {
//     parentComponent.vnode.el = el
//     updateHOCHostEl(parentComponent, el)
//   }
// }

// function isVNodeSuspensible(vnode: VNode) {
//   return vnode.props?.suspensible != null && vnode.props.suspensible !== false
// }
