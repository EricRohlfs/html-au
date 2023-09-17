import { CED, CEDC, CEDCIs } from '../createElement/types.js';

/**
 * conditionally defines an element and simplifies registration.
 *
 * example: defineElement('my-component', MyComponent, 'div') anything that dose not inherit from HTMLElement
 *          defineElement('my-component', MyComponent)
 * 
 * @param name - the name of the custom element like <svg-sprite> or <div is="svg-sprite"
 * @param customEleJs - the class that extends HTMLElement or other valid HTML type like HTMLDIVElement
 * @param extendsOption - usually 'table', 'div', 'form', etc.
 */
export function defineElement(name: string, customEleJs: CustomElementConstructor, extendsOption: null | string = null) {

  if (extendsOption === null) {
    customElements.get(name) ?? customElements.define(name, customEleJs);
  } else {
    customElements.get(name) ?? customElements.define(name, customEleJs, { extends: extendsOption });
  }
}

/**
 * Defines element in the window registry from a CED2 or CED3 type.
 * If the customElement extends from a built in type like HTMLButtonElement,
 * the is attribute must be set.
 * 
 * Note the unknown type. We don't care what typescript type is because we don't do anything with the actual class other than pass along. 
 * @param ced 
 * @returns 
 */
export function defineElementByCED(ced:CED<unknown>|CEDC<unknown>|CEDCIs<unknown> ) {
  if(ced?.attributes?.is){
    defineElement(ced.attributes.is as unknown as string, ced.ctor, ced.tagName);
    return;
  }
  defineElement(ced.tagName, ced.ctor);
}