const sass = require("sass");

const TEMPLATE_ENGINE = "liquid";

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/sass/");

  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid
  // 11ty.js template format also picks up on the esbuild.11ty.js script

  return {
    dir: {
      input: "src",
      output: "docs",
      data: "_data",
    },
    templateFormats: ["html", "md", "11ty.mjs", TEMPLATE_ENGINE],
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
  };
};
