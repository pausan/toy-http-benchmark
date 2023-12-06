// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const http = require("http");
const h3 = require("h3");

function start(port) {
  const app = h3.createApp();
  const router = h3.createRouter();
  router
    .get(
      "/hey",
      h3.eventHandler(() => "Hey!")
    )
    .get(
      "/hell",
      h3.eventHandler(() => "Hell!")
    )
    .get(
      "/hello",
      h3.eventHandler(() => "Hello World!")
    )
    .get(
      "/about",
      h3.eventHandler((event) => {
        h3.setResponseHeader(event, "Content-Type", "text/html");
        return "<html><body>About page</body></html>";
      })
    )
    .get(
      "/*",
      h3.eventHandler((event) => {
        h3.setResponseStatus(event, 404);
        return "Not Found";
      })
    );

  app.use(router);

  return http.createServer(h3.toNodeListener(app)).listen(port);
}

module.exports = {
  name: util.getModuleName("h3"),
  version: util.getModuleVersion("h3"),
  start,
};

if (require.main === module) {
  start(3000);
}
