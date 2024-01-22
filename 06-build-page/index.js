const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const pathDist = path.join(__dirname, 'project-dist');

fs.stat(pathDist, function (err) {
  const pathAssetsNew = path.join(__dirname, 'project-dist', 'assets');
  const pathAssets = path.join(__dirname, 'assets');
  const copyAssets = () => {
    fsPromises.mkdir(pathAssetsNew, { recursive: true }, () => {});
    copyFiles(pathAssets, pathAssetsNew);
  };
  if (!err) {
    createIndexHtml();
    createCss();
    fs.rm(pathAssetsNew, { recursive: true }, () => copyAssets());
  } else {
    fsPromises.mkdir(pathDist, { recursive: true }).then(function () {});
    createIndexHtml();
    createCss();
    copyAssets();
  }
});

function createIndexHtml() {
  const stream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  let textHtml = '';
  stream.on('data', (chunk) => {
    textHtml += chunk;
  });
  stream.on('end', () => {
    const pathHtml = path.join(__dirname, 'components');
    fs.readdir(
      pathHtml,
      { withFileTypes: true, encoding: 'utf8' },
      (err, files) => {
        if (err) throw err;
        let cnt = 0;
        files.forEach(function (item) {
          if (item.isFile() && path.extname(item.name) === '.html') {
            const fileBase = path.parse(item.name).base;
            const fileName = path.parse(item.name).name;
            const componentName = '{{' + fileName + '}}';
            if (textHtml.indexOf(componentName)) {
              const streamComponent = fs.ReadStream(
                path.join(pathHtml, fileBase),
                'utf-8',
              );
              let textComponent = '';
              streamComponent.on('data', (text) => {
                textComponent += text;
              });
              streamComponent.on('end', () => {
                textHtml = textHtml.replace(componentName, textComponent);
                cnt++;
                if (cnt === files.length) {
                  const streamWrite = fs.WriteStream(
                    path.join(pathDist, 'index.html'),
                    'utf-8',
                  );
                  streamWrite.write(textHtml);
                }
              });
            }
          }
        });
      },
    );
  });
}

function createCss() {
  const pathStyles = path.join(__dirname, 'styles');
  const fileCssName = path.join(__dirname, 'project-dist', 'style.css');
  fs.readdir(
    pathStyles,
    { withFileTypes: true, encoding: 'utf8' },
    (err, files) => {
      if (err) throw err;
      const streamWrite = fs.WriteStream(fileCssName, 'utf-8');
      files.forEach((item) => {
        if (item.isFile() && path.extname(item.name) === '.css') {
          let textCss = '';
          const stream = fs.ReadStream(
            path.join(pathStyles, item.name),
            'utf-8',
          );
          stream.on('data', (chunk) => (textCss += chunk));
          stream.on('end', () => streamWrite.write(`${textCss}\n`));
        }
      });
    },
  );
}

function copyFiles(dir, newDir) {
  fs.readdir(
    dir,
    { withFileTypes: true, encoding: 'utf8' },
    function (err, files) {
      files.forEach((item) => {
        const pathObject = path.join(dir, item.name);
        const pathObjectNew = path.join(newDir, item.name);
        if (item.isDirectory()) {
          fsPromises.mkdir(pathObjectNew, { recursive: true }, () => {});
          copyFiles(pathObject, pathObjectNew);
        } else {
          fs.copyFile(pathObject, pathObjectNew, (err) => {
            if (err) throw err;
          });
        }
      });
    },
  );
}
