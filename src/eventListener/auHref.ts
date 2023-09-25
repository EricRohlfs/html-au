import { pluginData } from "src/types";



export async function auHref(plugIn: pluginData, browserWindow) {
  if (plugIn.auMeta.auHref === null) { return }
  let hash = plugIn.auMeta.auHref
  if(plugIn.auMeta.auHref === 'use au-ced'){
    // todo:might want to whitelist or sanitize the tagname
    hash = `#${plugIn.auMeta.auCed.tagName}?${plugIn.auMeta.auCed.qs}`
  }
  // todo: this could be more sophisticated and use window.history.pushState
  browserWindow.location.hash = hash
  return hash
}