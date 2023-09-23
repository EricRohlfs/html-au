import { auObserver,  createElement, defineElement, html } from "../../src";
import { DialogButtons } from "./dialogButtons";

// want to get the observer running first thing
auObserver(document.body)

const buttons = createElement<DialogButtons>({
  tagName: 'dialog-buttons'
})

document.body.append(buttons)
