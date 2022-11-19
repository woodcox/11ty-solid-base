# 11ty Solid Base

A minimal base HTML5 template and the esbuild setup to compile your SolidJS app alongside 11ty.

Includes [11ty/is-land](https://www.11ty.dev/docs/plugins/partial-hydration/), [WebC](https://www.11ty.dev/docs/languages/webc/), [esBuild](https://esbuild.github.io), minifiying and autoprefixing of styles using [Lightning CSS](https://lightningcss.dev/), a shortcode to compile SolidJS inline and cashebusting via an esbuild generated hash.

## Compile Solidjs to js
Add `your_solid.jsx` file to the `src/assets/app` or the `src/assets/js` folders. Esbuild will output a minified js file. To configure esbuild modify `config/build/esbuild.js`.

## Shortcode
If you need to compile your js script inline, use this shortcode:

~~~liquid
{% solid "filename", "bundled" %}
  your.solid.jsx.code
{% endsolid %}
~~~

To configure esbuild for the shortcode, modify `config/shortcode/solidify.js`

### Arguments
There are two optional arguments:
- `filename`: The name of the file which is saved to `docs/assets`. This name is automatically prefixed by `solid-`.
- `bundled`: The solid.jsx is bundled by default. To switch bundling off pass the value: `"bundleOff"`.

## Cachebusting hash filter

Esbuild is configured to add a hash to the JS files it processes in the `src/assets/app` or the `src/assets/js` folders. It outputs a `manifest.json` file to the `src/_data` directory.
The manifest.json file is used in the hash filter to modify the URL href in the html:

~~~html
<script src="{{ '/assets/app/app.js' | hash }}"></script>
~~~

As a bonus if the file has been minified in production it will alter the file extension to `[hash]-min.js`, for example:

~~~html
<script src="/assets/app/app-S5YUTCHU.min.js"></script>
~~~

## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass and JS changes.

**`npm run build`**

> Production build with autoprefixed CSS but no minification. 

**`npm run minify`**

> Production build includes minified, autoprefixed CSS

Use this as the "Publish command" if needed by hosting such as Netlify.

## To do

- option to write shortcode to location in docs folder (maybe this should be via the config/shortcode/solidify file)
- bundle all solidify shortcodes into one js file
- The web component (webC example)
- improve styling
- make prettier hydration examples
