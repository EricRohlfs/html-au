import { createElement, defineElement, html } from '../../src/index.js'

const PATCH_EXAMPLE = 'patch-example';

export class PatchExample extends HTMLElement {
 model = {
  colors: [] as Array<string>,
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
    if (this.model.colors?.length === 0 || this.model?._event_target_name === 'start_over') {
      const req = await fetch('./patch/colors.json')
      this.model.colors = await req.json()
    } else if (this.model._event_target_name === 'add') {
        this.model.colors.push(this.model.new_color);
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
        au-target="closest ${PATCH_EXAMPLE}"
        au-ced="get ${PATCH_EXAMPLE}"
        name="start_over"
      >Start Over</button>
    `
  }

  templateLit() {
    const frag = html`
      <h3>Patch Example</h3>
      <p>This is a performance optimization for a particular use case 
            where we want to prevent unnecessary calls to the server just to look up the colors.
      </p>
      <p>An alternate approach would be to store the colors data in a store that is not destroyed on each re-render. And if the store is empty, then make the call to the serve. </p>
      <p>What is happening is au-ced="patch" is short circuiting the workflow and just doing the form binding then calling connectedCallback.</p>
      <div>
        The number should increase to prove we are not re-rendering the outer element on each change. The innerHTML is being re-rendered.
        <input name="counter" value="${
        //@ts-ignore
         Number(this.model.counter) + 1}" type="text"/>
      </div>
      <div>
        <label for="new_color">Add Color</label>
        <input name="new_color" />
        <button
          au-include="closest ${PATCH_EXAMPLE}"
          au-ced="patch"
          name="add"
          >Add</button>
      </div>
      <div></div>
      <div>
        <select name="favorite_color"><select>
        <button
          au-include="closest ${PATCH_EXAMPLE}"
          au-ced="patch"
          
          >Submit</button>
        <button
          au-include="closest ${PATCH_EXAMPLE}"
          au-ced="patch"
          name="start_over"
          >Start Over</button>
      </div>
    `
    const select = frag.querySelector<HTMLSelectElement>(':scope select');
    this.model?.colors?.forEach(color => {
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


defineElement(PATCH_EXAMPLE, PatchExample)