const sass = require("sass");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const now = String(Date.now());
const solidShortcode = require('./config/shortcodes/solidify.js');
const esbuildPipeline = require('./config/build/esbuild.js');
// const jsxExtension = require('./config/build/jsx.js');
const purgecssPipeline = require('./config/build/purgecss.js');
const path = require("path");
const manifest = require('./src/_data/manifest.json');
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;

const TEMPLATE_ENGINE = "liquid";

module.exports = function (eleventyConfig) {
  // DEV SERVER
  eleventyConfig.setServerOptions({
    port: 8080,
    watch: ["dist/app/*.css"]
  });
  
  // WATCH
  eleventyConfig.addWatchTarget("./src/scripts/");
  eleventyConfig.watchIgnores.add("./src/_data/manifest.json");
  eleventyConfig.watchIgnores.add("./src/_data/buildmeta.json");

  // BUILD HOOK
  eleventyConfig.on("eleventy.before", esbuildPipeline);
  if (isProd){
    eleventyConfig.on("eleventy.after", purgecssPipeline);
  };

  // PLUGINS
  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/_includes/components/**/*.webc",
  });
  // Add solid jsx templates
  // eleventyConfig.addTemplateFormats('jsx');
  // eleventyConfig.addExtension('jsx', { jsxExtension };
  // to use other templates like liquid and nunjunks
  eleventyConfig.addPlugin(EleventyRenderPlugin); 

  // SHORTCODES & FILTERS
  // Add cache busting by using {{ 'myurl' | version }}
  eleventyConfig.addFilter("version", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", `${now}`);
    return `${urlPart}?${params}`;
  });
  
  // Use this filter only if the asset is processed by esbuild and is in _data/manifest.json. Use {{ 'myurl' | hash }}
  eleventyConfig.addFilter("hash", (url) => {
    const urlbase = path.basename(url);
    const [basePart, ...paramPart] = urlbase.split(".");
    const urldir = path.dirname(url);
    let hashedBasename = manifest[basePart];
    return `${urldir}/${hashedBasename}`;
  });

  eleventyConfig.addPairedShortcode("solid", solidShortcode);
 
  // Let Eleventy transform HTML files as liquidjs
  // So that we can use .html instead of .liquid

  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data",
    },
    templateFormats: ["html", "md", TEMPLATE_ENGINE],
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
  };
};
