const sass = require("sass");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const now = String(Date.now());
const solidShortcode = require('./config/shortcodes/solidify.js');

const TEMPLATE_ENGINE = "liquid";

module.exports = function (eleventyConfig) {
  // PLUGIN WebC 
  eleventyConfig.addPlugin(pluginWebc);
  
  // WATCH the scss files
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy({ './_tmp': './assets/css' });
  
  // WATCH the js files for solid-js + esbuild
  eleventyConfig.addWatchTarget('./src/app');
  // eleventyConfig.addPassthroughCopy({ 
  //  "node_modules/@11ty/is-land/is-land.js": "./assets/js/is-land.js",
  // })

  // Add cache busting by using {{ 'myurl' | version }}
  eleventyConfig.addFilter("version", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", `${now}`);
    return `${urlPart}?${params}`;
  });

  eleventyConfig.addPairedLiquidShortcode("solid", solidShortcode);

  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid
  // 11ty.js template format also compiles the esbuild.11ty.js script

  return {
    dir: {
      input: "src",
      output: "docs",
      data: "_data",
    },
    templateFormats: ["html", "md", "11ty.js", TEMPLATE_ENGINE],
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
  };
};
