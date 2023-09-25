import { swapOptions, targetOptions } from "../auConstants.js";
import { auMetaType, pluginArgs } from "../types.js";


export function guessTheTargetSelector(ele, auMeta) {
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
}




/**
 * in relation to the element in which the event happened on
 * try to use same language for includes or target
 * au-target='div' document.querySelector('div')
 * au-target='next' // next sibbling
 * au-target='previous' // previous sibbling // but could just use parent
 * au-target='closest div' x.closest('div')
 * au-target='children div' //  x.querySelector(':scope div)
 * au-target='parent div' // x.parentElement.querySelector(':scope div')
 * au-target='parent2 div'
 * au-target='parent3 div'
 * au-target='parent4 div'
 * 
 */
export function getTargetEle(auElement: HTMLElement, cmd: string): HTMLElement {
  if (cmd === '' || cmd === undefined || cmd === null) {
    return;
  }
  // todo: add 'previous cssSelector' 
  if (cmd.startsWith('previous')) {
    throw Error("Previous selector is not yet implemented");
  }
  if (cmd.startsWith('closest')) {
    const selectorText = cmd.replace('closest ', '')
    return auElement.closest(selectorText)
  }
  if (cmd === targetOptions.next) {
    // todo: this should be a next sibling with css
    return auElement.nextElementSibling as HTMLElement
  }

  if (cmd === 'this') {
    return auElement
  }

  if (cmd.startsWith('document ')) {
    return document.querySelector(cmd.replace('document ', ''))
  }

  // not even sure this makes sense, usually clickable things don't have children, but here as a footgun anyway
  if (cmd.startsWith('scope ')) {
    // expected 'scope div span'
    return auElement.querySelector(`:${cmd}`)
  }

  return document.querySelector(cmd)

}

/** not sure this is idea, we might include it in the form but than might not mean it's the target to replace
*/
export function getIncludeElement(ele: HTMLElement, auMeta: auMetaType) {
  if (auMeta.auInclude?.length > 0) {
    return getTargetEle(ele, auMeta.auInclude)
  }
  return ele
}

export function replaceAuTarget(plugIn:pluginArgs){

  // need to play with this some more and get it working better
  let toDispose = new DocumentFragment();
  switch (plugIn.auMeta.auSwap) {
    case swapOptions.innerHTML:
      // could see if the inner has any auElements and remove the event listeners
      while (plugIn.targetEle.firstChild) {
        toDispose.appendChild(plugIn.targetEle.firstChild);
      }
      plugIn.targetEle.replaceChildren()
      plugIn.targetEle.append(plugIn.cedEle)
      break;
    case swapOptions.delete:
      toDispose.appendChild(plugIn.targetEle);
      break;
    default:
      // outerHTML
      // this is most likely the issue with some cases not appending the previous swapped
      plugIn.targetEle.replaceWith(plugIn.cedEle)
      toDispose.appendChild(plugIn.targetEle);
      break;
  }
  return toDispose
}