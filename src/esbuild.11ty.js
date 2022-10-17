const esbuild = require('esbuild')
const glob = require('glob-all') // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid')

module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }
  }

  async render() {
    await esbuild.build({
      entryPoints: glob.sync(['assets/js/*.js']),
      bundle: true,
      plugins: [solidPlugin()],
      minify: isProd,
      outdir: './docs/assets/js',
      sourcemap: !isProd,
      target: isProd ? 'es6' : 'esnext'
    })
  .catch(() => process.exit(1));
  }
}
