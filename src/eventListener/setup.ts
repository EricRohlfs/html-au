import { triggerOptions } from "src/auConstants";
import { basicEventListener } from "./eventListenerDSL.js";
import { auElementType } from "src/types.js";
import { auMetaPrep, getAuMeta } from "./auMeta.js";

const triggerKeys = Object.values(triggerOptions)

export async function eventListenerBuilder(ele: auElementType, auConfig) {
  // prevent infinate loop or already processed elements
  if (ele.auState === 'processed') { return; }
  ele.auState = 'processed'

 const initialMeta = await auMetaPrep(ele, auConfig);

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(initialMeta.trigger)) { return }
  await basicEventListener(ele, initialMeta.trigger, initialMeta, auConfig)

  // todo: htmx supports a setTimeout option too.
}