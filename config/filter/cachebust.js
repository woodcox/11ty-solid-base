const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const fs = require('fs');

let hashCss;
let hashJs;


module.exports = (url) => {
  const [urlPart, paramPart] = url.split("?");
  const params = new URLSearchParams(paramPart || "");
  params.set("v", `${now}`);
  return `${urlPart}?${params}`;
};

const readDataFile = () => {
  fs.readFile('src/_data/buildmeta.json', (err, data) => {
    if (err) throw err;
    let buildmeta = JSON.parse(data);
    if (err) console.log(err);
    console.log(buildmeta);
  })
  return;
  console.log(buildmeta);
}

fs.readFile('src/_data/buildmeta.json', (err, data) => {
  if (err) throw err;
  let hashmeta.outputs = JSON.parse(data, function(key, value) {
    console.log(key); 
    return value;
  });
  if (err) console.log(err);
});




