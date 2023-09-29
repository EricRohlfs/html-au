import { eventSetupArgs, pluginArgs } from "../types.js";
import { preserveFocusEle } from "./preserveFocus/types.js";



function reverseString(str) {
  return str.split("").reverse().join("");
}

function findFirstNonMatchingIndex(str1, str2) {
  const minLength = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      return i; // Return the index of the first non-matching character
    }
  }

  // If we reach this point, all characters up to the minimum length match
  // Check if one string is longer than the other and return its length as the index
  if (str1.length !== str2.length) {
    return minLength;
  }

  // If both strings are identical, return -1 to indicate no non-matching characters
  return -1;
}


function findFirstAndLastNonMatchingIndices(str1, str2) {
  let firstNonMatchingIndex = -1;
  let lastNonMatchingIndex = -1;

  const minLength = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      if (firstNonMatchingIndex === -1) {
        firstNonMatchingIndex = i;
      }
      lastNonMatchingIndex = i;
    }
  }

  // If one string is longer than the other, handle remaining characters
  if (str1.length !== str2.length) {
    if (firstNonMatchingIndex === -1) {
      firstNonMatchingIndex = minLength;
    }
    lastNonMatchingIndex = minLength;
  }

  return {
    first: firstNonMatchingIndex,
    last: lastNonMatchingIndex,
  };
}

function lastNonMatchingIndex(str1, str2) {
  let index = Math.min(str1.length, str2.length) - 1;

  while (index >= 0 && str1[index] === str2[index]) {
    index--;
  }

  return index;
}

export function setCurrentValue(args: eventSetupArgs) {
  // if a form type, need to store the current values for all the input elements
  // since input or change bubbles
  // might be best to use formdata
  const inputs = args.ele.querySelectorAll<HTMLInputElement>(':scope input')
  //const currentData = makeFormData(args.ele, undefined)
  inputs.forEach(iput => {
    Object.defineProperty(iput, '_preserveFocus', {
      value: iput.value
    })
  })

}


/**
 * this strategy is better than nothing,
 * but when if a user pastes in new matching items, we really don't know where 
 * it was pasted so we are doing a best guess
 * @returns 
 */
export function getSelectionRange(oldValue, newValue) {
  if (oldValue.length === 0 || newValue.length === 0) { return 0 }
  const lenghDelta = oldValue.length - newValue.length
  const isOneCharChange = Math.abs(lenghDelta) === 1
  if (!isOneCharChange) {
    // copy/paste scenario
    const delta = findFirstNonMatchingIndex(reverseString(newValue), reverseString(oldValue))
    return newValue.length - delta//+ (lenghDelta *2)
  }
  return findFirstNonMatchingIndex(oldValue, newValue) + 1
}


/** useful where a form is re-rendering and we want to keep the focus. Ideally this wouldn't need to happen, but it's here. */
export async function preserveFocus(plugin: pluginArgs, args) {
  const preserveFocus = plugin.ele.getAttribute('au-preserve-focus') !== null;
  const target = plugin.e.target as preserveFocusEle
  if (preserveFocus) {
    const setFocusName = target.getAttribute('name')
    let focusEle = plugin.cedEle.querySelector<HTMLInputElement>(`:scope [name=${setFocusName}]`)
    if (focusEle === null) {
      // todo: if a button without a name, then we need a better strategy before bailing out.
      const attrs = ['type', 'class']
      // use a control structure we can break out of
      attrs.forEach(a => {
        const setFocusName1 = target.getAttribute(a)
        const focusEle1 = plugin.cedEle.querySelectorAll<HTMLInputElement>(`:scope [${a}=${setFocusName1}]`)
        if (focusEle1.length === 1) {
          // our query only has one match, so this should be it
          focusEle = focusEle1[0]
        }
      })
      return 0
    }
    focusEle.focus()
    // todo: log or something is _preserveFocus is not there vs failing the app
    const range = getSelectionRange(target._preserveFocus, focusEle.value);
    if (focusEle.setSelectionRange) {
      focusEle.setSelectionRange(range, range);
    }
    return range
  }
}
