// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const fs = require("fs");
const util = require("./libs/util.js");


async function main() {
  await util.setup()

  const template = fs.readFileSync('README.template.md').toString('utf-8')
  const lastResult = JSON.parse (fs.readFileSync('last-result.json'))

  const allResults = []
  const allHandlers = new Set()
  const resultsForHandler = new Map()
  for (const result of lastResult) {
    allHandlers.add(result.handler)

    if (!resultsForHandler.has(result.handler))
      resultsForHandler.set(result.handler, [])

    const results = resultsForHandler.get(result.handler)
    results.push (result)
    allResults.push (result)
  }

  const contents = []
  for (const handler of allHandlers) {
    contents.push (`### ${handler} Benchmark\n`)

    const results = resultsForHandler.get(handler)
    contents.push(util.generateMarkdownTable(results) + "\n");
  }

  contents.push (`### All Benchmarks\n`)
  contents.push(util.generateMarkdownTable(allResults) + "\n");

  const readme = template.replace('<TEMPLATE_BENCHMARK_DATA>', contents.join('\n'))
  fs.writeFileSync('README.md', readme)
}




main()