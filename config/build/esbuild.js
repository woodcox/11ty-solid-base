// https://www.seancdavis.com/posts/javascript-for-11ty-with-esbuild/
const esbuild = require('esbuild');
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const { solidPlugin } = require('esbuild-plugin-solid');
const manifestPlugin = require('esbuild-plugin-manifest');
const fs = require('fs');
const path = require("path");


module.exports = async () => {
  result = await esbuild.build({
    entryPoints: glob.sync(['src/assets/app/*.jsx', 'src/assets/js/*.js']),
    entryNames: '[dir]/[name]-[hash]',
    outExtension: isProd ? {'.js': '.min.js', '.css': '.min.css'} : {'.js': '.js', '.css': '.css'},
    bundle: true,
    plugins: [
      solidPlugin(), 
      manifestPlugin({
        // NOTE: Save to src/_data. This is always relative to `outdir`.
        filename: '../../src/_data/manifest.json',
        shortNames: true,
        extensionless: 'input',
        // Generate manifest.json
        generate: (entries) =>
          Object.fromEntries(
            Object.entries(entries).map(([from, to]) => [
              from,
              `${path.basename(to)}`,
            ])
          ),
        })
    ],
    minify: isProd,
    outdir: './docs/assets',
    sourcemap: !isProd,
    target: isProd ? 'es6' : 'esnext',
    metafile: true,
  }).catch(() => process.exit(1));
  fs.writeFileSync('./src/_data/builddata.json', JSON.stringify(result.metafile));
}
