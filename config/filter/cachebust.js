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
  });


const toHtml = (markdownString) => {
  return markdownLib.renderInline(markdownString);
};


const readDataFile = () => {
  return readFile('src/_data/buildmeta.json', (err, data) => {
    if (err) console.log(err)
  })
}

console.log(readDataFile);




readCssFile()
  .then((data) => {
    hashCss = md5(data).slice(0, 16)
    console.log(hashCss)
  })
  .then(() => {
    readJsFile()
      .then((data) => {
        hashJs = md5(data).slice(0, 16)
        console.log(hashJs)
      })
      .then(() => {
        const versionObject = {
          css: hashCss,
          js: hashJs
        }

        writeFile('src/_data/version.json', JSON.stringify(versionObject), (err) => {
          if (err) throw err
          console.log('The file has been saved!')
        })
      })
      .then(() => {
        fs.rename('dist/styles.css', `dist/styles${hashCss}.css`, function(err) {
          if ( err ) return console.log('ERROR: ' + err)
          console.log(`dist/styles.css > dist/styles${hashCss}.css`)
        })

        fs.rename('dist/index.js', `dist/index${hashJs}.js`, function(err) {
          if ( err ) return console.log('ERROR: ' + err)
          console.log(`dist/index.js > dist/index${hashJs}.js`)
        })
      })
  })
