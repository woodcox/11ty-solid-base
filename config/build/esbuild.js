// https://www.seancdavis.com/posts/javascript-for-11ty-with-esbuild/
const esbuild = require('esbuild');
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const { solidPlugin } = require('esbuild-plugin-solid');
const manifestPlugin = require('esbuild-plugin-manifest');
const { http, default_schemes } = require('@hyrious/esbuild-plugin-http');
// cacheMap stores { url => contents }, you can easily persist it in file system - see https://github.com/hyrious/esbuild-plugin-http
let cacheMap = new Map();
const fs = require('fs');
const path = require("path");

const esbuildOpts = {
  entryPoints: glob.sync(['src/scripts/**/*.jsx', 'src/scripts/**/*.js', 'dist/app/*.css']), // include css so that its in the manifest.json
  entryNames: isProd ? '[name]-[hash]' : '[name]',
  outExtension: isProd ? {'.js': '.min.js', '.css': '.min.css'} : {'.js': '.js', '.css': '.css'},
  allowOverwrite: !isProd,  // overwrite dist/app/style.css when in dev mode
  bundle: true,
  minify: isProd,
  treeShaking: isProd,
  outdir: './dist/app',
  sourcemap: !isProd,
  target: isProd ? 'es6' : 'esnext',
  metafile: true,
  plugins: [
    // Runs develeopment build (skips purgingcss) if isProd = false when ELEVENTY_ENV != 'prod'
    http({
      filter: (url) => true,
      schemes: { default_schemes },
      cache: cacheMap
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
}


module.exports = async () => {
  if (isProd === true){
    let result = await esbuild.build({
      ...esbuildOpts,
    }).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    fs.writeFileSync('./src/_data/buildmeta.json', JSON.stringify(result.metafile));
  } else {
    let buildMetafile = JSON.parse(fs.readFileSync('./src/_data/buildmeta.json', 'utf8'));
    let ctx = await esbuild.context({
      ...esbuildOpts,
    }).catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    // ctx = Object.assign(ctx.build, buildMetafile);
    console.log();
    result = await ctx.rebuild();
    //await ctx.watch();
    console.log("[esbuild] esbuild is watching .js and .jsx files");
    fs.writeFileSync('./src/_data/buildmeta.json', JSON.stringify(result.metafile));
    await ctx.dispose();
  }
}

// Do I need this for dev servver? It still fails when changing JS or JSX
// module.exports = async () => {
//  let ctx = await esbuild.context({
//    ...esbuildOpts,
//  }).catch((error) => {
//    console.error(error);
//    process.exitCode = 1;
//  })
//  let result = await ctx.rebuild()
//  fs.writeFileSync('./src/_data/buildmeta.json', JSON.stringify(result.metafile));
// }
