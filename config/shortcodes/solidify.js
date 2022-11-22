const esbuild = require("esbuild");
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;
const { cache } = require('esbuild-plugin-cache');

module.exports = async (code, filename, bundled) => {
  let bundleJsx = bundled !== 'bundleOff' ? true : false;
  await fsPromises.writeFile('solid-' + filename + '.jsx', code),
  await esbuild.build({
    entryPoints: glob.sync(['solid-*.jsx']),
    entryNames: '[name]',
    outdir: './docs/assets/app',
    bundle: bundleJsx,
    plugins: [
      solidPlugin(),
      cache()
    ],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  })
  const solidifyJsx = await fsPromises.readFile('./docs/assets/app/solid-' + filename + '.js', 'utf8');
  return `<script type="module">${solidifyJsx}</script>`;
};
