'use strict';

const statsAggregator = require('statistics');
const { performance } = require('perf_hooks');

const args = process.argv.slice(2);
const amount = parseInt(args[0]) || 1;

const buildWorker = require('./worker_threads/itc.js');
const buildProcess = require('./child_process/ipc.js');

const strategy = {
  ipc: buildProcess,
  itc: buildWorker
};

const main = async (type, amount) => {
  console.log(type, amount);
  const subWorkerBuilder = strategy[type];
  if (!subWorkerBuilder) return console.error('no sub worker type provided');
  const worker = subWorkerBuilder();
  const stats = [];
  console.time(type);
  for (let i = 0; i < amount; i++) {
    const t1 = performance.now();
    const res = await worker.command();
    const t2 = performance.now();
    stats.push(t2 - t1);
  }
  console.timeEnd(type);
  const res = stats.reduce(statsAggregator);
  res.max = Math.max(...stats);
  res.min = Math.min(...stats);
  for (const key in res) {
    if (key === 'count') continue;
    res[key] = res[key].toFixed(2) + 'ms';
  }
  console.table(res);
  worker.close();
};

main('itc', amount).then(() => main('ipc', amount));