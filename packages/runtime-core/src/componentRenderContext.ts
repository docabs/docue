import { ComponentInternalInstance } from './component'

/**
 * mark the current rendering instance for asset resolution (e.g.
 * resolveComponent, resolveDirective) during render
 */
export let currentRenderingInstance: ComponentInternalInstance | null = null
export let currentScopeId: string | null = null

/**
 * Note: rendering calls maybe nested. The function returns the parent rendering
 * instance if present, which should be restored after the render is done:
 *
 * ```js
 * const prev = setCurrentRenderingInstance(i)
 * // ...render
 * setCurrentRenderingInstance(prev)
 * ```
 */
export function setCurrentRenderingInstance(
  instance: ComponentInternalInstance | null
): ComponentInternalInstance | null {
  const prev = currentRenderingInstance
  currentRenderingInstance = instance
  currentScopeId = (instance && instance.type.__scopeId) || null
  // // v2 pre-compiled components uses _scopeId instead of __scopeId
  // if (__COMPAT__ && !currentScopeId) {
  //   currentScopeId = (instance && (instance.type as any)._scopeId) || null
  // }
  return prev
}
