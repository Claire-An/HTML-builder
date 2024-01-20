const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(pathFile, 'utf-8');

let data = '';

stream.on('data', (chunk) => (data += chunk));
stream.on('close', () => console.log(data));
stream.on('error', (error) => console.log(error.message));
