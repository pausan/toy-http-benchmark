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

module.exports = {
  getModuleName,
  getModuleVersion,
};
