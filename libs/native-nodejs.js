// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const http = require("http");

async function start(port) {
  const server = http.createServer((req, res) => {
    if (req.url === "/hey") {
      res.writeHead(200);
      res.end("Hey!");
    } else if (req.url === "/hell") {
      res.writeHead(200);
      res.end("Hell!");
    } else if (req.url === "/hello") {
      res.writeHead(200);
      res.end("Hello!");
    } else if (req.url === "/about") {
      res.writeHead(200);
      res.end("<html><body>About page</body></html>");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });

  server.listen(port);

  return server;
}

module.exports = {
  name: "native-nodejs",
  version: process.version,
  start,
};
