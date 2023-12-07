// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const express = require("express");

async function start(port) {
  const app = express();

  app.get("/hey", (req, res) => {
    res.send(util.RESPONSE_HEY);
  });
  app.get("/hell", (req, res) => {
    res.send(util.RESPONSE_HELL);
  });
  app.get("/hello", (req, res) => {
    res.send(controller.hello());
  });
  app.get("/about", (req, res) => {
    res.send(util.RESPONSE_ABOUT);
  });

  // Route to handle 404 - Not Found
  app.use((req, res) => {
    res.status(404).send(util.RESPONSE_NOT_FOUND);
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      // console.log(`Server is running on port ${port}`);
      // NOTE: server already has a method named close that closes the server
      resolve(server);
    });
  });
}

module.exports = {
  name: util.getModuleName("express"),
  version: util.getModuleVersion("express"),
  start,
};
