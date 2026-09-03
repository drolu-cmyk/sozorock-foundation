#!/usr/bin/env bash
set -euo pipefail

attempts=3
delay_seconds=5
output="$(mktemp)"
cleanup() { rm -f "$output"; }
trap cleanup EXIT

for attempt in $(seq 1 "$attempts"); do
  : > "$output"
  set +e
  npm_config_fetch_retries=1 \
    npm_config_fetch_retry_mintimeout=1000 \
    npm_config_fetch_retry_maxtimeout=5000 \
    npm_config_fetch_timeout=30000 \
    npm audit --omit=dev --audit-level=high 2>&1 | tee "$output"
  status="${PIPESTATUS[0]}"
  set -e

  if [[ "$status" = '0' ]]; then
    exit 0
  fi

  if ! grep -Eqi 'Service Unavailable|Bad Gateway|Gateway Timeout|Too Many Requests|EAI_AGAIN|ECONNRESET|ECONNREFUSED|ETIMEDOUT|audit endpoint returned an error|[[:space:]](429|50[0234])[[:space:]]' "$output"; then
    exit "$status"
  fi

  if [[ "$attempt" -lt "$attempts" ]]; then
    echo "npm audit service unavailable; retrying in ${delay_seconds}s (${attempt}/${attempts})." >&2
    sleep "$delay_seconds"
    delay_seconds=$((delay_seconds * 2))
    continue
  fi

  echo '::warning::npm audit service remained unavailable. GitHub Dependency Review and Dependabot remain the blocking vulnerability controls.' >&2
  exit 0
done
