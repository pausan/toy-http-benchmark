// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const fs = require("fs");

function getModuleName(module) {
  const jsonContents = fs.readFileSync(`node_modules/${module}/package.json`);
  const packageJson = JSON.parse(jsonContents);
  return packageJson.name;
}

function getModuleVersion(module) {
  const jsonContents = fs.readFileSync(`node_modules/${module}/package.json`);
  const packageJson = JSON.parse(jsonContents);
  return packageJson.version;
}

// -----------------------------------------------------------------------------
// getMedalFor
//
// >>> getMedalFor('uWebSockets.js', [ { ... } ], 'requests')
// 🥇
// -----------------------------------------------------------------------------
function getMedalFor(name, array, field, lowerIsBetter) {
  const gold = "🥇";
  const silver = "🥈";
  const bronze = "🥉";

  const clone = [...array];

  clone.sort((a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  });

  if (lowerIsBetter !== "LOWER_IS_BETTER") clone.reverse();

  if (clone[0].name === name) return gold;
  if (clone[1].name === name) return silver;
  if (clone[2].name === name) return bronze;
  return "";
}

// -----------------------------------------------------------------------------
// hack to load ESM module
// -----------------------------------------------------------------------------
let markdownTable = null
async function setup() {
  const markdownTableModule = await import("markdown-table");
  markdownTable = markdownTableModule.markdownTable;
}

// -----------------------------------------------------------------------------
// generateMarkdownTable
// -----------------------------------------------------------------------------
function generateMarkdownTable(data) {
  const r = (n) => "-".repeat(n);
  // rank requests
  const clone = [...data];
  clone.sort((a, b) => {
    if (a.requests > b.requests) return -1;
    if (a.requests < b.requests) return 1;
    return 0;
  });

  // const nodeHttp = clone.find((x) => x.name == 'node:http')
  // const referenceReqPerSec = (nodeHttp || clone[clone.length - 1]).requests;
  const referenceReqPerSec = clone[clone.length - 1].requests;

  const table = [
    [
      "Name",
      "Version",
      // "Errors",
      "Speed Factor",
      "Requests/s",
      "Latency (us)",
      "Throughput (MB/s)",
    ],
  ];

  for (const item of clone) {
    item.speed = item.requests / referenceReqPerSec;

    const row = [
      item.name,
      item.version,
      // item.errors,
      getMedalFor(item.name, clone, "speed") + " " + item.speed.toFixed(2) + "x",
      getMedalFor(item.name, clone, "requests") + " " + parseInt(item.requests),
      getMedalFor(item.name, clone, "latency", "LOWER_IS_BETTER") +
        " " +
        parseInt(item.latency),
      `${getMedalFor(item.name, clone, "throughput")} ${(
        item.throughput / 1e6
      ).toFixed(1)}MB/s`
        .replace(/\n/g, " ")
        .replace(/^\s*/, ""),
    ];
    table.push(row);
  }

  return markdownTable(table, { align: ["l", "l", "r", "r", "r", "r", "r"] });
}


module.exports = {
  setup,
  getModuleName,
  getModuleVersion,
  getMedalFor,
  generateMarkdownTable,

  RESPONSE_HEY: "Hey!",
  RESPONSE_HELL: "Hell!",
  RESPONSE_HELLO: "Hello!",
  RESPONSE_ABOUT: "<html><body>About page</body></html>",
  RESPONSE_NOT_FOUND: "Not Found",
};
