const esbuild = require("esbuild");
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid');
const fsPromises = require('fs').promises;


// Note: transform will not bundle!
module.exports = async (code) => {
  await fsPromises.writeFile('in.jsx', code),
  await esbuild.buildSync({ 
    entryPoints: ['in.jsx'],
    outfile: 'out.js',
    // bundle: true,
    // plugins: [solidPlugin()],
    // minify: isProd,
    // target: isProd ? 'es6' : 'esnext'
  })
  const jsbundle = await fsPromises.readFile('out.js', 'utf8')
  return await jsbundle 
};

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
      outExtension: isProd ? {'.js': '.min.js', '.css': '.min.css'} : {'.js': '.js', '.css': '.css'},
      bundle: true,
      plugins: [solidPlugin()],
      minify: isProd,
      outdir: './docs/assets',
      sourcemap: !isProd,
      target: isProd ? 'es6' : 'esnext'
    }).catch(() => process.exit(1));
  }
}

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["js/index.js"],
      bundle: true,
      outfile: "_site/js/bundle.js",
      sourcemap: true,
      target: ["chrome58", "firefox57", "safari11", "edge16"],
    });
  });
};
