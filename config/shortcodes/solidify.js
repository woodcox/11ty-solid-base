const esbuild = require("esbuild");
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fs = require('fs');


// Note: transform will not bundle!
module.exports = async render(code) => {
  fs.writeFileSync('in.jsx', code)
  await esbuild.buildSync({ 
    entryPoints: ['in.jsx'],
    outfile: 'out.js',
    plugins: [solidPlugin()],
    minify: isProd
  })
  const bundle = require('fs').readFileSync('out.js', 'utf8')
  return bundle 
};
