// script to delete files from ./dist/app & ./_tmp folders prior to build
const fs = require('fs');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function(file, index){
      const curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    fs.rmdirSync(path);
  }
}

console.log("Cleaning working tree...");

// Add any folers here you want to delete prior to build

deleteFolderRecursive("./dist/app");
deleteFolderRecursive("./_tmp");

console.log("Successfully cleaned working tree!");

// recreate directory
const dir = './_tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
