// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const os = require("os");
const autocannon = require("autocannon");
const express = require("./express.js");
const fastify = require("./fastify.js");
const hyperExpress = require("./hyper-express.js");
const uwebsocketsExpress = require("./uwebsockets-express.js");
const uwebsockets = require("./uwebsockets.js");
const zeroHttp = require("./0http.js");

// -----------------------------------------------------------------------------
// g_testConfig Global configuraiton to keep things simple
// -----------------------------------------------------------------------------
const g_testConfig = {
  path: "hello",
  amount: 100 * 1000,
  connections: 1000,
  pipelining: 1,
  // duration: 10
};

// -----------------------------------------------------------------------------
// benchmarkUrl
// -----------------------------------------------------------------------------
async function benchmarkUrl(url) {
  const autocannonConfig = {
    ...g_testConfig,
    url,
  };
  const result = await autocannon(autocannonConfig);

  return {
    duration: result.duration,
    errors: result.errors + result.timeouts,
    latency: result.latency.p99_9,
    requests: result.requests.p99_9,
    throughput: result.throughput.p99_9,
  };
}

// -----------------------------------------------------------------------------
// testFramework
//
// Start & stop test server and perform HTTP requests to measure performance
// -----------------------------------------------------------------------------
async function testFramework(framework, port) {
  const server = await framework.start(port);
  const result = await benchmarkUrl(
    `http://localhost:${port}/${g_testConfig.path}`
  );
  await server.close();

  return {
    name: framework.name,
    version: framework.version,
    ...result,
  };
}

// -----------------------------------------------------------------------------
// getMedalFor
//
// >>> getMedalFor('uWebSockets.js', [ { ... } ], 'requests')
// 🥇
// -----------------------------------------------------------------------------
function getMedalFor(name, array, field, lowerIsBetter) {
  const gold = "🥇";
  const silver = "🥈";
  const bronze = "🥉";

  const clone = [...array];

  clone.sort((a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  });

  if (lowerIsBetter !== "LOWER_IS_BETTER") clone.reverse();

  if (clone[0].name === name) return gold;
  if (clone[1].name === name) return silver;
  if (clone[2].name === name) return bronze;
  return "";
}

// -----------------------------------------------------------------------------
// generateMarkdownTable
// -----------------------------------------------------------------------------
function generateMarkdownTable(data) {
  let markdown = [
    "| Name  | Version | Duration (s) | # Errors | Latency (us) | Requests/s | Throughput (KB/s) |",
    "| :---- | :------ | -----------: | -------: | -----------: | ---------: | ----------------: |",
  ];

  for (const item of data) {
    markdown.push(
      `
| ${item.name}
| ${item.version}
| ${getMedalFor(
        item.name,
        data,
        "duration",
        "LOWER_IS_BETTER"
      )} ${item.duration.toFixed(3)}
| ${item.errors}
| ${getMedalFor(
        item.name,
        data,
        "latency",
        "LOWER_IS_BETTER"
      )} ${item.latency.toFixed(3)}
| ${getMedalFor(item.name, data, "requests")} ${item.requests.toFixed(3)}
| ${getMedalFor(item.name, data, "throughput")} ${(
        item.throughput / 1000
      ).toFixed(3)}
|`
        .replace(/\n/g, " ")
        .replace(/^\s*/, "")
    );
  }

  return markdown.join("\n");
}

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------
async function main() {
  const frameworks = [
    uwebsockets,
    hyperExpress,
    uwebsocketsExpress,
    fastify,
    express,

    // disabled due to issues and me not wanting to invest 5 min fixing them
    // zeroHttp
  ];

  const results = [];
  for (const framework of frameworks) {
    // warmup
    await testFramework(framework, 2500);

    // now we measure
    const result = await testFramework(framework, 3000);
    results.push(result);
  }

  console.log(" ");
  console.log("Configuration: ");
  console.log("  Node Version: ", process.version);
  console.log("  CPU Model:    ", os.cpus()[0].model);
  console.log("  Path:         ", "/" + g_testConfig.path);
  console.log("  Requests:     ", g_testConfig.amount);
  console.log("  Connections:  ", g_testConfig.connections);
  console.log(" ");
  console.log(generateMarkdownTable(results));
}

main();
