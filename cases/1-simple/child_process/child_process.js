'use strict';

const vault = {
  block: 0
};

process.on('message', ({ taskId, args }) => {
  vault.block++;
  process.send({ taskId, vault });
});
