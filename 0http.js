// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const zero = require("0http");

async function start(port) {
  const { router, server } = zero();
  router.get("/hey", async (request, reply) => {
    return "Hey!";
  });
  router.get("/hell", async (request, reply) => {
    return "Hell!";
  });
  router.get("/hello", async (request, reply) => {
    return "Hello World!";
  });
  router.get("/about", async (request, reply) => {
    reply.type("text/html").send("<html><body>About page</body></html>");
  });

  await server.listen(port, {
    defaultRoute: (req, res) => {
      res.statusCode = 404;
      res.send("Not Found");
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
