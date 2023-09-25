
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
  
  const controls = []
  // todo:get all form controls
  const inputs = node.querySelectorAll(':scope input')
  controls.push(...inputs)// might not want to spread here, but quick and easy
  // todo: need to do other controls here
  // is single input element so no children to query
  if(node.tagName === 'INPUT'){
    controls.push(node);
  }
  if(node.tagName === 'BUTTON'){
    controls.push(node)
  }
  const fd = new FormData()

  controls.forEach(ctrol => {
    if(fd.has(ctrol.name)){
      console.warn(`Hey developer, you might have a copy paste error in your form. There is more than one form control with the name ${ctrol.name}`)
    }
    fd.set(ctrol.name, ctrol.value)
  })
  
  return fd;
}
