// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const uWS = require("uWebSockets.js");

async function start(port) {
  const app = uWS.App();

  app.get("/hey", (res) => {
    res.end("Hey!");
  });
  app.get("/hell", (res) => {
    res.end("Hell!");
  });
  app.get("/hello", (res) => {
    res.end("Hello World!");
  });
  app.get("/about", (res) => {
    res.end("<html><body>About page</body></html>");
  });

  // Route to handle 404 - Not Found
  app.any("/*", (res) => {
    res.writeStatus("404 Not Found").end("Not Found");
  });

  return new Promise((resolve) => {
    app.listen(port, (socket) => {
      resolve(app);
    });
  });
}

module.exports = {
  name: util.getModuleName("uWebSockets.js"),
  version: util.getModuleVersion("uWebSockets.js"),
  start,
};
