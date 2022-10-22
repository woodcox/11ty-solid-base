---
layout: base.html
title: Hello World
---

## Solid JS Counter
<is-land on:media="(min-width: 30em)">
  <counter-component>
    <div>Count value is 0</div>
  </counter-component>
  <template data-island="replace">
    <div id="app"><div>
    <script src="{{ '/assets/app/app.min.js' | url | version }}"></script>
  </template>
</is-land>
