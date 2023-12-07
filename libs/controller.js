// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const sqlite3 = require("sqlite3");
const betterSqlite3 = require("better-sqlite3");

let _sqlite3Db = null;
let _betterSqlite3Db = null;

// -----------------------------------------------------------------------------
// setup
//
// Setups all db connections once
// -----------------------------------------------------------------------------
function setup() {
  _sqlite3Db = new sqlite3.Database(":memory:");
  _betterSqlite3Db = betterSqlite3(":memory:");
}

// -----------------------------------------------------------------------------
// helloText
// -----------------------------------------------------------------------------
function helloText() {
  return util.RESPONSE_HELLO;
}

// -----------------------------------------------------------------------------
// helloBetterSqlite3
// -----------------------------------------------------------------------------
function helloBetterSqlite3() {
  const row = _betterSqlite3Db
    .prepare(`SELECT '${util.RESPONSE_HELLO}' as text`)
    .get();
  return row.text;
}

// -----------------------------------------------------------------------------
// helloSqlite3
// -----------------------------------------------------------------------------
async function helloSqlite3() {
  const stmt = _sqlite3Db.prepare(`SELECT '${util.RESPONSE_HELLO}' as text`);
  const text = await new Promise((resolve) => {
    stmt.get((err, row) => {
      resolve(row.text);
      stmt.finalize();
    });
  });
  return text;
}

module.exports = {
  setup,
  helloText,
  helloSqlite3,
  helloBetterSqlite3,

  hello: helloText,
};
