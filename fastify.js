// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const fastify = require("fastify");

async function start(port) {
  const server = fastify();
  server.get("/hey", async (request, reply) => {
    return "Hey!";
  });
  server.get("/hell", async (request, reply) => {
    return "Hell!";
  });
  server.get("/hello", async (request, reply) => {
    return "Hello World!";
  });
  server.get("/about", async (request, reply) => {
    reply.type("text/html").send("<html><body>About page</body></html>");
  });

  server.setNotFoundHandler(async (request, reply) => {
    reply.code(404).send("Not Found");
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
