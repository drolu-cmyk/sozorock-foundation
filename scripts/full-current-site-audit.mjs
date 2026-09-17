import { readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const sourcePath = path.resolve("scripts/current-site-audit.mjs");
const generatedPath = path.resolve("scripts/.full-current-site-audit.generated.mjs");

const desktopRoutes = [
  ["home", "/"],
  ["ai-society", "/ai-society"],
  ["contact", "/contact"],
  ["work", "/platforms"],
  ["institute", "/platforms/institute"],
  ["health", "/platforms/health"],
  ["ai-lab", "/platforms/ai-lab"],
  ["applied-learning", "/platforms/applied-learning"],
  ["research", "/publications"],
  ["insights", "/insights"],
  ["events", "/events"],
  ["about", "/about"],
  ["leadership", "/leadership"],
  ["partner", "/partner"],
  ["support", "/support"],
  ["standards", "/standards"],
  ["privacy", "/privacy"],
  ["accessibility", "/accessibility"],
  ["nondiscrimination", "/nondiscrimination"],
  ["terms", "/terms"],
  ["hsa", "/publication/hsa-v1-2026"],
  ["hsa-access", "/publication/hsa-v1-2026/access"],
  ["rrg", "/publication/rrg-v1-2025"],
  ["rrg-access", "/publication/rrg-v1-2025/access"],
  ["rebs", "/publication/rebs-v1-2025"],
  ["rebs-access", "/publication/rebs-v1-2025/access"],
];

const mobileRoutes = [
  ["home", "/"],
  ["work", "/platforms"],
  ["health", "/platforms/health"],
  ["applied-learning", "/platforms/applied-learning"],
  ["research", "/publications"],
  ["hsa", "/publication/hsa-v1-2026"],
  ["ai-society", "/ai-society"],
  ["partner", "/partner"],
  ["support", "/support"],
  ["contact", "/contact"],
  ["privacy", "/privacy"],
];

const source = readFileSync(sourcePath, "utf8");
const routeBlock = `const desktopRoutes = ${JSON.stringify(desktopRoutes, null, 2)};\nconst mobileRoutes = ${JSON.stringify(mobileRoutes, null, 2)};`;
const patched = source.replace(
  /const desktopRoutes = \[[\s\S]*?\];\nconst mobileRoutes = \[[\s\S]*?\];/u,
  routeBlock,
);

if (patched === source) throw new Error("Could not replace the audit route inventory.");

writeFileSync(generatedPath, patched);
try {
  await import(`${pathToFileURL(generatedPath).href}?run=${Date.now()}`);
} finally {
  rmSync(generatedPath, { force: true });
}
