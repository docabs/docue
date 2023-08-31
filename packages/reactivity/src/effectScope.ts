import { ReactiveEffect } from './effect'

let activeEffectScope: EffectScope | undefined

export class EffectScope {
  /**
   * @internal
   */
  private _active = true

  /**
   * @internal
   */
  effects: ReactiveEffect[] = []

  get active() {
    return this._active
  }
}

export function recordEffectScope(
  effect: ReactiveEffect,
  scope: EffectScope | undefined = activeEffectScope
) {
  if (scope && scope.active) {
    scope.effects.push(effect)
  }
}
