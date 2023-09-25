import { swapOptions, triggerOptions } from "./auConstants.js";
import { eventListenerBuilder } from "./eventListener/addEventListener.js";
import { auHref } from "./plugins/auHref.js";
import { workflow } from "./eventListener/workflow.js";
import { getJson, postJson } from "./fetcher.js";
import { auConfigType, pluginDefinition } from "./types.js";
import { preserveFocus } from "./plugins/preserveFocus.js";

const auHrefPlugin = {
  name:'auHref',
  when:'end',
  func: auHref,
  args:{
    _window: window
  }
} as pluginDefinition

const preserveFocusPlugin = {
  name:'preserveFocus',
  when:'end',
  func: preserveFocus,
  args:undefined
}

// for now the assumption is that all responses will be json 
// you can send data to the server as FormData or json, but the response should be json
export const defaultConfig = {
  eventListenerBuilder,
  workflow:workflow,
  // note: serverPost can be postForm or postJson or a custom one
  serverPost:postJson,
  serverGet: getJson,
  defaultAttributes:{
    'au-swap': swapOptions.outeHTML,
    'au-trigger':triggerOptions.click,
  },
  auCed:{
    verb:'post'
  },
  plugins:[
    auHrefPlugin, preserveFocusPlugin
  ]
} as auConfigType
