import {CED, auObserver, createElement, defineElement, html, defaultConfig} from '../src/index.js';
import './basic/clickCounter.js'
import './user-form/index.js'
import './dialog/dialogButtons.js'
import { HelloWorldDiv } from './basic/helloWorld.js';
import './patch/patch.js';
import './store/store.js'
import './auElementGenerator/auElementGenerator.js'

defineElement('hello-msg', HelloWorldDiv,'div')

auObserver(document.body, defaultConfig);

const pageLayout = html`
  <h1>Examples</h1>
  <nav>
    <button
      au-href="use au-ced"
      au-ced='get div?is=hello-msg&msg=Hello World'
      au-swap="innerHTML"
      au-target="main"
      >Hello Message using get</button>
    <!-- todo this should still work and copy the query params over -->
    <button
      au-href="#div?is=hello-msg&msg=Hello"
      au-ced="post div?is=hello-msg&msg=Hello"
      au-swap="innerHTML"
      au-target="main"
      > Hello Message post</button>

    <a 
      href="#click-counter"
      au-trigger="click"
      au-ced="post click-counter"
      au-target="main"
      au-swap="innerHTML"
      >Click Counter</a>

      <a 
      href="#user-form"
      au-trigger="click"
      au-ced="post user-form"
      au-target="main"
      au-swap="innerHTML"
      >User Form</a>

      <a 
      href="#user-form"
      au-trigger="click"
      au-ced="post user-form"
      au-target="main"
      au-swap="innerHTML"
      >User Form</a>
      
      <!-- automatically adds trigger='click' from the default config -->
      <a
      href="#dialog-buttons"
      au-ced="post dialog-buttons?open"
      au-target="main"
      au-swap="innerHTML"
      >Dialog Buttons</a>

    <a 
      href="#patch-example"
      au-ced="post patch-example"
      au-target="main"
      au-swap="innerHTML"
      >Patch Example<a>
    
    <a 
      href="#simple-store"
      au-ced="patch-example"
      au-target="main"
      au-swap="innerHTML"
      >Simple Store<a>
    
      <a 
      href="#element-generator"
      au-ced="element-generator"
      au-target="main"
      au-swap="innerHTML"
      >AU Element Generator<a>
      
  </nav>
  <main></main>
`

// nothing to do with html-au, just a development time saver: loads the last component on page refresh
const main = pageLayout.querySelector(':scope main') as HTMLElement;
const view = window.location.hash
// todo: could has if it has is
const noHash = view.replace('#','')
const split = noHash.split('?')
const tagName = split[0]

if(view?.length > 0){
  const ced = {
    tagName,
    attributes:{
      is: new URLSearchParams(split[1]).get('is')
    }
  } as CED<HTMLElement>
  const report = createElement(ced);
  main?.replaceChildren();
  main?.append(report);
}

document.body.append(pageLayout)