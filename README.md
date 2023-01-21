<div align="center">
  <img src="https://user-images.githubusercontent.com/64870518/212966953-811d880b-e53f-4f07-ad4e-759566539b62.png" alt="11ty solid base">
</div>
<br>

A minimal base HTML5 template and the [esbuild](https://esbuild.github.io/) setup to **compile your SolidJS app within 11ty**.

Includes:
  - [11ty/is-land](https://www.11ty.dev/docs/plugins/partial-hydration/)
  - [WebC](https://www.11ty.dev/docs/languages/webc/), 
  - [esbuild](https://esbuild.github.io)
  - Minifiying and autoprefixing of styles using [Lightning CSS](https://lightningcss.dev/)
  - Uses [Purgecss](https://purgecss.com/) to remove unused styles via a sligtly modified version of [esbuild-plugin-purgecss-2](https://github.com/arslanakram/esbuild-plugin-purgecss-2.0/blob/master/src/index.js)
  - A [shortcode](https://github.com/woodcox/11ty-solid-base/blob/main/config/shortcodes/solidify.js) to compile SolidJS inline
  - Cashebusting via an esbuild generated hash.
  - A [manifest.json file and a buildmeta.json file](https://github.com/woodcox/11ty-solid-base/tree/main/src/_data)
  - You can also import HTTP URLs into JavaScript code using [esbuild-plugin-http](https://github.com/hyrious/esbuild-plugin-http).

## Compile Solidjs to js
Add `your_solid.jsx` file to the `src/scripts/jsx` or the `src/scripts/js` folders. Esbuild will output a minified js file. To configure esbuild modify `config/build/esbuild.js`.

## Shortcode
If you need to compile your js script inline, use this shortcode:

~~~liquid
{% solid "filename", "bundled" %}
  your.solid.jsx.code
{% endsolid %}
~~~

The shortcode will generate a module script tag. 

~~~html
<script type="module">your.es6.js.code</script>
~~~

To configure esbuild for the shortcode, modify `config/shortcode/solidify.js`

### Arguments
There are two optional arguments:
- `filename`: The name of the file which is saved to `docs/assets`. This name is automatically prefixed by `solid-`.
- `bundled`: The solid.jsx is bundled by default. To switch bundling off pass the value: `"bundleOff"`.

## Cachebusting hash filter

Esbuild is configured to add a hash to the CSS and JS files it processes in the `src/assets/app`, `src/assets/js` and the `docs/assets/css` folders (it purges the prefixed output of the scss in situ). It outputs a `manifest.json` file to the `src/_data` directory.
The manifest.json file is used in the hash filter to modify the URL src or href in the html:

~~~html
<script src="{{ '/app/app.js' | hash }}"></script>
<link rel="stylesheet" href="{{ '/app/style.css' | hash }}" />
~~~

As a bonus if the file has been minified in production it will alter the file extension to `[hash]-min.js` or `[hash]-min.css`, for example:

~~~html
<script src="/app/app-S5YUTCHU.min.js"></script>
~~~

## Purgecss
Your css files will be automatically purged of unused css in production. To configure the purgecssPlugin modify the `config/build/esbuild.js` file. You can use any configuration pattern from [purgecss](https://purgecss.com/configuration.html), but you don't need to set the `css:` options as this is automatically included from the metafile.

~~~js
plugins: [
  ...
  purgecssPlugin({
    content: ["docs/index.html"]
   }),
 ]
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

- Look at adding js import maps
- Could make repo into an 11ty-plugin to make it agnostic to the method devs compile CSS, as everyone has their own preferred way to generate CSS. The plugin would focus on just compiling JS, shortcodes and hashing.
- look as using webc bundle to bundle all solidify shortcodes into one per page
- The web component (webC example)
- improve styling and make prettier hydration examples
- consider [scoped css modules](https://how-to.dev/how-to-set-up-css-modules-with-esbuild) and [esbuild css modules plugin](https://github.com/indooorsman/esbuild-css-modules-plugin#readme). However each dev has preferred methods for compiling CSS. Could just link to them?
