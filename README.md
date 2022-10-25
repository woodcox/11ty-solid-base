# 11ty Solid Base

Nothing but a base HTML5 template and the esbuild setup to compile your Solid-js app alongside 11ty.

Includes [11ty/is-land](https://www.11ty.dev/docs/plugins/partial-hydration/), [WebC](https://www.11ty.dev/docs/languages/webc/), [esBuild](https://esbuild.github.io), minifiying and autoprefixing of styles `postbuild` using [Lightning CSS](https://lightningcss.dev/). If you have different preferred browser targets, be sure to modify both the package `browserslist` and the value of `--target` within the `postbuild` script.

## Shortcode

## Development Scripts

~~~liquid
{% solid %}
  your.solid.jsx.code
{% endsolid %}
~~~

## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass changes

**`npm run build`**

> Production build with no minification, autoprefixed CSS

**`npm run minify`**

> Production build includes minified, autoprefixed CSS

Use this as the "Publish command" if needed by hosting such as Netlify.
