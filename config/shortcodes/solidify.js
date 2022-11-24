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
    outdir: './docs/assets/app/esm ',
    bundle: bundleJsx,
    format: 'esm',
    plugins: [
      solidPlugin(),
      http({
        filter: (url) => true,
        schemes: { default_schemes },
        cache: new Map()
      })
    ],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  }),

  // Cjs version
  await esbuild.build({
    entryPoints: glob.sync(['solid-*.jsx']),
    entryNames: '[name]',
    outdir: './docs/assets/app/cjs',
    bundle: bundleJsx,
    format: 'cjs',
    plugins: [
      solidPlugin(),
      http({
        filter: (url) => true,
        schemes: { default_schemes },
        cache: new Map()
      })
    ],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  })
  const solidifyEsm= await fsPromises.readFile('./docs/assets/app/esm/solid-' + filename + '.js', 'utf8');
  const solidifyCjs= await fsPromises.readFile('./docs/assets/app/cjs/solid-' + filename + '.js', 'utf8');
  return `<script type="module">${solidifyEsm}</script><script nomodule>${solidifyCjs}</script>`;
};
