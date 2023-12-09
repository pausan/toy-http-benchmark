// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const util = require("./util");
const sqlite3 = require("sqlite3");
const betterSqlite3 = require("better-sqlite3");
const postgres = require("postgres");
const pg = require("pg");
const redis = require("redis");

let _sqlite3Db = null;
let _betterSqlite3Db = null;
let _pgPool = null;
let _postgres = null;
let _redis = null;
const REDIS_KEY = 'hello'

// -----------------------------------------------------------------------------
// setup
//
// Setups all db connections once
// -----------------------------------------------------------------------------
async function setup() {
  _sqlite3Db = new sqlite3.Database(":memory:");
  _betterSqlite3Db = betterSqlite3(":memory:");

  const connectionString = "postgresql://pguser:pgpass@127.0.0.1:5432/pgdb";

  _pgPool = new pg.Pool({ connectionString, max: 10 });
  _postgres = postgres(connectionString, { max: 10 });

  _redis = await redis.createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

  await _redis.set(REDIS_KEY, helloText());
}

// -----------------------------------------------------------------------------
// shutdown
// -----------------------------------------------------------------------------
async function shutdown() {
  if (_pgPool) await _pgPool.end();
  if (_postgres) await _postgres.end();
  if (_redis) await _redis.disconnect();
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

// -----------------------------------------------------------------------------
// helloPg
// -----------------------------------------------------------------------------
async function helloPg() {
  const result = await _pgPool.query(`SELECT '${util.RESPONSE_HELLO}' as text`);
  const text = result.rows[0].text;
  return text;
}

// -----------------------------------------------------------------------------
// helloPostgres
// -----------------------------------------------------------------------------
async function helloPostgres() {
  const result = await _postgres`SELECT ${util.RESPONSE_HELLO} as text`;
  return result[0].text;
}

// -----------------------------------------------------------------------------
// helloRedis
// -----------------------------------------------------------------------------
async function helloRedis() {
  return await _redis.get(REDIS_KEY);
}

// -----------------------------------------------------------------------------
// exports
// -----------------------------------------------------------------------------
module.exports = {
  setup,
  shutdown,

  helloText,
  helloSqlite3,
  helloBetterSqlite3,
  helloPg,
  helloPostgres,
  helloRedis,

  hello: helloText,
};
