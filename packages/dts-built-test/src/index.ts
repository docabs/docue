import { defineComponent } from 'docue'

const _CustomPropsNotErased = defineComponent({
  props: {},
  setup() {}
})

// #8376
export const CustomPropsNotErased =
  _CustomPropsNotErased as typeof _CustomPropsNotErased & {
    foo: string
  }