import { auHref } from "../src/eventListener/auHref.js";

const stubWindow = {
  location:{
    hash:''
  }
}

describe('auHref function', () => {
  it('should return null if auMeta.auHref is null', async () => {
    const plugIn = {
      auMeta: {
        auHref: null,
      },
    };
    // @ts-ignore
    const result = await auHref(plugIn, stubWindow);

    expect(result).toBeUndefined();
  });

  it('should return the expected hash value if auMeta.auHref is "use au-ced"',async () => {
    const tagName = 'example-tag';
    const qs = 'param=value';
    const plugIn = {
      auMeta: {
        auHref: 'use au-ced',
        auCed: {
          tagName,
          qs,
        },
      },
    };
    // @ts-ignore
    const result = await auHref(plugIn, stubWindow);

    expect(result).toBe(`#${tagName}?${qs}`);
  });

  it('should return the expected hash value for other values of auMeta.auHref', async() => {
    const auHrefValue = 'some-hash-value';
    const plugIn = {
      auMeta: {
        auHref: auHrefValue,
      },
    };
    // @ts-ignore
    const result = await auHref(plugIn, stubWindow);

    expect(result).toBe(`${auHrefValue}`);
  });
});
