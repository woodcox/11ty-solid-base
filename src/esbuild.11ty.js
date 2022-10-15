const esbuild = require('esbuild')
const glob = require('glob-all') // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const solid = require('solid-js')

module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }
  }

  async render() {
    await esbuild.buildSync({
      entryPoints: glob.sync(['assets/js/*.js']),
      bundle: true,
      minify: isProd,
      outdir: './docs/assets/js',
      sourcemap: !isProd,
      target: isProd ? 'es6' : 'esnext'
    })
  }
}
