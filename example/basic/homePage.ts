import { html } from '../../src/utils/index.js'

export class HomeView extends HTMLElement{

  connectedCallback(){
    const frag = this.templateLit()
    this.append(frag)
  }

  templateLit(){
    return html`
    <h1>Examples and test cases</h1>
  
    <section id="counter-placeholder">
        <h3>Click Counter Example</h3>
        <click-counter></click-counter>
    </section>
    <section>
      <h3>User Details From Example: two components</h3>
      <form
        is="user-details-form"
        au-post="user-details-info"
        au-trigger="input"
        au-target="user-details-info"
      ></form>
      <user-details-info></user-details-info>
    </section>

    <section>
      <h3>User Details From Example: as a single component</h3>
      <form
        is="user-details-single"
        au-post="this"
        au-trigger="input"
        au-preserve-focus
      ></form>
    </section>

    <section>
      <h3>Hello World: invoking a built-in custom element</h3>
      <div
        au-get='div?is=hello-world-div&msg=Hello World'
        au-target='next'
        au-trigger='click'>Click Here</div>
      <div></div>
    </section>

    <section>
      <h3>Hello Input: invoking a built-in custom element</h3>
      <p><i>input name must match a parameter in the au-get. </i></p>
      <label> Enter a message </label>
      <input
        type='text'
        name='msg'
        au-get='div?is=hello-world-div&msg=Hello World'
        au-target='next'
        au-trigger='input'/>
      <div></div>
    </section>
    `
  }
}