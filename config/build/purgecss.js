module.exports = function purgecssPlugin(options) {
  return {
    name: 'purgecss',
    setup(build) {
      if (!build.initialOptions.metafile) {
        throw new Error('You should set metafile true to use this plugin.');
      }
      const { PurgeCSS } = require('@fullhuman/postcss-purgecss');
      const path = require('path');
      const fs = require('fs');

      build.onEnd(async (args) => {
        // outputKeyss gets metafile build output of .js files and .css files
        const outputKeys = Object.keys(args.metafile.outputs);
        console.log(outputKeys);
        // filter the metafile output to only return the css files
        const genFilter = (postfix) => (k) => k.endsWith(postfix);
        const css = outputKeys.filter(genFilter('.css'));
        console.log(css);
        console.log(options);

        // check it there is a options js object which contains purgecss config
        const opts = options[] ? options[] : {};
        console.log(opts);
        
        // pass the purgecss config options and the relevant css file to purgecss
        const purgeResult = await new PurgeCSS().purge({ ...opts, css: css });

        for (let index = 0; index < purgeResult.length; index++) {
          const { file, css } = purgeResult[index];
          await fs.promises.writeFile(file, css);
        }
      });
    },
  };
};
