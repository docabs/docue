import { ComponentPublicInstance } from './componentPublicInstance'

export interface DirectiveBinding<V = any> {
  instance: ComponentPublicInstance | null
  value: V
  oldValue: V | null
  arg?: string
  modifiers: DirectiveModifiers
  dir: ObjectDirective<any, V>
}

export interface ObjectDirective<T = any, V = any> {
  // created?: DirectiveHook<T, null, V>
  // beforeMount?: DirectiveHook<T, null, V>
  // mounted?: DirectiveHook<T, null, V>
  // beforeUpdate?: DirectiveHook<T, VNode<any, T>, V>
  // updated?: DirectiveHook<T, VNode<any, T>, V>
  // beforeUnmount?: DirectiveHook<T, null, V>
  // unmounted?: DirectiveHook<T, null, V>
  // getSSRProps?: SSRDirectiveHook
  // deep?: boolean
}

export type DirectiveModifiers = Record<string, boolean>
