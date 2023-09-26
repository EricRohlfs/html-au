import { getSelects } from "../src/eventListener/auFormData.js";


describe('getSelects Function', () => {
  let hostElement: HTMLElement;

  beforeEach(() => {
    hostElement = document.createElement('div');
    //document.body.appendChild(hostElement);
  });

  afterEach(() => {
    // document.body.removeChild(hostElement);
  });

  it('should return null for no select elements', () => {
    const result = getSelects(hostElement);
    expect(result?.length).toBe(0)
  });

  it('should return an array of select values and text', () => {
    // Arrange
    const select1 = document.createElement('select');
    select1.name = 'select1';
    const option1 = document.createElement('option');
    option1.value = 'value1';
    option1.text = 'Option 1';
    select1.appendChild(option1);

    const select2 = document.createElement('select');
    select2.name = 'select2';
    const option2 = document.createElement('option');
    option2.value = 'value2';
    option2.text = 'Option 2';
    select2.appendChild(option2);

    hostElement.appendChild(select1);
    hostElement.appendChild(select2);

    // Act
    const result = getSelects(hostElement);

    // Assert
    expect(result).toEqual([
      [
        { name: 'select1', value: 'value1' },
        { name: 'select1_text', value: 'Option 1' },
      ],
      [
        { name: 'select2', value: 'value2' },
        { name: 'select2_text', value: 'Option 2' },
      ],
    ]);
  });

  
  it('should option with empty value should return the text', () => {
    // this is part of the browser spec, nothing special to code.
    const select1 = document.createElement('select');
    select1.name = 'select1';
    const option1 = document.createElement('option');
    option1.text = 'Option 1';
    select1.appendChild(option1);

    const select2 = document.createElement('select');
    select2.name = 'select2';
    const option2 = document.createElement('option');
    option2.text = 'Option 2';
    select2.appendChild(option2);

    hostElement.append(select1, select2);

    const result = getSelects(hostElement);

    // Assert
    expect(result).toEqual([
      [
        { name: 'select1', value: 'Option 1' },
        { name: 'select1_text', value: 'Option 1' },
      ],
      [
        { name: 'select2', value: 'Option 2' },
        { name: 'select2_text', value: 'Option 2' },
      ],
    ]);
  });

  // Add more test cases as needed to cover different scenarios
});
