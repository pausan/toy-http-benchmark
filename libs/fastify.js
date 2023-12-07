// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const controller = require("./controller");
const util = require("./util");
const fastify = require("fastify");

async function start(port) {
  const server = fastify();
  server.get("/hey", async (request, reply) => {
    return util.RESPONSE_HEY;
  });
  server.get("/hell", async (request, reply) => {
    return util.RESPONSE_HELL;
  });
  server.get("/hello", async (request, reply) => {
    return await controller.hello();
  });
  server.get("/about", async (request, reply) => {
    reply.type("text/html").send(util.RESPONSE_ABOUT);
  });

  server.setNotFoundHandler(async (request, reply) => {
    reply.code(404).send(util.RESPONSE_NOT_FOUND);
  });

  await server.listen({ port });
  return {
    close: () => {
      return server.close();
    },
  };
}

module.exports = {
  name: util.getModuleName("fastify"),
  version: util.getModuleVersion("fastify"),
  start,
};

if (require.main === module) {
  start(3000);
}
