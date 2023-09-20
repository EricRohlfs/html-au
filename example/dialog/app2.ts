import { auObserve } from "src";
import { createElement, defineElement, html } from "src/utils";
import { DIALOG_POST, DialogPostExample, buttonActionType } from "./auPostExample";

// want to get the observer running first thing
auObserve(document.body)

class DialogButtons extends HTMLElement {
  model = {
    button_action: '' as buttonActionType
  }
  connectedCallback() {
    const frag = this.templateLit()
    this.append(frag)
    // normally I like to do work before adding to the DOM, but ...
    // in this case, because of the spec the modal must be on the dom for showModal to work.
    if (this.model?.button_action?.length > 0) {
      const dialog = this.querySelector<DialogPostExample>(':scope dialog')
      dialog.action(this.model.button_action)
    }
  }
  templateLit() {
    return html`
    <main>
      <!-- Example 1-->
      <button
        au-get="dialog-buttons?open"
        au-target="closest dialog-buttons"
        au-trigger="click">get open dialog attribute</button>
      <!-- Example 2-->
      <button
        au-post="dialog-buttons"
        au-target="closest dialog-buttons"
        au-trigger="click"
        name="button_action"
        value="show">post dialog.show</button>
      <!-- Example 3-->
      <!-- notice missing trigger attribute will use au-post --> 
      <button
        au-post="dialog-buttons"
        au-trigger="click"
        name="button_action"
        value="showModal">post dialog.showModal</button>

        <div id='dialog-placeholder-2'>
          <!-- notice the hasAttribute check for the get button example -->
          <dialog is='${DIALOG_POST}' ${this.hasAttribute('open') ? 'open' : ''}></div>
        </div>
      </main>`
  }
}

defineElement(DIALOG_POST, DialogPostExample, 'dialog')
defineElement('dialog-buttons', DialogButtons)

const buttons = createElement<DialogButtons>({
  tagName: 'dialog-buttons'
})

document.body.append(buttons)
