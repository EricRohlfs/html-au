import { CED } from "./utils/index.js"

export type auSwapType = 'none'|'innerHTML'|'outerHTML' |'delete'

export type auMetaType = {
  trigger:string
  targetSelector: string|null
  server: string| null
  auGet: string|null
  auPost: string|null
  auSwap: string // auSwapType
  verb: string,
  searchParams: URLSearchParams,
  preserveFocus: boolean
  auInclude: string|null
  isThis: boolean,
  /** messages for decisions we make trying to be smart for the user */
  brains:Array<string>
  ced: CED<HTMLElement>
}

type booleanAttribute = true|false // really it exists or does not exist as an attribute

// more to come, just the ones currently supported
export type auAttributeTypes = {
  'au-post'?: string
  'au-get'?: string
  'au-trigger'?: string
  'au-include'?: string
  'au-swap'?: auSwapType
  'au-preserve-focus'?: booleanAttribute
  'au-server'?:string
}

export type auElementType = {
  auState:'processed'
  auAbortController: AbortController
  auMeta:auMetaType
  body?:FormData
  model?: any
  attributes:auAttributeTypes
} & HTMLElement


// todo: we could have a default loding component type here
// todo: we could have a default error error component for fetch errors. Or it could be handled in the user provided fetch functions 
export type auConfigType ={
  eventListenerBuilder: (ele:HTMLElement, auConfig:auConfigType)=>Promise<void>
  serverPost:(url:string, data: unknown | FormData)=>Promise<unknown>
  serverGet: (url:string)=>Promise<unknown>
}

