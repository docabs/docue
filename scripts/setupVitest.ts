import { vi, type SpyInstance } from 'vitest'

let warn: SpyInstance
const asserted: Set<string> = new Set()
