import { Component } from './component'
import { ComponentPublicInstance } from './componentPublicInstance'

export interface App<HostElement = any> {
  component(name: string): Component | undefined
  component(name: string, component: Component): this

  mount(
    rootContainer: HostElement | string,
    isHydrate?: boolean,
    isSVG?: boolean
  ): ComponentPublicInstance
  unmount(): void
}

export interface AppConfig {
  version: string
  config: AppConfig

  errorHandler?: (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => void
  warnHandler?: (
    msg: string,
    instance: ComponentPublicInstance | null,
    trace: string
  ) => void
}

export interface AppContext {
  app: App // for devtools
  config: AppConfig

  components: Record<string, Component>
}
