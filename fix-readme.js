// -----------------------------------------------------------------------------
// Copyright @ 2023 Pau Sanchez
//
// MIT License
// -----------------------------------------------------------------------------
const fs = require("fs");
const util = require("./libs/util.js");

class BenchResultSet {
  constructor(jsonResults) {
    this.reset()

    if (jsonResults) {
      this.load (jsonResults)
    }
  }

  reset() {
    this.allResults = []
    this.allHandlers = new Set()
    this.allFrameworks = new Set()
    this.resultsForHandler = new Map()
  }

  load(jsonResults) {
    for (const result of jsonResults) {
      this.allFrameworks.add(result.framework)
      this.allHandlers.add(result.handler)

      if (!this.resultsForHandler.has(result.handler))
        this.resultsForHandler.set(result.handler, [])

      const results = this.resultsForHandler.get(result.handler)
      results.push (result)

      this.allResults.push (result)
    }
  }
}

// -----------------------------------------------------------------------------
// renderReadmeMarkdown
// -----------------------------------------------------------------------------
function renderReadmeMarkdown(benchResultSet) {
  const template = fs.readFileSync('README.template.md').toString('utf-8')

  const contents = []
  for (const handler of benchResultSet.allHandlers) {
    contents.push (`### ${handler} Benchmark\n`)

    const results = benchResultSet.resultsForHandler.get(handler)
    contents.push(util.generateMarkdownTable(results) + "\n");
  }

  contents.push (`### All Benchmarks\n`)
  contents.push(util.generateMarkdownTable(benchResultSet.allResults) + "\n");

  const readme = template.replace('<TEMPLATE_BENCHMARK_DATA>', contents.join('\n'))
  fs.writeFileSync('README.md', readme)
}

// -----------------------------------------------------------------------------
// renderBlogMarkdown
// -----------------------------------------------------------------------------
function renderBlogMarkdown(benchResultSet) {
  const contents = []
  for (const handler of benchResultSet.allHandlers) {
    const results = benchResultSet.resultsForHandler.get(handler)

    contents.push (`{{% tab name="${handler}" %}}`)
    contents.push(util.generateMarkdownTable(results));
    contents.push (`{{% /tab %}}\n`)
  }

  contents.push (`{{% tab name="All handlers" %}}`)
  contents.push(util.generateMarkdownTable(benchResultSet.allResults));
  contents.push (`{{% /tab %}}\n`)

  fs.writeFileSync('tmp-blog.md', contents.join('\n'))
}

// -----------------------------------------------------------------------------
// renderBlogChartjs
// -----------------------------------------------------------------------------
function renderBlogChartjs(benchResultSet) {
  const datasets = []

  // TODO: guess this automatically from text benchmarks
  const allFrameworksOrdered = [
    "express",
    "uwebsockets-express",
    "fastify",
    "node:http",
    "h3",
    "node:net",
    "hyper-express",
    "uWebSockets.js",
  ].filter( (x) => benchResultSet.allFrameworks.has(x) )

  for (const handler of [...benchResultSet.allHandlers].reverse()) {
    const results = [...benchResultSet.resultsForHandler.get(handler)]
    results.sort( (a, b) => {
      const a1 = allFrameworksOrdered.indexOf(a.framework)
      const b1 = allFrameworksOrdered.indexOf(b.framework)
      if (a1 < b1) return -1
      if (a1 > b1) return 1
      return 0
    })
    const dataPoints = [... results.map((x) => x.requests)]

    datasets.push({
      label : handler,
      data : dataPoints,
    });
  }

  const chartjsData = {
    labels: allFrameworksOrdered,
    datasets : datasets,
  }

  fs.writeFileSync('tmp-chartjs.js', JSON.stringify(chartjsData, null, 2))
}

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------
async function main() {
  await util.setup()

  const lastResult = JSON.parse (fs.readFileSync('last-result.json'))
  const benchResultSet = new BenchResultSet(lastResult)

  renderReadmeMarkdown(benchResultSet)
  renderBlogChartjs(benchResultSet)
  renderBlogMarkdown(benchResultSet)
}

main()