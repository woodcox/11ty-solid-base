module.exports = function purgecssPlugin(options) {
  return {
    name: 'purgecss',
    setup(build) {
      if (!build.initialOptions.metafile) {
        throw new Error('You should set metafile true to use this plugin.');
      }
      const PurgeCSS = require('@fullhuman/postcss-purgecss');
      const path = require('path');
      const fs = require('fs');

      build.onEnd(async (args) => {
        const outputKeys = Object.keys(args.metafile.outputs);
        console.log(outputKeys);
        const genFilter = (postfix) => (k) => k.endsWith(postfix);
        console.log(genFilter);
        
        const css = outputKeys.filter(genFilter('.css'));
        console.log(css);
        const opts = options ? options : {};
        console.log(opts);

        const purgeResult = await new PurgeCSS().purge({ ...opts, css: css });

        for (let index = 0; index < purgeResult.length; index++) {
          const { file, css } = purgeResult[index];
          await fs.promises.writeFile(file, css);
        }
      });
    },
  };
};
