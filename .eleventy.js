const sass = require("sass");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const now = String(Date.now());
const solidShortcode = require('./config/shortcodes/solidify.js');
const esbuildPipeline = require('./config/build/esbuild.js');
const path = require("path");
const fs= require('fs');

const TEMPLATE_ENGINE = "liquid";

module.exports = function (eleventyConfig) {
  // DEV SERVER
  eleventyConfig.setServerOptions({
    port: 8080
  });

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
  });

  // SHORTCODES & FILTERS
  // Add cache busting by using {{ 'myurl' | version }}
  eleventyConfig.addFilter("version", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", `${now}`);
    return `${urlPart}?${params}`;
  });
  
  eleventyConfig.addFilter("hash", (url) => {
    const urlbase = path.basename(url);
    const [basePart, ...paramPart] = urlbase.split(".");
    console.log(basePart);
    const urldir= path.dirname(url)
    console.log(urldir);
    
    fs.readFile(path.resolve('src/_data/manifest.json'), (err, data) => {
      if (err) throw err;
      let hashmeta = JSON.parse(data);
      if (err) console.log(err);
      console.log(hashmeta[basePart]);
    })
    const params = new URLSearchParams(urlbase || "");
    params.set("v", `${now}`);
    return `${urlbase}?${params}`;
  });

  eleventyConfig.addPairedShortcode("solid", solidShortcode);
 
  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid

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
