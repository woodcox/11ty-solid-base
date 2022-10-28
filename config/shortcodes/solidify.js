const esbuild = require("esbuild");
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;

module.exports = async (code, filename, inline) => {
  await fsPromises.writeFile('src/in.jsx', code),
  await esbuild.build({ 
    entryPoints: ['jsx-filename.jsx'],
    outdir: './docs',
    bundle: true,
    plugins: [solidPlugin()],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  })
  try {
    const solidifyJsx = await fsPromises.readFile('./docs/jsx-filename.js', 'utf8');
    return `<script type="module">${solidifyJsx}</script>`;
  } catch(err) {
    console.log('Solidify Jsx Shortcode', err);
  }
};
