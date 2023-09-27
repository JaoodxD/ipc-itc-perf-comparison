const buildWorker = require('./worker_threads/itc.js');
const buildProcess = require('./child_process/ipc.js');

const strategy = {
  ipc: buildProcess,
  itc: buildWorker
};

module.exports = strategy;
