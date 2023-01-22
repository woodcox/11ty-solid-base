const esbuild = require("esbuild");
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;
const { http, default_schemes } = require('@hyrious/esbuild-plugin-http');

module.exports = async (code, filename, bundled) => {
  let bundleJsx = bundled !== 'bundleOff' ? true : false;
  await fsPromises.writeFile('./_tmp/solid-' + filename + '.jsx', code),
  
  // esm version
  let res = await esbuild.build({
    entryPoints: glob.sync(['_tmp/solid-*.jsx']),
    entryNames: '[name]',
    // write: false,
    outdir: './docs/app',
    bundle: bundleJsx,
    format: 'esm',
    minify: isProd,
    treeShaking: isProd,
    target: isProd ? 'es6' : 'esnext',
    plugins: [
      http({
        filter: (url) => true,
        schemes: { default_schemes }
      }),
      solidPlugin()
    ]
  }).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  for (let out of res.outputFiles) {
    console.log(out.path, out.contents, out.text)
  }
  const solidifyJsx= await fsPromises.readFile('./docs/app/solid-' + filename + '.js', 'utf8');
  return `<script type="module">${solidifyJsx}</script>`;
};
