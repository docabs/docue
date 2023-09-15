import { IfAny, Prettify, SlotFlags } from '@docue/shared'
import { VNode, VNodeNormalizedChildren } from './vnode'
import { ComponentInternalInstance } from './component'

export type Slot<T extends any = any> = (
  ...args: IfAny<T, any[], [T] | (T extends undefined ? [] : never)>
) => VNode[]

export type InternalSlots = {
  [name: string]: Slot | undefined
}

export type Slots = Readonly<InternalSlots>

declare const SlotSymbol: unique symbol
export type SlotsType<T extends Record<string, any> = Record<string, any>> = {
  [SlotSymbol]?: T
}

export type StrictUnwrapSlotsType<
  S extends SlotsType,
  T = NonNullable<S[typeof SlotSymbol]>
> = [keyof S] extends [never] ? Slots : Readonly<T>

export type UnwrapSlotsType<
  S extends SlotsType,
  T = NonNullable<S[typeof SlotSymbol]>
> = [keyof S] extends [never]
  ? Slots
  : Readonly<
      Prettify<{
        [K in keyof T]: NonNullable<T[K]> extends (...args: any[]) => any
          ? T[K]
          : Slot<T[K]>
      }>
    >

export type RawSlots = {
  // [name: string]: unknown
  // // manual render fn hint to skip forced children updates
  // $stable?: boolean
  // /**
  //  * for tracking slot owner instance. This is attached during
  //  * normalizeChildren when the component vnode is created.
  //  * @internal
  //  */
  // _ctx?: ComponentInternalInstance | null
  /**
   * indicates compiler generated slots
   * we use a reserved property instead of a vnode patchFlag because the slots
   * object may be directly passed down to a child component in a manual
   * render function, and the optimization hint need to be on the slot object
   * itself to be preserved.
   * @internal
   */
  _?: SlotFlags
}

export const initSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren
) => {
  // if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
  //   const type = (children as RawSlots)._
  //   if (type) {
  //     // users can get the shallow readonly version of the slots object through `this.$slots`,
  //     // we should avoid the proxy object polluting the slots of the internal instance
  //     instance.slots = toRaw(children as InternalSlots)
  //     // make compiler marker non-enumerable
  //     def(children as InternalSlots, '_', type)
  //   } else {
  //     normalizeObjectSlots(
  //       children as RawSlots,
  //       (instance.slots = {}),
  //       instance
  //     )
  //   }
  // } else {
  //   instance.slots = {}
  //   if (children) {
  //     normalizeVNodeSlots(instance, children)
  //   }
  // }
  // def(instance.slots, InternalObjectKey, 1)
}
