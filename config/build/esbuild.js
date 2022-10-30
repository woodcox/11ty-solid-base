// https://www.seancdavis.com/posts/javascript-for-11ty-with-esbuild/
const esbuild = require('esbuild');
const glob = require('glob-all'); // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;

module.exports = async () => {
  const result = await esbuild.build({
    entryPoints: glob.sync(['src/assets/app/*.jsx', 'src/assets/js/*.js']),
    entryNames: '[dir]/[name]-[hash]',
    outExtension: isProd ? {'.js': '.min.js', '.css': '.min.css'} : {'.js': '.js', '.css': '.css'},
    bundle: true,
    plugins: [solidPlugin()],
    minify: isProd,
    outdir: './docs/assets',
    sourcemap: !isProd,
    target: isProd ? 'es6' : 'esnext',
    metafile: true,
  }).catch(() => process.exit(1));
  await fsPromises.writeFile('src/_data/esbuildmeta.json',
  JSON.stringify(result.metafile)), function (err) {
    if (err) return console.log(err)
    console.log(`${result.metafile} > src/_data/esbuildmeta.json`)
  }
}

