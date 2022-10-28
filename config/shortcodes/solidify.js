const esbuild = require("esbuild");
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;

module.exports = async (code, outname, inline) => {
  await fsPromises.writeFile('src/in.jsx', code),
  await esbuild.build({ 
    entryPoints: ['src/in.jsx'],
    outfile: './docs/out${outname}.js',
    bundle: true,
    plugins: [solidPlugin()],
    minify: isProd,
    target: isProd ? 'es6' : 'esnext'
  })
  try {
    const solidifyJsx = await fsPromises.readFile('./docs/out${extension}.js', 'utf8');
    return `<script type="module">${solidifyJsx}</script>`;
  } catch(err) {
    console.log(' + solidifyJsx + ', err);
  }
};
