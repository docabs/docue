import { ComputedGetter, WritableComputedOptions } from '@docue/reactivity'
import { CreateComponentPublicInstance } from './componentPublicInstance'

export interface ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions
> {
  name?: string
}

export type ComponentOptions<
  Props = {},
  RawBindings = any,
  D = any,
  C extends ComputedOptions = any,
  M extends MethodOptions = any
> = ComponentOptionsBase<Props, RawBindings, D, C, M> &
  ThisType<CreateComponentPublicInstance<{}, RawBindings, D, C, M>>

export type ComputedOptions = Record<
  string,
  ComputedGetter<any> | WritableComputedOptions<any>
>

export interface MethodOptions {
  [key: string]: Function
}

export type ComponentInjectOptions = string[] | ObjectInjectOptions

export type ObjectInjectOptions = Record<
  string | symbol,
  string | symbol | { from?: string | symbol; default?: unknown }
>

export type InjectToObject<T extends ComponentInjectOptions> =
  T extends string[]
    ? {
        [K in T[number]]?: unknown
      }
    : T extends ObjectInjectOptions
    ? {
        [K in keyof T]?: unknown
      }
    : never
