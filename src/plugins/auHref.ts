import { pluginArgs } from "../types.js";

export async function auHref(plugIn: Partial<pluginArgs>, args) {
  const auHref = plugIn.ele.getAttribute('au-href')
  if (auHref === null) { return null}
  let hash = auHref
  if(auHref === 'use au-ced'){
    // todo:might want to whitelist or sanitize the tagname
    hash = `#${plugIn.auMeta.auCed.tagName}?${plugIn.auMeta.auCed.qs}`
  }
  // todo: this could be more sophisticated and use window.history.pushState
  args._window.location.hash = hash
  return hash
}
