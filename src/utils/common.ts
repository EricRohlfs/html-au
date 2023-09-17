/**
 * This is the OWASP encodeHTML function, useful if you need to sanitize strings and not use template literals.
 * This used to be the primary encoding function, but has been replaced with document.createTextNode().
 * Note, createTextNode is weird in that it does lazy evaluation, so if you use it instead of this function, be sure it works correctly.
 */
export function encodeHTML(value: string) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * best used to sanitize templates where the output is either a real string or log msg.
 * to encode template literals for use in making html, use taggedTemplateLit
 */
export function escapeString(html: TemplateStringsArray, ...data: string[]) {
  const results = [];
  for (let i = 0; i < html.length; ++i) {
    results.push(html[i]);
    if (i < data.length) {
      results.push(encodeHTML(data[i]));
    }
  }
  return results.join('');
}
