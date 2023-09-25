import { swapOptions } from '../auConstants.js';
import { auObserver } from '../auObserver.js';
import { isAuElement } from '../common.js';
import { getIncludeElement, getTargetEle } from '../auTargetSelector.js';
import { auCedEle, auConfigType, auElementType, auMetaType, pluginData } from '../types.js';
import { createElement } from '../utils/index.js';
import { makeFormData } from '../auFormData.js';
import { attachServerResp, isAuServer } from '../auServerDSL.js';
import { getAuMeta } from './auMeta.js';
import { auHref } from './auHref.js';

/**
 * destroy the old event listener so we don't degrade performance
 * if issues, then turn this off.
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

export async function basicEventListener(ele: auElementType, cmd: string, initialMeta:Partial<auMetaType>, auConfig: auConfigType) {
  ele.auAbortController = new AbortController()
  // todo: think of a way to destroy the event listener when the time is right
  ele.addEventListener(cmd, async (e) => {
    const auMeta = await getAuMeta(ele, initialMeta, auConfig)
    const cedEle = createElement<auCedEle>(auMeta.ced)

    const plugIn = {
      auMeta,
      ele,
      cedEle,
      auConfig
    } as pluginData

    const isServer = isAuServer(auMeta);
    // attachServerResp is mutually exclusive against update the component with form data
    //await attachServerResp(ele, auMeta, cedEle, auConfig)
    await attachServerResp(plugIn)

    // not sure this is any different for get or post
    if (auMeta.auCed.verb === 'post' && !isServer) {
      const formDataEle = getIncludeElement(ele, auMeta)
      // note: user gets to decide which format by what they put in their componet
      const fd = makeFormData(formDataEle)
      const hasBody = cedEle.hasOwnProperty('body')
      const hasModel = cedEle.hasOwnProperty('model')
      if (hasBody) {
        plugIn.cedEle.body = fd
      }
      if (hasModel) {
        plugIn.cedEle.model = Object.fromEntries(fd.entries())
      }
      if (!hasBody && !hasModel) {
        throw new Error('Using attribute au-post without a property of body or model on the target component. Either add body or model to the component, or use au-get.')
      }
    }

    cedEle.auMeta = { ...auMeta } // add the metadata for debugging and other edge use cases like maybe they want to parse the au-post query params
    // the observer will decide if it needs to wire up as another auElement
    auObserver(cedEle, auConfig)

    const target = getTargetEle(ele, auMeta.targetSelector)
    plugIn.targetEle = target

    // need to play with this some more and get it working better
    let toDispose = new DocumentFragment();
    switch (auMeta.auSwap) {
      case swapOptions.innerHTML:
        // could see if the inner has any auElements and remove the event listeners
        while (target.firstChild) {
          toDispose.appendChild(target.firstChild);
        }
        target.replaceChildren()
        target.append(cedEle)
        break;
      case swapOptions.delete:
        toDispose.appendChild(target);
        break;
      default:
        // outerHTML
        // this is most likely the issue with some cases not appending the previous swapped
        target.replaceWith(cedEle)
        toDispose.appendChild(target);
        break;
    }

    /** useful where a form is re-rendering and we want to keep the focus. Ideally this wouldn't need to happen, but it's here. */
    if (auMeta.preserveFocus) {
      const setFocusName = (e.target as HTMLElement).getAttribute('name')
      const focusEle = cedEle.querySelector<HTMLInputElement>(`:scope [name=${setFocusName}]`)
      focusEle.focus()
      focusEle.setSelectionRange(focusEle.value.length, focusEle.value.length);
    }

    auHref(plugIn, window)

    removeOldEventListeners(toDispose)
  }, { signal: ele.auAbortController.signal })
}




