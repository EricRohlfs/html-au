
/**
 * query known form element types and make new FormData out of them.
 */
export function makeFormData(node: HTMLElement): FormData {
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
      console.warn(`Hey developer, you might have a copy paste error in your form on name ${ctrol.name}`)
    }
    fd.set(ctrol.name, ctrol.value)
  })
  
  return fd;
}
