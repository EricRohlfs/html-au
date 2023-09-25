import { auObserver,  createElement, defineElement, html } from "../../src";
import { DialogButtons } from "./dialogButtons";
import './dialogButtons.js'

// want to get the observer running first thing
auObserver(document.body)

const buttons = createElement<DialogButtons>({
  tagName: 'dialog-buttons'
})

document.body.append(buttons)
