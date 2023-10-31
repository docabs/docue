import { escapeHtml, toDisplayString } from '@docue/shared'

export function ssrInterpolate(value: unknown): string {
  return escapeHtml(toDisplayString(value))
}
