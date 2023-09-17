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
      <h3>User Details From Example</h3>
      <form
        is="user-details-form"
        au-post="user-details-info"
        au-trigger="input"
        au-target="user-details-info"
      ></form>
      <user-details-info></user-details-info>
    </section>
    `
  }
}