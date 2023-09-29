import { createElement } from "../src/index.js";
import { preserveFocus } from "../src/plugins/preserveFocus.js";
import { preserveFocusEle } from "../src/plugins/preserveFocus/types.js";

describe('preserveFocus function', () => {
  it('should not preserve focus if "au-preserve-focus" attribute is not present', async () => {
    // Create a mock plugin object with no "au-preserve-focus" attribute
    const plugin = {
      ele: document.createElement('div'), // You can use any HTML element here
      e: {
        target: document.createElement('input'), // You can use any input element here
      },
      cedEle: document.createElement('div'), // You can use any HTML element here
    };
    

    //(plugin.ele as unknown as  preserveFocusEle)._preserveFocus = ''

    // @ts-ignore
    const result = await preserveFocus(plugin, undefined);
    expect(result).toBe(undefined);
    // Expect that no element has focus
    //expect(document.activeElement).not.toBe(plugin.e.target);
  });

  it('should preserve focus and set focus on the correct element if "au-preserve-focus" attribute is present', async () => {
    const inputElement = createElement<preserveFocusEle>({
      tagName: 'input',
      attributes: {
        name: 'testInput',
        value: 'Jane'
      },
      properties: {
        _preserveFocus: 'Jan'
      }
    })

    const ele = createElement<HTMLElement>({
      tagName: 'div',
      attributes: {
        'au-preserve-focus': true
      }
    })

    const plugin = {
      ele,
      e: {
        target: inputElement //document.createElement('input'), // You can use any input element here
      },
      cedEle: document.createElement('div'), // You can use any HTML element here
    };

    // Append the input element to the cedEle
    plugin.cedEle.appendChild(inputElement);

    // @ts-ignore
    const focusLength = await preserveFocus(plugin, undefined);
    expect(focusLength).toBe((inputElement as unknown as HTMLInputElement).value.length);
  });
});
