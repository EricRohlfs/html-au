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
