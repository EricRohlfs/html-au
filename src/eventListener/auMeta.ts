import { auConfigType, auElementType, auMetaType } from '../types.js';
import { CED } from '../utils/index.js';
import { defaultConfig } from 'src/defaultConfig.js';
import { parseAuCed } from './parseAuCed.js';

// export const auPost = 'auPost'
// export const auGet = 'auGet'

function guessTheTargetSelector(ele, auMeta) {
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


export async function getAuMeta(ele: HTMLElement, auConfig: auConfigType): Promise<auMetaType> {

  const brains = []
  if (ele.getAttribute('au-trigger') === null) {
    ele.setAttribute('au-trigger', defaultConfig.defaultAttributes['au-trigger']);
    brains.push('au-trigger was empty. The default in the was added for you.')
  }
  if (ele.getAttribute('au-swap') === null) {
    ele.setAttribute('au-swap', defaultConfig.defaultAttributes['au-swap']);
    brains.push('au-swap was empty. The default in the config was added for you.')
  }

  const auMeta = {
    trigger: ele.getAttribute('au-trigger'),
    server: ele.getAttribute('au-server'),
    targetSelector: ele.getAttribute('au-target'),
    auCed: undefined, //ele.getAttribute('au-ced'),
    // auCedParsed: undefined,
    // auGet: ele.getAttribute('au-get'),
    // auPost: ele.getAttribute('au-post'),
    auInclude: ele.getAttribute('au-include'),
    auSwap: ele.getAttribute('au-swap'),
    preserveFocus: ele.getAttribute('au-preserve-focus') !== null,
    attachSwapped: ele.getAttribute('au-attach-swapped') !== null,
    verb: '', // todo: rename to differentiate between the various get/post types
    // searchParams: undefined,
    isThis: false,
    brains,
    // todo: better name, what CED? the ced to create based on the route
    ced: {
      tagName: '',
      attributes: {},
      properties: {}
    } as CED<HTMLElement>
  }

  // @ts-ignore
  auMeta.auCed = parseAuCed(ele.getAttribute('au-ced'), auConfig)

  // if (auMeta.auGet !== null) {
  //   auMeta.verb = auGet
  // } else if (auMeta.auPost !== null) {
  //   auMeta.verb = auPost
  // }

  // todo: validate that au-get, au-post are mutually exclusive

  // const auCedParts = auMeta.auCed?.split('?') //?? auMeta.auPost?.split('?') ?? ['', '']
  auMeta.ced.tagName = auMeta.auCed.tagName
  // figure out ced element name
  if (auMeta.ced.tagName === 'this') {
    auMeta.isThis = true
    auMeta.ced.tagName = ele.tagName
    auMeta.targetSelector = 'this'
  }

  guessTheTargetSelector(ele, auMeta)

  // given <div au-ced="get hello-msg?msg=hello world" we want to use the parameters as attributes
  // this will be an important part of the convention
  // auMeta.searchParams = new URLSearchParams(auCedParts[1])
  return auMeta
}