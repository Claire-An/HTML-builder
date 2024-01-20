const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const pathFile = path.join(__dirname, 'text.txt');
const stream = new fs.WriteStream(pathFile, 'utf-8');

const rl = readline.createInterface({ input, output });

output.write('Введите текст\n');

const processExit = () => {
  output.write('Добавление текста завершено');
  process.exit();
};

rl.on('line', (input) => {
  if (input === 'exit') processExit();
  else stream.write(input + '\n');
});

rl.on('SIGINT', () => {
  processExit();
});
