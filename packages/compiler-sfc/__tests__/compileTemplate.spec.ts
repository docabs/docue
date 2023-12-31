import {
  compileTemplate,
  SFCTemplateCompileOptions
} from '../src/compileTemplate'
import { parse, SFCTemplateBlock } from '../src/parse'

function compile(opts: Omit<SFCTemplateCompileOptions, 'id'>) {
  return compileTemplate({
    ...opts,
    id: ''
  })
}

test('should work', () => {
  const source = `<div><p>{{ render }}</p></div>`

  const result = compile({ filename: 'example.docue', source })

  expect(result.errors.length).toBe(0)
  expect(result.source).toBe(source)
  // should expose render fn
  expect(result.code).toMatch(`export function render(`)
})

// #6807
test('should work with style comment', () => {
  const source = `
  <div style="
    /* nothing */
    width: 300px;
    height: 100px/* nothing */
    ">{{ render }}</div>
  `

  const result = compile({ filename: 'example.docue', source })
  expect(result.errors.length).toBe(0)
  expect(result.source).toBe(source)
  expect(result.code).toMatch(`{"width":"300px","height":"100px"}`)
})

test('preprocess pug', () => {
  const template = parse(
    `
<template lang="pug">
body
  h1 Pug Examples
  div.container
    p Cool Pug example!
</template>
`,
    { filename: 'example.docue', sourceMap: true }
  ).descriptor.template as SFCTemplateBlock

  const result = compile({
    filename: 'example.docue',
    source: template.content,
    preprocessLang: template.lang
  })

  expect(result.errors.length).toBe(0)
})

test('warn missing preprocessor', () => {
  const template = parse(`<template lang="unknownLang">hi</template>\n`, {
    filename: 'example.docue',
    sourceMap: true
  }).descriptor.template as SFCTemplateBlock

  const result = compile({
    filename: 'example.docue',
    source: template.content,
    preprocessLang: template.lang
  })

  expect(result.errors.length).toBe(1)
})

test('transform asset url options', () => {
  const input = { source: `<foo bar="~baz"/>`, filename: 'example.docue' }
  // Object option
  const { code: code1 } = compile({
    ...input,
    transformAssetUrls: {
      tags: { foo: ['bar'] }
    }
  })
  expect(code1).toMatch(`import _imports_0 from 'baz'\n`)

  // legacy object option (direct tags config)
  const { code: code2 } = compile({
    ...input,
    transformAssetUrls: {
      foo: ['bar']
    }
  })
  expect(code2).toMatch(`import _imports_0 from 'baz'\n`)

  // false option
  const { code: code3 } = compile({
    ...input,
    transformAssetUrls: false
  })
  expect(code3).not.toMatch(`import _imports_0 from 'baz'\n`)
})

test('source map', () => {
  const template = parse(
    `
<template>
  <div><p>{{ render }}</p></div>
</template>
`,
    { filename: 'example.docue', sourceMap: true }
  ).descriptor.template as SFCTemplateBlock

  const result = compile({
    filename: 'example.docue',
    source: template.content
  })

  expect(result.map).toMatchSnapshot()
})

test('template errors', () => {
  const result = compile({
    filename: 'example.docue',
    source: `<div :foo
      :bar="a[" v-model="baz"/>`
  })
  expect(result.errors).toMatchSnapshot()
})

test('preprocessor errors', () => {
  const template = parse(
    `
<template lang="pug">
  div(class='class)
</template>
`,
    { filename: 'example.docue', sourceMap: true }
  ).descriptor.template as SFCTemplateBlock

  const result = compile({
    filename: 'example.docue',
    source: template.content,
    preprocessLang: template.lang
  })

  expect(result.errors.length).toBe(1)
  const message = result.errors[0].toString()
  expect(message).toMatch(`Error: example.docue:3:1`)
  expect(message).toMatch(
    `The end of the string reached with no closing bracket ) found.`
  )
})

// #3447
test('should generate the correct imports expression', () => {
  const { code } = compile({
    filename: 'example.docue',
    source: `
      <img src="./foo.svg"/>
      <Comp>
        <img src="./bar.svg"/>
      </Comp>
    `,
    ssr: true
  })
  expect(code).toMatch(`_ssrRenderAttr(\"src\", _imports_1)`)
  expect(code).toMatch(`_createVNode(\"img\", { src: _imports_1 })`)
})

// #3874
test('should not hoist srcset URLs in SSR mode', () => {
  const { code } = compile({
    filename: 'example.docue',
    source: `
    <picture>
      <source srcset="./img/foo.svg"/>
      <img src="./img/foo.svg"/>
    </picture>
    <router-link>
      <picture>
        <source srcset="./img/bar.svg"/>
        <img src="./img/bar.svg"/>
      </picture>
    </router-link>
    `,
    ssr: true
  })
  expect(code).toMatchSnapshot()
})

// #6742
test('dynamic v-on + static v-on should merged', () => {
  const source = `<input @blur="onBlur" @[validateEvent]="onValidateEvent">`

  const result = compile({ filename: 'example.docue', source })

  expect(result.code).toMatchSnapshot()
})
