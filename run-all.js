// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./libs/controller.js");
const express = require("./libs/express.js");
const fastify = require("./libs/fastify.js");
const h3 = require("./libs/h3.js");
const hyperExpress = require("./libs/hyper-express.js");
const nodeHttp = require("./libs/node-http.js");
const nodeRawSockets = require("./libs/node-raw-sockets.js");
const uwebsockets = require("./libs/uwebsockets.js");
const uwebsocketsExpress = require("./libs/uwebsockets-express.js");
const zeroHttp = require("./libs/0http.js");

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------
async function main() {
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

  controller.setup();

  // just a sample
  // controller.hello = controller.helloBetterSqlite3;

  const servers = [];
  let port = 3000;
  for (const framework of frameworks) {
    console.log(
      `Running ${framework.name} ${framework.version} on port ${port}...`
    );
    const server = await framework.start(port);
    servers.push(server);
    port++;
  }

  process.on("SIGINT", () => {
    console.log("Ctrl+C pressed: Exiting all servers gracefully...");
    for (const server of servers) {
      server.close();
    }

    process.exit(0);
  });
}

main();
