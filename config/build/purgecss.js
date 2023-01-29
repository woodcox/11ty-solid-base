// A modified version of https://github.com/arslanakram/esbuild-plugin-purgecss-2.0
const esbuild = require('esbuild');
const glob = require('glob-all');
const purgecssPlugin = require('./purgecssPlugin.js');


module.exports = async () => {
  let result = await esbuild.build({
    entryPoints: glob.sync(['dist/app/*.css']),
    allowOverwrite: true,
    minify: true,
    outdir: './dist/app',
    plugins: [
      purgecssPlugin({
        // For your production build. Add other content by using a glob-all pattern glob.sync(["dist/*.html", "dist/**/index.html"])
        content: ["dist/index.html"]
      })
    ]
  })
};