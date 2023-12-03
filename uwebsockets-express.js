// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const uWS = require("uWebSockets.js");
const expressify = require("uwebsockets-express").default;

async function start(port) {
  const uwsApp = uWS.App();
  const app = expressify(uwsApp);

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
