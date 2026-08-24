import assert from "node:assert/strict";
import { agents } from "./agents.mjs";
import { graphs } from "./graph.mjs";

const requiredGraphs = [
  "foundationContentRefresh",
  "publicationRelease",
  "foundationSiteAssurance",
  "aiLabLearnerLoop",
  "aiLabProgramImprovement",
];

assert.deepEqual(Object.keys(graphs), requiredGraphs);

for (const [graphId, graph] of Object.entries(graphs)) {
  assert.ok(["foundation", "ai-lab"].includes(graph.surface), `${graphId} has an invalid surface`);
  assert.ok(graph.nodes.length >= 3, `${graphId} is not a multi-step graph`);
  assert.equal(graph.nodes.at(-1), "evaluator", `${graphId} must terminate in evaluation`);
  for (const nodeId of graph.nodes) {
    assert.ok(agents[nodeId], `${graphId} references missing agent ${nodeId}`);
  }
}

assert.notDeepEqual(graphs.foundationContentRefresh.nodes, graphs.aiLabLearnerLoop.nodes);
assert.equal(graphs.aiLabLearnerLoop.surface, "ai-lab");
assert.equal(graphs.foundationContentRefresh.surface, "foundation");

console.log(`Validated ${requiredGraphs.length} agent graphs.`);
