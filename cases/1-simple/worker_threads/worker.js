'use strict';

const { parentPort } = require('worker_threads');

const vault = {
  block: 0
};

parentPort.on('message', ({ taskId, args }) => {
  vault.block++;
  parentPort.postMessage({ taskId, vault });
});
