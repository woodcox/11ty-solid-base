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
The manifest.json file is used in the hash filter to modify the URL src in the html:

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

- [esbuild-plugin-cache](https://github.com/dalcib/esbuild-plugin-cache) can cache http/https imports. But its an esm plugin which is incompatable with 11ty. Convert to from mjs to cjs, then could import http/https without installing npm packages on node_modules similar to snowpack/skypack. It also allows use of import-maps.
- Consider making repo framework agnostic. As I think the esbuild config and shortcode may be able to accomodate other frameworks. This would make the repo way more useful to the 11ty community. Caching https imports would be beneficial as would not need any framework related node modules dependencies in the repo. Would need the relevant esbuild plugins for the frameworks. 
- should I make it agnostic to the method devs compile CSS, as everyone has their own preferred way to generate CSS?  
- compile css through esbuild so can use the hash filter, drop lightningcss? or just use purgecss in esbuild
- look as using webc bundle to bundle all solidify shortcodes into one per page
- The web component (webC example)
- improve styling
- make prettier hydration examples
- not sure about this - option to write shortcode to location in docs folder (maybe this should be via the config/shortcode/solidify file)
