#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const permanentRoutes = [
  "/platforms",
  "/platforms/institute",
  "/platforms/health",
  "/platforms/ai-lab",
  "/publications",
  "/insights",
  "/events",
  "/about",
  "/leadership",
  "/partner",
  "/support",
  "/standards",
  "/publication/hsa-v1-2026",
  "/publication/hsa-v1-2026/access",
  "/publication/rrg-v1-2025",
  "/publication/rebs-v1-2025",
];

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

// Sites' edge dispatcher resolves a clean GET path against static HTML before
// the worker fallback. Emitting route.html entry files keeps copied links and
// browser refreshes on their permanent path instead of redirecting to `/`.
for (const route of permanentRoutes) {
  const routeFile = path.join(dist, "client", `${route.slice(1)}.html`);
  mkdirSync(path.dirname(routeFile), { recursive: true });
  copyFileSync(index, routeFile);
}

console.log(`Prepared Sites build with ${permanentRoutes.length} permanent HTML entries.`);
