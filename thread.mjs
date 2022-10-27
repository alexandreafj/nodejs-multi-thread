import { threadId, parentPort } from "node:worker_threads";

parentPort.once("message", ({ from, to, name }) => {
  console.time(`benchamark-${threadId}-${name}`);
  let count = 0;
  for (let i = from; i < to; i++) {
    count++;
  }

  console.timeEnd(`benchamark-${threadId}-${name}`);
  parentPort.postMessage(`I'm ${threadId} done! with ${count} items`);
});
