import { auConfigType, auMetaType } from '../types.js';
import { CED } from '../utils/index.js';
// import { defaultConfig } from '../../src/defaultConfig.js';
import { parseAuCed } from './parseAuCed.js';
import { guessTheTargetSelector } from './parseAuTarget.js';


export async function auMetaPrep(ele: HTMLElement, auConfig: auConfigType): Promise<Partial<auMetaType>>{
  const brains = []
  if (ele.getAttribute('au-trigger') === null) {
    ele.setAttribute('au-trigger', auConfig.defaultAttributes['au-trigger']);
    brains.push('au-trigger was empty. The default in the was added for you.')
  }
  if (ele.getAttribute('au-swap') === null) {
    ele.setAttribute('au-swap', auConfig.defaultAttributes['au-swap']);
    brains.push('au-swap was empty. The default in the config was added for you.')
  }
  const auMeta = {
    trigger: ele.getAttribute('au-trigger'),
    brains
  }
  return auMeta
}

export async function getAuMeta(ele: HTMLElement, initialMeta:Partial<auMetaType> ,auConfig: auConfigType): Promise<auMetaType> {

  const auMeta = {
    trigger: initialMeta.trigger,
    server: ele.getAttribute('au-server'),
    targetSelector: ele.getAttribute('au-target'),
    auCed: parseAuCed(ele.getAttribute('au-ced'), auConfig, ele),
    auInclude: ele.getAttribute('au-include'),
    auSwap: ele.getAttribute('au-swap'),
    // auHref: ele.getAttribute('au-href'),
    // preserveFocus: ele.getAttribute('au-preserve-focus') !== null,
    // attachSwapped: ele.getAttribute('au-attach-swapped') !== null,
    isThis: false,
    brains: initialMeta.brains,
    ced: {
      tagName: '',
      attributes: {},
      properties: {}
    } as CED<HTMLElement>
  }


  auMeta.ced.tagName = auMeta.auCed.tagName
  // figure out ced element name
  if (auMeta.ced.tagName === 'this') {
    auMeta.isThis = true
    auMeta.ced.tagName = ele.tagName
    auMeta.targetSelector = 'this'
  }

  guessTheTargetSelector(ele, auMeta)

    // attributes are nice and allow for outer configuration like classes and such
    // but attributes do clutter up the dom if just needed as properties
    // if we only passed properties, then the user could have getters/setters that do set the attribute
    // but attributes are usually safer
    // BUT picking and choosing interfears with the whole get/post form data serialization thing.
    // technically all form values should be paramertized, but what about a big text field?
    // todo: move to auMeta
    for (const [key, value] of auMeta.auCed.qs.entries()) {
      auMeta.ced.attributes[key] = value
    }

     //input auElement special use case where the input is basically the form so we can copy into get any mattaching verb searchParameter
     if (ele.tagName === 'INPUT') {
      // overwrite searchparam->attrbiute with the value of the input box
      if (auMeta.auCed.qs.get((ele as HTMLInputElement)?.name)) {
        auMeta.ced.attributes[(ele as HTMLInputElement)?.name] = (ele as HTMLInputElement)?.value
      }
    }

   // todo: revisit this use case
    // could have an overwrite situation when the searchParam and an existing attribute are the same.
    if (auMeta.isThis) {
      // copy existing attributes to new element
      for (const attr of ele.attributes) {
        auMeta.ced.attributes[attr.name] = attr.value
      }
    }

  // given <div au-ced="get hello-msg?msg=hello world" we want to use the parameters as attributes
  // this will be an important part of the convention
  // auMeta.searchParams = new URLSearchParams(auCedParts[1])
  return auMeta
}