export type eleAttributesType =  Record<string, string|boolean|number|string[]|symbol>

/** is attribute required */
export type attributesWithIs = eleAttributesType & {
  is:string;
}

export type CreateElementOptions = {
  useBooleanAttributes?: boolean
}

/**
 * If using with defineElementByCED
 * 1. must have ctor
 * 2. if extending built-in elements must set is attribute.
 */
export interface CED<eleType, ctorArgsT = unknown> {
  tagName: string
  ctor?: CustomElementConstructor // same as second argument in customElement.defin(firstArg, secondArg)
  ctorArg?:ctorArgsT
  attributes?: eleAttributesType // todo: we could make this type better to express how class can be set
  /**
   * properties to set after the element is created.
   * these are best used if the property already exists.
   * If the property does not exist or you need to make it enumerable or not writable, use defineProperties
   */
  properties?:Partial<eleType>

  /**
   * A way to add properties that do not exist, or to create with more control, like if you want to freeze the property
   */
  defineProperties?: PropertyDescriptorMap

  /**
   * a way to turn features on or off in createElement like useBooleanAttributes:false
   */
  options?: Partial<CreateElementOptions> // used to override all options
}

/**
 * Component Element Description with Constructor
 * constructor is not optional
 */
export interface CEDC<eleType, ctorArgsT = unknown > extends CED<eleType, ctorArgsT>{
  ctor: CustomElementConstructor
}

/**
 * Can be used when extending built-in custom elements like HTMLFormElement.
 * ctor and is attribute are not optional, in CED they are optional
 */
export interface CEDCIs<eleType, ctorArgsT = unknown > extends CED<eleType, ctorArgsT>{
  ctor: CustomElementConstructor // it would be nice to enforce that it did not directly extend HTMLElement, but that might cause other issues
  attributes: attributesWithIs
}


