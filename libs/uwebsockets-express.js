// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const uWS = require("uWebSockets.js");
const expressify = require("uwebsockets-express").default;

async function start(port) {
  const uwsApp = uWS.App();
  const app = expressify(uwsApp);

  app.get("/hey", (req, res) => {
    res.send(util.RESPONSE_HEY);
  });
  app.get("/hell", (req, res) => {
    res.send(util.RESPONSE_HELL);
  });
  app.get("/hello", async (req, res) => {
    res.send(await controller.hello());
  });
  app.get("/about", (req, res) => {
    res.send(util.RESPONSE_ABOUT);
  });

  // Route to handle 404 - Not Found
  app.use((req, res) => {
    res.status(404).send(util.RESPONSE_NOT_FOUND);
  });

  await app.listen(port);

  return {
    close: () => {
      return uwsApp.close();
    },
  };
}

module.exports = {
  name: util.getModuleName("uwebsockets-express"),
  version: util.getModuleVersion("uwebsockets-express"),
  start,
};
