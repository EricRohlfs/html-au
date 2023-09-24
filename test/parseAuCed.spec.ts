import { defaultConfig } from "../src/defaultConfig.js";
import { parseAuCed } from "../src/eventListener/parseAuCed.js";

describe('parseAuCed', () => {
  it('should parse a raw string with verb', () => {
    const raw = 'post div?is=hello-world';
    const parsed = parseAuCed(raw, defaultConfig);
    const sp = new URLSearchParams('is=hello-world');
    expect(parsed).toEqual({
      raw,
      verb: 'post',
      tagName: 'div',
      qs: sp,
    });
  });

  it('should parse a raw string without verb', () => {
    const raw = 'div?is=hello-world';
    const sp = new URLSearchParams('is=hello-world');
    const parsed = parseAuCed(raw, defaultConfig);
    expect(parsed).toEqual({
      raw,
      verb: defaultConfig.auCed.verb,
      tagName: 'div',
      qs: sp,
    });
  });

  it('should parse a raw string with no query string', () => {
    const raw = 'get span';
    const parsed = parseAuCed(raw, defaultConfig);
    const sp = new URLSearchParams('');
    expect(parsed).toEqual({
      raw,
      verb: 'get',
      tagName: 'span',
      qs: sp,
    });
  });
});