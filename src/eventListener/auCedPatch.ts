import { auMetaType, auElementType } from "../types.js"
import { makeFormData } from "./auFormData.js"
import { getIncludeElement } from "./parseAuTarget.js"

/**
 * when au-ced="post" this is a special short circuit where we do not recreate the element.
 * we instead attach the form data then call connectedCallback.
 */
export const auCedPatchWorkflow = (wf, ele ,auMeta:auMetaType) =>{
  const includedEle = getIncludeElement(ele, auMeta) as auElementType
  // note: user gets to decide which format by what they put in their componet
  const fd = makeFormData(includedEle, ele)
  const hasBody = includedEle.hasOwnProperty('body')
  const hasModel = includedEle.hasOwnProperty('model')
  if (hasBody) {
    // includedEle.body = fd
    throw new Error('not yet implemented')
  }
  if (hasModel) {
    const entries = fd.entries();
    // update or patch the model
    for(const [key, val] of entries){
      includedEle.model[key] = val;
    }
  }
  if (!hasBody && !hasModel) {
    throw new Error('Using attribute au-ced="patch" with au-include="..." the au-include needs a property of body or model.')
  }

  //note: thought about clearing the children here, but decided to leave that control to the component
  includedEle.connectedCallback();
}
