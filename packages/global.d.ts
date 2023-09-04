/// <reference types="vite/client" />

// Global compile-time constants
declare var __DEV__: boolean
declare var __TEST__: boolean

// for tests
declare namespace jest {
  interface Matchers<R, T> {
    toHaveBeenWarned(): R
    toHaveBeenWarnedLast(): R
    toHaveBeenWarnedTimes(n: number): R
  }
}
