import { callback, config } from "../../src/index.js";
import { createElement, defineElement } from '../../src/utils/index.js';
import { ClickCounter } from "./clickCounter.js";
import { HelloWorldDiv } from "./helloWorld.js";
import { HomeView } from "./homePage.js";
import { UserDetailsForm, UserDetailsInfo, UserDetailsSingle } from "./userDetails.js";

defineElement('home-view', HomeView)
defineElement('click-counter', ClickCounter)
defineElement('user-details-form', UserDetailsForm, 'form')
defineElement('user-details-info', UserDetailsInfo)
defineElement('user-details-single', UserDetailsSingle, 'form')
defineElement('hello-world-div', HelloWorldDiv, 'div')

const hv = createElement<HomeView>({
  tagName:'home-view'
})

const observer = new MutationObserver(callback)
observer.observe(document.body, config)
document.body.appendChild(hv)

