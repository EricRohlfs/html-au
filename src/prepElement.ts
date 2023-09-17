import { createElement } from './utils/index.js';

// Options for the observer (which mutations to observe)
export const config = { attributes: true, subtree: true, childList: true };

function makeFormData(node: HTMLElement):FormData {
  const controls = []
  // todo:get all form controls
  const inputs = node.querySelectorAll(':scope input')
  controls.push(...inputs)// might not want to spread here, but quick and easy
  const fd = new FormData()
  controls.forEach(ctrol=>{
    fd.set(ctrol.name, ctrol.value)
  })
  return fd;
}

export function prepElement(node: HTMLElement) {
  const target = node
  if (target.getAttribute('au-state') === 'processed') { return; }
  target.setAttribute('au-state', 'processed')
  const trigger = target.getAttribute('au-trigger')
  const auTargetSelector = target.getAttribute('au-target')
  const auGet = target.getAttribute('au-get')
  const auPost = target.getAttribute('au-post')
  const parts = auGet?.split('?') ?? auPost?.split('?') ?? ['','']
  const tagName = parts[0]
  const sp = new URLSearchParams(parts[1])

  target.addEventListener(trigger, (e) => {
    const attributes = {}
    for (const [key, value] of sp.entries()) {
      attributes[key] = value
    }

    let properties = {}
    let fdNode = node;
    if(target.hasAttribute('au-post')){
      const auInclude = node.getAttribute('au-include')
      if(auInclude?.startsWith('closest')){
        const s1 = auInclude.replace('closest ','')
        fdNode = node.closest(s1)
      }
      properties['body'] = makeFormData(fdNode)
    }

    //const attrs = Object.entries(x)
    const newEle = createElement<HTMLElement>({
      tagName: tagName,
      // @ts-ignore
      attributes,
      properties
    })
   
    xjObserver.observe(newEle, config)
    if(auTargetSelector === 'this'){
      // we could get fancy and if it's the same element, just update the attributes again, but then we would need reactive attributes so no
      (e.target as HTMLElement).replaceWith(newEle)
    }
    const futureTarget = document.querySelector(auTargetSelector)
    futureTarget?.replaceWith(newEle)
  })
}

// Callback function to execute when mutations are observed
export const callback = (mutationList: MutationRecord[], observer) => {
  for (const mutation of mutationList) {
    if (mutation.target?.nodeType === 1 || mutation.target?.nodeType === 11) {
      // @ts-ignore
      console.log(mutation.target?.tagName)
      // @ts-ignore
      const isAu = Array.from(mutation.target?.attributes).find(attr=> attr?.name?.startsWith('au-'))
      if(isAu){
        prepElement(mutation.target as unknown as HTMLElement)
      }
    }
    mutation.addedNodes.forEach((node: HTMLElement) => {
      console.log(node?.tagName)
      if (node.nodeType === 1 || node.nodeType === 11) {
        const isAu = Array.from(node.attributes).find(attr=> attr.name.startsWith('au-'))
        if(!isAu){return}
        prepElement(node as unknown as HTMLElement)
      }
    })
  }
};

export const xjObserver = new MutationObserver(callback);

