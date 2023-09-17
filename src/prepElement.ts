import { CED, createElement } from './utils/index.js';

// Options for the observer (which mutations to observe)
export const config = { attributes: true, subtree: true, childList: true };

/**
 * query known form element types and make new FormData out of them.
 */
function makeFormData(node: HTMLElement): FormData {
  const controls = []
  // todo:get all form controls
  const inputs = node.querySelectorAll(':scope input')
  controls.push(...inputs)// might not want to spread here, but quick and easy
  const fd = new FormData()
  controls.forEach(ctrol => {
    fd.set(ctrol.name, ctrol.value)
  })
  return fd;
}

const triggerOptions = ['click', 'input', 'change']

type booleanAttribute = true | false // really it exists or does not exist as an attribute

// more to come, just the ones currently supported
export type auAttributeTypes = {
  'au-post': string,
  'au-get': string,
  'au-trigger': string,
  'au-include': string,
  'au-preserve-focus': booleanAttribute
}

const auAttributeList = ['au-post', 'au-get', 'au-trigger', 'au-include', 'au-preserve-focus']


function getAuMeta(ele: HTMLElement) {
  const auMeta = {
    trigger: ele.getAttribute('au-trigger'),
    targetSelector: ele.getAttribute('au-target'),
    auGet: ele.getAttribute('au-get'),
    auPost: ele.getAttribute('au-post'),
    verb: '',
    searchParams: undefined,
    preserveFocus: ele.getAttribute('au-preserve-focus') !== null,
    auInclude: ele.getAttribute('au-include'),
    isThis: false,
    ced: {
      tagName: '',
      attributes: {},
      properties: {}
    } as CED<HTMLElement>
  }

  if (auMeta.auGet !== null) {
    auMeta.verb = 'auGet'
  } else if (auMeta.auPost !== null) {
    auMeta.verb = 'auPost'
  }

  // todo: validate that au-get, au-post are mutually exclusive

  const routerParts = auMeta.auGet?.split('?') ?? auMeta.auPost?.split('?') ?? ['', '']
  auMeta.ced.tagName = routerParts[0]
  if (auMeta.ced.tagName === 'this') {
    auMeta.isThis = true
    auMeta.ced.tagName = ele.tagName
  }

  // given <div au-get="hello-msg?msg=hello world" we want to use the parameters as attributes
  // this will be an important part of the convention
  auMeta.searchParams = new URLSearchParams(routerParts[1])

  return auMeta
}

/**
 * todo: au-post with built in au-post='div?is=hello-world'
 */
export function prepElement(ele: HTMLElement) {
  // prevent infinate loop
  if (ele.getAttribute('au-state') === 'processed') { return; }
  ele.setAttribute('au-state', 'processed')
  const auMeta = getAuMeta(ele)

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerOptions.includes(auMeta.trigger)) { return }

  // the magic starts here
  ele.addEventListener(auMeta.trigger, (e) => {

    // add any querystring params from au-get or au-post
    // attributes are nice and allow for outer configuration like classes and such
    // but attributes do clutter up the dom if just needed as properties
    // if we only passed properties, then the user could have getters/setters that do set the attribute
    // but attributes are usually safer
    for (const [key, value] of auMeta.searchParams.entries()) {
      auMeta.ced.attributes[key] = value
    }

    //special input example with mattaching verb searchParam
    // todo: potentially expand this to multiple input types
    //       for textarea may need to do that as post or do all as a post
    if(ele.tagName === 'INPUT'){
      // @ts-ignore
      if(auMeta.searchParams.get(ele?.name)){ 
        // @ts-ignore 
        auMeta.ced.attributes[ele?.name] = ele.value
      }
    }

    // could have an overwrite situation when the searchParam and an existing attribute are the same.
    if (auMeta.isThis) {
      // copy existing attributes to new element
      for (const attr of ele.attributes) {
        auMeta.ced.attributes[attr.name] = attr.value
      }
    }
    // in case the attribute was copied earlier
    delete auMeta.ced.attributes['au-state']


    // au-include functionality
    // in http post has a body, get doesn't
    // use case: button has the au attributes, but we want the whole form
    if (ele.hasAttribute('au-post')) {
      let formDataEle = ele // element to extract the form data from
      if (auMeta.auInclude?.startsWith('closest')) {
        // given 'closest div' selectorText = 'div'
        const selectorText = auMeta.auInclude.replace('closest ', '')
        formDataEle = ele.closest(selectorText)
      }
      // todo: non-closest use case
      auMeta.ced.properties['body'] = makeFormData(formDataEle)
    }

    const newEle = createElement<HTMLElement>(auMeta.ced)
    // @ts-ignore
    newEle.auMeta = { ...auMeta } // add the metadata for debugging and other edge use cases like maybe they want to parse the au-post query params
    auObserver.observe(newEle, config)
    if (auMeta.isThis || auMeta.targetSelector === 'this') {
      // in the form case of input, the target will be the input and not the form
      // thought about if its the same type update attributes and body and call connectedCallback, but that might introduce unwanted complexity and can't think of the value for most situations.
      // the main situation would be interoperability where external compnent has handle on an element and we don't want to destroy that ele and loose the handle.
      // (e.target as HTMLElement).replaceWith(newEle)
      ele.replaceWith(newEle);
      // true up to do best effort to reset focus
      // assumes name element is used on the form
      // for bubbled event actions like form with event trigger of 'input'
      if (auMeta.preserveFocus) {
        const setFocusName = (e.target as HTMLElement).getAttribute('name')
        const focusEle = newEle.querySelector<HTMLInputElement>(`:scope [name=${setFocusName}]`)
        focusEle.focus()
        focusEle.setSelectionRange(focusEle.value.length, focusEle.value.length);
      }
      return
    }
    if (auMeta.targetSelector === 'next') {
      ele.nextElementSibling.replaceWith(newEle)

      return
    }
    const futureTarget = document.querySelector(auMeta.targetSelector)
    futureTarget?.replaceWith(newEle)
  })
}

function recurseNodes(node: HTMLElement) {
  if (node.nodeType === 1 || node.nodeType === 11) {
    console.log(node?.tagName)
    node.childNodes.forEach(child => recurseNodes(child as HTMLHtmlElement))
    const isAu = Array.from(node.attributes).find(attr => attr.name.startsWith('au-'))
    if (!isAu) { return }
    prepElement(node as unknown as HTMLElement)
  }}

  // Callback function to execute when mutations are observed
  export const callback = (mutationList: MutationRecord[], observer) => {
    for (const mutation of mutationList) {
      if (mutation.target?.nodeType === 1 || mutation.target?.nodeType === 11) {
        recurseNodes(mutation.target as HTMLElement)
      }
      mutation.addedNodes.forEach((node: HTMLElement) => {
        console.log(node?.tagName)
        if (node.nodeType === 1 || node.nodeType === 11) {
          mutation.target.childNodes.forEach(child => {
            recurseNodes(child as HTMLElement)
          })
        }

      })
    }
  };

  export const auObserver = new MutationObserver(callback);

