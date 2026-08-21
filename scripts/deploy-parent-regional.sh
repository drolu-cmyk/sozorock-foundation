#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:?AWS_REGION is required}"
: "${DOMAIN_NAME:?DOMAIN_NAME is required}"
: "${WWW_NAME:?WWW_NAME is required}"
: "${HOSTED_ZONE_ID:?HOSTED_ZONE_ID is required}"
: "${BUCKET_NAME:?BUCKET_NAME is required}"
: "${CERTIFICATE_ARN:?CERTIFICATE_ARN is required}"
: "${LAMBDA_ROLE_ARN:?LAMBDA_ROLE_ARN is required}"

ACCOUNT_ID="${ACCOUNT_ID:-791860731989}"
FUNCTION_NAME="${FUNCTION_NAME:-SozoRockFoundationParentOrigin}"
API_NAME="${API_NAME:-SozoRockFoundationParentSite}"
RUN_ID="${GITHUB_RUN_ID:-manual}"

log() {
  printf '\n==> %s\n' "$*"
}

wait_for_lambda() {
  local state update_status
  for _ in $(seq 1 90); do
    state="$(aws lambda get-function-configuration --function-name "$FUNCTION_NAME" --query 'State' --output text 2>/dev/null || true)"
    update_status="$(aws lambda get-function-configuration --function-name "$FUNCTION_NAME" --query 'LastUpdateStatus' --output text 2>/dev/null || true)"
    if [ "$state" = "Active" ] && { [ "$update_status" = "Successful" ] || [ "$update_status" = "None" ] || [ "$update_status" = "" ]; }; then
      return 0
    fi
    if [ "$state" = "Failed" ] || [ "$update_status" = "Failed" ]; then
      aws lambda get-function-configuration --function-name "$FUNCTION_NAME" --output json >&2 || true
      return 1
    fi
    sleep 2
  done
  echo "Lambda function did not become ready in time." >&2
  return 1
}

log "Confirm AWS account"
test "$(aws sts get-caller-identity --query Account --output text)" = "$ACCOUNT_ID"

log "Ensure private S3 origin bucket"
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" >/dev/null 2>&1; then
  aws s3api create-bucket --bucket "$BUCKET_NAME" >/dev/null
fi
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled
aws s3api put-bucket-ownership-controls \
  --bucket "$BUCKET_NAME" \
  --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'

log "Package Lambda static origin"
cat >/tmp/index.py <<'PY'
import base64
import boto3
import mimetypes
import os
import urllib.parse
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
bucket = os.environ['SITE_BUCKET']

SECURITY_HEADERS = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'strict-transport-security': 'max-age=31536000',
    'content-security-policy': "frame-ancestors 'none'",
}


def resolve_key(raw_path):
    path = urllib.parse.unquote(raw_path or '/')
    path = path.split('?', 1)[0]
    if path == '/':
        return 'index.html'
    key = path.lstrip('/')
    if key.endswith('/'):
        return key + 'index.html'
    leaf = key.rsplit('/', 1)[-1]
    if '.' not in leaf:
        return key + '/index.html'
    return key


def handler(event, context):
    key = resolve_key(event.get('rawPath') or event.get('path') or '/')
    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        body = obj['Body'].read()
        content_type = obj.get('ContentType') or mimetypes.guess_type(key)[0] or 'application/octet-stream'
        headers = dict(SECURITY_HEADERS)
        headers['content-type'] = content_type
        if obj.get('CacheControl'):
            headers['cache-control'] = obj['CacheControl']
        return {
            'statusCode': 200,
            'headers': headers,
            'body': base64.b64encode(body).decode('ascii'),
            'isBase64Encoded': True,
        }
    except ClientError as exc:
        code = exc.response.get('Error', {}).get('Code', '')
        if code in ('NoSuchKey', 'NoSuchBucket', '404'):
            return {
                'statusCode': 404,
                'headers': {**SECURITY_HEADERS, 'content-type': 'text/plain; charset=utf-8'},
                'body': 'Not found',
                'isBase64Encoded': False,
            }
        raise
PY
(
  cd /tmp
  rm -f origin.zip
  python3 -m zipfile -c origin.zip index.py
)

log "Create or update Lambda origin"
if aws lambda get-function --function-name "$FUNCTION_NAME" >/dev/null 2>&1; then
  wait_for_lambda
  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --runtime python3.13 \
    --handler index.handler \
    --role "$LAMBDA_ROLE_ARN" \
    --memory-size 256 \
    --timeout 10 \
    --environment "Variables={SITE_BUCKET=$BUCKET_NAME}" >/dev/null
  wait_for_lambda
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb:///tmp/origin.zip >/dev/null
  wait_for_lambda
else
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime python3.13 \
    --handler index.handler \
    --role "$LAMBDA_ROLE_ARN" \
    --zip-file fileb:///tmp/origin.zip \
    --memory-size 256 \
    --timeout 10 \
    --environment "Variables={SITE_BUCKET=$BUCKET_NAME}" >/dev/null
  wait_for_lambda
fi
FUNCTION_ARN="$(aws lambda get-function --function-name "$FUNCTION_NAME" --query 'Configuration.FunctionArn' --output text)"
test -n "$FUNCTION_ARN"

log "Create or repair HTTP API"
API_ID="$(aws apigatewayv2 get-apis --output json | jq -r --arg name "$API_NAME" '.Items[]? | select(.Name==$name) | .ApiId' | head -n1)"
if [ -z "$API_ID" ]; then
  API_JSON="$(aws apigatewayv2 create-api \
    --name "$API_NAME" \
    --protocol-type HTTP \
    --target "$FUNCTION_ARN" \
    --output json)"
  API_ID="$(jq -r '.ApiId' <<<"$API_JSON")"
fi
test -n "$API_ID"

INTEGRATION_ID="$(aws apigatewayv2 get-integrations --api-id "$API_ID" --output json | jq -r --arg arn "$FUNCTION_ARN" '.Items[]? | select(.IntegrationUri==$arn) | .IntegrationId' | head -n1)"
if [ -z "$INTEGRATION_ID" ]; then
  INTEGRATION_ID="$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --integration-type AWS_PROXY \
    --integration-uri "$FUNCTION_ARN" \
    --payload-format-version 2.0 \
    --query 'IntegrationId' \
    --output text)"
fi

test -n "$INTEGRATION_ID"
ROUTE_ID="$(aws apigatewayv2 get-routes --api-id "$API_ID" --output json | jq -r '.Items[]? | select(.RouteKey=="$default") | .RouteId' | head -n1)"
if [ -z "$ROUTE_ID" ]; then
  aws apigatewayv2 create-route \
    --api-id "$API_ID" \
    --route-key '$default' \
    --target "integrations/$INTEGRATION_ID" >/dev/null
else
  aws apigatewayv2 update-route \
    --api-id "$API_ID" \
    --route-id "$ROUTE_ID" \
    --target "integrations/$INTEGRATION_ID" >/dev/null
fi

STAGE_EXISTS="$(aws apigatewayv2 get-stages --api-id "$API_ID" --output json | jq -r '[.Items[]? | select(.StageName=="$default")] | length')"
if [ "$STAGE_EXISTS" = "0" ]; then
  aws apigatewayv2 create-stage \
    --api-id "$API_ID" \
    --stage-name '$default' \
    --auto-deploy >/dev/null
else
  aws apigatewayv2 update-stage \
    --api-id "$API_ID" \
    --stage-name '$default' \
    --auto-deploy >/dev/null
fi

aws lambda remove-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id AllowApiGatewayInvoke >/dev/null 2>&1 || true
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id AllowApiGatewayInvoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${API_ID}/*" >/dev/null

API_ENDPOINT="$(aws apigatewayv2 get-api --api-id "$API_ID" --query 'ApiEndpoint' --output text)"
test -n "$API_ENDPOINT"

log "Publish approved build to private S3"
aws s3 sync dist/assets/ "s3://${BUCKET_NAME}/assets/" \
  --delete \
  --cache-control 'public,max-age=31536000,immutable'
aws s3 sync dist/ "s3://${BUCKET_NAME}/" \
  --delete \
  --exclude 'assets/*' \
  --cache-control 'public,max-age=300,must-revalidate'

log "Verify API endpoint before custom-domain or DNS changes"
api_verified=0
for _ in $(seq 1 45); do
  page="$(curl -fsSL --max-time 20 "${API_ENDPOINT}/?deploy=${RUN_ID}" || true)"
  if grep -Fq 'Access.' <<<"$page" && grep -Fq 'Assurance.' <<<"$page" && grep -Fq 'Intelligence.' <<<"$page"; then
    api_verified=1
    break
  fi
  sleep 4
done
if [ "$api_verified" != "1" ]; then
  echo "New API target failed identity verification. DNS was not changed." >&2
  exit 1
fi

log "Create or update regional API Gateway custom domain"
if DOMAIN_JSON="$(aws apigatewayv2 get-domain-name --domain-name "$DOMAIN_NAME" --output json 2>/dev/null)"; then
  CURRENT_CERT="$(jq -r '.DomainNameConfigurations[0].CertificateArn // ""' <<<"$DOMAIN_JSON")"
  if [ "$CURRENT_CERT" != "$CERTIFICATE_ARN" ]; then
    aws apigatewayv2 update-domain-name \
      --domain-name "$DOMAIN_NAME" \
      --domain-name-configurations "CertificateArn=$CERTIFICATE_ARN,EndpointType=REGIONAL,SecurityPolicy=TLS_1_2" >/dev/null
  fi
else
  aws apigatewayv2 create-domain-name \
    --domain-name "$DOMAIN_NAME" \
    --domain-name-configurations "CertificateArn=$CERTIFICATE_ARN,EndpointType=REGIONAL,SecurityPolicy=TLS_1_2" >/dev/null
fi

DOMAIN_READY=0
for _ in $(seq 1 120); do
  DOMAIN_JSON="$(aws apigatewayv2 get-domain-name --domain-name "$DOMAIN_NAME" --output json 2>/dev/null || true)"
  status="$(jq -r '.DomainNameConfigurations[0].DomainNameStatus // ""' <<<"${DOMAIN_JSON:-{}}")"
  if [ "$status" = "AVAILABLE" ]; then
    DOMAIN_READY=1
    break
  fi
  if [ "$status" = "FAILED" ]; then
    echo "$DOMAIN_JSON" >&2
    exit 1
  fi
  sleep 5
done
if [ "$DOMAIN_READY" != "1" ]; then
  echo "API Gateway custom domain did not become AVAILABLE in time." >&2
  echo "${DOMAIN_JSON:-}" >&2
  exit 1
fi

TARGET="$(jq -r '.DomainNameConfigurations[0].ApiGatewayDomainName' <<<"$DOMAIN_JSON")"
TARGET_ZONE="$(jq -r '.DomainNameConfigurations[0].HostedZoneId' <<<"$DOMAIN_JSON")"
test -n "$TARGET"
test "$TARGET" != "null"
test -n "$TARGET_ZONE"
test "$TARGET_ZONE" != "null"

log "Create or update root API mapping"
MAPPING_ID="$(aws apigatewayv2 get-api-mappings --domain-name "$DOMAIN_NAME" --output json | jq -r '.Items[]? | select((.ApiMappingKey // "")=="") | .ApiMappingId' | head -n1)"
if [ -z "$MAPPING_ID" ]; then
  aws apigatewayv2 create-api-mapping \
    --domain-name "$DOMAIN_NAME" \
    --api-id "$API_ID" \
    --stage '$default' >/dev/null
else
  aws apigatewayv2 update-api-mapping \
    --domain-name "$DOMAIN_NAME" \
    --api-mapping-id "$MAPPING_ID" \
    --api-id "$API_ID" \
    --stage '$default' >/dev/null
fi

log "Verify custom-domain target directly before Route 53 cutover"
TARGET_IP="$(getent ahostsv4 "$TARGET" | awk 'NR==1{print $1}')"
test -n "$TARGET_IP"
custom_page="$(curl -fsSL --max-time 30 --resolve "${DOMAIN_NAME}:443:${TARGET_IP}" "https://${DOMAIN_NAME}/?target=${RUN_ID}")"
grep -Fq 'Access.' <<<"$custom_page"
grep -Fq 'Assurance.' <<<"$custom_page"
grep -Fq 'Intelligence.' <<<"$custom_page"

log "Atomically replace only the www routing record"
TARGET_DOT="${TARGET%.}."
RECORDS="$(aws route53 list-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --output json)"
CURRENT_CNAME="$(jq -c --arg name "$WWW_NAME" '.ResourceRecordSets[] | select(.Name==$name and .Type=="CNAME")' <<<"$RECORDS")"
CURRENT_A="$(jq -r --arg name "$WWW_NAME" '.ResourceRecordSets[] | select(.Name==$name and .Type=="A") | .AliasTarget.DNSName // empty' <<<"$RECORDS")"

if [ -n "$CURRENT_A" ]; then
  CURRENT_A="${CURRENT_A%.}."
fi

if [ -n "$CURRENT_CNAME" ]; then
  OLD_VALUE="$(jq -r '.ResourceRecords[0].Value' <<<"$CURRENT_CNAME")"
  OLD_VALUE="${OLD_VALUE%.}."
  if [ "$OLD_VALUE" != 'custom-domains.chatgpt.site.' ] && [ "$OLD_VALUE" != "$TARGET_DOT" ]; then
    echo "Unexpected existing www CNAME: $OLD_VALUE" >&2
    exit 1
  fi
  jq -n \
    --argjson cname "$CURRENT_CNAME" \
    --arg name "$WWW_NAME" \
    --arg target "$TARGET_DOT" \
    --arg zone "$TARGET_ZONE" \
    '{Comment:"Restore Foundation www on regional AWS hosting",Changes:[
      {Action:"DELETE",ResourceRecordSet:$cname},
      {Action:"CREATE",ResourceRecordSet:{Name:$name,Type:"A",AliasTarget:{HostedZoneId:$zone,DNSName:$target,EvaluateTargetHealth:false}}}
    ]}' >/tmp/www-cutover.json
  CHANGE_ID="$(aws route53 change-resource-record-sets \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --change-batch file:///tmp/www-cutover.json \
    --query 'ChangeInfo.Id' \
    --output text)"
  aws route53 wait resource-record-sets-changed --id "$CHANGE_ID"
elif [ "$CURRENT_A" = "$TARGET_DOT" ]; then
  echo "www already points to the regional API Gateway target."
else
  echo "Expected old www CNAME or the new target A alias was not found; refusing ambiguous DNS mutation." >&2
  exit 1
fi

log "Verify authoritative Route 53 state"
FINAL="$(aws route53 list-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --output json)"
FINAL_A="$(jq -r --arg name "$WWW_NAME" '.ResourceRecordSets[] | select(.Name==$name and .Type=="A") | .AliasTarget.DNSName // empty' <<<"$FINAL")"
FINAL_CNAME="$(jq -r --arg name "$WWW_NAME" '.ResourceRecordSets[] | select(.Name==$name and .Type=="CNAME") | .ResourceRecords[0].Value // empty' <<<"$FINAL")"
FINAL_A="${FINAL_A%.}."
test "$FINAL_A" = "$TARGET_DOT"
test -z "$FINAL_CNAME"

log "Verify live public HTTPS"
PUBLIC_OK=0
for _ in $(seq 1 60); do
  live="$(curl -fsSL --max-time 20 "https://${DOMAIN_NAME}/?live=${RUN_ID}" || true)"
  if grep -Fq 'Access.' <<<"$live" && grep -Fq 'Assurance.' <<<"$live" && grep -Fq 'Intelligence.' <<<"$live"; then
    PUBLIC_OK=1
    break
  fi
  sleep 5
done

if [ "$PUBLIC_OK" = "1" ]; then
  echo "LIVE: https://${DOMAIN_NAME} is serving the approved Foundation parent site."
else
  echo "Authoritative DNS and direct HTTPS verification passed. Public resolver caches are still converging." >&2
fi

printf 'API_ID=%s\nAPI_ENDPOINT=%s\nTARGET=%s\nTARGET_ZONE=%s\n' "$API_ID" "$API_ENDPOINT" "$TARGET" "$TARGET_ZONE"
