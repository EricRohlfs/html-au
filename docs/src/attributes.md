

## au-target
- method: get or post
- selector strategy
- selector

'get' passes any included data a attributes

```  au-target="get closest div" ```

### Click counter example

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

When button is clicked is equivalent to

``` js 

const oldClickCounter = button.closest('click-counter')
const input = oldClickCounter.querySelector('input')
const formData = new FormData()
formData.set(input.name, input.value);

const clickCounterCED ={
  tagName:'click-counter',
  properties:{
    body: formData
  }
}
const newClickCounter = createElement(clickCounterCED)
oldClickCounter.replaceWith(newClickCounter)
```

clickCounterCED is the same as 
``` js
  const clickCounter = documnet.createElement('click-counter')
  clickCounter.body = formData

```