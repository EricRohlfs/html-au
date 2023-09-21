import { html } from "src/utils/index.js"

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

type userInfoModel = {
  first_name: string
  last_name: string
}

export class UserDetailsInfo extends HTMLElement {
  // body: FormData // data is being passed into the component as FormData
  model = {
    first_name: '',
    last_name: ''
  }
  connectedCallback() {
    // if (this.body) {
    //   this.model = Object.fromEntries(this.body) as userInfoModel
    // }
    const frag = html`
      <div>
        <span>First Name</span>
        <span id="first_name">${this.model.first_name}</span>
      </div>
      <div>
        <span>Last Name</span>
        <span id="last_name">${this.model.last_name}<span>
      </div>`
    this.append(frag)
  }
}

export class UserDetailsSingle extends HTMLFormElement {
  body: FormData // data is being passed into the component as FormData
  model = {
    first_name: '',
    last_name: ''
  }
  connectedCallback() {
    if (this.body) {
      // @ts-ignore
      this.model = Object.fromEntries(this.body)
    }
    const frag = html`
      <div>
        <label>First Name
          <input name='first_name' type='text' value='${this.model.first_name}'/>
        </label>
        <label> Last Name
          <input name='last_name' type='text' value='${this.model.last_name}'/>
        </label>
      </div>
      <div>
        <span>First Name</span>
        <span>${this.model.first_name}</span>
      </div>
      <div>
        <span>Last Name</span>
        <span>${this.model.last_name}<span>
      </div>`
    this.append(frag)
  }
}