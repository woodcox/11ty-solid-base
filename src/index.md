---
layout: base.html
title: 11ty-solid-base
---

## Solid JS Counter
On mobile, turn the phone to landscape to start the counter.

<is-land on:media="(min-width: 30em)">
  <vanilla-web-component>
    <div>Count value is 0</div>
  </vanilla-web-component>
  <template data-island="replace">
    <div id="app"><div>
    <script src="{{ '/assets/app/app.min.js' | url | version }}"></script>
  </template>
</is-land>

<p id="test"></p>
    
{% solid %}  
import { render } from '../node_modules/solid-js/web';

function HelloWorld() {
  return <div>Hello World!</div>;
}

render(() => <HelloWorld />, document.getElementById('test'))

{% endsolid %}
