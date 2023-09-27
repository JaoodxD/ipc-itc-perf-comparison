'use strict';

const path = require('path');
const defer = require('../lib/deffer.js');
const { fork } = require('child_process');
const process_path = path.join(__dirname, 'child_process.js');

const buildProcess = () => {
  const child_process = fork(process_path);
  const close = () => child_process.kill();

  let commandId = 0;
  const commands = new Map();

  child_process.on('message', ({ taskId, vault }) => {
    const resolver = commands.get(taskId);
    if (!resolver) return console.error('Missing resolver', taskId);
    commands.delete(taskId);
    resolver(vault);
  });
  const command = async () => {
    const taskId = commandId++;
    const { promise, resolve } = defer();
    commands.set(taskId, resolve);
    child_process.send({ taskId });
    return promise;
  };
  return { command, close };
};

module.exports = buildProcess;
