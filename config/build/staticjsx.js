// kudos to https://github.com/madrilene/eleventy-excellent
// CSS and JavaScript as first-class citizens in Eleventy: https://pepelsbey.dev/articles/eleventy-css-js/

const esbuild = require('esbuild');
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const isDev = process.env.ELEVENTY_ENV === 'dev' ? true : false;
const { solidPlugin } = require('esbuild-plugin-solid');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('jsx');

  eleventyConfig.addExtension('jsx', {
    outputFileExtension: 'js',
    compile: async (content, fullPath) => {
      const parsedPath = path.parse(fullPath);
      const basedir = path.basename(parsedPath.dir);

      if (path.basename(fullPath) !== `${basedir}.jsx`) {
        return;
      }

      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [fullPath],
          minify: isProd,
          bundle: true,
          write: false,
          sourcemap: !isProd,
          loader: {
            '.wgsl': 'text'
          },
          plugins: [solidPlugin({generate?: 'ssr'})]
        });

        return output.outputFiles[0].html;
      };
    },
  });
};