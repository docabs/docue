import { ShapeFlags, isOn } from '@docue/shared'
import { ComponentInternalInstance, FunctionalComponent } from './component'
import { setCurrentRenderingInstance } from './componentRenderContext'
import { VNode, cloneVNode, createVNode, normalizeVNode } from './vnode'
import { warn } from './warning'
import { ErrorCodes } from './errorHandling'

/**
 * dev only flag to track whether $attrs was used during render.
 * If $attrs was used during render then the warning for failed attrs
 * fallthrough can be suppressed.
 */
let accessedAttrs: boolean = false

export function markAttrsAccessed() {
  accessedAttrs = true
}

type SetRootFn = ((root: VNode) => void) | undefined

export function renderComponentRoot(
  instance: ComponentInternalInstance
): VNode {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    //   slots,
    attrs,
    //   emit,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance

  let result
  let fallthroughAttrs
  const prev = setCurrentRenderingInstance(instance)
  if (__DEV__) {
    accessedAttrs = false
  }

  try {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // withProxy is a proxy with a different `has` trap only for
      // runtime-compiled render functions using `with` block.
      const proxyToUse = withProxy || proxy
      result = normalizeVNode(
        render!.call(
          proxyToUse,
          proxyToUse!,
          renderCache,
          props,
          setupState,
          data,
          ctx
        )
      )
      fallthroughAttrs = attrs
    } else {
      // functional
      const render = Component as FunctionalComponent
      //     // in dev, mark attrs accessed if optional props (attrs === props)
      //     if (__DEV__ && attrs === props) {
      //       markAttrsAccessed()
      //     }
      result = normalizeVNode(
        render.length > 1
          ? render(
              props,
              __DEV__
                ? {
                    get attrs() {
                      markAttrsAccessed()
                      return attrs
                    }
                    // slots,
                    // emit
                  }
                : { attrs /*, slots, emit*/ }
            )
          : render(props, null as any /* we know it doesn't need it */)
      )
      // fallthroughAttrs = Component.props
      //   ? attrs
      //   : getFunctionalFallthrough(attrs)
    }
  } catch (err) {
    // blockStack.length = 0
    // handleError(err, instance, ErrorCodes.RENDER_FUNCTION)
    // result = createVNode(Comment)
  }

  // attr merging
  // in dev mode, comments are preserved, and it's possible for a template
  // to have comments along side the root element which makes it a fragment
  let root = result
  // let setRoot: SetRootFn = undefined
  // if (
  //   __DEV__ &&
  //   result.patchFlag > 0 &&
  //   result.patchFlag & PatchFlags.DEV_ROOT_FRAGMENT
  // ) {
  //   ;[root, setRoot] = getChildRoot(result)
  // }

  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs)
    const { shapeFlag } = root
    if (keys.length) {
      if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.COMPONENT)) {
        //       if (propsOptions && keys.some(isModelListener)) {
        //         // If a v-model listener (onUpdate:xxx) has a corresponding declared
        //         // prop, it indicates this component expects to handle v-model and
        //         // it should not fallthrough.
        //         // related: #1543, #1643, #1989
        //         fallthroughAttrs = filterModelListeners(
        //           fallthroughAttrs,
        //           propsOptions
        //         )
        //       }
        //       root = cloneVNode(root, fallthroughAttrs)
      } else if (__DEV__ && !accessedAttrs && root.type !== Comment) {
        //       const allAttrs = Object.keys(attrs)
        //       const eventAttrs: string[] = []
        //       const extraAttrs: string[] = []
        //       for (let i = 0, l = allAttrs.length; i < l; i++) {
        //         const key = allAttrs[i]
        //         if (isOn(key)) {
        //           // ignore v-model handlers when they fail to fallthrough
        //           if (!isModelListener(key)) {
        //             // remove `on`, lowercase first letter to reflect event casing
        //             // accurately
        //             eventAttrs.push(key[2].toLowerCase() + key.slice(3))
        //           }
        //         } else {
        //           extraAttrs.push(key)
        //         }
        //       }
        //       if (extraAttrs.length) {
        //         warn(
        //           `Extraneous non-props attributes (` +
        //             `${extraAttrs.join(', ')}) ` +
        //             `were passed to component but could not be automatically inherited ` +
        //             `because component renders fragment or text root nodes.`
        //         )
        //       }
        //       if (eventAttrs.length) {
        //         warn(
        //           `Extraneous non-emits event listeners (` +
        //             `${eventAttrs.join(', ')}) ` +
        //             `were passed to component but could not be automatically inherited ` +
        //             `because component renders fragment or text root nodes. ` +
        //             `If the listener is intended to be a component custom event listener only, ` +
        //             `declare it using the "emits" option.`
        //         )
        //       }
      }
    }
  }

  // if (
  //   __COMPAT__ &&
  //   isCompatEnabled(DeprecationTypes.INSTANCE_ATTRS_CLASS_STYLE, instance) &&
  //   vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT &&
  //   root.shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.COMPONENT)
  // ) {
  //   const { class: cls, style } = vnode.props || {}
  //   if (cls || style) {
  //     if (__DEV__ && inheritAttrs === false) {
  //       warnDeprecation(
  //         DeprecationTypes.INSTANCE_ATTRS_CLASS_STYLE,
  //         instance,
  //         getComponentName(instance.type)
  //       )
  //     }
  //     root = cloneVNode(root, {
  //       class: cls,
  //       style: style
  //     })
  //   }
  // }

  // // inherit directives
  // if (vnode.dirs) {
  //   if (__DEV__ && !isElementRoot(root)) {
  //     warn(
  //       `Runtime directive used on component with non-element root node. ` +
  //         `The directives will not function as intended.`
  //     )
  //   }
  //   // clone before mutating since the root may be a hoisted vnode
  //   root = cloneVNode(root)
  //   root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs
  // }
  // // inherit transition data
  // if (vnode.transition) {
  //   if (__DEV__ && !isElementRoot(root)) {
  //     warn(
  //       `Component inside <Transition> renders non-element root node ` +
  //         `that cannot be animated.`
  //     )
  //   }
  //   root.transition = vnode.transition
  // }

  // if (__DEV__ && setRoot) {
  //   setRoot(root)
  // } else {
  result = root
  // }

  setCurrentRenderingInstance(prev)

  return result
}
