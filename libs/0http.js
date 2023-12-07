// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const zero = require("0http");

async function start(port) {
  const { router, server } = zero();
  router.get("/hey", async (request, reply) => {
    return util.RESPONSE_HEY;
  });
  router.get("/hell", async (request, reply) => {
    return util.RESPONSE_HELL;
  });
  router.get("/hello", async (request, reply) => {
    return await controller.hello();
  });
  router.get("/about", async (request, reply) => {
    reply.type("text/html").send(util.RESPONSE_ABOUT);
  });

  await server.listen(port, {
    defaultRoute: (req, res) => {
      res.statusCode = 404;
      res.send(util.RESPONSE_NOT_FOUND);
    },
  });
  return {
    close: () => {
      return server.close();
    },
  };
}

module.exports = {
  name: util.getModuleName("0http"),
  version: util.getModuleVersion("0http"),
  start,
};
