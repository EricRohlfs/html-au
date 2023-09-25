import { auObserver } from '../auObserver.js';
import { isAuElement } from '../common.js';
import { getIncludeElement, getTargetEle, replaceAuTarget } from './parseAuTarget.js';
import { auCedEle, auElementType, pluginArgs, workflowArgs } from '../types.js';
import { createElement } from '../utils/index.js';
import { makeFormData } from './auFormData.js';
import { attachServerRespToCedEle, isAuServer } from './auServerDSL.js';
import { getAuMeta } from './auMeta.js';

/**
 * destroy the old event listener so we don't degrade performance
 * if issues, then turn this off.
 * todo: prove this is valuable
 */
async function removeOldEventListeners(ele: Element | DocumentFragment) {
  if (ele.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    Array.from(ele.children).forEach(childEle => { removeOldEventListeners(childEle) })
    return
  }

  if (isAuElement(ele as HTMLElement)) {
    (ele as auElementType).auAbortController.abort()
  }
  Array.from(ele.children).forEach(childEle => { removeOldEventListeners(childEle) })
}

export async function workflow(wf: workflowArgs) {
  const { ele, initialMeta, auConfig, e } = wf

  const auMeta = await getAuMeta(ele, initialMeta, auConfig)

  const cedEle = createElement<auCedEle>(auMeta.ced)


  const plugInArgs = {
    e,
    auMeta,
    ele,
    cedEle,
    auConfig
  } as pluginArgs

  // attachServerResp is mutually exclusive against update the component with form data
  await attachServerRespToCedEle(plugInArgs)

  // not sure this is any different for get or post
  if (auMeta.auCed.verb === 'post' && !isAuServer(auMeta)) {
    const formDataEle = getIncludeElement(ele, auMeta)
    // note: user gets to decide which format by what they put in their componet
    const fd = makeFormData(formDataEle)
    const hasBody = cedEle.hasOwnProperty('body')
    const hasModel = cedEle.hasOwnProperty('model')
    if (hasBody) {
      plugInArgs.cedEle.body = fd
    }
    if (hasModel) {
      plugInArgs.cedEle.model = Object.fromEntries(fd.entries())
    }
    if (!hasBody && !hasModel) {
      throw new Error('Using attribute au-ced="post ..." without a property of body or model on the target component. Either add body or model to the component, or remove the post hint.')
    }
  }

  cedEle.auMeta = { ...auMeta } // add the metadata for debugging and other edge use cases like maybe they want to parse the au-post query params
  // the observer will decide if it needs to wire up as another auElement
  // todo: validate this is still necessary.
  auObserver(cedEle, auConfig)

  const target = getTargetEle(ele, auMeta.targetSelector)
  plugInArgs.targetEle = target

  const toDispose = replaceAuTarget(plugInArgs)
  wf.auConfig._plugins.atEnd.forEach(pi => pi.func(plugInArgs, pi.args))

  removeOldEventListeners(toDispose)
  // todo: explore destroying other objects that are no longer needed
  return plugInArgs;
}
