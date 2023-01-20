// A modified version of https://github.com/arslanakram/esbuild-plugin-purgecss-2.0

module.exports = function purgecssPlugin(options) {
  return {
    name: 'purgecss',
    setup(build) {
      if (!build.initialOptions.metafile) {
        throw new Error('You should set metafile true to use this plugin.');
      }
      const { PurgeCSS } = require('purgecss');
      const path = require('path');
      const fs = require('fs');

      build.onEnd(async (args) => {
        path: args.path;
        // outputKeyss gets metafile build output of .js files and .css files
        const outputKeys = Object.keys(args.metafile.outputs);
        console.log(outputKeys);
        // create a file extension filter 
        const genFilter = (postfix) => (k) => k.endsWith(postfix);
        // filter the metafile output to only return the css files
        const css = outputKeys.filter(genFilter('.css'));
      
        // Create a jS object of the purgecss config for css
        let cssConfig = { css: css };
        // Merge the css config with the purgecssPlugin options
        let config = Object.assign(options, cssConfig);

        // check if there is the purgecss config js object and throw error if not
        const opts = config ? config : () => {throw Error('You should set the purgecssPlugin options for this plugin.')};
        
        // pass the purgecss config including the relevant css file to purgecss
        const purgeResult = await new PurgeCSS().purge({ ...opts });

        for (let index = 0; index < purgeResult.length; index++) {
          const { file, css } = purgeResult[index];
          await fs.promises.writeFile(file, css);
        }
      });
    },
  };
};
