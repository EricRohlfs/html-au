import { swapOptions } from '../auConstants.js';
import { auObserver } from '../auObserver.js';
import { isAuElement } from '../common.js';
import { getIncludeElement, getTargetEle } from '../auTargetSelector.js';
import { auConfigType, auElementType } from '../types.js';
import { createElement } from '../utils/index.js';
import { makeFormData } from '../auFormData.js';
import { attachServerResp, isAuServer } from '../auServerDSL.js';
import { getAuMeta } from './auMeta.js';

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

export async function basicEventListener(ele: HTMLElement, cmd: string, auConfig: auConfigType) {
  (ele as auElementType).auAbortController = new AbortController()
  // todo: think of a way to destroy the event listener when the time is right
  ele.addEventListener(cmd, async (e) => {
    const auMeta = await getAuMeta(ele, auConfig)
    // add any querystring params from au-get or au-post
    // attributes are nice and allow for outer configuration like classes and such
    // but attributes do clutter up the dom if just needed as properties
    // if we only passed properties, then the user could have getters/setters that do set the attribute
    // but attributes are usually safer
    // BUT picking and choosing interfears with the whole get/post form data serialization thing.
    // technically all form values should be paramertized, but what about a big text field?
    for (const [key, value] of auMeta.auCed.qs.entries()) {
      auMeta.ced.attributes[key] = value
    }

    //input auElement special use case where the input is basically the form so we can copy into get any mattaching verb searchParameter
    if (ele.tagName === 'INPUT') {
      // overwrite searchparam->attrbiute with the value of the input box
      if (auMeta.auCed.qs.get((ele as HTMLInputElement)?.name)) {
        auMeta.ced.attributes[(ele as HTMLInputElement)?.name] = (ele as HTMLInputElement)?.value
      }
    }

    // todo:revisit this use case
    // could have an overwrite situation when the searchParam and an existing attribute are the same.
    if (auMeta.isThis) {
      // copy existing attributes to new element
      for (const attr of ele.attributes) {
        auMeta.ced.attributes[attr.name] = attr.value
      }
    }

    const newEle = createElement<auElementType>(auMeta.ced)
    const isServer = isAuServer(auMeta);
    // attachServerResp is mutually exclusive against update the component with form data
    await attachServerResp(ele, auMeta, newEle, auConfig)

    // not sure this is any different for get or post
    if (auMeta.auCed.verb === 'post' && !isServer) {
      const formDataEle = getIncludeElement(ele, auMeta)
      // note: user gets to decide which format by what they put in their componet
      const fd = makeFormData(formDataEle)
      const hasBody = newEle.hasOwnProperty('body')
      const hasModel = newEle.hasOwnProperty('model')
      if (hasBody) {
        newEle.body = fd
      }
      if (hasModel) {
        newEle.model = Object.fromEntries(fd.entries())
      }
      if (!hasBody && !hasModel) {
        throw new Error('Using attribute au-post without a property of body or model on the target component. Either add body or model to the component, or use au-get.')
      }
    }

    newEle.auMeta = { ...auMeta } // add the metadata for debugging and other edge use cases like maybe they want to parse the au-post query params
    // the observer will decide if it needs to wire up as another auElement
    auObserver(newEle, auConfig)

    const target = getTargetEle(ele, auMeta.targetSelector)

    // need to play with this some more and get it working better
    let toDispose;
    if (auMeta.attachSwapped) {
      newEle.auPreviousTree = new DocumentFragment()
      toDispose = newEle.auPreviousTree;
    } else {
      toDispose = new DocumentFragment()
    }
    switch (auMeta.auSwap) {
      case swapOptions.innerHTML:
        // could see if the inner has any auElements and remove the event listeners
        while (target.firstChild) {
          toDispose.appendChild(target.firstChild);
        }
        target.replaceChildren()
        target.append(newEle)
        break;
      case swapOptions.delete:
        toDispose.appendChild(target);
        break;
      default:
        // outerHTML
        // this is most likely the issue with some cases not appending the previous swapped
        target.replaceWith(newEle)
        toDispose.appendChild(target);
        break;
    }

    /** useful where a form is re-rendering and we want to keep the focus. Ideally this wouldn't need to happen, but it's here. */
    if (auMeta.preserveFocus) {
      const setFocusName = (e.target as HTMLElement).getAttribute('name')
      const focusEle = newEle.querySelector<HTMLInputElement>(`:scope [name=${setFocusName}]`)
      focusEle.focus()
      focusEle.setSelectionRange(focusEle.value.length, focusEle.value.length);
    }

    removeOldEventListeners(toDispose)
  }, { signal: (ele as auElementType).auAbortController.signal })
}




