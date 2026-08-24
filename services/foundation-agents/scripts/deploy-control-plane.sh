#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:?AWS_REGION is required}"
: "${ACCOUNT_ID:?ACCOUNT_ID is required}"
: "${FUNCTION_NAME:?FUNCTION_NAME is required}"
: "${API_NAME:?API_NAME is required}"
: "${LAMBDA_ZIP:?LAMBDA_ZIP is required}"

work="${RUNNER_TEMP:-/tmp}/foundation-agent-deploy"
mkdir -p "$work"
function_changed=0
routes_changed=0
deployment_verified=0
integration_created=0
integration_id=""
api_id=""

snapshot_route() {
  local route_key="$1"
  local slug="$2"
  local routes_json="$3"
  local route_id
  route_id="$(jq -r --arg key "$route_key" '.Items[]? | select(.RouteKey == $key) | .RouteId' <<<"$routes_json" | head -n1)"
  if [[ -n "$route_id" ]]; then
    aws apigatewayv2 get-route --api-id "$api_id" --route-id "$route_id" --output json > "$work/route-${slug}.json"
  else
    printf '{"absent":true,"RouteKey":%s}\n' "$(jq -Rn --arg value "$route_key" '$value')" > "$work/route-${slug}.json"
  fi
}

restore_route() {
  local slug="$1"
  local snapshot="$work/route-${slug}.json"
  [[ -s "$snapshot" ]] || return 0
  local route_key route_id current_routes auth target
  route_key="$(jq -r '.RouteKey' "$snapshot")"
  current_routes="$(aws apigatewayv2 get-routes --api-id "$api_id" --output json 2>/dev/null || echo '{"Items":[]}')"
  route_id="$(jq -r --arg key "$route_key" '.Items[]? | select(.RouteKey == $key) | .RouteId' <<<"$current_routes" | head -n1)"
  if [[ "$(jq -r '.absent // false' "$snapshot")" = 'true' ]]; then
    if [[ -n "$route_id" ]]; then
      aws apigatewayv2 delete-route --api-id "$api_id" --route-id "$route_id" >/dev/null 2>&1 || true
    fi
    return 0
  fi
  [[ -n "$route_id" ]] || return 0
  auth="$(jq -r '.AuthorizationType // "NONE"' "$snapshot")"
  target="$(jq -r '.Target // empty' "$snapshot")"
  if [[ -n "$target" ]]; then
    aws apigatewayv2 update-route --api-id "$api_id" --route-id "$route_id" --authorization-type "$auth" --target "$target" >/dev/null 2>&1 || true
  else
    aws apigatewayv2 update-route --api-id "$api_id" --route-id "$route_id" --authorization-type "$auth" >/dev/null 2>&1 || true
  fi
}

rollback() {
  if [[ "$deployment_verified" = '1' ]]; then
    return 0
  fi
  echo 'Agent control-plane verification failed; restoring previous runtime state.' >&2

  if [[ -n "$api_id" && "$routes_changed" = '1' ]]; then
    restore_route health
    restore_route graphs
    restore_route run
    aws lambda remove-permission --function-name "$FUNCTION_NAME" --statement-id FoundationAgentsInternalApiInvoke >/dev/null 2>&1 || true
    if [[ "$integration_created" = '1' && -n "$integration_id" ]]; then
      aws apigatewayv2 delete-integration --api-id "$api_id" --integration-id "$integration_id" >/dev/null 2>&1 || true
    fi
  fi

  if [[ "$function_changed" = '1' && -s "$work/original-code.zip" && -s "$work/original-config.json" ]]; then
    aws lambda update-function-code --function-name "$FUNCTION_NAME" --zip-file "fileb://$work/original-code.zip" >/dev/null 2>&1 || return 0
    aws lambda wait function-updated --function-name "$FUNCTION_NAME" >/dev/null 2>&1 || true
    jq '{Variables:(.Environment.Variables // {})}' "$work/original-config.json" > "$work/original-env.json"
    local runtime handler memory timeout
    runtime="$(jq -r '.Runtime' "$work/original-config.json")"
    handler="$(jq -r '.Handler' "$work/original-config.json")"
    memory="$(jq -r '.MemorySize' "$work/original-config.json")"
    timeout="$(jq -r '.Timeout' "$work/original-config.json")"
    aws lambda update-function-configuration \
      --function-name "$FUNCTION_NAME" \
      --runtime "$runtime" \
      --handler "$handler" \
      --memory-size "$memory" \
      --timeout "$timeout" \
      --environment "file://$work/original-env.json" >/dev/null 2>&1 || true
    aws lambda wait function-updated --function-name "$FUNCTION_NAME" >/dev/null 2>&1 || true
  fi
}
trap rollback EXIT

test "$(aws sts get-caller-identity --query Account --output text)" = "$ACCOUNT_ID"
aws lambda get-function --function-name "$FUNCTION_NAME" --output json > "$work/function.json"
aws lambda get-function-configuration --function-name "$FUNCTION_NAME" --output json > "$work/original-config.json"
function_arn="$(jq -r '.Configuration.FunctionArn' "$work/function.json")"
execution_role="$(jq -r '.Configuration.Role' "$work/function.json")"
test "$function_arn" = "arn:aws:lambda:${AWS_REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}"
test "$execution_role" = "arn:aws:iam::${ACCOUNT_ID}:role/SozoRockFoundationParentLambdaRole"
code_location="$(jq -r '.Code.Location' "$work/function.json")"
test -n "$code_location"
curl --fail --silent --show-error --location "$code_location" --output "$work/original-code.zip"
test -s "$work/original-code.zip"

api_id="$(aws apigatewayv2 get-apis --output json | jq -r --arg name "$API_NAME" '.Items[]? | select(.Name == $name) | .ApiId' | head -n1)"
test -n "$api_id"
api_endpoint="$(aws apigatewayv2 get-api --api-id "$api_id" --query ApiEndpoint --output text)"
test -n "$api_endpoint"

routes_before="$(aws apigatewayv2 get-routes --api-id "$api_id" --output json)"
snapshot_route 'GET /internal/health' health "$routes_before"
snapshot_route 'GET /internal/v1/graphs' graphs "$routes_before"
snapshot_route 'POST /internal/v1/run' run "$routes_before"

# Lambda supplies AWS_REGION as a reserved runtime variable. Do not set it here.
jq -n \
  --arg model 'gpt-5.6-sol' \
  --arg key "${OPENAI_API_KEY:-}" \
  --arg provider "${OPENAI_IDENTITY_PROVIDER_ID:-}" \
  --arg service "${OPENAI_SERVICE_ACCOUNT_ID:-}" \
  --arg audience "${OPENAI_WIF_AUDIENCE:-}" \
  '{Variables:{OPENAI_AGENT_MODEL:$model,OPENAI_API_KEY:$key,OPENAI_IDENTITY_PROVIDER_ID:$provider,OPENAI_SERVICE_ACCOUNT_ID:$service,OPENAI_WIF_AUDIENCE:$audience}} | .Variables |= with_entries(select(.value != ""))' \
  > "$work/lambda-env.json"

aws lambda update-function-code --function-name "$FUNCTION_NAME" --zip-file "fileb://$LAMBDA_ZIP" >/dev/null
function_changed=1
aws lambda wait function-updated --function-name "$FUNCTION_NAME"
aws lambda update-function-configuration \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs22.x \
  --handler src/handler.handler \
  --memory-size 1024 \
  --timeout 120 \
  --environment "file://$work/lambda-env.json" >/dev/null
aws lambda wait function-updated --function-name "$FUNCTION_NAME"

integrations="$(aws apigatewayv2 get-integrations --api-id "$api_id" --output json)"
integration_id="$(jq -r --arg arn "$function_arn" '.Items[]? | select(.IntegrationType == "AWS_PROXY" and .IntegrationUri == $arn) | .IntegrationId' <<<"$integrations" | head -n1)"
if [[ -z "$integration_id" ]]; then
  integration_id="$(aws apigatewayv2 create-integration \
    --api-id "$api_id" \
    --integration-type AWS_PROXY \
    --integration-uri "$function_arn" \
    --payload-format-version '2.0' \
    --query IntegrationId \
    --output text)"
  integration_created=1
fi
test -n "$integration_id"

upsert_route() {
  local route_key="$1"
  local current route_id
  current="$(aws apigatewayv2 get-routes --api-id "$api_id" --output json)"
  route_id="$(jq -r --arg key "$route_key" '.Items[]? | select(.RouteKey == $key) | .RouteId' <<<"$current" | head -n1)"
  if [[ -n "$route_id" ]]; then
    aws apigatewayv2 update-route --api-id "$api_id" --route-id "$route_id" --authorization-type AWS_IAM --target "integrations/${integration_id}" >/dev/null
  else
    aws apigatewayv2 create-route --api-id "$api_id" --route-key "$route_key" --authorization-type AWS_IAM --target "integrations/${integration_id}" >/dev/null
  fi
}
upsert_route 'GET /internal/health'
upsert_route 'GET /internal/v1/graphs'
upsert_route 'POST /internal/v1/run'
routes_changed=1

aws lambda remove-permission --function-name "$FUNCTION_NAME" --statement-id FoundationAgentsInternalApiInvoke >/dev/null 2>&1 || true
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FoundationAgentsInternalApiInvoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${api_id}/*/*/internal/*" >/dev/null

routes_after="$(aws apigatewayv2 get-routes --api-id "$api_id" --output json)"
for key in 'GET /internal/health' 'GET /internal/v1/graphs' 'POST /internal/v1/run'; do
  auth="$(jq -r --arg key "$key" '.Items[]? | select(.RouteKey == $key) | .AuthorizationType' <<<"$routes_after")"
  target="$(jq -r --arg key "$key" '.Items[]? | select(.RouteKey == $key) | .Target' <<<"$routes_after")"
  test "$auth" = 'AWS_IAM'
  test "$target" = "integrations/${integration_id}"
done

cat > "$work/public-event.json" <<'JSON'
{"version":"2.0","rawPath":"/publication/rrg-v1-2025","rawQueryString":"source=agent-edge","requestContext":{"http":{"method":"GET","path":"/publication/rrg-v1-2025"}}}
JSON
aws lambda invoke --function-name "$FUNCTION_NAME" --cli-binary-format raw-in-base64-out --payload "file://$work/public-event.json" "$work/public-response.json" >/dev/null
test "$(jq -r '.statusCode' "$work/public-response.json")" = '308'
test "$(jq -r '.headers.location' "$work/public-response.json")" = 'https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=agent-edge'

public_status="$(curl --silent --show-error --output /dev/null --max-time 20 --write-out '%{http_code}' "${api_endpoint}/publication/rrg-v1-2025?source=api-agent-edge")"
public_location="$(curl --silent --show-error --head --max-time 20 "${api_endpoint}/publication/rrg-v1-2025?source=api-agent-edge" | awk 'BEGIN{IGNORECASE=1} /^location:/ {sub(/\r$/, ""); sub(/^location:[[:space:]]*/, ""); print; exit}')"
test "$public_status" = '308'
test "$public_location" = 'https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=api-agent-edge'

cat > "$work/health-event.json" <<'JSON'
{"version":"2.0","rawPath":"/internal/health","requestContext":{"http":{"method":"GET","path":"/internal/health"}}}
JSON
aws lambda invoke --function-name "$FUNCTION_NAME" --cli-binary-format raw-in-base64-out --payload "file://$work/health-event.json" "$work/health-response.json" >/dev/null
test "$(jq -r '.statusCode' "$work/health-response.json")" = '200'
health_body="$(jq -r '.body' "$work/health-response.json")"
test "$(jq -r '.ok' <<<"$health_body")" = 'true'
auth_mode="$(jq -r '.modelAuthMode // "none"' <<<"$health_body")"
model_configured="$(jq -r '.modelConfigured' <<<"$health_body")"

unauth_status="$(curl --silent --show-error --output /dev/null --max-time 20 --write-out '%{http_code}' "${api_endpoint}/internal/health" || true)"
test "$unauth_status" = '403'

deployment_verified=1

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "api_id=$api_id" >> "$GITHUB_OUTPUT"
  echo "auth_mode=$auth_mode" >> "$GITHUB_OUTPUT"
  echo "model_configured=$model_configured" >> "$GITHUB_OUTPUT"
fi

if [[ "$model_configured" = 'true' ]]; then
  cat > "$work/run-event.json" <<'JSON'
{"version":"2.0","rawPath":"/internal/v1/run","requestContext":{"http":{"method":"POST","path":"/internal/v1/run"}},"body":"{\"graphId\":\"foundationSiteAssurance\",\"input\":{\"task\":\"Review a bounded synthetic deployment change.\",\"evidence\":{\"repository\":\"sozorock-foundation\",\"liveVerification\":\"not supplied\",\"constraint\":\"Do not claim production completion without live evidence.\"}},\"context\":{\"source\":\"deployment-smoke\"}}"}
JSON
  aws lambda invoke --function-name "$FUNCTION_NAME" --cli-binary-format raw-in-base64-out --payload "file://$work/run-event.json" "$work/run-response.json" >/dev/null
  test "$(jq -r '.statusCode' "$work/run-response.json")" = '200'
  run_body="$(jq -r '.body' "$work/run-response.json")"
  terminal_status="$(jq -r '.status' <<<"$run_body")"
  decision="$(jq -r '.decision' <<<"$run_body")"
  run_id="$(jq -r '.runId' <<<"$run_body")"
  [[ "$terminal_status" = 'review_required' || "$terminal_status" = 'escalated' ]]
  [[ "$decision" = 'pass' || "$decision" = 'revise' || "$decision" = 'escalate' ]]
  test -n "$run_id"
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "graph_status=$terminal_status" >> "$GITHUB_OUTPUT"
    echo "graph_decision=$decision" >> "$GITHUB_OUTPUT"
  fi
fi
