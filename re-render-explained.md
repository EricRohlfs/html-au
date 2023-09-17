
# Re-render explained

Fist, I'll explain what updates in native web component custom elements. Then then I'll explain re-render. Then HTML-au.

Updates are when you render a component with data, then as the data changes you update just the data on the DOM. The existing elements stay and the goal is to update the smallest parts necessary.

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


## Separation of Concerns between child to parent components

In raw native web components with no framework, it has been said that a child reaching up to a parent element is not good and too tightly couples the components together.  Then what do we do?  Most use that some other strategy such as events. Events are good, but then the component needs to throw the event, then the parent needs to listen for the event. This is not too difficult. So now the components are decoupled, but are tied together via the eventing system.

For me it depends on what I'm donig. In some cases I'll create a child component just to better organize my code and the parent and child know about each other. No events used. It's easier to query for the parent and call a class method than to wire up events.

HTML-au can be thought of as a DSL to facilitate child parent interactions. 

