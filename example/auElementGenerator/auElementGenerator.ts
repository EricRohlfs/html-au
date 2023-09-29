// create a form to help users create an au element and explain what is going on.
import { defineElement, html } from "../../src";

defineElement('hello-try-it',class extends HTMLElement{
  model
  connectedCallback(){
    this.textContent = "Hello World"
  }
});
export class AuElementGenerator extends HTMLElement{

  model = {
    cedname:'hello-try-it',
    eventname:'click',
    targetselector:'div[try-it-target]',
    elementname:'button',
    swap:'innerHTML'
  }
  connectedCallback(){
    this.model.elementname = this.getAttribute('elementname') ?? this.model.elementname
  
    const frag = this.templateLit()
    this.addElementNameButtons(frag);
    this.append(frag);
    const div = this.querySelector(':scope div[try-it]')
    div?.appendChild(this.templateLitTryIt())
  }

  addElementNameButtons(frag){
    const target = frag.querySelector(':scope label[for=elementname] + div')
    const eles = ['div', 'button','span', 'form'];
    eles.forEach(name =>{
      const x = html`<button
      au-host="closest element-generator"
      au-target="host"
      au-include="host"
      au-ced="post element-generator?elementname=${name}"
      name="btn-set-ele-name"
      value="${name}"
      >${name}</button>`
      target?.append(x);
    })
  }

  templateLitTryIt(){
    return html`
    <${this.model.elementname}
    au-trigger="${this.model.eventname}"
    au-target="${this.model.targetselector}"
    au-ced="${this.model.cedname}"
    au-swap="${this.model.swap}"
    > click
    </${this.model.elementname}>
    `
  }

  templateLit(){
    return html`
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 400px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
    
            h1 {
                text-align: center;
                color: #333;
            }
    
            .form-group {
                margin-bottom: 20px;
            }
    
            label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
    
            input[type="text"],
            select {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 16px;
            }
    
            .btn-submit {
                background-color: #007BFF;
                color: #fff;
                border: none;
                padding: 10px 20px;
                font-size: 18px;
                border-radius: 3px;
                cursor: pointer;
            }
    
            .btn-submit:hover {
                background-color: #0056b3;
            }

            p.details{
              font-size:smaller;
            }
        </style>

        <div class="container">
            <h3>AU Element Generator</h3>
            <div
              au-trigger="input"
              au-target="closest element-generator"
              au-ced="element-generator"
              au-preserve-focus
            >
                <div class="form-group">
                    <label for="elementname">Element Name:</label>
                    <div></div>
                    <input type="text" id="elementname" name="elementname" value="${this.model.elementname}" required>
                </div>
                <div class="form-group">
                    <label for="eventname">Event Name:</label>
                    <select id="eventname" name="eventname" required>
                        <option value="click" ${this.model.eventname === 'click'? 'selected':''}>Click</option>
                        <option value="input" ${this.model.eventname === 'input'? 'selected':''}>Input</option>
                        <option value="change" ${this.model.eventname === 'change'? 'selected':''}>Change</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="cedname">Custom element tagName to make after the event:</label>
                    <input type="text" id="cedname" name="cedname" value="${this.model.cedname}" required/>
                </div>
                
                <div class="form-group">
                    <label for="targetselector">Target CSS Selector:</label>
                    <p class="details">The element already on the page you wish to overwrite with your custom element</p>
                    <input type="text" id="targetselector" name="targetselector" value="${this.model.targetselector}" required/>
                </div>
                <div class="form-group">
                  <label for="auswap">Swap, how to overwrite the target element<label>
                  <p></p>
                  <select name="swap">
                    <option name="innerhtml" value="innerHTML" ${this.model.swap === 'innerHTML'? 'selected':''} >innerHTML</option>
                    <option name="outerhtml" value="outerHTML" ${this.model.swap === 'outerHTML'? 'selected':''} >outerHTML</option>
                  </select>
                </div>
                <div class="form-group">
                    <button 
                      type="submit" 
                      class="btn-submit"
                      au-target="closest element-generator"
                      au-ced="post element-generator"
                      au-include="closest element-generator"
                      au-preserve-focus
                      >Submit</button>
                </div>
                <div>
<textarea rows="10">
&lt; ${this.model.elementname}
  au-trigger="${this.model.eventname}"
  au-target="${this.model.targetselector}"
  au-ced="${this.model.cedname}"
  au-swap="${this.model.swap}"
  &gt;
  &lt;/${this.model.elementname}&gt;
</textarea>
                </div>
              <div try-it>
                <h3>Try it</h3>
              </div>
              <div try-it-target></div>
            </div>
        </div>

    `
  }
}

defineElement('element-generator', AuElementGenerator);