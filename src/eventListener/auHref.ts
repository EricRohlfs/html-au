import { pluginData } from "src/types";

export async function auHref(plugIn: pluginData) {
  if (plugIn.auMeta.auHref === null) { return }

  if(plugIn.auMeta.auHref === 'use au-ced'){
    // todo:might want to whitelist or sanitize the tagname
    window.location.hash = `#${plugIn.auMeta.auCed.tagName}?${plugIn.auMeta.auCed.qs}`
    return
  }
  // todo: this could be more sophisticated and use window.history.pushState
  window.location.hash = plugIn.auMeta.auHref

}