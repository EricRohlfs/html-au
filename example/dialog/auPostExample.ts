
import { html } from "src/utils";

export const DIALOG_POST = 'dialog-post'

export type buttonActionType = ''|'showModal'|'show'|'close'

export class DialogPostExample extends HTMLDialogElement{

  model= {
    button_action:'' as buttonActionType
  }
  connectedCallback(){
    const frag = html`
      <h1>Anim nulla et ipsum</h1>
      <p>Quis est id culpa irure. Consectetur consequat sint nisi aute amet consequat magna adipisicing. Est commodo excepteur deserunt aute sunt et. Reprehenderit pariatur fugiat consequat incididunt deserunt do anim nostrud. Proident do veniam Lorem laborum voluptate ea esse excepteur id. Exercitation officia aliquip duis veniam voluptate ea in Lorem cillum. Ullamco ad ut dolore officia.</p>
      <!-- multiple ways this could be done, but basic is to just
           re-render the dialog without the open attribute/querystring -->
      <button
        au-get="dialog?is=${DIALOG_POST}"
        au-target='closest dialog'
        au-trigger='click'
        au-swap='delete'
      >Close</button>
    `
    this.append(frag)
    this.action(this.model.button_action)
  }

  action(action: buttonActionType){
    if(action === 'show'){
      this.show()
    }
    if(action === 'showModal'){
      this.showModal()
    }
    if(action === 'close'){
      this.close()
    }
  }
}

