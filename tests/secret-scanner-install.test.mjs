import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("scanner installer enforces the reviewed digest before execution", () => {
  const result = spawnSync("python3", [fileURLToPath(new URL("./secret_scanner_install.py", import.meta.url))], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
