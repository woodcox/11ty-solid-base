const esbuild = require('esbuild')
const glob = require('glob-all') // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid')
const fsPromises = require('fs').promises;

module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }
  }

  async render() {
    await esbuild.build({
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
    const result = await esbuild.build(config);
    await fsPromises.writeFile('.src/_data/esbuildmeta.json',
    JSON.stringify(result.metafile));
  }
}
