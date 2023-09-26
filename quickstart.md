

# Quickstart

``` html
  .. in head
  <script type="module>">
    import { auObserver, defaultConfig } form './html-au/dist/browser/js/index.js';
    import { HelloMsg } from './hello-msg.js'
    customElements.define('hello-msg', HelloMsg);
    auObserver(document.body, defaultConfig)
  </script>
  ... in body
  <button au-trigger='click' au-ced='post hello-msg' au-target="main" au-swap='innerHTML' name='msg' value='Hello World'>Show Message</button>
  <main></main>
  // returns
  <main><hello-msg>Hello World</hello-msg></main>
 ```