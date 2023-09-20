import { escapeString } from '../common.js';
import { CED, CEDC, CEDCIs, CreateElementOptions, eleAttributesType } from './types.js';
export * from './types.js';

const unsafeTagNames = ['script'];
const unsafePropertyNames = ['innerHTML'];
const unsafePropertyNamesThatStartWith = ['on'];

export const UNSAFE_PROPERTY_ERROR = 'UnsafePropertyError';

export const unsafePropertError = (key: string) => {
  return {
    name: UNSAFE_PROPERTY_ERROR,
    message: escapeString`${key} is an unsafe prop in the current options set.`
  };
};

function canAdd(key: string) {
  if (unsafePropertyNames.includes(key)) { return false; }
  if (!unsafePropertyNamesThatStartWith.every(item => !key.startsWith(item))) { return false; }
  return true;
}

const addAsProperty = (ele: HTMLElement, keyVal) => {
  const [key, value] = keyVal;
  if (!canAdd(key)) {
    throw unsafePropertError(key);
  }
  try {
    ele[key] = value;
  } catch (e) {
    // too much work to find if getter only, this was the lest complicated solution. The new iHTMLElementSetables should help with this
    const isGetOnly = e.message.indexOf('which has only a getter') > -1;
    if (!isGetOnly) { throw e; }
  }
};

export const isUnsafeElement = (tagName) => {
  return unsafeTagNames.includes(tagName);
};

export const removeUnsafeProps = (props: PropertyDescriptorMap): PropertyDescriptorMap => {
  if (!props) { return; }
  const result = {};
  for (const [key, value] of Object.entries(props)) {
    if (!canAdd(key)) {
      throw unsafePropertError(key);
    }
    result[key] = value;
  }
  return result;
};

function _makeEle(ced: CED<unknown> | CEDC<unknown> | CEDCIs<unknown>): HTMLElement {
  const hasCtorArgs = !(ced.ctorArg === undefined || ced.ctorArg === null);
  if (hasCtorArgs) {
    return new ced.ctor(ced.ctorArg);
  }
  if (ced?.attributes?.is) {
    return document.createElement(ced.tagName, { is: ced.attributes.is as string });
  }
  return document.createElement(ced.tagName);
}

/**
 * Add classes in a way that does not override classes already set by the
 * constructor.
 * this should throw an error if the type of element does not
 * support classList
 */
function addClasses(elem: Element, classes: string | string[]) {
  let cleaned = classes as string[];
  if (typeof classes === 'string') {
    cleaned = classes.split(' ');
  }
  // filter removes any empty strings
  elem.classList.add(...cleaned.filter((c) => c));
}

/**
 * different than truthy and falsy
 * if typeof boolean then true
 * if 'true' or 'false' then true
 * if 0 or 1 false
 * if object that exists false
 *
 * @param attrVal
 * @returns
 */
export function isBooleanValue(attrVal: boolean | string) {
  return typeof attrVal === 'boolean' || attrVal === 'true' || attrVal === 'false'
}


/**
 * adds a booleanAttribute to the element
 */
export function _addedBooleanAttribute(ele: Element, attrName: string, attrVal: string | boolean) {
  if (typeof attrVal === 'boolean') {
    // using === true for readability, this is already confusing enough
    if (attrVal === true) {
      ele.setAttribute(attrName, '');
    }
    // if true create attr, if false do not create but report created
    return true;
  }
  if (attrVal === 'true' || attrVal === 'false') {
    if (attrVal === 'true') {
      ele.setAttribute(attrName, '');
    }
    return true;
  }
  // was not a boolean attribute, so don't do anything and report that it was not created or processed
  return false;
}

/**
 * has support for boolean attributes
 * boolean attributes are <div show></div> and not <div show="true">setting true is a bad thing to do </div>
 * boolean attributes simplify web development and support hasAttribute('show')
 */
export function _addAttributes(elem: Element, attrs: eleAttributesType, opts: CreateElementOptions) {
  if (!attrs) { return }
  for (const attrIn in attrs) {
    const attrVal = attrs[attrIn];
    const isNotAria = !attrIn.startsWith('aria');
    const isNotSpellcheck = attrIn !== 'spellcheck';
    // processing order is important for creating the attributes
    if (opts?.useBooleanAttributes && isNotAria && isNotSpellcheck) {
      if (_addedBooleanAttribute(elem, attrIn, attrVal as string)) { return }
    }
    if (attrIn === 'class') {
      addClasses(elem, attrVal as string | string[]);
    } else {
      elem.setAttribute(attrIn, attrVal as string);
    }
  }
}

/**
 * createElement and the CED type is useful for creating web elements using a cleaner syntax.
 * Use Cases:
 * - define elements to be created later, like in a component router
 * - cleaner syntax that usig built-in browser api's.
 * - components can export a fully loaded CED for other components to use as a starting point so you don't have to guess attributes and such.
 * - can use the defineElement(ced) to more easily define the element
 *
 * Benefits:
 * - figures out the appropriate createElement constructor to use. 
 * -- Three different use cases:
 * --- elements that extend HTMLElement
 * --- elements that extend built-ins like HTMLFormElement
 * --- calling the class constructor directly and passing in arguments
 * - supports boolean attributes
 * - supports aria boolean attributes that are value based booleans and not true booleans
 * - adds classes via an array or a string - helpful for spread operator mixin use cases
 * - automatically binds properties that exist on the element
 * - allows the use of property definitions to add new properties and have them be enumerable or frozen or what ever you need
 * - few other things too
 *
 * Adding your own rules is esay: make your own createElement function by copy/paste/edit
 * Goal: trying to keep this from becoming solid.js where it knows everything about the element
 */
export function createElement<eleType>(ced: CED<eleType> | CEDC<eleType> | CEDCIs<eleType>) {
  if (isUnsafeElement(ced.tagName)) {
    throw new Error(escapeString`createElement will not create ${ced.tagName}`);
  }

  const options = { ...{ useBooleanAttributes: true }, ...ced.options };

  const ele = _makeEle(ced);
  _addAttributes(ele, ced?.attributes, options);

  // could warn on ced.settables
  if (ced?.properties) {
    Object.entries(ced.properties).forEach(item => addAsProperty(ele, item));
  }
  if (ced?.defineProperties) {
    const p = removeUnsafeProps(ced.defineProperties);
    Object.defineProperties(ele, p);
  }
  return ele as eleType;
}

