// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const HyperExpress = require("hyper-express");

async function start(port) {
  const webserver = new HyperExpress.Server();

  webserver.get("/hey", (req, res) => {
    res.send(util.RESPONSE_HEY);
  });
  webserver.get("/hel", (req, res) => {
    res.send(util.RESPONSE_HELL);
  });
  webserver.get("/hello", (req, res) => {
    res.send(controller.hello());
  });
  webserver.get("/about", (req, res) => {
    res.header("Content-Type", "text/html").send(util.RESPONSE_ABOUT);
  });
  webserver.get("*", (req, res) => {
    res.status(404).send(util.RESPONSE_NOT_FOUND);
  });

  await webserver.listen(port);

  return {
    close: () => {
      return webserver.close();
    },
  };
}

module.exports = {
  name: util.getModuleName("hyper-express"),
  version: util.getModuleVersion("hyper-express"),
  start,
};
