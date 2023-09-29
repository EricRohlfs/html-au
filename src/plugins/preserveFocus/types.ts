export type preserveFocusEle = HTMLElement & {
  // todo: rename to _preserveFocus.oldVal
  _preserveFocus:string
  _preserveFocusA:{
    oldVal:string,
    tagName:string
  }
}