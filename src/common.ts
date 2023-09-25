export function isAuElement(ele: Element) {
  return Array.from(ele.attributes).find(attr => attr?.name.startsWith('au-'))
}

export function objectToQueryParams(obj) {
  const params = Object.keys(obj).map((key) => {
    if (obj[key]) {
      return`${key}=${encodeURIComponent(obj[key])}`;
    }
  });
  return (params.length) ? `?${params.join('&')}` : '';
}
