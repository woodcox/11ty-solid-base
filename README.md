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

### Arguments
There are two arguments:
- `filename` (required): The name of the file which is saved to `dist/app`. This name is automatically prefixed by `solid-`.
- `bundled` (optional): The solid.jsx is bundled by default. To switch bundling off pass the value: `"bundleOff"`.

## SolidJS configuration
To configure esbuild for js/jsx files modify `config/build/esbuild.js` or to configure the shortcode, modify `config/shortcode/solidify.js`. For further info check out the [esbuild-plugin-solid](https://github.com/amoutonbrady/esbuild-plugin-solid) github repo by [amoutonbrady](https://amoutonbrady.dev/).

~~~js
/** Configuration options for esbuild-plugin-solid */
export interface Options {
  /** The options to use for @babel/preset-typescript @default {} */
  typescript: object
  /**
   * Pass any additional babel transform options. They will be merged with
   * the transformations required by Solid.
   *
   * @default {}
   */
  babel:
    | TransformOptions
    | ((source: string, id: string, ssr: boolean) => TransformOptions)
    | ((source: string, id: string, ssr: boolean) => Promise<TransformOptions>);
  /**
   * Pass any additional [babel-plugin-jsx-dom-expressions](https://github.com/ryansolid/dom-expressions/tree/main/packages/babel-plugin-jsx-dom-expressions#plugin-options).
   * They will be merged with the defaults sets by [babel-preset-solid](https://github.com/solidjs/solid/blob/main/packages/babel-preset-solid/index.js#L8-L25).
   *
   * @default {}
   */
  solid: {
    /**
     * The name of the runtime module to import the methods from.
     *
     * @default "solid-js/web"
     */
    moduleName?: string;

    /**
     * The output mode of the compiler.
     * Can be:
     * - "dom" is standard output
     * - "ssr" is for server side rendering of strings.
     * - "universal" is for using custom renderers from solid-js/universal
     *
     * @default "dom"
     */
    generate?: 'ssr' | 'dom' | 'universal';

    /**
     * Indicate whether the output should contain hydratable markers.
     *
     * @default false
     */
    hydratable?: boolean;

    /**
     * Boolean to indicate whether to enable automatic event delegation on camelCase.
     *
     * @default true
     */
    delegateEvents?: boolean;

    /**
     * Boolean indicates whether smart conditional detection should be used.
     * This optimizes simple boolean expressions and ternaries in JSX.
     *
     * @default true
     */
    wrapConditionals?: boolean;

    /**
     * Boolean indicates whether to set current render context on Custom Elements and slots.
     * Useful for seemless Context API with Web Components.
     *
     * @default true
     */
    contextToCustomElements?: boolean;

    /**
     * Array of Component exports from module, that aren't included by default with the library.
     * This plugin will automatically import them if it comes across them in the JSX.
     *
     * @default ["For","Show","Switch","Match","Suspense","SuspenseList","Portal","Index","Dynamic","ErrorBoundary"]
     */
    builtIns?: string[];
  };
}
~~~

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
Your css files will be automatically purged of unused css in production. To configure the purgecssPlugin modify the `config/build/purgecss.js` file. You can use any configuration pattern from [purgecss](https://purgecss.com/configuration.html), but you don't need to set the `css:` options as this is automatically included from the buildmeta.json.

~~~js
plugins: [
  ...
  purgecssPlugin({
    content: ["dist/index.html"]
   }),
 ]
 ~~~

## Environment variables
The `pathPrefix` npm script argument from 11ty (`--pathprefix=form-2-pdf",
`) is passed through as an environment variable (along with all the npm script arguments) using [esbuild's define api](https://esbuild.github.io/api/#define). You can add other environment variables by adding them to the defineEnv const in the `config/build/esbuild.js` script.

~~~js
const defineEnv = {
  'process.env.PATHPREFIX': JSON.stringify(pathPrefix),
  // Add other environment variables as needed
};
~~~

If you decide to use a client-side router such as [solid router](https://github.com/solidjs/solid-router) you could do the following in your jsx:

~~~jsx
const pathPrefix = process.env.PATHPREFIX;
const urlPrefix = pathPrefix ? `/${pathPrefix}` : "";

render(
    () => (
        <Router>
            <Route path={urlPrefix}> {/* solid-js router uses urlPrefix here to set the url path */}
                <Route path="/" component={YourComponent} />
            </Route>
        </Router>
    ), 
    document.getElementById('app')
);
~~~

## Compression - Gzip and Brotli

In a production build the css and js files are automatically compressed and output as minified, gzipped and brotli files:

 - `app-S5YUTCHU.min.js`
 - `app-S5YUTCHU.min.js.br`
 - `app-S5YUTCHU.min.js.gz`

To alter this behaviour modifiy the following in the `config/build/esbuild.js` script:

~~~js
if (isProd) {
  esbuildOpts.plugins.push(gzipPlugin({
    uncompressed: isProd,
    gzip: isProd,
    brotli: isProd,
  }));
}
~~~

## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass and JS changes.

**`npm run cloud`**

> Development build for use on cloud IDE's such as [Stackblitz](https://stackblitz.com/) without the pathprefix of /11ty-solid-base/. The CSS is autoprefixed but no minification or purging happens.

If your using [Stackblitz](https://stackblitz.com/). To start the cloud dev server run: `npm run cloud` then `npm run start`.

**`npm run build`**

> Staging build with autoprefixed CSS but no minification or purging. 

**`npm run minify`**

> Production build includes minified, autoprefixed and purged CSS

Use this as the "Publish command" if needed by hosting such as Netlify.


## Need scoped CSS?
[Lightningcss](https://lightningcss.dev/css-modules.html) can be configured to support css modules by adding `--css-modules` to the `prefix` npm script. Alternatively you could use [esbuild css modules plugin](https://github.com/indooorsman/esbuild-css-modules-plugin#readme). An example [setup of scoped css modules with esbuild](https://how-to.dev/how-to-set-up-css-modules-with-esbuild).


## To do
- Look at adding js import maps
- The web component (webC example)
- improve styling and make prettier hydration examples
- Example using [Solid Element](https://github.com/solidjs/solid/blob/main/packages/solid-element/README.md) web components
- Maybe look as using [eleventy-plugin-bundle](https://github.com/11ty/eleventy-plugin-bundle) and esbuild to create per page solidjs asset buckets/bundles.


### Planning for 2.0 release
- Alter the solid shortcode API so that the arguements are `bundle` and bundleOff instead of the current API of `bundled` and `bundleOff`.
- Change the esbuild/solid internal configuration so that its an eleventy-plugin instead.
- Should I remove the sass dependency?
