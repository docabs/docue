import { isOn } from '@docue/shared'
import { ComponentInternalInstance } from '../component'
import { assertCompatEnabled, DeprecationTypes } from './compatConfig'

export function getCompatListeners(instance: ComponentInternalInstance) {
  assertCompatEnabled(DeprecationTypes.INSTANCE_LISTENERS, instance)

  const listeners: Record<string, Function | Function[]> = {}
  const rawProps = instance.vnode.props
  if (!rawProps) {
    return listeners
  }
  for (const key in rawProps) {
    if (isOn(key)) {
      listeners[key[2].toLowerCase() + key.slice(3)] = rawProps[key]
    }
  }
  return listeners
}
