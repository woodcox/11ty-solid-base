const esbuild = require("esbuild");
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;
const { http, default_schemes } = require('@hyrious/esbuild-plugin-http');

module.exports = async (code, filename, bundled) => {
  let bundleJsx = bundled !== 'bundleOff' ? true : false;
  await fsPromises.writeFile('solid-' + filename + '.jsx', code),
  
  // esm version
  await esbuild.build({
    entryPoints: glob.sync(['solid-*.jsx']),
    entryNames: '[name]',
    outdir: './docs/assets/app',
    outExtension: { '.js': '.mjs' },
    bundle: bundleJsx,
    watch: !isProd,
    format: 'esm',
    plugins: [
      http({
        filter: (url) => true,
        schemes: { default_schemes },
        cache: new Map()
      }),
      solidPlugin()
    ],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  }),

  // Cjs version
  await esbuild.build({
    entryPoints: glob.sync(['solid-*.jsx']),
    entryNames: '[name]',
    outdir: './docs/assets/app',
    bundle: bundleJsx,
    format: 'cjs',
    plugins: [
      http({
        filter: (url) => true,
        schemes: { default_schemes },
        cache: new Map()
      }),
      solidPlugin()
    ],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  }).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  const solidifyEsm= await fsPromises.readFile('./docs/assets/app/solid-' + filename + '.mjs', 'utf8');
  const solidifyCjs= await fsPromises.readFile('./docs/assets/app/solid-' + filename + '.js', 'utf8');
  return `<script type="module">${solidifyEsm}</script><script nomodule>${solidifyCjs}</script>`;
};
