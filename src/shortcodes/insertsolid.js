const { transformSync } = require("esbuild");
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
const { solidPlugin } = require('esbuild-plugin-solid')
const solid = require('solid-js')


// Note: transform will not bundle!
module.exports = (content) => {
  const result = transformSync(content, { 
    loader: "jsx",
    jsx: "preserve",
    "jsxImportSource": "solid",
    plugins: [solidPlugin()],
    minify: isProd
  });
  if (result.js) {
    return `<script>${result.js}</script>`;
  }
  return `<script>console.log(${JSON.stringify(result.errors)})</script>`;
};
