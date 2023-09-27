'use strict';

const path = require('path');
const defer = require('../lib/deffer.js');
const { Worker } = require('worker_threads');
const worker_path = path.join(__dirname, 'worker.js');

const buildWorker = () => {
  const worker = new Worker(worker_path);
  const close = () => worker.terminate();

  let commandId = 0;
  const commands = new Map();

  worker.on('message', ({ taskId, vault }) => {
    const resolver = commands.get(taskId);
    if (!resolver) return console.error('Missing resolver', taskId);
    commands.delete(taskId);
    resolver(vault);
  });
  const command = async () => {
    const taskId = commandId++;
    const { promise, resolve } = defer();
    commands.set(taskId, resolve);
    worker.postMessage({ taskId });
    return promise;
  };

  return { command, close };
};

module.exports = buildWorker;
