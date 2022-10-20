const esbuild = require('esbuild')
const glob = require('glob-all') // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const extension = isProd ? '.min' : '';
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
      entryPoints: glob.sync(['src/app/*.jsx', 'src/assest/js/*.js']),
      outExtension: {'.js': '.min.js', '.css': '.min.css'},
      bundle: true,
      plugins: [solidPlugin()],
      minify: isProd,
      outdir: './docs/app',
      sourcemap: !isProd,
      target: isProd ? 'es6' : 'esnext',
      watch: !isProd
    }).then(result => {
      console.log('watching...')

      setTimeout(() => {
        result.stop()
        console.log('stopped watching')
      }, 10 * 1000)
    }).catch(() => process.exit(1));
  }
}
