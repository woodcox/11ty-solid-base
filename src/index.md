---
layout: base.html
title: 11ty-solid-base
---

## The counter
To test if the island partial hydration is working; on a mobile phone, turn the phone to landscape view. This should swap the html for javascript to start the counter.

<is-land on:media="(min-width: 30em)">
  <counter-component>
    <p>Count value is 0</p>
  </counter-component>
  <template data-island="replace">
    <p id="app"></p>
    <script src="{{ '/assets/app/app.min.js' | url | version }}"></script>
  </template>
</is-land>


## The shortcode
The shortcode adds the js inline, which is not ideal. Going forward I will look at an option to write to the file system.

<is-land on:media="(min-width: 30em)">
  <shortcode-component>
    <p>The solidify shortcode is inactive :)</p>
  </shortcode-component>
  <template data-island="replace">
    <p id="shorty"></p>

{% solid "shorty", "false" %}  
import { render } from './node_modules/solid-js/web';

function Solidify() {
  return <div>The solidify shortcode is active!</div>;
}

render(() => <Solidify />, document.getElementById('shorty'))
{% endsolid %}
    
  </template>
</is-land>

To do:
  - option to write to location in `docs` folder (maybe this should be via the `config/shortcode/solidify` file)
  - bundle all solidify shortcodes into one js file 

## The web component
To do: 
 - look at [11ty docs](https://www.11ty.dev/docs/languages/webc/) & [11ty.rocks](https://11ty.rocks/)
 - A webC example



