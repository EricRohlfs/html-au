import { CED } from "./utils/index.js"


export type auSwapType = 'none' | 'innerHTML' | 'outerHTML' | 'delete'

export type auMetaType = {
  trigger: string
  targetSelector: string | null
  server: string | null
  /**
   * note: there are subtle differences between auCed and ced.
   *  The auCED is the attribute that is parsed into an object then later becomes the CED
   *  */
  auCed: { raw: string, verb: string, tagName: string, qs: URLSearchParams }
  auSwap: string // auSwapType
  auInclude: string | null
  isThis: boolean,
  /** messages for decisions we make trying to be smart for the user */
  brains: Array<string>
  ced: CED<HTMLElement>
}

type booleanAttribute = true | false // really it exists or does not exist as an attribute

// more to come, just the ones currently supported
export type auAttributeTypes = {
  'au-cmd'?: string
  'au-trigger'?: string
  'au-include'?: string
  'au-swap'?: auSwapType
  'au-href'?: string
  'au-preserve-focus'?: booleanAttribute
  'au-attach-swapped'?: booleanAttribute
  'au-server'?: string
}

export type auElementType = {
  auState: 'processed'
  auAbortController: AbortController
  auMeta: auMetaType
  body?: FormData
  model?: any
  attributes: auAttributeTypes
  // auPreviousTree: DocumentFragment
  connectedCallback?:()=>void
} & HTMLElement


export type auCedEle = HTMLElement & {
  body?: unknown
  model?: unknown
  auMeta?: auMetaType
}

export type auConfigType = {
  eventListenerBuilder: (ele: HTMLElement, auConfig: auConfigType) => Promise<void>
  workflow?: (wf: workflowArgs) => Promise<pluginArgs>
  serverPost: (url: string, data: unknown | FormData, plugIn: pluginArgs) => Promise<unknown>
  serverGet: (url: string, plugIn: pluginArgs) => Promise<unknown>
  defaultAttributes: {
    'au-swap': string
    'au-trigger': string
  }
  auCed: {
    verb: 'post' | 'get' | 'patch'
  },
  auInclude:{
    verb: 'post'|'get'
  }
  plugins: Array<pluginDefinition>
  _plugins: {
    atEnd: Array<pluginDefinition>
  }
}

/**
 * Everything a plug-in would need to do whatever it needed to do.
 */
export type pluginArgs = {
  e: Event
  auMeta: auMetaType
  ele: auElementType
  targetEle?: HTMLElement
  cedEle?: auCedEle
  auConfig: auConfigType
}

export type eventSetupArgs = {
  ele: auElementType,
  // cmd: string,
  initialMeta: Partial<auMetaType>,
  auConfig: auConfigType
}

export type workflowArgs = eventSetupArgs & {
  e: Event
}

/**
 * todo: for when we could support better ordering like
 * after somePluginName
 */
export type pluginDefinition = {
  name: string
  when: string
  func: (pi: pluginArgs, args: any) => Promise<any>
  args: any
}