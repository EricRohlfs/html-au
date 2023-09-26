


export function getSelects(hostEle:HTMLElement) {
  // todo: might be helpful to return the the options too
  const selects = hostEle.querySelectorAll(':scope select')
  if (selects === null) { return null }
  return Array.from(selects).map( (selectEle :HTMLSelectElement)=> {
    const selectedOption = selectEle.options[selectEle.selectedIndex];
    const val = {
      name: selectEle.name,
      value: selectedOption.value
    }
    // add in the text just for good measure
    const text ={
      name: selectEle.name + '_text',
      value: selectedOption.text
    }
    return [val, text]
  })

}



/**
 * query known form element types and make new FormData out of them.
 * the list of form control elements https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
 * 
 * To support
 * - button
 * - input
 * - textarea
 * - select
 * - output
 * 
 *  Not supported
 * - fieldset
 * - object
 
 */
export function makeFormData(node: HTMLElement): FormData {
  // todo: could see if it is already a form and just return all the controls 
  
  // is single input element so no children to query
  const controls = []
  if (node.tagName === 'INPUT') {
    controls.push(node);
  }
  if (node.tagName === 'BUTTON') {
    controls.push(node)
  }
  // todo:get all form controls
  const inputs = node.querySelectorAll(':scope input')
  controls.push(...inputs)// might not want to spread here, but quick and easy
  // todo: need to do other controls here
  controls.push(getSelects(node))

  const fd = new FormData()

  controls.forEach(ctrol => {
    if (fd.has(ctrol.name)) {
      console.warn(`Developer, you may have a copy/paste error in your form or au-include tree. There is more than one form control with the name ${ctrol.name}`)
    }
    fd.set(ctrol.name, ctrol.value)
  })

  return fd;
}
