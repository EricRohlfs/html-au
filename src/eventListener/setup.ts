import { triggerOptions } from "src/auConstants";
import { getAuMeta, basicEventListener } from "./eventListenerDSL.js";
import { auElementType } from "src/types.js";

const triggerKeys = Object.values(triggerOptions)

export async function setupEventListener(ele: HTMLElement) {
  // prevent infinate loop or already processed elements
  if ((ele as auElementType).auState === 'processed') { return; }
  (ele as auElementType).auState = 'processed'
  //setupEventListener(ele)

  // todo: just get what you need
  const triggerData = getAuMeta(ele)

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(triggerData.trigger)) { return }
  await basicEventListener(ele, triggerData.trigger)

  // todo: htmx supports a setTimeout option too.
}