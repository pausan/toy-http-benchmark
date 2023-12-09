// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const os = require("os");
const fs = require("fs");
const util = require("util");
const { exec } = require("child_process");
const autocannon = require("autocannon");
const controller = require("./libs/controller");
const express = require("./libs/express.js");
const fastify = require("./libs/fastify.js");
const h3 = require("./libs/h3.js");
const hyperExpress = require("./libs/hyper-express.js");
const nodeHttp = require("./libs/node-http.js");
const nodeRawSockets = require("./libs/node-raw-sockets.js");
const uwebsockets = require("./libs/uwebsockets.js");
const uwebsocketsExpress = require("./libs/uwebsockets-express.js");
const zeroHttp = require("./libs/0http.js");
const libUtil = require("./libs/util.js");

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
// main
// -----------------------------------------------------------------------------
async function main() {
  let portIndex = 0;
  const frameworks = [
    express,
    fastify,
    h3,
    hyperExpress,
    nodeHttp,
    nodeRawSockets,
    uwebsockets,
    uwebsocketsExpress,

    // disabled due to issues and me not wanting to invest 5 min fixing them
    // zeroHttp
  ];

  console.log(" ");
  console.log("Configuration: ");
  console.log("  Node Version: ", process.version);
  console.log("  CPU Model:    ", os.cpus()[0].model);
  console.log("  Path:         ", "/" + g_testConfig.path);
  console.log("  Duration:     ", g_testConfig.duration, "s");
  console.log("  Connections:  ", g_testConfig.connections);
  console.log(" ");

  await execAsync("docker-compose up -d");
  await new Promise((x) => setTimeout(x, 3000)) // wait for pg to start
  await libUtil.setup()
  await controller.setup();

  const controllers = {
    text: controller.helloText,
    redis: controller.helloRedis,
    "better-sqlite3": controller.helloBetterSqlite3,
    sqlite3: controller.helloSqlite3,
    pg: controller.helloPg,
    postgres: controller.helloPostgres,
  };

  const allResults = [];
  for (const [controllerName, controllerHandler] of Object.entries(
    controllers
  )) {
    if (process.env.BENCH_FILTER && !controllerName.includes(process.env.BENCH_FILTER))
      continue;

    controller.hello = controllerHandler;
    const results = [];
    for (const framework of frameworks) {
      console.error(`Testing ${framework.name} (${controllerName})...`);

      const result = await testFramework(WRK, framework, {
        ...g_testConfig,
        port: 3000 + portIndex,
      });
      result.framework = result.name;
      result.handler = controllerName;
      results.push(result);
      allResults.push({
        ...result,
        name: `${result.name} (${controllerName})`,
      });

      portIndex++;
    }

    console.log(libUtil.generateMarkdownTable(results) + "\n\n");
  }

  console.log("All:");
  console.log(libUtil.generateMarkdownTable(allResults) + "\n\n");
  controller.shutdown();
  await execAsync("docker-compose down");

  // save output
  fs.writeFileSync(
    'last-result.json',
    JSON.stringify(allResults, null, 2)
  )
}

main();
