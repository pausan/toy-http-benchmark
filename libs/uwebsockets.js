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
    res.end(util.RESPONSE_HEY);
  });
  app.get("/hell", (res) => {
    res.end(util.RESPONSE_HELL);
  });
  app.get("/hello", (res) => {
    res.end(util.RESPONSE_HELLO);
  });
  app.get("/about", (res) => {
    res.end(util.RESPONSE_ABOUT);
  });

  // Route to handle 404 - Not Found
  app.any("/*", (res) => {
    res.writeStatus("404 Not Found").end(util.RESPONSE_NOT_FOUND);
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
