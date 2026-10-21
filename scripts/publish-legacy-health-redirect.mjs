import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

export const legacyHosts = ["sozorockhealth.com", "www.sozorockhealth.com"];
export const redirects = [
  ["/", "https://health.sozorockfoundation.org/"],
  ["/about", "https://health.sozorockfoundation.org/work"],
  ["/cb-cap", "https://cbcap.sozorockfoundation.org/"],
];

export function validateDistribution(response, functionArn) {
  const distribution = response.Distribution;
  assert.equal(distribution?.Status, "Deployed", "The legacy distribution must be deployed.");
  const config = distribution.DistributionConfig;
  assert.equal(config.Enabled, true, "The legacy distribution must be enabled.");
  assert.deepEqual([...(config.Aliases?.Items ?? [])].sort(), [...legacyHosts].sort(), "The configured distribution must serve only the two legacy hosts.");
  const behaviors = [config.DefaultCacheBehavior, ...(config.CacheBehaviors?.Items ?? [])];
  for (const behavior of behaviors) {
    const associations = (behavior.FunctionAssociations?.Items ?? []).filter((item) => item.EventType === "viewer-request");
    assert.equal(associations.length, 1, "Each behavior must already have the legacy viewer-request function.");
    assert.equal(associations[0].FunctionARN, functionArn, "A behavior uses a different viewer-request function.");
  }
  return response.ETag;
}

export function sampleEvents() {
  const samples = [];
  for (const host of legacyHosts) {
    for (const [uri, location] of redirects) {
      for (const method of ["GET", "HEAD"]) samples.push({ host, uri, method, status: 301, location });
    }
    samples.push({ host, uri: "/api/contact", method: "GET", status: 410 });
    samples.push({ host, uri: "/", method: "POST", status: 410 });
  }
  samples.push({ host: "example.invalid", uri: "/", method: "GET", status: 403 });
  return samples.map((sample) => ({
    ...sample,
    event: {
      version: "1.0", context: { eventType: "viewer-request" },
      viewer: { ip: "192.0.2.1" },
      request: { method: sample.method, uri: sample.uri, headers: { host: { value: sample.host } }, cookies: {}, querystring: {} },
    },
  }));
}

export function inspectHeaders(raw, location) {
  const blocks = raw.trim().split(/\r?\n\r?\n/).filter((block) => /^HTTP\//.test(block));
  const lines = (blocks.at(-1) ?? "").split(/\r?\n/);
  const status = Number(lines[0]?.match(/^HTTP\/\S+\s+(\d+)/)?.[1]);
  const headers = new Map(lines.slice(1).filter((line) => line.includes(":")).map((line) => {
    const separator = line.indexOf(":");
    return [line.slice(0, separator).toLowerCase(), line.slice(separator + 1).trim()];
  }));
  return { status, location: headers.get("location"), matches: status === 301 && headers.get("location") === location };
}

function aws(...args) {
  try {
    return JSON.parse(execFileSync("aws", ["cloudfront", ...args, "--output", "json", "--no-cli-pager"], { encoding: "utf8", timeout: 60_000, maxBuffer: 8 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }));
  } catch {
    throw new Error("CloudFront " + args[0] + " failed. Check the configured resources and bounded role permissions.");
  }
}

function configuration() {
  const functionName = process.env.LEGACY_HEALTH_FUNCTION_NAME;
  const distributionId = process.env.LEGACY_HEALTH_DISTRIBUTION_ID;
  assert.ok(functionName && distributionId && process.env.RUNNER_TEMP, "Set the required repository variables and runner temporary directory.");
  assert.match(functionName, /^[A-Za-z0-9_-]{1,64}$/);
  assert.match(distributionId, /^[A-Za-z0-9]+$/);
  const directory = path.join(process.env.RUNNER_TEMP, "legacy-health-redirect");
  const backup = path.join(directory, "backup");
  const results = path.join(directory, "results");
  mkdirSync(backup, { recursive: true });
  mkdirSync(results, { recursive: true });
  return { functionName, distributionId, backup, results };
}

function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { mode: 0o600 });
}
function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function backupCurrent(settings) {
  const { functionName, distributionId, backup } = settings;
  const descriptions = {};
  for (const stage of ["DEVELOPMENT", "LIVE"]) {
    const description = aws("describe-function", "--name", functionName, "--stage", stage);
    const code = aws("get-function", "--name", functionName, "--stage", stage, path.join(backup, stage + ".js"));
    assert.equal(code.ETag, description.ETag, "The function changed while backing it up. Start again.");
    writeJson(path.join(backup, stage + ".json"), description);
    descriptions[stage] = description;
  }
  const distribution = aws("get-distribution", "--id", distributionId);
  validateDistribution(distribution, descriptions.LIVE.FunctionSummary.FunctionMetadata.FunctionARN);
  writeJson(path.join(backup, "distribution.json"), distribution);
  writeJson(path.join(backup, "manifest.json"), { functionName, distributionId, capturedAt: new Date().toISOString() });
  console.log("Both function stages and distribution configuration are backed up. No changes made.");
}

function publish(settings) {
  const { functionName, distributionId, backup, results } = settings;
  const manifest = readJson(path.join(backup, "manifest.json"));
  assert.equal(manifest.functionName, functionName);
  assert.equal(manifest.distributionId, distributionId);
  const priorDevelopment = readJson(path.join(backup, "DEVELOPMENT.json"));
  const priorLive = readJson(path.join(backup, "LIVE.json"));
  const development = aws("describe-function", "--name", functionName, "--stage", "DEVELOPMENT");
  const live = aws("describe-function", "--name", functionName, "--stage", "LIVE");
  assert.equal(development.ETag, priorDevelopment.ETag, "Development changed after backup. Start again.");
  assert.equal(live.ETag, priorLive.ETag, "Live changed after backup. Start again.");
  const distribution = aws("get-distribution", "--id", distributionId);
  validateDistribution(distribution, live.FunctionSummary.FunctionMetadata.FunctionARN);
  assert.equal(distribution.ETag, readJson(path.join(backup, "distribution.json")).ETag, "Distribution configuration changed after backup. Start again.");
  const configFile = path.join(results, "function-config.json");
  writeJson(configFile, live.FunctionSummary.FunctionConfig);
  const updated = aws("update-function", "--name", functionName, "--if-match", development.ETag, "--function-config", "file://" + configFile, "--function-code", "fileb://infra/cloudfront/legacy-health-redirect.js");
  writeJson(path.join(results, "updated.json"), updated);
  for (const [index, sample] of sampleEvents().entries()) {
    const eventFile = path.join(results, "event-" + index + ".json");
    writeJson(eventFile, sample.event);
    const tested = aws("test-function", "--name", functionName, "--if-match", updated.ETag, "--stage", "DEVELOPMENT", "--event-object", "fileb://" + eventFile);
    writeJson(path.join(results, "test-" + index + ".json"), tested);
    assert.ok(!tested.TestResult?.FunctionErrorMessage, "The development function returned an error.");
    const output = JSON.parse(tested.TestResult.FunctionOutput);
    assert.equal(Number(output.statusCode), sample.status);
    if (sample.location) assert.equal(output.headers.location.value, sample.location);
  }
  const fresh = aws("describe-function", "--name", functionName, "--stage", "DEVELOPMENT");
  assert.equal(fresh.ETag, updated.ETag, "Development changed after testing. Refusing to publish untested code.");
  const finalDistribution = aws("get-distribution", "--id", distributionId);
  validateDistribution(finalDistribution, live.FunctionSummary.FunctionMetadata.FunctionARN);
  assert.equal(finalDistribution.ETag, distribution.ETag, "Distribution changed during testing.");
  const published = aws("publish-function", "--name", functionName, "--if-match", fresh.ETag);
  writeJson(path.join(results, "published.json"), published);
  console.log("Tested code published to the existing function. Distribution associations were not modified.");
}

async function verify(settings) {
  const deadline = Date.now() + 600_000;
  let last = [];
  while (Date.now() < deadline) {
    last = [];
    for (const host of legacyHosts) {
      for (const [uri, expected] of redirects) {
        const url = "https://" + host + uri;
        try {
          const seconds = () => {
            const remaining = Math.floor((deadline - Date.now()) / 1000);
            assert.ok(remaining > 0, "Propagation deadline reached.");
            return String(Math.min(15, remaining));
          };
          const raw = execFileSync("curl", ["--silent", "--show-error", "--head", "--proto", "=https", "--max-time", seconds(), url], { encoding: "utf8", timeout: 17_000 });
          const result = inspectHeaders(raw, expected);
          const final = execFileSync("curl", ["--silent", "--show-error", "--location", "--max-redirs", "3", "--proto", "=https", "--proto-redir", "=https", "--max-time", seconds(), "--output", "/dev/null", "--write-out", "%{http_code} %{url_effective}", url], { encoding: "utf8", timeout: 17_000 }).trim();
          last.push({ url, ...result, final, ok: result.matches && final === "200 " + expected });
        } catch {
          last.push({ url, ok: false, error: "Request failed or propagation deadline reached." });
        }
      }
    }
    writeJson(path.join(settings.results, "verification.json"), { checkedAt: new Date().toISOString(), results: last });
    if (last.length === 6 && last.every((item) => item.ok)) {
      console.log("All six legacy URLs return 301 to the expected destinations; final pages return 200.");
      return;
    }
    const remaining = deadline - Date.now();
    if (remaining > 0) await delay(Math.min(20_000, remaining));
  }
  throw new Error("Redirect verification did not pass within ten minutes. Review the artifact; no automatic rollback was attempted.");
}

export async function main(mode) {
  assert.ok(["backup", "publish", "verify"].includes(mode), "Use backup, publish or verify.");
  const settings = configuration();
  if (mode === "backup") backupCurrent(settings);
  if (mode === "publish") publish(settings);
  if (mode === "verify") await verify(settings);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv[2]).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
