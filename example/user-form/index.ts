import { auObserver, defineElement, html } from "../../src";

const USER_FORM = 'user-form'
const apiUrl =  'http://127.0.0.1:8081/user'

/**
 * note: this could extend from HTMLFormElement and could potentially take advantage of other built-in form button
 */
export class UserForm extends HTMLElement {
  // auPost data added here
  model
  async connectedCallback() {
    if (this.model === undefined) {
      // business data concern
      this.model = {
        firstname: '',
        lastname: '',
        userid: '0'
      }
      // UI only concern
      this.model.counter = 0
    }
    const model = this.model
    model.counter = (Number(model.counter?? 0) + 1).toString()
    // inline style is a bad idea. Need to do this differently. Started as shadowdom 
    const frag = html`
        <style>
          div:has(label){
            display:table-row
          }
          label{
            display:table-cell
          }
          input{
            display:table-cell
          }
          input[readonly]{
            background-color: lightgray;
          }

        </style>
        <h3>User Form</h3>
        <i>npm run serve-user-form</i>
        <p>Of interest, this example uses au-server="post \${some url}"</p>
        <ul>
            <li>When user clicks submit</li>
            <li>converts the form to a FormData object</li>
            <li>converts the FormData to json object</li>
            <li>makes a server side api call with the json object</li>
            <li>merges the server response with the original json object</li>
            <li>creates the new custom element as defined by the au-post </li>
            <li>binds the merged data object to new custom element</li>
            <li>the new element is added to the DOM</li>
            <li>the new elements connectedCallback is called and the component is rendered with the new data</li>
        </ul>


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
          <input id="firstname" type='text' name='firstname' value="${model.firstname}"/>
        </div>
        <div>
          <label for="lastname"> Last Name </label>
          <input id="lastname" type='text' name='lastname' value="${model.lastname}"/>
        </div>
        <div>
          <label></label>
          <button
            id="submit_post"
            type="submit"
            value="submit"
            au-trigger="click"
            au-post="${USER_FORM}"
            au-include="closest ${USER_FORM}"
            au-server="post ${apiUrl}"
            >Submit POST</button>
          <button
            type="submit"
            value="submit"
            au-trigger="click"
            au-post="${USER_FORM}"
            au-include="closest ${USER_FORM}"
            au-server="get ${apiUrl}"
            >Submit GET</button>
          </div>
    `
    this.append(frag)
  }
}

defineElement(USER_FORM, UserForm)