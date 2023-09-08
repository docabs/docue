import { extend } from '@docue/shared'
import {
  CreateAppFunction,
  createRenderer,
  RootRenderFunction,
  VNode
} from '@docue/runtime-core'
import { TestElement, nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { serializeInner } from './serialize'

const { render: baseRender, createApp: baseCreateApp } = createRenderer(
  extend({ patchProp }, nodeOps)
)

export const render = baseRender as RootRenderFunction<TestElement>
export const createApp = baseCreateApp as CreateAppFunction<TestElement>

// convenience for one-off render validations
export function renderToString(vnode: VNode) {
  const root = nodeOps.createElement('div')
  render(vnode, root)
  return serializeInner(root)
}

export * from './triggerEvent'
export * from './serialize'
export * from './nodeOps'
export * from '@docue/runtime-core'
