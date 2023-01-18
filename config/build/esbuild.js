// https://www.seancdavis.com/posts/javascript-for-11ty-with-esbuild/
const esbuild = require('esbuild');
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const { solidPlugin } = require('esbuild-plugin-solid');
const manifestPlugin = require('esbuild-plugin-manifest');
const { http, default_schemes } = require('@hyrious/esbuild-plugin-http');
const purgecssPlugin2 = require("esbuild-plugin-purgecss-2");
const fs = require('fs');
const path = require("path");

let purgecssPlugin = {
  name: 'purgecss',
  setup(build) {
    if (!build.initialOptions.metafile) {
      throw new Error('You should set metafile true to use this plugin.');
    }
    const { PurgeCSS } = require('@fullhuman/postcss-purgecss');
    const path = require('path');
    const fs = require('fs');

    build.onEnd(async (args) => {
      const outputKeys = Object.keys(args.metafile.outputs);
      const genFilter = (postfix) => (k) => k.endsWith(postfix);

      const css = outputKeys.filter(genFilter('.css'));
      const opts = options ? options : {};

      const res = await new PurgeCSS().purge({ ...opts, css: css });

      for (let index = 0; index < res.length; index++) {
        const { file, css } = res[index];
        await fs.promises.writeFile(file, css);
      }
    });
  },
};


module.exports = async () => {
  let result = await esbuild.build({
    entryPoints: glob.sync(['src/assets/app/*.jsx', 'src/assets/js/*.js', 'docs/app/*.css']),
    entryNames: '[name]-[hash]',
    outExtension: isProd ? {'.js': '.min.js', '.css': '.min.css'} : {'.js': '.js', '.css': '.css'},
    bundle: true,
    minify: isProd,
    treeShaking: isProd,
    outdir: './docs/app',
    sourcemap: !isProd,
    target: isProd ? 'es6' : 'esnext',
    metafile: true,
    plugins: [
      http({
        filter: (url) => true,
        schemes: { default_schemes },
        cache: new Map()
      }),
      purgecssPlugin({
        content: ["./docs/index.html"]
      }),
      solidPlugin(), 
      manifestPlugin({
        // NOTE: Save to src/_data. This is always relative to `outdir`.
        filename: '../../src/_data/manifest.json',
        shortNames: true,
        extensionless: 'input',
        // Generate manifest.json - https://github.com/pellebjerkestrand/pokesite/blob/main/source/build/build-client.js
        generate: (entries) =>
          Object.fromEntries(
            Object.entries(entries).map(([from, to]) => [
              from,
              `${path.basename(to)}`,
            ])
          ),
        })
    ]
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  fs.writeFileSync('./src/_data/builddata.json', JSON.stringify(result.metafile));
  
  // Esbuild in watch mode if ELEVENTY_ENV not "prod", uses 11ty dev server to serve see package.json
  if (!isProd){
    await result.watch()
    console.log('esbuild is watching...')
  }
}
