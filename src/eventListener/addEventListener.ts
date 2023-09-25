import { triggerOptions } from "../../src/auConstants.js";
import { workflow } from "./workflow.js";
import { auConfigType, auElementType, eventSetupArgs, workflowArgs } from "../../src/types.js";
import { auMetaPrep } from "./auMeta.js";

const triggerKeys = Object.values(triggerOptions)

export async function basicEventListener(eventSetup: eventSetupArgs) {
  eventSetup.ele.auAbortController = new AbortController()

  eventSetup.ele.addEventListener(eventSetup.initialMeta.trigger, async (e) => {
    (eventSetup as workflowArgs).e = e;
    if(eventSetup.auConfig.workflow){
      await eventSetup.auConfig.workflow(eventSetup as workflowArgs)
    }else{
      // easier tracing and debugging, but allows for overriding
      workflow(eventSetup as workflowArgs)
    }
    
  }, { signal: eventSetup.ele.auAbortController.signal })
}


export async function eventListenerBuilder(ele: auElementType, auConfig:auConfigType) {
  // prevent infinate loop or already processed elements
  if (ele.auState === 'processed') { return; }
  ele.auState = 'processed'

  const initialMeta = await auMetaPrep(ele, auConfig);
  const eventSetupArgs = {
    ele,
    auConfig,
    initialMeta
  }

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(initialMeta.trigger)) { return }
  await basicEventListener(eventSetupArgs)

  // todo: htmx supports a setTimeout option too.
}