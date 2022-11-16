# 11ty Solid Base

A minimal base HTML5 template and the esbuild setup to compile your Solid-js app alongside 11ty.

Includes [11ty/is-land](https://www.11ty.dev/docs/plugins/partial-hydration/), [WebC](https://www.11ty.dev/docs/languages/webc/), [esBuild](https://esbuild.github.io), minifiying and autoprefixing of styles using [Lightning CSS](https://lightningcss.dev/). If you have different preferred browser targets, be sure to modify both the package `browserslist` and the value of `--target` within the `processcss` script.

## Complie Solidjs to js
Add `your_solid.jsx` file to the `src/assets/app` folder. Esbuild will output a minified js file. To configure esbuild modify `config/build/esbuild.js`.

## Shortcode
If you need to compile your js script inline, use this shortcode:

~~~liquid
{% solid %}
  your.solid.jsx.code
{% endsolid %}
~~~
To configure esbuild for the shortcode, modify `config/shortcode/solidify.js`

## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass and JS changes.

**`npm run build`**

> Production build with autoprefixed CSS but no minification. 

**`npm run minify`**

> Production build includes minified, autoprefixed CSS

Use this as the "Publish command" if needed by hosting such as Netlify.
