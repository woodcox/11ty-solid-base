const sass = require("sass");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const now = String(Date.now());
const solidShortcode = require('./config/shortcodes/solidify.js');
const esbuildPipeline = require('./config/build/esbuild.js');

const TEMPLATE_ENGINE = "liquid";

module.exports = function (eleventyConfig) {
  // BUILD HOOK
  eleventyConfig.on("eleventy.before", esbuildPipeline);

  // PLUGINS
  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/_includes/components/**/*.webc",
  });

  // WATCH
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addWatchTarget('./src/app');

  // COPY
  // Copy sass output from ./_tmp file
  eleventyConfig.addPassthroughCopy({ 
    './_tmp': './assets/css',
    './src/_data/esbuildmeta.json': './assets/data/esbuild.json',
  });

  // SHORTCODES & FILTERS
  // Add cache busting by using {{ 'myurl' | version }}
  eleventyConfig.addFilter("version", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", `${now}`);
    return `${urlPart}?${params}`;
  });

  eleventyConfig.addPairedShortcode("solid", solidShortcode);
 
  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid
  // 11ty.js template format also compiles the esbuild.11ty.js script

  return {
    dir: {
      input: "src",
      output: "docs",
      data: "_data",
    },
    templateFormats: ["html", "md", TEMPLATE_ENGINE],
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
  };
};
