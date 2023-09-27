import { createElement, defineElement, html } from '../../src/index.js'

const SIMPLE_STORE = 'simple-store';

const store = {
  colors:[] as Array<string>
}

export class SimpleStore extends HTMLElement {
  model = {
    new_color: "",
    favorite_color: null,
    _event_target_tagname: null,
    _event_target_name: null,
    _event_target_value: null,
    counter:0
  }
  constructorCalled: boolean;

  constructor(){
    super();
    this.constructorCalled = true;
  }

  async connectedCallback() {
    if(this.constructorCalled){
      this.model.counter = 0
    }
    // get colors from the server
    if (store.colors.length === 0 ) {
      const req = await fetch('./patch/colors.json')
      store.colors = await req.json()
    } else if (this.model._event_target_name === 'add') {
        store.colors.push(this.model.new_color)
    }

    this.replaceChildren();
    const isSubmit = this.model._event_target_name === 'submit'
    const frag = isSubmit? this.templateLitSubmit() : this.templateLit()
    this.append(frag)
    this.constructorCalled = false;
  }

  templateLitSubmit() {
    return html`
      <h3>${this.model.favorite_color ?? ''} is your favorite color.</h3>
      <button
        au-target="closest main"
        au-ced="post ${SIMPLE_STORE}"
        name="start_over"
        >Start Over</button>
    `
  }

  templateLit() {
    const frag = html`
      <h3>Store Example</h3>
      <p>This is the alternate approach to the patch Example. There is really no code savings. The patch example does not re-render the host element, that is about the only benefit.</p>
      <div>
        The number should stay at 1 to prove we are re-rendering on each change.
        <input name="counter" value="${
        //@ts-ignore
         Number(this.model.counter) + 1}" type="text"/>
      </div>
      <div>
        <label for="new_color">Add Color</label>
        <input name="new_color" />
        <button
          au-include="closest ${SIMPLE_STORE}"
          au-ced="post ${SIMPLE_STORE}"
          name="add"
          >Add</button>
      </div>
      <div>
        <select name="favorite_color"><select>
        <button
          au-include="closest ${SIMPLE_STORE}"
          au-ced="post ${SIMPLE_STORE}"
          name="start_over"
          >Start Over</button>
        <button
          au-include="closest ${SIMPLE_STORE}"
          au-ced="post ${SIMPLE_STORE}"
          name="submit"
          >Submit</button>
      </div>
    `
    const select = frag.querySelector<HTMLSelectElement>(':scope select');
    store.colors.forEach(color => {
      const selected = (this.model.favorite_color === color);
      const opt = createElement<HTMLOptionElement>({
        tagName: 'option',
        attributes: {
          value: color,
          selected
        }, properties: { textContent: color }
      });
      select?.appendChild(opt);
    });
    return frag;
  }
}


defineElement(SIMPLE_STORE, SimpleStore)