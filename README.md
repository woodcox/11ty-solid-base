# 11ty Solid Starter

Nothing but a base HTML5 template and the essentials setup esbuild to compile Solid-js alongside 11ty.

Includes minifiying and autoprefixing of styles `postbuild` using [Lightning CSS](https://lightningcss.dev/). If you have different preferred browser targets, be sure to modify both the package `browserslist` and the value of `--target` within the `postbuild` script.


## Development Scripts

**`npm start`**

> Run 11ty with hot reload at localhost:8080, including reload based on Sass changes

**`npm run build`**

> Production build includes minified, autoprefixed CSS

Use this as the "Publish command" if needed by hosting such as Netlify.
