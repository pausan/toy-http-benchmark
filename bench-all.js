// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const os = require("os");
const util = require("util");
const { exec } = require("child_process");
const autocannon = require("autocannon");
const nativejs = require("./native-nodejs.js");
const express = require("./express.js");
const fastify = require("./fastify.js");
const h3 = require("./h3.js");
const hyperExpress = require("./hyper-express.js");
const uwebsocketsExpress = require("./uwebsockets-express.js");
const uwebsockets = require("./uwebsockets.js");
const zeroHttp = require("./0http.js");

const execAsync = util.promisify(exec);

const AUTOCANNON = "autocannon";
const WRK = "wrk";

// -----------------------------------------------------------------------------
// g_testConfig Global configuraiton to keep things simple
// -----------------------------------------------------------------------------
const g_testConfig = {
  path: "hello",
  port: 3000,
  warmup: parseInt(process.env.BENCH_WARMUP || true),
  connections: parseInt(process.env.BENCH_CONNECTIONS || 100),
  pipelining: 1,
  duration: parseInt(process.env.BENCH_DURATION || 10),
};

// -----------------------------------------------------------------------------
// benchmarkUrlWithAutocannon
// -----------------------------------------------------------------------------
async function benchmarkUrlWithAutocannon(config, url) {
  const autocannonConfig = {
    ...config,
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
// benchmarkUrlWithWrk
// -----------------------------------------------------------------------------
async function benchmarkUrlWithWrk(config, url) {
  const command = [
    "wrk",
    "-s",
    "wrk-json.lua",
    "--timeout",
    "2s",
    "-t",
    "1",
    "-c",
    config.connections,
    "-d",
    config.duration + "s",
    url,
  ];

  const { stdout } = await execAsync(command.join(" "));
  const data = JSON.parse(stdout.toString().split("JSON Output:")[1]);
  return {
    duration: data.duration_in_microseconds / 1e6,
    errors:
      data.connect_errors +
      data.read_errors +
      data.write_errors +
      data.http_errors +
      data.timeouts,
    latency: data.latency_p99_9,
    requests: data.requests_per_sec,
    throughput: data.bytes_transfer_per_sec,
  };
}

// -----------------------------------------------------------------------------
// testFramework
//
// Start & stop test server and perform HTTP requests to measure performance
// -----------------------------------------------------------------------------
async function testFramework(loadTestingTool, framework, config) {
  const server = await framework.start(config.port);

  // warmup for 1 second
  if (config.warmup)
    await benchmarkUrlWithAutocannon(
      { ...config, duration: 1 },
      `http://localhost:${config.port}/${config.path}`
    );

  let result = {};
  switch (loadTestingTool) {
    case AUTOCANNON:
      result = await benchmarkUrlWithAutocannon(
        config,
        `http://localhost:${config.port}/${config.path}`
      );
      break;

    case WRK:
    default:
      result = await benchmarkUrlWithWrk(
        config,
        `http://localhost:${config.port}/${config.path}`
      );
      break;
  }
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
    "| Name  | Version | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |",
    "| :---- | :------ | -------: | -----------: | ---------: | -----------: | ----------------: |",
  ];

  // rank requests
  const clone = [...data];
  clone.sort((a, b) => {
    if (a.requests > b.requests) return -1;
    if (a.requests < b.requests) return 1;
    return 0;
  });
  const lowestReqPerSec = clone[clone.length - 1].requests;

  for (const item of clone) {
    item.speed = item.requests / lowestReqPerSec;

    markdown.push(
      `
| ${item.name}
| ${item.version}
| ${item.errors}
| ${getMedalFor(item.name, clone, "speed")} ${item.speed.toFixed(2)}x
| ${getMedalFor(item.name, clone, "requests")} ${parseInt(item.requests)}
| ${getMedalFor(
        item.name,
        clone,
        "latency",
        "LOWER_IS_BETTER"
      )} ${item.latency.toFixed(3)}
| ${getMedalFor(item.name, clone, "throughput")} ${(
        item.throughput / 1e6
      ).toFixed(1)}MB/s
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
  let portIndex = 0;
  const frameworks = [
    uwebsockets,
    hyperExpress,
    uwebsocketsExpress,
    nativejs,
    fastify,
    h3,
    express,

    // disabled due to issues and me not wanting to invest 5 min fixing them
    // zeroHttp
  ];

  const results = [];
  for (const framework of frameworks) {
    console.log(`Testing ${framework.name}...`);

    const result = await testFramework(WRK, framework, {
      ...g_testConfig,
      port: 3000 + portIndex,
    });
    results.push(result);

    portIndex++;
  }

  console.log(" ");
  console.log("Configuration: ");
  console.log("  Node Version: ", process.version);
  console.log("  CPU Model:    ", os.cpus()[0].model);
  console.log("  Path:         ", "/" + g_testConfig.path);
  console.log("  Duration:     ", g_testConfig.duration, "s");
  console.log("  Connections:  ", g_testConfig.connections);
  console.log(" ");
  console.log(generateMarkdownTable(results));
}

main();
