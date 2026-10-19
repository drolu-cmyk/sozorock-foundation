#!/usr/bin/env bash
set -euo pipefail
umask 077

: "${AWS_REGION:?AWS_REGION is required}"
: "${ACCOUNT_ID:?ACCOUNT_ID is required}"
: "${FUNCTION_NAME:?FUNCTION_NAME is required}"
: "${API_NAME:?API_NAME is required}"
: "${LAMBDA_ZIP:?LAMBDA_ZIP is required}"
test "${FOUNDATION_MODEL_EXECUTION_ENABLED:-false}" != 'true'
test "$(aws sts get-caller-identity --query Account --output text)" = "$ACCOUNT_ID"

work="$(mktemp -d "${RUNNER_TEMP:-/tmp}/foundation-guidance.XXXXXX")"
code_changed=0
config_changed=0
verified=0
rollback() {
  local result=$?
  trap - EXIT
  if [[ "$verified" != '1' ]]; then
    if [[ "$code_changed" == '1' ]]; then
      aws lambda update-function-code --function-name "$FUNCTION_NAME" --zip-file "fileb://$work/original-code.zip" >/dev/null || result=1
      aws lambda wait function-updated --function-name "$FUNCTION_NAME" || result=1
    fi
    if [[ "$config_changed" == '1' ]]; then
      aws lambda update-function-configuration --function-name "$FUNCTION_NAME" --environment "file://$work/original-env.json" >/dev/null || result=1
      aws lambda wait function-updated --function-name "$FUNCTION_NAME" || result=1
    fi
    echo 'Guidance verification failed; previous runtime restoration attempted.' >&2
    result=1
  fi
  rm -rf "$work"
  exit "$result"
}
trap rollback EXIT

aws lambda get-function --function-name "$FUNCTION_NAME" > "$work/original.json"
jq -e '.Configuration.Handler == "src/handler.handler" and .Configuration.State == "Active"' "$work/original.json" >/dev/null
jq '{Variables:(.Configuration.Environment.Variables // {})}' "$work/original.json" > "$work/original-env.json"
jq '.Variables.FOUNDATION_MODEL_EXECUTION_ENABLED = "false"' "$work/original-env.json" > "$work/paused-env.json"
curl --proto '=https' --tlsv1.2 --fail --silent --show-error --location "$(jq -r '.Code.Location' "$work/original.json")" --output "$work/original-code.zip"
test -s "$work/original-code.zip"
api_id="$(aws apigatewayv2 get-apis --output json | jq -er --arg name "$API_NAME" '[.Items[] | select(.Name == $name)] | if length == 1 then .[0].ApiId else error("Expected one existing API") end')"
api_endpoint="$(aws apigatewayv2 get-api --api-id "$api_id" --query ApiEndpoint --output text)"
aws apigatewayv2 get-routes --api-id "$api_id" > "$work/routes-before.json"
for route in 'GET /internal/health' 'GET /internal/v1/graphs' 'POST /internal/v1/run'; do
  jq -e --arg route "$route" '.Items[] | select(.RouteKey == $route) | .AuthorizationType == "AWS_IAM"' "$work/routes-before.json" >/dev/null
done

aws lambda update-function-configuration --function-name "$FUNCTION_NAME" \
  --revision-id "$(jq -r '.Configuration.RevisionId' "$work/original.json")" \
  --environment "file://$work/paused-env.json" >/dev/null
config_changed=1
aws lambda wait function-updated --function-name "$FUNCTION_NAME"
revision="$(aws lambda get-function-configuration --function-name "$FUNCTION_NAME" --query RevisionId --output text)"
aws lambda update-function-code --function-name "$FUNCTION_NAME" --revision-id "$revision" --zip-file "fileb://$LAMBDA_ZIP" >/dev/null
code_changed=1
aws lambda wait function-updated --function-name "$FUNCTION_NAME"

status="$(curl --silent --show-error --max-time 30 --output /dev/null --dump-header "$work/redirect.txt" --write-out '%{http_code}' "${api_endpoint}/publication/rrg-v1-2025?source=guidance-release")"
test "$status" = '308'
tr -d '\r' < "$work/redirect.txt" | grep -qi '^location: https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=guidance-release$'
status="$(curl --silent --show-error --max-time 30 --output /dev/null --write-out '%{http_code}' "${api_endpoint}/internal/health")"
test "$status" = '403'
status="$(curl --silent --show-error --max-time 30 --output "$work/answer.json" --write-out '%{http_code}' \
  -H 'content-type: application/json' -H 'origin: https://www.sozorockfoundation.org' \
  --data '{"question":"Tell me about primary care access"}' "${api_endpoint}/public/v1/navigate")"
test "$status" = '200'
jq -e '.knowledgeVersion == "2026-10-19-primary-care-access" and (.answer | contains("Purcell Integrative Osteopathic Care")) and (.answer | contains("January 2027"))' "$work/answer.json" >/dev/null

status="$(curl --silent --show-error --max-time 30 --output "$work/health.json" --write-out '%{http_code}' \
  --aws-sigv4 "aws:amz:${AWS_REGION}:execute-api" --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
  -H "x-amz-security-token: ${AWS_SESSION_TOKEN}" "${api_endpoint}/internal/health")"
test "$status" = '200'
jq -e '.ok == true and .modelConfigured == false and .modelExecutionEnabled == false' "$work/health.json" >/dev/null
status="$(curl --silent --show-error --max-time 30 --output "$work/paused.json" --write-out '%{http_code}' \
  --aws-sigv4 "aws:amz:${AWS_REGION}:execute-api" --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
  -H "x-amz-security-token: ${AWS_SESSION_TOKEN}" -H 'content-type: application/json' \
  --data '{"graphId":"foundationSiteAssurance","input":{"task":"Verify paused execution"}}' "${api_endpoint}/internal/v1/run")"
test "$status" = '503'
jq -e '.error == "model_execution_paused"' "$work/paused.json" >/dev/null
aws apigatewayv2 get-routes --api-id "$api_id" > "$work/routes-after.json"
diff <(jq -S '.Items | sort_by(.RouteId)' "$work/routes-before.json") <(jq -S '.Items | sort_by(.RouteId)' "$work/routes-after.json")
verified=1
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  printf 'public_guidance_verified=true\nmodel_execution_paused=true\n' >> "$GITHUB_OUTPUT"
fi
echo 'Public guidance, redirect and private-route protection verified. Model execution remains paused.'
