// sets the number of threads used in libuv's threadpool
// UV_THREADPOOL_SIZE=100 node index.mjs

import { execSync } from "node:child_process";
import { Worker } from "node:worker_threads";

function getCurrentThreadCount() {
  // Get how many therads inside the process has and counts
  return parseInt(execSync(`ps -M ${process.pid} | wc -l`).toString());
}

function createThread(data) {
  const worker = new Worker("./thread.mjs");
  const p = new Promise((resolve, reject) => {
    worker.once("message", (message) => {
      return resolve(message);
    });
    worker.once("error", reject);
    worker.once("exit", (exitCode) => console.log("finish: ", exitCode));
  });

  worker.postMessage(data);
  return p;
}

async function asyncBlockingFunction(data) {
  const p = new Promise((resolve, reject) => {
    console.time(`promise`);
    for (let i = data.from; i < data.to; i++);
    console.timeEnd(`promise`);

    resolve("termineeei");
  });

  return p;
}

const nodejsDefaultThreadNumber = getCurrentThreadCount() - 1; // - 1 = ignores process because is counted
console.log(
  `Im running`,
  process.pid,
  `default threads: ${nodejsDefaultThreadNumber}`
);

let nodejsThreadCount = 0;
const intervalId = setInterval(() => {
  // in this way we can see only the threads we've created manually
  const currentThreads = getCurrentThreadCount() - nodejsDefaultThreadNumber;
  if (currentThreads == nodejsThreadCount) return;

  nodejsThreadCount = currentThreads;
  console.log("threads", nodejsThreadCount);
});

// for(let i =0; i< 1e20; i++);

// await Promise.all([
//   asyncBlockingFunction({
//     from: 0,
//     to: 1e10
//   }),
//   asyncBlockingFunction({
//     from: 0,
//     to: 1e9
//   }),
// ])

await Promise.all([
  createThread({
    from: 0,
    to: 1e9,
    name: "abc",
  }),
  createThread({
    from: 0,
    to: 1e9,
    name: "abcd",
  }),
  createThread({
    from: 0,
    to: 1e8,
    name: "abcde",
  }),
  createThread({
    from: 0,
    to: 1e10,
    name: "abcdef",
  }),
  createThread({
    from: 0,
    to: 1e3,
    name: "abcdefg",
  }),
]).then((results) => console.log(results));

clearInterval(intervalId);
