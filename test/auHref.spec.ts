import { auHref } from "../src/plugins/auHref.js";
import { auElementType, pluginArgs } from "../src/types.js";

const _window = {
  location:{
    hash:''
  }
}

describe('auHref function', () => {
  let ele
  beforeEach(()=>{
    ele = document.createElement('div')
  })
  it('should return null if auMeta.auHref is null', async () => {
    const plugIn = { ele };
    const result = await auHref(plugIn, {_window});
    expect(result).toBeNull();
  });

  it('should return the expected hash value if auMeta.auHref is "use au-ced"',async () => {
    const tagName = 'example-tag';
    const qs = new URLSearchParams('param=value');
    ele.setAttribute('au-href','use au-ced')
    const plugIn = {
      ele,
      auMeta: {
        auCed: {
          tagName,
          qs,
        },
      },
    } as Partial<pluginArgs>;

    const result = await auHref(plugIn, {_window});
    expect(result).toBe(`#${tagName}?${qs}`);
  });

  it('should return the expected hash value for other values of auMeta.auHref', async() => {
    const auHrefValue = 'some-hash-value';
    ele.setAttribute('au-href', auHrefValue)
    const plugIn = { ele } as Partial<pluginArgs>;
    const result = await auHref(plugIn, {_window});
    expect(result).toBe(`${auHrefValue}`);
  });
});
