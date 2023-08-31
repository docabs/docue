import { makeMap } from '../src'

test('shared: makeMap', () => {
  expect(makeMap(`foo`)('foo')).toBe(true)
  expect(makeMap(`foo,b`)('b')).toBe(true)
  expect(makeMap(`Foo,b`)('foo')).toBe(false)
  expect(makeMap(`Foo,b`, true)('foo')).toBe(false)
})
