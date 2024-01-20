const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const pathFolderCopy = path.join(__dirname, 'files-copy');
const pathFolder = path.join(__dirname, 'files');

fs.stat(pathFolderCopy, function (err) {
  if (!err) {
    fs.readdir(
      pathFolderCopy,
      { withFileTypes: true, encoding: 'utf8' },
      (err) => {
        if (err) throw err;
        fs.rm(pathFolderCopy, { recursive: true }, () => copyFolder());
      },
    );
  } else copyFolder();
});

function copyFolder() {
  fsPromises
    .mkdir(pathFolderCopy, { recursive: true })
    .then(function () {
      fs.readdir(
        pathFolder,
        { withFileTypes: true, encoding: 'utf8' },
        (err, files) => {
          if (err) throw err;
          files.forEach(function (item) {
            if (item.isFile()) {
              const fileNameOut = path.join(pathFolder, item.name);
              const fileNameIn = path.join(pathFolderCopy, item.name);
              fs.copyFile(fileNameOut, fileNameIn, () => {});
            }
          });
        },
      );
    })
    .catch(function () {
      console.log('failed to create directory');
    });
}
