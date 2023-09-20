export function isAuElement(ele: Element) {
  return Array.from(ele.attributes).find(attr => attr?.name.startsWith('au-'))
}
