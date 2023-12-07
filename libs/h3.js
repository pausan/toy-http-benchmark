// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const http = require("http");
const h3 = require("h3");

function start(port) {
  const app = h3.createApp();
  const router = h3.createRouter();
  router
    .get(
      "/hey",
      h3.eventHandler(() => util.RESPONSE_HEY)
    )
    .get(
      "/hell",
      h3.eventHandler(() => util.RESPONSE_HELL)
    )
    .get(
      "/hello",
      h3.eventHandler(async () => await controller.hello())
    )
    .get(
      "/about",
      h3.eventHandler((event) => {
        h3.setResponseHeader(event, "Content-Type", "text/html");
        return util.RESPONSE_HELLO;
      })
    )
    .get(
      "/*",
      h3.eventHandler((event) => {
        h3.setResponseStatus(event, 404);
        return util.RESPONSE_NOT_FOUND;
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
