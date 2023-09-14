import { computed as _computed } from '@docue/reactivity'
import { isInSSRComponentSetup } from './component'

export const computed: typeof _computed = (
  getterOrOptions: any,
  debugOptions?: any
) => {
  // @ts-ignore
  return _computed(getterOrOptions, debugOptions, isInSSRComponentSetup)
}
