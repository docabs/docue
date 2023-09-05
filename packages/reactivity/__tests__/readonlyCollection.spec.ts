import {
  effect,
  isProxy,
  isReactive,
  isReadonly,
  reactive,
  readonly
} from '../src'

describe('Map Collection', () => {
  const maps = [Map, WeakMap]
  maps.forEach((Collection: any) => {
    test('should make nested values readonly', () => {
      const key1 = {}
      const key2 = {}
      const original = new Collection([
        [key1, {}],
        [key2, {}]
      ])
      const wrapped = readonly(original)
      // expect(wrapped).not.toBe(original) // ? TODO: 报错
      expect(wrapped === original).toBeFalsy()
      expect(isProxy(wrapped)).toBe(true)
      expect(isReactive(wrapped)).toBe(false)
      expect(isReadonly(wrapped)).toBe(true)
      expect(isReactive(original)).toBe(false)
      expect(isReadonly(original)).toBe(false)
      expect(isReactive(wrapped.get(key1))).toBe(false)
      expect(isReadonly(wrapped.get(key1))).toBe(true)
      expect(isReactive(original.get(key1))).toBe(false)
      expect(isReadonly(original.get(key1))).toBe(false)
    })

    test('should not allow mutation & not trigger effect', () => {
      const map = readonly(new Collection())
      const key = {}
      let dummy
      effect(() => {
        dummy = map.get(key)
      })
      expect(dummy).toBeUndefined()
      map.set(key, 1)
      expect(dummy).toBeUndefined()
      expect(map.has(key)).toBe(false)
      expect(
        `Set operation on key "${key}" failed: target is readonly.`
      ).toHaveBeenWarned()
    })

    // #1772
    test('readonly + reactive should make get() value also readonly + reactive', () => {
      const map = reactive(new Collection())
      const roMap = readonly(map)
      const key = {}
      map.set(key, {})

      const item = map.get(key)
      expect(isReactive(item)).toBe(true)
      expect(isReadonly(item)).toBe(false)

      const roItem = roMap.get(key)
      expect(isReactive(roItem)).toBe(true)
      expect(isReadonly(roItem)).toBe(true)
    })

    if (Collection === Map) {
      test('should retrieve readonly values on iteration', () => {
        const key1 = {}
        const key2 = {}
        const original = new Map([
          [key1, {}],
          [key2, {}]
        ])
        const wrapped: any = readonly(original)
        expect(wrapped.size).toBe(2)
        for (const [key, value] of wrapped) {
          expect(isReadonly(key)).toBe(true)
          expect(isReadonly(value)).toBe(true)
        }
        wrapped.forEach((value: any) => {
          expect(isReadonly(value)).toBe(true)
        })
        for (const value of wrapped.values()) {
          expect(isReadonly(value)).toBe(true)
        }
      })

      test('should retrieve reactive + readonly values on iteration', () => {
        const key1 = {}
        const key2 = {}
        const original = reactive(
          new Map([
            [key1, {}],
            [key2, {}]
          ])
        )
        const wrapped: any = readonly(original)
        expect(wrapped.size).toBe(2)
        for (const [key, value] of wrapped) {
          expect(isReadonly(key)).toBe(true)
          expect(isReadonly(value)).toBe(true)
          expect(isReactive(key)).toBe(true)
          expect(isReactive(value)).toBe(true)
        }
        wrapped.forEach((value: any) => {
          expect(isReadonly(value)).toBe(true)
          expect(isReactive(value)).toBe(true)
        })
        for (const value of wrapped.values()) {
          expect(isReadonly(value)).toBe(true)
          expect(isReactive(value)).toBe(true)
        }
      })
    }
  })
})

describe('Set Collection', () => {
  const sets = [Set, WeakSet]
  sets.forEach((Collection: any) => {
    test('should make nested values readonly', () => {
      const key1 = {}
      const key2 = {}
      const original = new Collection([key1, key2])
      const wrapped = readonly(original)
      // expect(wrapped).not.toBe(original) // ? TODO: 报错
      expect(wrapped === original).toBeFalsy()
      expect(isProxy(wrapped)).toBe(true)
      expect(isReactive(wrapped)).toBe(false)
      expect(isReadonly(wrapped)).toBe(true)
      expect(isReactive(original)).toBe(false)
      expect(isReadonly(original)).toBe(false)
      expect(wrapped.has(reactive(key1))).toBe(true)
      expect(original.has(reactive(key1))).toBe(false)
    })

    test('should not allow mutation & not trigger effect', () => {
      const set = readonly(new Collection())
      const key = {}
      let dummy
      effect(() => {
        dummy = set.has(key)
      })
      expect(dummy).toBe(false)
      set.add(key)
      expect(dummy).toBe(false)
      expect(set.has(key)).toBe(false)
      expect(
        `Add operation on key "${key}" failed: target is readonly.`
      ).toHaveBeenWarned()
    })

    if (Collection === Set) {
      test('should retrieve readonly values on iteration', () => {
        const original = new Collection([{}, {}])
        const wrapped: any = readonly(original)
        expect(wrapped.size).toBe(2)
        for (const value of wrapped) {
          expect(isReadonly(value)).toBe(true)
        }
        wrapped.forEach((value: any) => {
          expect(isReadonly(value)).toBe(true)
        })
        for (const value of wrapped.values()) {
          expect(isReadonly(value)).toBe(true)
        }
        for (const [v1, v2] of wrapped.entries()) {
          expect(isReadonly(v1)).toBe(true)
          expect(isReadonly(v2)).toBe(true)
        }
      })
    }
  })
})
