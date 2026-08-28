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
    restore_route public-navigate
    restore_route public-options
    aws lambda remove-permission --function-name "$FUNCTION_NAME" --statement-id FoundationAgentsInternalApiInvoke >/dev/null 2>&1 || true
    aws lambda remove-permission --function-name "$FUNCTION_NAME" --statement-id FoundationAgentsPublicApiInvoke >/dev/null 2>&1 || true
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
snapshot_route 'POST /public/v1/navigate' public-navigate "$routes_before"
snapshot_route 'OPTIONS /public/v1/navigate' public-options "$routes_before"

# AWS_REGION is injected by Lambda as a reserved runtime variable.
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
  local authorization_type="${2:-AWS_IAM}"
  local current route_id
  current="$(aws apigatewayv2 get-routes --api-id "$api_id" --output json)"
  route_id="$(jq -r --arg key "$route_key" '.Items[]? | select(.RouteKey == $key) | .RouteId' <<<"$current" | head -n1)"
  if [[ -n "$route_id" ]]; then
    aws apigatewayv2 update-route --api-id "$api_id" --route-id "$route_id" --authorization-type "$authorization_type" --target "integrations/${integration_id}" >/dev/null
  else
    aws apigatewayv2 create-route --api-id "$api_id" --route-key "$route_key" --authorization-type "$authorization_type" --target "integrations/${integration_id}" >/dev/null
  fi
}
upsert_route 'GET /internal/health'
upsert_route 'GET /internal/v1/graphs'
upsert_route 'POST /internal/v1/run'
upsert_route 'POST /public/v1/navigate' NONE
upsert_route 'OPTIONS /public/v1/navigate' NONE
routes_changed=1

aws lambda remove-permission --function-name "$FUNCTION_NAME" --statement-id FoundationAgentsInternalApiInvoke >/dev/null 2>&1 || true
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FoundationAgentsInternalApiInvoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${api_id}/*/*/internal/*" >/dev/null

aws lambda remove-permission --function-name "$FUNCTION_NAME" --statement-id FoundationAgentsPublicApiInvoke >/dev/null 2>&1 || true
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FoundationAgentsPublicApiInvoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${api_id}/*/*/public/*" >/dev/null

routes_after="$(aws apigatewayv2 get-routes --api-id "$api_id" --output json)"
for key in 'GET /internal/health' 'GET /internal/v1/graphs' 'POST /internal/v1/run'; do
  auth="$(jq -r --arg key "$key" '.Items[]? | select(.RouteKey == $key) | .AuthorizationType' <<<"$routes_after")"
  target="$(jq -r --arg key "$key" '.Items[]? | select(.RouteKey == $key) | .Target' <<<"$routes_after")"
  test "$auth" = 'AWS_IAM'
  test "$target" = "integrations/${integration_id}"
done
for key in 'POST /public/v1/navigate' 'OPTIONS /public/v1/navigate'; do
  auth="$(jq -r --arg key "$key" '.Items[]? | select(.RouteKey == $key) | .AuthorizationType' <<<"$routes_after")"
  target="$(jq -r --arg key "$key" '.Items[]? | select(.RouteKey == $key) | .Target' <<<"$routes_after")"
  test "$auth" = 'NONE'
  test "$target" = "integrations/${integration_id}"
done

# Prove the deployed Lambda through the API endpoint rather than requiring the
# deploy role to have direct lambda:InvokeFunction permission.
public_headers="$work/public-headers.txt"
public_status="$(curl --silent --show-error --dump-header "$public_headers" --output /dev/null --max-time 30 --write-out '%{http_code}' "${api_endpoint}/publication/rrg-v1-2025?source=api-agent-edge")"
public_location="$(awk 'BEGIN{IGNORECASE=1} /^location:/ {sub(/\r$/, ""); sub(/^location:[[:space:]]*/, ""); value=$0} END {print value}' "$public_headers")"
test "$public_status" = '308'
test "$public_location" = 'https://www.sozorockfoundation.org/publication/rrg-v1-2025?source=api-agent-edge'

# AWS_IAM must block an unsigned caller before Lambda executes.
unauth_status="$(curl --silent --show-error --output /dev/null --max-time 20 --write-out '%{http_code}' "${api_endpoint}/internal/health" || true)"
test "$unauth_status" = '403'

# The public route is intentionally read-only and schema-constrained. Prove that
# it is reachable without consuming a model turn by sending an invalid prompt.
public_navigator_status="$(curl --silent --show-error --output "$work/public-navigator.json" --max-time 30 --write-out '%{http_code}' \
  --request POST \
  -H 'content-type: application/json' \
  -H 'origin: https://www.sozorockfoundation.org' \
  --data '{"question":"x"}' \
  "${api_endpoint}/public/v1/navigate" || true)"
test "$public_navigator_status" = '400'
test "$(jq -r '.error' "$work/public-navigator.json")" = 'question_must_be_3_to_600_characters'

# At this point the production edge and authorization boundary are verified and
# can remain deployed even if the deploy role itself lacks execute-api:Invoke or
# the OpenAI model credential has not yet been provisioned.
deployment_verified=1

if [[ -n "${OPENAI_API_KEY:-}" ]]; then
  model_configured='true'
  auth_mode='api_key'
elif [[ -n "${OPENAI_IDENTITY_PROVIDER_ID:-}" && -n "${OPENAI_SERVICE_ACCOUNT_ID:-}" && -n "${OPENAI_WIF_AUDIENCE:-}" ]]; then
  model_configured='true'
  auth_mode='aws_wif'
else
  model_configured='false'
  auth_mode='none'
fi
signed_route_verified='false'
model_api_mode='unknown'
graph_status='not-run'
graph_decision='not-run'

# If curl supports AWS SigV4, attempt an authenticated end-to-end probe using
# the current role. A 403 here means only that this deploy role is not an API
# consumer; it does not weaken or roll back the IAM-protected control plane.
if curl --help all 2>/dev/null | grep -q -- '--aws-sigv4'; then
  signed_health_status="$(curl --silent --show-error \
    --output "$work/signed-health.json" \
    --max-time 30 \
    --write-out '%{http_code}' \
    --aws-sigv4 "aws:amz:${AWS_REGION}:execute-api" \
    --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
    -H "x-amz-security-token: ${AWS_SESSION_TOKEN}" \
    "${api_endpoint}/internal/health" || true)"

  if [[ "$signed_health_status" = '200' ]]; then
    signed_route_verified='true'
    model_configured="$(jq -r '.modelConfigured' "$work/signed-health.json")"
    auth_mode="$(jq -r '.modelAuthMode // "none"' "$work/signed-health.json")"
    model_api_mode="$(jq -r '.modelApiMode // "unknown"' "$work/signed-health.json")"

    if [[ "$model_configured" = 'true' ]]; then
      test "$model_api_mode" = 'chat_completions'
      cat > "$work/run-payload.json" <<'JSON'
{"graphId":"foundationSiteAssurance","input":{"task":"Review a bounded synthetic deployment change.","evidence":{"repository":"sozorock-foundation","liveVerification":"not supplied","constraint":"Do not claim production completion without live evidence."}},"context":{"source":"deployment-smoke"}}
JSON
      signed_run_status="$(curl --silent --show-error \
        --output "$work/signed-run.json" \
        --max-time 180 \
        --write-out '%{http_code}' \
        --request POST \
        --aws-sigv4 "aws:amz:${AWS_REGION}:execute-api" \
        --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
        -H "x-amz-security-token: ${AWS_SESSION_TOKEN}" \
        -H 'content-type: application/json' \
        --data-binary "@$work/run-payload.json" \
        "${api_endpoint}/internal/v1/run" || true)"
      if [[ "$signed_run_status" = '200' ]]; then
        graph_status="$(jq -r '.status' "$work/signed-run.json")"
        graph_decision="$(jq -r '.decision' "$work/signed-run.json")"
        [[ "$graph_status" = 'review_required' || "$graph_status" = 'escalated' ]]
        [[ "$graph_decision" = 'pass' || "$graph_decision" = 'revise' || "$graph_decision" = 'escalate' ]]
      else
        failure_category="$(jq -r '.failure.category // "unknown"' "$work/signed-run.json" 2>/dev/null || echo unknown)"
        failure_status="$(jq -r '.failure.providerStatus // "unknown"' "$work/signed-run.json" 2>/dev/null || echo unknown)"
        failure_code="$(jq -r '.failure.providerCode // "unknown"' "$work/signed-run.json" 2>/dev/null || echo unknown)"
        failure_param="$(jq -r '.failure.providerParam // "unknown"' "$work/signed-run.json" 2>/dev/null || echo unknown)"
        failure_detail="$(jq -r '.failure.providerDetail // "not supplied"' "$work/signed-run.json" 2>/dev/null || echo 'not supplied')"
        echo "Signed graph smoke failed safely: HTTP ${signed_run_status}; category=${failure_category}; provider_status=${failure_status}; provider_code=${failure_code}; provider_param=${failure_param}; detail=${failure_detail}." >&2
      fi
    fi
  fi
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "api_id=$api_id" >> "$GITHUB_OUTPUT"
  echo "api_endpoint=$api_endpoint" >> "$GITHUB_OUTPUT"
  echo "public_navigator_endpoint=${api_endpoint}/public/v1/navigate" >> "$GITHUB_OUTPUT"
  echo "auth_mode=$auth_mode" >> "$GITHUB_OUTPUT"
  echo "model_api_mode=$model_api_mode" >> "$GITHUB_OUTPUT"
  echo "model_configured=$model_configured" >> "$GITHUB_OUTPUT"
  echo "signed_route_verified=$signed_route_verified" >> "$GITHUB_OUTPUT"
  echo "graph_status=$graph_status" >> "$GITHUB_OUTPUT"
  echo "graph_decision=$graph_decision" >> "$GITHUB_OUTPUT"
fi
