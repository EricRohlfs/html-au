import { swapOptions, triggerOptions } from './auConstants.js';
import { auObserve } from './auObserver.js';
import { isAuElement } from './common.js';
import { getIncludeElement, getTargetEle } from './targetSelectorDSL.js';
import { auElementType, auMetaType, auSwapType } from './types.js';
import { CED, createElement } from './utils/index.js';
import { makeFormData } from './makeFormData.js';

const auPost = 'auPost'
const auGet = 'auGet'

const triggerKeys = Object.values(triggerOptions)

export function getAuMeta(ele: HTMLElement): auMetaType {

  const auMeta = {
    trigger: ele.getAttribute('au-trigger'),
    targetSelector: ele.getAttribute('au-target'),
    auGet: ele.getAttribute('au-get'),
    auPost: ele.getAttribute('au-post'),
    auInclude: ele.getAttribute('au-include'),
    auSwap: ele.getAttribute('au-swap') ?? 'none',
    verb: '',
    searchParams: undefined,
    preserveFocus: ele.getAttribute('au-preserve-focus') !== null,
    isThis: false,
    brains: [],
    // todo: better name, what CED? the ced to create based on the route
    ced: {
      tagName: '',
      attributes: {},
      properties: {}
    } as CED<HTMLElement>
  }

  if (auMeta.auGet !== null) {
    auMeta.verb = auGet
  } else if (auMeta.auPost !== null) {
    auMeta.verb = auPost
  }

  // todo: validate that au-get, au-post are mutually exclusive

  const routerParts = auMeta.auGet?.split('?') ?? auMeta.auPost?.split('?') ?? ['', '']
  auMeta.ced.tagName = routerParts[0]
  // figure out ced element name
  if (auMeta.ced.tagName === 'this') {
    auMeta.isThis = true
    auMeta.ced.tagName = ele.tagName
    auMeta.targetSelector = 'this'
  }

  // potential foot gun, guess a target when null
  if (auMeta.targetSelector === null) {
    // if no children search up the tree
    if (ele.children.length === 0) {
      auMeta.targetSelector = `closest ${auMeta.ced.tagName}`
    } else {
      auMeta.targetSelector = `document ${auMeta.ced.tagName}`
    }
    ele.setAttribute('au-target', auMeta.targetSelector)
    auMeta.brains.push('au-target was empty so one was added for you.')
  }

  // given <div au-get="hello-msg?msg=hello world" we want to use the parameters as attributes
  // this will be an important part of the convention
  auMeta.searchParams = new URLSearchParams(routerParts[1])
  return auMeta
}


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

function basicEventListener(ele: HTMLElement, cmd: string) {
  (ele as auElementType).auAbortController = new AbortController()
  // todo: think of a way to destroy the event listener when the time is right
  ele.addEventListener(cmd, (e) => {
    const auMeta = getAuMeta(ele)
    // add any querystring params from au-get or au-post
    // attributes are nice and allow for outer configuration like classes and such
    // but attributes do clutter up the dom if just needed as properties
    // if we only passed properties, then the user could have getters/setters that do set the attribute
    // but attributes are usually safer
    for (const [key, value] of auMeta.searchParams.entries()) {
      auMeta.ced.attributes[key] = value
    }

    //input auElement special use case where the input is basically the form so we can copy into get any mattaching verb searchParameter
    if (ele.tagName === 'INPUT') {
      // overwrite searchparam->attrbiute with the value of the input box
      if (auMeta.searchParams.get((ele as HTMLInputElement)?.name)) {
        auMeta.ced.attributes[(ele as HTMLInputElement)?.name] = (ele as HTMLInputElement)?.value
      }
    }

    // could have an overwrite situation when the searchParam and an existing attribute are the same.
    if (auMeta.isThis) {
      // copy existing attributes to new element
      for (const attr of ele.attributes) {
        auMeta.ced.attributes[attr.name] = attr.value
      }
    }

    const newEle = createElement<auElementType>(auMeta.ced)
    if (auMeta.verb === auPost) {
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
        throw new Error('Using attribute au-post without a property of body or model on the targe component. Either add body or model to the component, or use au-get.')
      }
    }

    newEle.auMeta = { ...auMeta } // add the metadata for debugging and other edge use cases like maybe they want to parse the au-post query params
    // the observer will decide if it needs to wire up as another auElement
    auObserve(newEle)

    const target = getTargetEle(ele, auMeta.targetSelector)
    // todo: maybe move the elements to a fragment, then cleanup async
    const toDispose = new DocumentFragment()
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

export function setupEventListener(ele: HTMLElement) {
  // prevent infinate loop or already processed elements
  if ((ele as auElementType).auState === 'processed') { return; }
  (ele as auElementType).auState = 'processed'
  //setupEventListener(ele)

  // todo: just get what you need
  const triggerData = getAuMeta(ele)

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(triggerData.trigger)) { return }
  basicEventListener(ele, triggerData.trigger)

  // todo: htmx supports a setTimeout option too.
}


