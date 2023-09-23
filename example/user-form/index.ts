import { auObserve, defineElement, html } from "../../src";

const USER_FORM = 'user-form'

export class UserForm extends HTMLElement {
  // auPost data added here
  model
  async connectedCallback() {
    if (this.model === undefined) {
      this.model = {
        firstname: '',
        lastname: '',
        userid: '0'
      }
      this.model.counter = 0
    }
    const model = this.model
    model.counter = (Number(model.counter) + 1).toString()

    const frag = html`
       <!-- this is a bad idea need to do this differently. started as shadowdom-->
        <style>
          label{
          }
          input[readonly]{
            background-color: lightgray;
          }
        </style>
        <div>
          <label for="counter"> Counter </label>
          <input id="counter" type="text" name="counter" value="${model.counter}" readonly/>
        </div>
        <div>
          <label for="userid"> User ID</label>
          <input id="userid" type="text" name="userid" value="${model.userid}" readonly />
        </div>
        <div>
          <label for="firstname"> First Name </label>
          <input type='text' name='firstname' value="${model.firstname}"/>
        </div>
        <div>
          <label for="lastname"> Last Name </label>
          <input type='text' name='lastname' value="${model.lastname}"/>
        </div>
        <button type="reset" value="cancel">Cancel</button>
        <button
          type="submit"
          value="submit"
          au-trigger="click"
          au-post="${USER_FORM}"
          au-include="closest ${USER_FORM}"
          au-server="post http://127.0.0.1:8081/user"
          >Submit POST</button>
        <button
          type="submit"
          value="submit"
          au-trigger="click"
          au-post="${USER_FORM}"
          au-include="closest ${USER_FORM}"
          au-server="get http://127.0.0.1:8081/user "
          >Submit GET</button>
    `
    this.append(frag)
  }
}


defineElement(USER_FORM, UserForm)