export const version = __VERSION__

// API
export { parse, parseCache } from './parse'
export { compileTemplate } from './compileTemplate'
export { compileStyle, compileStyleAsync } from './compileStyle'
export { compileScript } from './compileScript'
export { rewriteDefault, rewriteDefaultAST } from './rewriteDefault'
export { resolveTypeElements, inferRuntimeType } from './script/resolveType'

// // TODO remove in 3.4
// export {
//   shouldTransform as shouldTransformRef,
//   transform as transformRef,
//   transformAST as transformRefAST
// } from '@docue/reactivity-transform'

// Utilities
export { parse as babelParse } from '@babel/parser'
import MagicString from 'magic-string'
export { MagicString }
// technically internal but we want it in @docue/repl, cast it as any to avoid
// relying on estree types
import { walk as _walk } from 'estree-walker'
export const walk = _walk as any
export {
  generateCodeFrame,
  walkIdentifiers,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty
} from '@docue/compiler-core'

// Internals for type resolution
export { invalidateTypeCache, registerTS } from './script/resolveType'

// Types
export type {
  SFCParseOptions,
  SFCParseResult,
  SFCDescriptor,
  SFCBlock,
  SFCTemplateBlock,
  SFCScriptBlock,
  SFCStyleBlock
} from './parse'
export type {
  TemplateCompiler,
  SFCTemplateCompileOptions,
  SFCTemplateCompileResults
} from './compileTemplate'
export type {
  SFCStyleCompileOptions,
  SFCAsyncStyleCompileOptions,
  SFCStyleCompileResults
} from './compileStyle'
export type { SFCScriptCompileOptions } from './compileScript'
export type { ScriptCompileContext } from './script/context'
export type {
  TypeResolveContext,
  SimpleTypeResolveContext
} from './script/resolveType'
export type {
  AssetURLOptions,
  AssetURLTagConfig
} from './template/transformAssetUrl'
export type {
  CompilerOptions,
  CompilerError,
  BindingMetadata
} from '@docue/compiler-core'
