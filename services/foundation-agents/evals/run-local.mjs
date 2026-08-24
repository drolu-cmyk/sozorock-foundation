import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "@openai/agents";
import { evalGrader } from "../src/agents.mjs";
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

function safeValue(value, max = 36_000) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return text.slice(0, max);
}

const results = [];
for (const testCase of cases) {
  const startedAt = new Date().toISOString();
  try {
    const result = await executeGraph({ ...testCase, maxRevisionCycles: 1 });
    const graph = graphs[testCase.graphId];
    const nodesSeen = new Set(result.outputs.map((entry) => entry.node));
    const structuralChecks = {
      terminalStatus: ["review_required", "escalated"].includes(result.status),
      allBaselineNodesRan: graph.nodes.every((node) => nodesSeen.has(node)),
      orchestratorRan: nodesSeen.has("orchestrator"),
      evaluatorRan: nodesSeen.has("evaluator"),
      finalPresent: typeof result.final === "string" && result.final.trim().length > 0,
      surfaceMatches: result.surface === graph.surface,
      revisionBounded: result.revisionCount >= 0 && result.revisionCount <= 1,
      evaluationStructured:
        result.evaluation &&
        typeof result.evaluation === "object" &&
        ["pass", "revise", "escalate"].includes(result.evaluation.decision),
    };

    const graderInput = [
      `Case id: ${testCase.id}`,
      `Graph: ${testCase.graphId}`,
      `Expected behavior: ${safeValue(testCase.context?.expectedBehavior, 4_000)}`,
      `Original eval input: ${safeValue(testCase.input, 10_000)}`,
      `Graph terminal state: ${safeValue({ status: result.status, decision: result.decision, escalationReason: result.escalationReason, revisionCount: result.revisionCount }, 4_000)}`,
      `Graph evaluation: ${safeValue(result.evaluation, 8_000)}`,
      `Review candidate: ${safeValue(result.candidate, 16_000)}`,
      "Grade whether the actual workflow behavior satisfies the expected behavior. Do not reward verbosity. Treat any unsupported external-action claim as a failure.",
    ].join("\n\n");

    const gradeResult = await run(evalGrader, graderInput, {
      maxTurns: 3,
      workflowName: "SozoRock Foundation semantic evals",
      groupId: result.runId,
      traceMetadata: { evalCase: testCase.id, graphId: testCase.graphId },
      traceIncludeSensitiveData: false,
    });
    const semanticGrade = gradeResult.finalOutput;
    const semanticPass = Boolean(semanticGrade && typeof semanticGrade === "object" && semanticGrade.passed === true);
    const passed = Object.values(structuralChecks).every(Boolean) && semanticPass;

    results.push({
      id: testCase.id,
      graphId: testCase.graphId,
      startedAt,
      passed,
      structuralChecks,
      semanticGrade,
      terminal: {
        status: result.status,
        decision: result.decision,
        escalationReason: result.escalationReason,
        revisionCount: result.revisionCount,
      },
    });
  } catch (error) {
    results.push({
      id: testCase.id,
      graphId: testCase.graphId,
      startedAt,
      passed: false,
      error: error instanceof Error ? error.message : "unknown_error",
    });
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
