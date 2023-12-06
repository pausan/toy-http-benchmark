// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const express = require("express");
const util = require("./util");

async function start(port) {
  const app = express();

  app.get("/hey", (req, res) => {
    res.send("Hey!");
  });
  app.get("/hell", (req, res) => {
    res.send("Hell!");
  });
  app.get("/hello", (req, res) => {
    res.send("Hello World!");
  });
  app.get("/about", (req, res) => {
    res.send("<html><body>About page</body></html>");
  });

  // Route to handle 404 - Not Found
  app.use((req, res) => {
    res.status(404).send("Not Found");
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
