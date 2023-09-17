import { encodeHTML } from '../common.js';

/** see the html function as an example for usage */
function htmlTemplateLitBase(forTag:string){

  /**
    * prevents xss by escaping the data
    * ensures no attributes start with on like onerror or other.
    */
  function html(htmlStrings:TemplateStringsArray, ...data:string[]):DocumentFragment {
    const results = [];
    for (let i = 0; i < htmlStrings.length; ++i) {
      results.push(htmlStrings[i]);
      if (i < data.length) {
        results.push(encodeHTML(data[i]));
      }
    }
    /**
    * Architecture Decision:
    * Using a template to create the element seemed to work nicely at first
    * but had an unexpected side effect of not invoking the customElement definition
    * nothing was available after selecting the nodes, no functions, properites, getters/setters
    * since the main use case is returning something we can work on, template is not used.
    * const tempDoc = document.createElement('template')
    * tempDoc.innerHTML =  results.join('');
    * return tempDoc.content
    */
    const tempDoc = document.createElement(forTag);
    // eslint-disable-next-line no-unsanitized/property
    tempDoc.innerHTML = results.join('');
    const frag = new DocumentFragment();
    if(forTag === 'table' && results[0].startsWith('<tr')){
      // when a table automatically creates a tbody we need to remove
      frag.prepend(...tempDoc.firstElementChild.childNodes);
    }else{
      frag.prepend(...tempDoc.childNodes);
    }
    return frag;
  }

  return { html };
}

/**
 * Prevents xss by escaping the data
 * It is recommended to use the factory for anything other than div
 */
export function html(htmlStrings:TemplateStringsArray, ...data:string[]):DocumentFragment {
  // eslint-disable-next-line no-unsanitized/method
  return htmlTemplateLitBase('div').html(htmlStrings, ...data);
}

/**
 * Prevents xss by escaping the data when building html tables.
 * There is a known issue/feature about adding tr tags as children of DIV's, this fixes that issue.
 */
export function htmlForTable(htmlStrings:TemplateStringsArray, ...data:string[]):DocumentFragment {
  // eslint-disable-next-line no-unsanitized/method
  return htmlTemplateLitBase('table').html(htmlStrings, ...data);
}
