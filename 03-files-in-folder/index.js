const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(
  pathFolder,
  { withFileTypes: true, encoding: 'utf8' },
  (err, files) => {
    if (err) throw err;
    files.forEach(function (item) {
      if (item.isFile()) {
        const fileName = path.parse(item.name).name;
        const extName = path.extname(item.name).slice(1);
        const filePath = path.join(pathFolder, item.name);
        fs.stat(filePath, (err, stats) => {
          const fileSize = stats.size;
          stdout.write(`${fileName} - ${extName} - ${fileSize}b\n`);
        });
      }
    });
  },
);
