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
The developer benefit to re-rendering is significantly less code.

I was very excited about this discovery and started sharing it with other devs.  They were skeptical. I would show them my production app, they agreed it was fast. But they were not seriously going to consider adopting the practice. I get it. It sounds crazy and goes against 15+ years of web development best practices. I don't blame them, had I not lived it, I wouldn't have seriously considered it.

The big mystery to me was, why hasn't anyone else in the industry seized on this idea for simplification. Time is money. Development is not cheap. What am I missing? Isn't the point of technology to make life easier. (I've never understood how react made anyones life any easier.) 

Then I start hearing about [HTMX](https://htmx.org/examples/click-to-edit/). I ignored it for awhile. I just didn't have the time for looking at another framework.

When I found out what HTMX did ... I was like 'YES' there it is! I'm not alone in the belief to just re-render! And what a brilliant idea to use attributes to do it.

The only downside for me was, I don't need or want to do this on the server. My customElements look just like the server code, and they area already on the browser. It didn't make sense to me to try to do that work in a server side environment when it's just as many lines in JavaScript IF YOU ARE NOT TRYING TO DO UPDATES!!!!!!!!!!

I browsed through their docs, looked through their code and immediately started creating this. Four hours later I had my first few use cases working.

At some point I need to take time and actually build an app with HTMX. But for now having too much fun putting this together.
