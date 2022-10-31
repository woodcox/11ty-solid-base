const fsPromises = require('fs').promises;
const readFile = fsPromises.readFile;
const writeFile = fsPromises.writeFile;

let hashCss;
let hashJs;


module.exports = (url) => {
  const [urlPart, paramPart] = url.split("?");
  const params = new URLSearchParams(paramPart || "");
  params.set("v", `${now}`);
  return `${urlPart}?${params}`;
};

const readDataFile = () => {
  return readFile('src/_data/buildmeta.json', (err, data) => {
    if (err) console.log(err)
  })
}

console.log(readDataFile);



