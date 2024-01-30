// kudos to https://github.com/madrilene/eleventy-excellent
// CSS and JavaScript as first-class citizens in Eleventy: https://pepelsbey.dev/articles/eleventy-css-js/

const esbuild = require('esbuild');
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
//const isDev = process.env.ELEVENTY_ENV === 'dev' ? true : false;
const { solidPlugin } = require('esbuild-plugin-solid');
const path = require('path');


module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('jsx');

  eleventyConfig.addExtension('jsx', {
    outputFileExtension: 'html',
    compile: async (content, fullPath) => {
      const parsedPath = path.parse(fullPath);
      const basedir = path.basename(parsedPath.dir);
      console.log('is this working', basedir);

      if (path.basename(fullPath) !== `${basedir}.jsx`) {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: isProd ? 'es6' : 'esnext',
          entryPoints: [fullPath],
          minify: isProd,
          bundle: true,
          write: false,
          sourcemap: !isProd,
          plugins: [solidPlugin({generate: 'ssr', hydratable: true})]
        });

        return output.outputFiles[0].text;
        //let testing = output.outputFiles[0];
      };
    },
  });
  console.log('[Test] is testing...');
};