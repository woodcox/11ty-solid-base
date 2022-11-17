const esbuild = require("esbuild");
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;

module.exports = async (code, filename, bundled) => {
  let bundled === 'bundle' ? true : false;
  await fsPromises.writeFile('solid-' + filename + '.jsx', code),
  await esbuild.build({
    entryPoints: glob.sync(['solid-*.jsx']),
    entryNames: '[name]',
    outdir: './docs',
    bundle: bundled,
    plugins: [solidPlugin()],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  })
  try {
    const solidifyJsx = await fsPromises.readFile('./docs/solid-' + filename + '.js', 'utf8');
    return `<script type="module">${solidifyJsx}</script>`;
  } catch(err) {
    console.log('Solidify Jsx Shortcode', err);
  }
};
