export type CompilerCompatConfig = Partial<
  Record<CompilerDeprecationTypes, boolean | 'suppress-warning'>
> & {
  MODE?: 2 | 3
}

export interface CompilerCompatOptions {
  compatConfig?: CompilerCompatConfig
}

export const enum CompilerDeprecationTypes {}
