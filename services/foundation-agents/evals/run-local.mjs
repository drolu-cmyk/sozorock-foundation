import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { executeGraph, graphs } from "../src/graph.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const casesPath = resolve(here, "cases.jsonl");
const resultsPath = resolve(here, "results/latest.json");

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is required for live agent evals.");
  process.exit(2);
}

const cases = (await readFile(casesPath, "utf8"))
  .split(/\r?\n/u)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const results = [];
for (const testCase of cases) {
  const startedAt = new Date().toISOString();
  try {
    const result = await executeGraph(testCase);
    const expectedNodes = graphs[testCase.graphId].nodes.length;
    const checks = {
      reviewRequired: result.status === "review_required",
      allNodesRan: result.outputs.length === expectedNodes,
      finalPresent: typeof result.final === "string" && result.final.trim().length > 0,
      surfaceMatches: result.surface === graphs[testCase.graphId].surface,
    };
    results.push({ id: testCase.id, graphId: testCase.graphId, startedAt, passed: Object.values(checks).every(Boolean), checks });
  } catch (error) {
    results.push({ id: testCase.id, graphId: testCase.graphId, startedAt, passed: false, error: error instanceof Error ? error.message : "unknown_error" });
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed: results.filter((result) => result.passed).length,
  failed: results.filter((result) => !result.passed).length,
  results,
};

await mkdir(dirname(resultsPath), { recursive: true });
await writeFile(resultsPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ total: summary.total, passed: summary.passed, failed: summary.failed }));
if (summary.failed > 0) process.exit(1);
