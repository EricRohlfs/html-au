import { objectToQueryParams } from "./common"
import { getJson, postJson } from "./fetcher"
import { makeFormData } from "./auFormData"
import { getIncludeElement } from "./auTargetSelector"
import { auElementType, auMetaType } from "./types"

//todo:need to test this function
function toFormData(o) {
  // @ts-ignore
  return Object.entries(o).reduce((d,e) => (d.append(...e),d), new FormData())
}


const errorMsg = (newEle:auElementType)=>{return `Developer, you are using the au-post attribute without a property of body or model for component named ${newEle?.tagName}. Either add body or model to the component, or use au-get.`}

export const isAuServer = (auMeta) => { return auMeta.server?.length > 0 }

/**
 * <div au-server="post ./users"
 * 
 * todo: the following are not implemented yet, might be nice
 * <div au-server="post ./users/${model.userid}"
 * <div au-server="post as json ./users"
 * <div au-server="post as formdata ./users"
 * 
 */
export async function attachServerResp(ele:HTMLElement, auMeta:auMetaType, newEle: auElementType, auConfig):Promise<void> {
  if (auMeta.server) {
    const [verb, url] = auMeta.server.split(' ')

    if (verb === 'post') {
      const formDataEle = getIncludeElement(ele, auMeta)
      const fd1 = makeFormData(formDataEle)
      const model = Object.fromEntries(fd1.entries())
      const json = await auConfig.serverPost(url, model)
      const merged = {...model, ...json }
      const hasBody = newEle.hasOwnProperty('body')
      const hasModel = newEle.hasOwnProperty('model')
      if (hasBody) {
        // since we merged, shouldn't have duplicates
        // todo: test this out and uncomment
        // newEle.body = toFormData(merged)
      }
      if (hasModel) {
        newEle.model = merged
      }
      if (!hasBody && !hasModel) {
        throw new Error(errorMsg(newEle))
      }
    }

    if (verb === 'get') {
      //todo: consider if there are already querystring params on the url and merge them in too
      const formDataEle = getIncludeElement(ele, auMeta);
      const fd = makeFormData(formDataEle);
      const model = Object.fromEntries(fd.entries());
      const qs = objectToQueryParams(model);
      const urlWithQs = `${url}${qs}`;
      const json = await auConfig.serverGet(urlWithQs);
      const merged = {...model, ...json };
      const hasBody = newEle.hasOwnProperty('body');
      const hasModel = newEle.hasOwnProperty('model');
      if (hasBody) {
        // since we merged, shouldn't have duplicates
        // todo: need to test this out and turn on if it works
        //newEle.body = toFormData(merged)
      }
      if (hasModel) {
        newEle.model = merged
      }
      if (!hasBody && !hasModel) {
        throw new Error(errorMsg(newEle))
      }
    }


  }
}