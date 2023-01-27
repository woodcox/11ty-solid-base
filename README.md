<div align="center">
  <img src="https://user-images.githubusercontent.com/64870518/212966953-811d880b-e53f-4f07-ad4e-759566539b62.png" alt="11ty solid base">
</div>
<br>

A minimal base HTML5 template and the [esbuild](https://esbuild.github.io/) setup to **compile your SolidJS app within 11ty**.

Includes:
  - [11ty/is-land](https://www.11ty.dev/dist/plugins/partial-hydration/)
  - [WebC](https://www.11ty.dev/dist/languages/webc/), 
  - [esbuild](https://esbuild.github.io)
  - Minifiying and autoprefixing of styles using [Lightning CSS](https://lightningcss.dev/)
  - Uses [Purgecss](https://purgecss.com/) to remove unused styles via a slightly modified version of [esbuild-plugin-purgecss-2](https://github.com/arslanakram/esbuild-plugin-purgecss-2.0/blob/master/src/index.js)
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
- `filename`: The name of the file which is saved to `dist/app`. This name is automatically prefixed by `solid-`.
- `bundled`: The solid.jsx is bundled by default. To switch bundling off pass the value: `"bundleOff"`.

## Cachebusting hash filter

Esbuild is configured to add a hash to the CSS and JS files it processes in the `src/scripts/jsx`, `src/scripts/js` and the `dist/app/css` folders (it purges the prefixed output of the scss in situ). It outputs a `manifest.json` file to the `src/_data` directory.
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
    content: ["dist/index.html"]
   }),
 ]
 ~~~

## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass and JS changes.

**`npm run build`**

> Production build with autoprefixed CSS but no minification or purging. 

**`npm run minify`**

> Production build includes minified, autoprefixed and purged CSS

Use this as the "Publish command" if needed by hosting such as Netlify.

## To do

- Look at adding js import maps
- look as using webc to bundle into one per page
- The web component (webC example)
- improve styling and make prettier hydration examples

## Need scoped CSS?
There's a plug-in for that - [esbuild css modules plugin](https://github.com/indooorsman/esbuild-css-modules-plugin#readme) and an example [setup of scoped css modules with esbuild](https://how-to.dev/how-to-set-up-css-modules-with-esbuild).
