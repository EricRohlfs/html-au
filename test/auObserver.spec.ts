import { defaultConfig } from "../src/defaultConfig.js"
import { auMetaPrep, getAuMeta } from "../src/eventListener/auMeta.js"
import { auObserver} from "../src/index.js"
import { auElementType, auMetaType} from "../src/types.js"
import { CED, createElement, html } from "../src/index.js"


describe('auObserver',()=>{
  let host:HTMLDivElement

  beforeEach(()=>{
    host = createElement<HTMLDivElement>({
      tagName:'div'
    })
    auObserver(host)
  })

  it('processes auElements', (done)=>{
    const frag = html`
      <input
      type='text'
      name='msg'
      au-ced='div?is=hello-world-div'
      au-target='next'
      au-trigger='input'/>
    `
    const input = frag.querySelector<auElementType>(':scope input')
    host.append(frag)
    // need time for the mutation observer to do it's thing.
    setTimeout(() => {
      // @ts-ignore
      expect(input.auState).toBe('processed')
      done()
    }, 15);
  })

})

describe('getAuMeta',()=>{
  let inputEle:auElementType
  let auMeta:auMetaType
  const inputCED = {
    tagName:'input',
    attributes:{
      type:'text',
      name:'msg',
      'au-ced':'post div?is=hello-world-div',
      'au-target':'next',
      'au-trigger':'input',
    }
  }as CED<HTMLInputElement>

  beforeAll(async ()=>{
    inputEle = createElement<auElementType>(inputCED)
    const initialMeta = await auMetaPrep(inputEle, defaultConfig)
    auMeta = await getAuMeta(inputEle, initialMeta, defaultConfig)
  })
  it('has au-post',()=>{
    // @ts-ignore
    expect(auMeta.auCed.raw).toBe(inputCED.attributes['au-ced'] as string)
  })
  it('has au-target',()=>{
    // @ts-ignore
    expect(auMeta.targetSelector).toBe(inputCED.attributes['au-target'] as string)
  })
  it('has au-trigger',()=>{
    // @ts-ignore
    expect(auMeta.trigger).toBe(inputCED.attributes['au-trigger'] as string)
  })
  // it('au-get is null',()=>{
  //   expect(auMeta).toBe(null)
  // })
  it('au-swap is null',()=>{
    expect(auMeta.auSwap).toBe('outerHTML')
  })
  it('auMeta au ced verb tobe post',()=>{
    expect(auMeta.auCed.verb).toBe('post')
  })
  it('searchParams tobe is=hello-world-div',()=>{
    expect(auMeta.auCed.qs.get('is')).toBe('hello-world-div')
  })
  it('preserveFocus is null',()=>{
    expect(auMeta.preserveFocus).toBe(false)
  })
  it('auInclude is null',()=>{
    expect(auMeta.auInclude).toBe(null)
  })
  it('isThis tobe false',()=>{
    expect(auMeta.isThis).toBe(false)
  })
  it('ced.tagName is input',()=>{
    expect(auMeta.ced.tagName).toBe('div')
  })

})