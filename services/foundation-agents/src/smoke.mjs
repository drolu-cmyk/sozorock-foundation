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
assert.ok(agents.orchestrator, "Foundation Orchestrator is required");
assert.ok(agents.evaluator, "Graph evaluator is required");

for (const [graphId, graph] of Object.entries(graphs)) {
  assert.ok(["foundation", "ai-lab"].includes(graph.surface), `${graphId} has an invalid surface`);
  assert.ok(graph.nodes.length >= 5, `${graphId} is not a meaningful multi-step graph`);
  assert.equal(graph.nodes[0], "orchestrator", `${graphId} must begin with Foundation Orchestrator planning`);
  assert.equal(graph.nodes.at(-1), "evaluator", `${graphId} must terminate in evaluation`);
  assert.ok(graph.candidateNode, `${graphId} must identify its review candidate node`);
  assert.ok(graph.nodes.includes(graph.candidateNode), `${graphId} candidate node is not in the graph`);
  assert.notEqual(graph.candidateNode, "orchestrator", `${graphId} cannot use the plan as its final candidate`);
  assert.notEqual(graph.candidateNode, "evaluator", `${graphId} cannot use evaluation as its final candidate`);

  const revisionTargets = graph.nodes.filter((node) => !["orchestrator", "evaluator"].includes(node));
  assert.ok(revisionTargets.length >= 2, `${graphId} must expose bounded specialist revision targets`);
  assert.ok(revisionTargets.includes(graph.candidateNode), `${graphId} candidate must be a valid revision target`);

  for (const nodeId of graph.nodes) {
    assert.ok(agents[nodeId], `${graphId} references missing agent ${nodeId}`);
  }
}

assert.notDeepEqual(graphs.foundationContentRefresh.nodes, graphs.aiLabLearnerLoop.nodes);
assert.equal(graphs.aiLabLearnerLoop.surface, "ai-lab");
assert.equal(graphs.foundationContentRefresh.surface, "foundation");
assert.equal(graphs.publicationRelease.candidateNode, "distributionEditor");
assert.equal(graphs.foundationSiteAssurance.candidateNode, "securityReviewer");
assert.equal(graphs.aiLabLearnerLoop.candidateNode, "projectReviewer");

console.log(`Validated ${requiredGraphs.length} adaptive agent graphs.`);
