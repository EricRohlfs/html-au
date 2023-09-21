# HTML-AU
HTML-AU is inspired by HTMX but uses client side JavaScript native customElements to generate html.

Unlike HTMX, HTML-AU does not try to conform to [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)

## Install
```npm i html-au```

## Development

```
// run rollup in watch mode
npm run dev
```

Use a web server such as Go Live in Visual Studio Code to run the examples. You will need to change the port number. [click here after starting live server](http://127.0.0.1:64699/example/basic/index.html)

Unit tests
```
// terminal 1 - rollup in watch mode
npm run build-test
// terminal 2 - karma in watch mode
npm run test-dev
```

## Project Technical Summary
Using HTML attributes to make a DSL for a set of use cases that will re-render the an entire component. Inspired by HTMX.
If the amount of code to write is about the same on the client vs the server, save the http call and do the work on the client.

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
// This code is just as small and concise as it would be in server side code used with htmx.
import { idGen } from "../../src/index.js";
import { html } from '../../src/utils/index.js'
export const CLICK_COUNTER = 'click-counter'

export class ClickCounter extends HTMLElement {
  body: FormData;

  connectedCallback() {
    this.id = `counter-${idGen.next().value}`
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
