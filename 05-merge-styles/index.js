const path = require('path');
const fs = require('fs');

const fileCssName = path.join(__dirname, 'project-dist', 'bundle.css');
const pathFolderCss = path.join(__dirname, 'styles');

fs.readdir(
  pathFolderCss,
  { withFileTypes: true, encoding: 'utf8' },
  (err, files) => {
    if (err) throw err;
    const streamWrite = fs.createWriteStream(fileCssName, 'utf-8');
    files.forEach((item) => {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const stream = fs.createReadStream(
          path.join(pathFolderCss, item.name),
          'utf-8',
        );
        let data = '';
        stream.on('end', () => streamWrite.write(`${data}\n`));
        stream.on('data', (chunk) => (data += chunk));
        stream.on('error', (error) => console.log(error.message));
      }
    });
  },
);
