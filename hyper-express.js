// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const HyperExpress = require("hyper-express");

async function start(port) {
  const webserver = new HyperExpress.Server();

  webserver.get("/hey", (req, res) => {
    res.send("Hey!");
  });
  webserver.get("/hel", (req, res) => {
    res.send("Hell!");
  });
  webserver.get("/hello", (req, res) => {
    res.send("Hello World!");
  });
  webserver.get("/about", (req, res) => {
    res
      .header("Content-Type", "text/html")
      .send("<html><body>About page</body></html>");
  });

  webserver.use((req, res) => {
    res.status(404).send("Not Found");
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
