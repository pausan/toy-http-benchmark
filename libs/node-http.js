// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const http = require("http");
const util = require("./util");

async function start(port) {
  const server = http.createServer((req, res) => {
    if (req.url === "/hey") {
      res.writeHead(200);
      res.end(util.RESPONSE_HEY)
    } else if (req.url === "/hell") {
      res.writeHead(200);
      res.end(util.RESPONSE_HELL)
    } else if (req.url === "/hello") {
      res.writeHead(200);
      res.end(util.RESPONSE_HELLO)
    } else if (req.url === "/about") {
      res.writeHead(200);
      res.end(util.RESPONSE_ABOUT)
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(util.RESPONSE_NOT_FOUND)
    }
  });

  server.listen(port);

  return server;
}

module.exports = {
  name: "node:http",
  version: process.version,
  start,
};
