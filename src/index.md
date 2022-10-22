---
layout: base.html
title: Hello World
---

## Solid JS Counter
<is-land on:media="(min-width: 30em)">
  <vanilla-web-component>
    <div>Count value is 0</div>
  </vanilla-web-component>
  <template data-island="replace">
    <div id="app"><div>
    <script src="{{ '/assets/app/app.min.js' | url | version }}"></script>
  </template>
</is-land>
