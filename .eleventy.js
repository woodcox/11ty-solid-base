const sass = require("sass");
const ts = String(Date.now());

const TEMPLATE_ENGINE = "liquid";

module.exports = function (eleventyConfig) {
  // WATCH the scss files
  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy({ './_tmp': './assets/css' });
  
  // WATCH the js files for esbuild in scripts.11ty.js
  eleventyConfig.addWatchTarget('./src/app');

  // Add cache busting with {{ 'myurl' | version }} time string
  eleventyConfig.addFilter("version", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("ts", `${ts}`);
    console.log(params);
    return `${urlPart}?${params}`;
  });

  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid
  // 11ty.js template format also picks up mon the esbuild.11ty.js script

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
