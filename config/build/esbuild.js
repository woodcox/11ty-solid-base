module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["js/index.js"],
      bundle: true,
      outfile: "_site/js/bundle.js",
      sourcemap: true,
      target: ["chrome58", "firefox57", "safari11", "edge16"],
    });
  });
};
