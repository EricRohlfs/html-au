# html-au
HTML-au is Like HTMX but uses native web components on the client to generate html fragments vs using server side rendering.

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
The answer is yes I could. After I figured out a few things and accepted components for what they are, I liked them better than angular.js, vue.js and react.

I quickly discovered that re-rendering components is just as fast as trying to update existing DOM elements. Updating existing elements is the whole point of angular.js, vue.js and react.

This discovery is a double win: less code and faster development time via less code I had to write.

I was very excited about my re-rendering discovery and started sharing it with others.  They were skeptical and the data alone was not enough to convince them to change their development practices.

I often thought why hadn't our industry seized on this idea. Was it because Internet Explorer? Inertia?  Time is money. Development is not cheap. What was I missing?

Enter [HTMX](https://htmx.org/examples/click-to-edit/). I ignored it for awhile. I just didn't have the time to looking at another framework.

When I finally took a look and found out what HTMX did ... I was like 'YES' there it is! Independent confirmation that in many cases re-rendering does not negatively impact the user! And what a brilliant idea to use attributes to do it.

My issue with HTMX was I did not want to generate my html on the server. My customElements look just like the server code.

I browsed through the HTMX docs and looked through their code and immediately started creating this. Three hours later I had my first few use cases working.

## The au- tag prefix
No technical reason. I just liked it.
