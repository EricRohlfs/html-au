
import { pluginArgs } from "../types.js";

/** useful where a form is re-rendering and we want to keep the focus. Ideally this wouldn't need to happen, but it's here. */
export function preserveFocus(plugin: pluginArgs, args) {
  const preserveFocus = plugin.ele.getAttribute('au-preserve-focus') !== null;
  if (preserveFocus) {
    const setFocusName = (plugin.e.target as HTMLElement).getAttribute('name')
    const focusEle = plugin.cedEle.querySelector<HTMLInputElement>(`:scope [name=${setFocusName}]`)
    focusEle.focus()
    const fLength = focusEle.value.length
    focusEle.setSelectionRange(fLength,fLength);
    // since this is a difficult value to test, returning a value only to test
    return fLength;
  }
}
