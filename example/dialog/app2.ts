import { auObserver,  createElement, defaultConfig } from "../../src/index.js";
import { DialogButtons } from "./dialogButtons";
import './dialogButtons.js'

// want to get the observer running first thing
auObserver(document.body, defaultConfig)

const buttons = createElement<DialogButtons>({
  tagName: 'dialog-buttons'
})

document.body.append(buttons)
