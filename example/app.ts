import {auObserver, html} from '../src/index.js';
import './basic/clickCounter.js'
import './user-form/index.js'

auObserver(document.body);

const pageLayout = html`
  <h1>Examples</h1>
  <nav>
    <a 
      href="#click-counter"
      au-trigger="click"
      au-post="click-counter"
      au-target="main"
      au-swap="innerHTML"
      >Click Counter</a>

      <a 
      href="#user-form"
      au-trigger="click"
      au-post="user-form"
      au-target="main"
      au-swap="innerHTML"
      >User Form</a>
  </nav>
  <main></main>
`

// nothing to do with html-au, just a development time saver: loads the last component on page refresh
const main = pageLayout.querySelector(':scope main') as HTMLElement;
const view = window.location.hash
if(view?.length > 0){
  const report = document.createElement(view.replace('#','')) as HTMLElement;
  main?.replaceChildren();
  main?.append(report);
}

document.body.append(pageLayout)