import { triggerOptions } from "src/auConstants";
import { basicEventListener, getAuMeta } from "./eventListenerDSL.js";
import { auElementType } from "src/types.js";

const triggerKeys = Object.values(triggerOptions)

export async function eventListenerBuilder(ele: HTMLElement, auConfig) {
  // prevent infinate loop or already processed elements
  if ((ele as auElementType).auState === 'processed') { return; }
  (ele as auElementType).auState = 'processed'

 const initialMeta = await getAuMeta(ele, auConfig);
  // add in any missing attributes or footgun attributes
  

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(initialMeta.trigger)) { return }
  await basicEventListener(ele, initialMeta.trigger, auConfig)

  // todo: htmx supports a setTimeout option too.
}