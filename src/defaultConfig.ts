import { swapOptions, triggerOptions } from "./auConstants.js";
import { eventListenerBuilder } from "./eventListener/setup.js";
import { getJson, postJson } from "./fetcher.js";
import { auConfigType } from "./types.js";

// for now the assumption is that all responses will be json 
// you can send data to the server as FormData or json, but the response should be json
export const defaultConfig = {
  eventListenerBuilder,
  // note: this could be postForm or postJson
  serverPost:postJson,
  serverGet: getJson,
  defaultAttributes:{
    'au-swap': swapOptions.outeHTML,
    'au-trigger':triggerOptions.click,
  }
} as auConfigType