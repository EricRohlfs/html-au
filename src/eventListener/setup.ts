import { triggerOptions } from "src/auConstants";
import { basicEventListener } from "./eventListenerDSL.js";
import { auElementType } from "src/types.js";

const triggerKeys = Object.values(triggerOptions)

export async function eventListenerBuilder(ele: HTMLElement, auConfig) {
  // prevent infinate loop or already processed elements
  if ((ele as auElementType).auState === 'processed') { return; }
  (ele as auElementType).auState = 'processed'

  const trigger = ele.getAttribute('au-trigger')

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(trigger)) { return }
  await basicEventListener(ele, trigger, auConfig)

  // todo: htmx supports a setTimeout option too.
}