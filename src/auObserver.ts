import { isAuElement } from './common.js';
import { auConfigType } from './types.js';

function recurseNodes(node: HTMLElement, auConfig:auConfigType) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    // console.log(node?.tagName)
    node.childNodes.forEach(child => recurseNodes(child as HTMLHtmlElement, auConfig))
    if (!isAuElement(node)) { return; }
      auConfig.eventListenerBuilder(node as unknown as HTMLElement, auConfig)
  }
}

const getCallback = (auConfig:auConfigType) => {
  // Callback function to execute when mutations are observed
  return (mutationList: MutationRecord[], observer) => {
    for (const mutation of mutationList) {
      if (mutation.target?.nodeType === 1 || mutation.target?.nodeType === 11) {
        recurseNodes(mutation.target as HTMLElement, auConfig)
      }
    }
  };
}

export function _auObserver(ele:HTMLElement, auConfig:auConfigType){
  if(!Object.isFrozen(auConfig)){
    // organize plugins once to improve performance
    auConfig._plugins = {
      atEnd:  auConfig.plugins.filter(p=>p.when === 'end')
    }
    Object.freeze(auConfig);
  }
  const callback = getCallback(auConfig);
  const auObserver = new MutationObserver(callback);
  auObserver.observe(ele, { attributes: true, subtree: true, childList: true })
}
