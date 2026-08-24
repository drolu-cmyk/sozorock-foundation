import { run } from "@openai/agents";
import { agents } from "./agents.mjs";

export const graphs = Object.freeze({
  foundationContentRefresh: {
    surface: "foundation",
    description: "Turn new Foundation source material into a verified, reviewable content candidate.",
    nodes: ["sourceAnalyst", "instituteAnalyst", "verifier", "copyEditor", "distributionEditor", "evaluator"],
  },
  publicationRelease: {
    surface: "foundation",
    description: "Review a publication record and prepare verified release material without changing permanent routes.",
    nodes: ["sourceAnalyst", "publicationEditor", "verifier", "copyEditor", "distributionEditor", "evaluator"],
  },
  foundationSiteAssurance: {
    surface: "foundation",
    description: "Review a website change across product, UX, accessibility, security, and release quality.",
    nodes: ["productReviewer", "uxReviewer", "accessibilityReviewer", "securityReviewer", "evaluator"],
  },
  aiLabLearnerLoop: {
    surface: "ai-lab",
    description: "Plan, coach, review, and evaluate one learner cycle from evidence supplied by the AI Lab.",
    nodes: ["learnerPlanner", "learnerCoach", "projectReviewer", "evaluator"],
  },
  aiLabProgramImprovement: {
    surface: "ai-lab",
    description: "Use program evidence to identify learning friction and propose a bounded curriculum improvement.",
    nodes: ["learningAnalyst", "learnerPlanner", "projectReviewer", "evaluator"],
  },
});

function safeValue(value, max = 16_000) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return text.slice(0, max);
}

function nodeInput({ graphId, nodeId, originalInput, outputs, context }) {
  return [
    `Graph: ${graphId}`,
    `Current node: ${nodeId}`,
    `Original task and evidence:\n${safeValue(originalInput)}`,
    `Operational context:\n${safeValue(context, 4_000)}`,
    outputs.length
      ? `Prior node outputs:\n${safeValue(outputs.map(({ node, output }) => ({ node, output })), 24_000)}`
      : "Prior node outputs: none.",
    "Return only the work product for your specialist responsibility. Do not claim that anything has been published, deployed, sent, approved, or verified unless the supplied evidence explicitly proves it.",
  ].join("\n\n");
}

export async function executeGraph({ graphId, input, context = {}, maxTurns = 5 }) {
  const graph = graphs[graphId];
  if (!graph) throw new Error(`Unknown graph: ${graphId}`);
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required by the Foundation agent runtime.");

  const outputs = [];
  for (const nodeId of graph.nodes) {
    const agent = agents[nodeId];
    if (!agent) throw new Error(`Graph ${graphId} references unknown agent ${nodeId}.`);
    const result = await run(agent, nodeInput({ graphId, nodeId, originalInput: input, outputs, context }), { maxTurns });
    outputs.push({
      node: nodeId,
      output: result.finalOutput || "",
      responseId: result.lastResponseId || null,
    });
  }

  return {
    graphId,
    surface: graph.surface,
    status: "review_required",
    outputs,
    final: outputs.at(-1)?.output || "",
  };
}
