# html-au
Like HTMX but uses native web components on the client to generate html fragments vs server side rendering.

Unlike HTMX does not try to conform to [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)

This is currently an experiment to see what is possible.

## Project Technical Summary
Using HTML attributes to make a DSL for a set of use cases that will just re-render components vs trying to do updates. Inspired by HTMX. 
The primary reason is, why even go to the server for html components/fragments. Have either an internal router to do that work, or use a convention based approach. 

```
// simple input and button. Clicking the button updates the input value.
// the rendered live html
<section id="counter-placeholder">
    <h3>Click Counter Example</h3>
    <click-counter id="me-53">
      <input name="counter" value="54">
      <button
          au-trigger="click"
          au-post="click-counter"
          au-include="closest click-counter"
          au-target="#me-53"
          au-state="processed">click me</button>
    </click-counter>
</section>
```

```
// click counter code.
// I don't see how this would be any smaller in a server side language.
import { idGen } from "../../src/index.js";
import { html } from '../../src/utils/index.js'
export const CLICK_COUNTER = 'click-counter'

export class ClickCounter extends HTMLElement {
  body: FormData;

  connectedCallback() {
    this.id = `me-${idGen.next().value}`
    const previousCount = Number(this?.body?.get('counter') ?? 0)
    const count = (previousCount + 1).toString()
    const frag = html`
      <input name='counter' value='${count}' />
      <button
        au-trigger='click'
        au-post='${CLICK_COUNTER}'
        au-include='closest ${CLICK_COUNTER}'
        au-target='#${this.id}'>click me</button>
    `
    this.append(frag)
  }
}

```

## Motivation

Around 2021, I was excited for the retirement of Internet Explorer and wanted to see if a production app could be written using native JavaScript Custom Elements.
The answer is yes I could. After I figured a few things out, and accepted it for what it was, liked it better than angular.js, vue.js and react.

I quickly discovered that it is just as fast to re-render components as is was to try to update the existing DOM elements.
The benefit to me as a developer is significantly less code and huge time savings.

I was very excited about my re-rendering discovery and started sharing it with others.  They were skeptical. I would show them my production app, they agreed it was fast. But they were not seriously going to consider adopting the practice. I get it. It sounds crazy and goes against 15+ years of web development best practices. Had I not lived it, I wouldn't have seriously considered it either.

The big mystery to me was, why hasn't anyone else in the industry seized on this idea for simplification. Time is money. Development is not cheap. What am I missing? Isn't the point of technology to make life easier. How is all this bit twiddling making life eaiser for anyone! It feels like waste.

Enter [HTMX](https://htmx.org/examples/click-to-edit/). I ignored it for awhile. I just didn't have the time to looking at another framework.

When I finally took a look and found out what HTMX did ... I was like 'YES' there it is! I'm someone else gets it too! And what a brilliant idea to use attributes to do it. I wasing doing it with eventlisteners in each component. But what I like about HTMX is it is more declaritive in the browser and provides a conventionaly way to do it.

The only downside for me was, I don't need or want to do generate my html on the server. My customElements look just like the server code, and they area already on the browser. It didn't make sense to me to try to do that work in a server side environment when it's just as many lines in JavaScript as long as you are just rendering the component and ARE NOT TRYING TO DO UPDATES!!!!!!!!!! Maybe I should post an example of doing updates.

I browsed through the HTMX docs and looked through their code and immediately started creating this. Three hours later I had my first few use cases working.


## The au- tag prefix
No technical reason. I just liked it.

## Example of doing updates in a custom element

```
// I have not run this, but should give you enough of an idea of what is going on.
// The update approach in custom elements (no htmx). A user enters data into the form, then the user sees their input in the divs below. 
// This example is not too bad, but this is a simple example. Even so, few things could go wrong like misspelling selectors, ids, or input names. There are stratigies for this like using const first_name='first_name', but why, when we could just re-render the entire info template.

export class UserDetailsForm extends HTMLFormElement{

  connectedCallback(){
    const frag = templateLit()
    const firstNameEle = this.querySelector(':scope #first_name')
    const lastNameEle = this.querySelector(':scope #last_name')
    this.addEventListener('input',(e)={
      if(e.target.tagName ==='first_name'){
        firstNameEle.textContent = e.target.value
      }else{
        lastNameEle.textContent = e.target.value
      }
    })
    this.append(frag)
  }

  templateLit(){
      return html`<div>
      <input name='first_name' type='text'/>
      <input name='last_name' type='text'/>
      <hr/>
      <div id="first_name">${this.first_name}</div>
      <div id="last_name">${this.last_name} </div></div>`
  }

}
defineElement('user-details-form', UserDetailsForm, 'form')
```

```
// the re-render example (but not using the html-au or htmx approach, just giving an example of re-rendering vs. updates in custom elements. But as you can see even this approach is not ideal. And that is what html-au hopes to bring to the table.)
// this example is much less brittle and scales better too.

export class UserDetailsForm extends HTMLFormElement{

  connectedCallback(){
    const frag = templateLit()
    const placeholder = this.querySelector(':scope #placeholder')
    this.addEventListener('input',(e)={
      this.model = Object.fromEntries(new FormData(this))
      placeholder.replaceChildren(this.templateLitDivs())
    })
    this.append(frag)
  }

  templateLit():DocumentFragment{
      return html`<div>
        <input name='first_name' type='text'/>
        <input name='last_name' type='text'/>
        <hr/>
        <!-- just being lazy here, I could insert after the hr and drop a div.-->
        <div id='placeholder'></div>
      </div>
  }

  templateLitDivs():DocumentFragment{
      return html`
         <div id="first_name">${this.model.first_name}</div>
        <div id="last_name">${this.model.last_name} </div>`
      `
  }

}
defineElement('user-details-form', UserDetailsForm, 'form')
```

```
// html-au example
// this might be overkill, I might not need two components, I bet I could just re-render the whole form with a little extra work. This is a good two component example then.

export class UserDetailsForm extends HTMLFormElement{
  connectedCallback(){
    const frag = html`<div>
        <input name='first_name' type='text'/>
        <input name='last_name' type='text'/>
      </div>
    this.append(frag)
  }
}
defineElement('user-details-form', UserDetailsForm, 'form')

class UserDetailsInfo extends HTMLElement {
  body:FormData // data is being passed into the component as FormData
  connectedCallback(){
    const model = Object.fromEntries(body)
    const frag =  html`
         <div id="first_name">${model.first_name}</div>
        <div id="last_name">${model.last_name} </div>`
      `
    this.append(frag)
  }
}
defineElement('user-details', UserDetailsInfo)
// html that ties it all together

// this html to create the components would be inside another component, or could be any html on the page.

<form
  is="user-details"
  au-post="user-details"
  au-trigger="input"
  au-target="user-details"
></form>
<user-details></user-details>
```



```
// html-au example
// as a single component 

export class UserDetailsForm extends HTMLFormElement{
  body:FormData // data is being passed into the component as FormData
  model = {
    first_name:'',
    last_name:''
  }
  connectedCallback(){
    if(this.body){
      this.model = Object.fromEntries(body)
    }
    const frag = html`<div>
        <input name='first_name' type='text' value="${this.model.first_name}"/>
        <input name='last_name' type='text' value="${this.model.last_name}"/>
      </div>
      <div id="first_name">${this.model.first_name}</div>
      <div id="last_name">${this.model.last_name} </div>`
      `
    this.append(frag)
  }
}


// this html to create the components would be inside another component, or could be any html on the page.

<form
  is="user-details"
  au-post="user-details"
  au-trigger="input"
  au-target="user-details"
></form>
```