// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const express = require("./express.js");
const fastify = require("./fastify.js");
const hyperExpress = require("./hyper-express.js");
const uwebsocketsExpress = require("./uwebsockets-express.js");
const uwebsockets = require("./uwebsockets.js");
const zeroHttp = require("./0http.js");

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
