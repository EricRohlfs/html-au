# HTML-AU
HTML-AU is inspired by HTMX. Instead of rendering HTML on the server like HTMX, HTML-AU uses client side JavaScript native customElements to generate html.

Unlike HTMX, HTML-AU does not try to conform to [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)

Uses the fundamentals of get and post to pass data between components. Can even pass data to the sever the pass then pass the response to the component.

## Install
```npm i html-au```

## Quick Start

``` js
// app.js
import './src/helloWorld.js' // your customElement
import {auObserver, defaultConfig, html} from '../src/index.js';
auObserver(document.body, defaultConfig)
// assuming you have a component registered as hello-world
const someHtml = html`
      <button au-trigger='click' au-target='main' au-ced='hello-world?msg=nice to meet you'>click</button>
      <main></main>
`
document.body.append(someHtml)

```

## Project Technical Summary
An html attribute based reactive framework for web components. Inspired by HTMX.
HTMX renders html on the server. HTML-AU renders html on the client using the ES6 customElement specification.  The idea being if the amount of code to write to generate html is about the same on the client vs the server, save the http call and do the work on the client. With a hook to send data to and from the server. Which is helpful for existing api based web projects.

CED Component Element Description

CED explained
[MDN CreateElement for web components](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement#web_component_example)

``` html
  <div au-ced='div?is=hello-world&msg=nice to meet you'>click</div>
```
Translates to 
``` js
  const helloWorldCED = {
    tagName:'div',
    attributes:{
      is:'hello-world',
      msg:'nice to meet you'
    }
  }
  createElement(helloWorldCED)
```
Which is equivalent to
``` js
  const ele = document.createElement('div', {is: 'hello-world'} )
  ele.setAttribute('msg','nice to meet you')
  // pre connectedCallback <div is="hello-world" msg="nice to meet you"></div>
  // post connectedCallback <div is="hello-world" msg="nice to meet you">nice to meet you<div>
```

customElement
``` js
export class HelloWorld extends HTMLElement{
  connectedCallback(){
    this.textContent = this.getAttribute('msg')
  }
}
```
## Example Click Counter

``` js
// simple input and button. Clicking the button updates the input value.
// the rendered live html

  <click-counter>
    <input name="counter" value="54">
    <button
        au-trigger="click"
        au-ced="click-counter"
        au-include="closest click-counter"
        // au-server="post ./api/click" // to post the data to a server, then send the results to the component
        au-target="post closest click-counter">add one</button>
  </click-counter>

```

Click counter custom element

html`<div></div>` is our template literal sanitization library that returns a document fragment
``` js
import { html } from '../../src/utils/index.js'
export const CLICK_COUNTER = 'click-counter'

export class ClickCounter extends HTMLElement {
  body: FormData;

  connectedCallback() {
    const previousCount = Number(this?.body?.get('counter') ?? 0)
    const count = (previousCount + 1).toString()
    const frag = html`
      <input name='counter' value='${count}' />
      <button
        au-trigger='click'
        au-ced='${CLICK_COUNTER}'
        au-include='closest ${CLICK_COUNTER}'
        au-target='post closest ${CLICK_COUNTER}'>click me</button>
    `
    this.append(frag)
  }
}

```
