const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false;
const fs= require('fs');
resolve = require('path').resolve;

let buildmeta;


module.exports = (url) => {
  fs.readFile(resolve('src/_data/buildmeta.json'), (err, data) => {
    if (err) throw err;
    let buildmeta = JSON.parse(data);
    if (err) console.log(err);
    console.log(buildmeta);
  })
  if (url === buildmeta.outputs[0].entryPoint ) { 
    url = buildmeta.outputs[0]
  }
  return `${url}`;
  console.log(url);
};

// const readDataFile = () => {
//  fs.readFile('src/_data/buildmeta.json', (err, data) => {
//    if (err) throw err;
//    let buildmeta = JSON.parse(data);
//    if (err) console.log(err);
//    console.log(buildmeta);
//  })
//  if (url === buildmeta.outputs[0].input ) { 
//    url = buildmeta.outputs[0]
//  }
//  console.log(buildmeta.outputs[0]);
// }

//fs.readFile('src/_data/buildmeta.json', (err, data) => {
//  if (err) throw err;
//  let hashmeta = JSON.parse(data, function(key, value) {
//    console.log(key); 
//    return value;
//  });
//  if (err) console.log(err);
//});

// fs.readFile('src/_data/buildmeta.json', (err, data) => {
//   if (err) throw err;
//   let esbuildmeta = JSON.parse(data);
//  if (err) console.log(err);
  // https://medium.com/@prathameshk73/get-nested-properties-in-javascript-objects-97a9b1b0750f
//  function getNestedObject(obj, key) {
//    return key.split(".").reduce(function(o, x) {
//      return (typeof o == "undefined" || o === null)? o: o[x]
//    }, obj);
//    getNestedObject(data, 'outputs[0]'); 
//  }
//  console.log(getNestedObject);
//});




