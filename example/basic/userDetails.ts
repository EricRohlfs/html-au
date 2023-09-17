import { html, defineElement } from "src/utils/index.js"

export class UserDetailsForm extends HTMLFormElement {
  connectedCallback() {
    const frag = html`<div>
        <label>First Name
          <input name='first_name' type='text'/>
        </label>
        <label> Last Name
          <input name='last_name' type='text'/>
        </label>
      </div>`
    this.append(frag)
  }
}

export class UserDetailsInfo extends HTMLElement {
  body: FormData // data is being passed into the component as FormData
  model = {
    first_name: '',
    last_name: ''
  }
  connectedCallback() {
    if (this.body) {
      this.model = Object.fromEntries(this.body) as { first_name: string, last_name: string }
    }
    const frag = html`
         <div id="first_name">${this.model.first_name}</div>
         <div id="last_name">${this.model.last_name} </div>`
    this.append(frag)
  }
}
