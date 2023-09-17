import { callback, config } from "../../src/index.js";
import { createElement, defineElement } from '../../src/utils/index.js';
import { ClickCounter } from "./clickCounter.js";
import { HomeView } from "./home.js";
import { UserDetailsForm, UserDetailsInfo, UserDetailsSingle } from "./userDetails.js";

defineElement('home-view', HomeView)
defineElement('click-counter', ClickCounter)
defineElement('user-details-form', UserDetailsForm, 'form')
defineElement('user-details-info', UserDetailsInfo)
defineElement('user-details-single', UserDetailsSingle, 'form')


const hv = createElement<ClickCounter>({
  tagName:'home-view'
})

const observer = new MutationObserver(callback)
observer.observe(document.body, config)
document.body.appendChild(hv)

