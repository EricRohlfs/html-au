# Technical Description

## Custom Elements as Templates

The technical goal is to limit the amount of code written in 
custom elements to primarily template work.

It is extremely helpful to know how to build custom elements.

- create it
  - wire up the connectedCallback to render a template
- define it in the browser


## Off Ramp
Every technology should have an off ramp.

- start with basic usage (todo: what does this mean?)
- when data does not align, map it in your component before you render the template literal.
- if that does not work, I'm working on an attribute directive to attach the previous version of the custom element as a property of the new one. Then the component can interrogate.
- use a different approach to solve the issue at hand. But I would like to know that use case, maybe there is a new feature to be added. So please post an issue on Github.


