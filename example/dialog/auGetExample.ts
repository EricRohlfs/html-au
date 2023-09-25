import { swapOptions, createElement, html } from "../../src"

export const DIALOG_GET = 'dialog-get'

export class DialogGetExample extends HTMLDialogElement {
  connectedCallback(){
    const frag = html`
      <h1>Anim nulla et ipsum</h1>
      <p>Quis est id culpa irure. Consectetur consequat sint nisi aute amet consequat magna adipisicing. Est commodo excepteur deserunt aute sunt et. Reprehenderit pariatur fugiat consequat incididunt deserunt do anim nostrud. Proident do veniam Lorem laborum voluptate ea esse excepteur id. Exercitation officia aliquip duis veniam voluptate ea in Lorem cillum. Ullamco ad ut dolore officia.</p>
      <!-- multiple ways this could be done, but basic is to just
           re-render the dialog without the open attribute/querystring -->
      <button
        au-ced="get dialog?is=${DIALOG_GET}"
        au-target='closest dialog'
        au-swap='${swapOptions.delete}'
        au-trigger='click'
      >Close</button>
    `
    this.append(frag)
  }
}


/**
 * Notice the buttons are not custom elements the just use html-au
 */
export const buttonOpenGetExample = createElement<HTMLButtonElement>({
  tagName:'button',
  attributes:{
    'au-ced':`get dialog?is=${DIALOG_GET}&open`,
    'au-target':`#dialog-placeholder`,
    'au-swap': swapOptions.innerHTML,
    'au-trigger':'click'
  },
  properties:{
    textContent: 'open dialog attribute'
  }
})


