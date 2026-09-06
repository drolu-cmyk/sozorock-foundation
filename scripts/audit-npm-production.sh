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

  if ! grep -Eqi 'Service Unavailable|Bad Gateway|Gateway Timeout|Too Many Requests|EAI_AGAIN|ECONNRESET|ECONNREFUSED|ETIMEDOUT|[[:space:]](429|50[0234])[[:space:]]' "$output"; then
    exit "$status"
  fi

  if [[ "$attempt" -lt "$attempts" ]]; then
    echo "npm audit service unavailable; retrying in ${delay_seconds}s (${attempt}/${attempts})." >&2
    sleep "$delay_seconds"
    delay_seconds=$((delay_seconds * 2))
    continue
  fi

  echo '::error::npm audit did not complete. Release blocked until a vulnerability result is available.' >&2
  exit "$status"
done
