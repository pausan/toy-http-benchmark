// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// This raw socket implementation tries to keep things simple and fast and does
// not worry too much about any sort of errors or malformed inputs, it is just
// a best-case scenario sort of thing to use raw sockets in node and measure
// the best scenario preformance.
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const net = require("net");

function start(port) {
  const server = net.createServer((socket) => {
    socket.setEncoding("utf-8");

    socket.on("data", async (data) => {
      const request = data.toString();
      const requestData = request.split("\r\n");

      if (requestData[0].startsWith("GET")) {
        const url = requestData[0].split(" ")[1];

        let content = "unknown";
        let headers = ["Connection: keep-alive"];
        switch (url) {
          case "/hey":
            content = util.RESPONSE_HEY;
            break;
          case "/hell":
            content = util.RESPONSE_HELL;
            break;
          case "/hello":
            content = await controller.hello();
            break;
          case "/about":
            headers.push("Content-Type: text/html");
            content = util.RESPONSE_ABOUT;
            break;
          default:
            socket.write("HTTP/1.1 404 Not Found\r\n\r\nNot Found");
            socket.end();
            return;
        }

        // NOTE: this is wrong in UTF-8
        headers.push(`Content-Length: ${content.length}`);

        // force adding extra \r\n
        if (headers.length) headers.push("");

        socket.write(
          `HTTP/1.1 200 OK\r\n${headers.join("\r\n")}\r\n${content}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\nNot Found");
      }

      // disabled for performance: enable if "Connection: close"
      // socket.end()
    });

    socket.on("error", (error) => {
      if (error.code === "ECONNRESET") {
        // ignoring
      } else if (error.code === "EPIPE") {
        // ignoring on purpose
      } else {
        console.error("Socket error:", error);
      }
    });
  });

  return server.listen(port);
}

module.exports = {
  name: "node:net",
  version: process.version,
  start,
};

if (require.main === module) {
  start(3000);
}
