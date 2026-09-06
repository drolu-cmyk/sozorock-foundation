import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function sandbox(run) {
  const dir = mkdtempSync(join(tmpdir(), 'release-security-'));
  const executable = (name, body) => writeFileSync(join(dir, name), `#!/usr/bin/env bash\n${body}\n`, { mode: 0o755 });
  executable('sleep', 'exit 0');
  try { run(dir, executable); } finally { rmSync(dir, { recursive: true, force: true }); }
}

for (const [label, message, code, calls] of [
  ['successful audit', 'found 0 vulnerabilities', 0, 1],
  ['permanent authentication error', '401 audit endpoint returned an error', 1, 1],
  ['vulnerability finding', 'high severity vulnerability', 1, 1],
  ['persistent transient error', '503 Service Unavailable', 1, 3],
]) {
  test(`production audit handles ${label}`, () => sandbox((dir, executable) => {
    executable('npm', `echo call >> "$CALLS"\nprintf '%s\\n' "$MESSAGE"\nexit "$CODE"`);
    const result = spawnSync('bash', [resolve('scripts/audit-npm-production.sh')], {
      env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, CALLS: join(dir, 'calls'), MESSAGE: message, CODE: String(code) },
      encoding: 'utf8',
    });
    assert.equal(result.status, code, result.stderr);
    assert.equal(readFileSync(join(dir, 'calls'), 'utf8').trim().split('\n').length, calls);
  }));
}

for (const [mode, expected] of [['removed', 0], ['absent', 0], ['throttled', 1], ['denied', 1]]) {
  test(`canary cleanup handles ${mode}`, () => sandbox((dir, executable) => {
    executable('aws', `
[[ "$*" == 'lambda remove-permission --function-name test-function --statement-id FoundationAgentsDeployCanaryInvoke' ]] || exit 99
if [[ "$MODE" == removed && ! -f "$CALLS" ]]; then touch "$CALLS"; exit 0; fi
case "$MODE" in
  removed|absent) echo 'An error occurred (ResourceNotFoundException)' >&2;;
  throttled) echo 'An error occurred (TooManyRequestsException)' >&2;;
  denied) echo 'An error occurred (AccessDeniedException)' >&2;;
esac
exit 254`);
    const helper = resolve('services/foundation-agents/scripts/remove-canary-permission.sh');
    const result = spawnSync('bash', ['-c', 'source "$HELPER"; remove_canary_permission'], {
      env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, HELPER: helper, FUNCTION_NAME: 'test-function', MODE: mode, CALLS: join(dir, 'calls') },
      encoding: 'utf8',
    });
    assert.equal(result.status, expected, result.stderr);
  }));
}
