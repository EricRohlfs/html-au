
import { pluginArgs } from "../types.js";



//todo: use a better strategy instead of adding to the end
// todo: don't do it if it is a select element
/** useful where a form is re-rendering and we want to keep the focus. Ideally this wouldn't need to happen, but it's here. */
export function preserveFocus(plugin: pluginArgs, args) {
  const preserveFocus = plugin.ele.getAttribute('au-preserve-focus') !== null;
  if (preserveFocus) {
    const setFocusName = (plugin.e.target as HTMLElement).getAttribute('name')
    let focusEle = plugin.cedEle.querySelector<HTMLInputElement>(`:scope [name=${setFocusName}]`)
    if(focusEle === null){ 
      // todo: if a button without a name, then we need a better strategy before bailing out.
      const attrs = ['type','class']
      // use a control structure we can break out of
      attrs.forEach(a =>{
        const setFocusName1 = (plugin.e.target as HTMLElement).getAttribute(a)
        const focusEle1 = plugin.cedEle.querySelectorAll<HTMLInputElement>(`:scope [${a}=${setFocusName1}]`)
        if(focusEle1.length === 1){
          // our query only has one match, so this should be it
          focusEle = focusEle1[0]
        }
      })
      return}
    focusEle.focus()
    const fLength = focusEle.value.length
    if(focusEle.setSelectionRange){
      focusEle.setSelectionRange(fLength,fLength);
    }

    // since this is a difficult value to test, returning a value only to test
    return fLength;
  }
}
