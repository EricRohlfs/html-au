import { auObserver,  createElement, defineElement, html } from "../../src";
import { DIALOG_POST, DialogPostExample, buttonActionType } from "./auPostExample";

export class DialogButtons extends HTMLElement {
  model = {
    button_action: '' as buttonActionType
  }
  isShow: boolean;
  connectedCallback() {
    this.isShow = this.hasAttribute('open') || this.model.button_action !== ''
    const frag = this.templateLit()
    this.append(frag)
    // we have to do showModal in JavaScript because of the spec and the dialog has to be on the live DOM
    // todo: could put something into html-au to make this attribute driven since dialog is a known element
    const dialog = this.querySelector<DialogPostExample>(':scope dialog')
    if (this.model?.button_action?.length > 0) {
      dialog?.action(this.model.button_action)
    }

    // in this particular example, the button in the dialog component is set to just close the dialog
    // but in this case we need to re-enable the buttons in this component
    // there are a few ways this could be done.
    //    The dialog component could use shadowdom and template for the actions, then we could configure the buttons
    //    Or we could just reach in and change the button attributes to re-render this component

    // todo: could add template support to non-shadowdom au components, then no js will be needed
    const dialogBtn = dialog?.querySelector(':scope button')
    dialogBtn?.setAttribute('au-get', 'dialog-buttons')
    dialogBtn?.setAttribute('au-target', 'closest dialog-buttons')
    dialogBtn?.setAttribute('au-swap','outerHTML')
  }
  templateLit() {
    const disabled = this.isShow ? 'disabled':''
    return html`
    <main>
      <!-- Example 1-->
      <button
        au-get="dialog-buttons?open"
        au-target="closest dialog-buttons"
        au-trigger="click"
        ${disabled}
        >get open dialog attribute</button>
      <!-- Example 2-->
      <button
        au-post="dialog-buttons"
        au-target="closest dialog-buttons"
        au-trigger="click"
        name="button_action"
        ${disabled}
        value="show">post dialog.show</button>
      <!-- Example 3-->
      <!-- notice missing trigger attribute will use au-post --> 
      <button
        au-post="dialog-buttons"
        au-trigger="click"
        name="button_action"
        ${disabled}
        value="showModal"
        >post dialog.showModal</button>

        <div id='dialog-placeholder-2'>
          <!-- notice the hasAttribute check for the get button example -->
          <dialog is='${DIALOG_POST}' ${this.hasAttribute('open') ? 'open' : ''}></div>
        </div>
      </main>`
  }
}

defineElement(DIALOG_POST, DialogPostExample, 'dialog')
defineElement('dialog-buttons', DialogButtons)