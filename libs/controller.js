// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");

function text() {
  return util.RESPONSE_HELLO;
}

module.exports = {
  hello: text,
  text,
};
