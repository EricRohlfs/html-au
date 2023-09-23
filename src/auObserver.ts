import { isAuElement } from './common.js';
import {setupEventListener} from './eventListener/setup.js'

// Options for the observer (which mutations to observe)
// Note: only need attributes if element add them after they are created
// todo: test the use case where we have an element it's not au, then we add them after the element is on the DOM
export const config = { attributes: true, subtree: true, childList: true };

function recurseNodes(node: HTMLElement) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    // console.log(node?.tagName)
    node.childNodes.forEach(child => recurseNodes(child as HTMLHtmlElement))
    if (!isAuElement(node)) { return }
    setupEventListener(node as unknown as HTMLElement)
  }}

  // Callback function to execute when mutations are observed
  export const callback = (mutationList: MutationRecord[], observer) => {
    for (const mutation of mutationList) {
      if (mutation.target?.nodeType === 1 || mutation.target?.nodeType === 11) {
        recurseNodes(mutation.target as HTMLElement)
      }
    }
  };

  export function auObserve(ele){
    const auObserver = new MutationObserver(callback);
    auObserver.observe(ele, config)
  }


