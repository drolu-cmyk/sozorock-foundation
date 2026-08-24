#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:?AWS_REGION is required}"
: "${APEX_HOST:?APEX_HOST is required}"
: "${FOUNDATION_HOSTED_ZONE_ID:?FOUNDATION_HOSTED_ZONE_ID is required}"
: "${CERTIFICATE_ARN:?CERTIFICATE_ARN is required}"

report="${REPORT_PATH:-/dev/null}"
selected_cert_arn="$CERTIFICATE_ARN"

certificate_covers_apex() {
  local arn="$1"
  local cert
  cert="$(aws acm describe-certificate \
    --region "$AWS_REGION" \
    --certificate-arn "$arn" \
    --query 'Certificate.{status:Status,domain:DomainName,sans:SubjectAlternativeNames}' \
    --output json 2>/dev/null || true)"
  [[ -n "$cert" ]] || return 1
  jq -e --arg apex "$APEX_HOST" \
    '(.status == "ISSUED") and ((.domain == $apex) or ([.sans[]?] | index($apex) != null))' \
    <<<"$cert" >/dev/null
}

if certificate_covers_apex "$selected_cert_arn"; then
  echo "- Apex certificate: existing configured certificate already covers \`${APEX_HOST}\`." >> "$report"
else
  echo "- Apex certificate: configured certificate does not cover \`${APEX_HOST}\`; looking for an existing issued apex certificate." >> "$report"

  existing_cert_arn=""
  if existing_cert_arn="$(aws acm list-certificates \
    --region "$AWS_REGION" \
    --certificate-statuses ISSUED \
    --query "CertificateSummaryList[?DomainName=='${APEX_HOST}'].CertificateArn | [0]" \
    --output text 2>"${RUNNER_TEMP:-/tmp}/acm-list.err")"; then
    if [[ "$existing_cert_arn" == "None" ]]; then existing_cert_arn=""; fi
  else
    echo "- Apex certificate discovery: \`$(tr '\n' ' ' < "${RUNNER_TEMP:-/tmp}/acm-list.err" | sed 's/`/'"'"'/g')\`" >> "$report"
    existing_cert_arn=""
  fi

  if [[ -n "$existing_cert_arn" ]] && certificate_covers_apex "$existing_cert_arn"; then
    selected_cert_arn="$existing_cert_arn"
    echo "- Apex certificate: reusing an existing issued ACM certificate for \`${APEX_HOST}\`." >> "$report"
  else
    request_token="sozorockapex20260824"
    request_err="${RUNNER_TEMP:-/tmp}/acm-request.err"
    if ! selected_cert_arn="$(aws acm request-certificate \
      --region "$AWS_REGION" \
      --domain-name "$APEX_HOST" \
      --validation-method DNS \
      --idempotency-token "$request_token" \
      --options CertificateTransparencyLoggingPreference=ENABLED \
      --query CertificateArn \
      --output text 2>"$request_err")"; then
      echo "- Apex certificate request: \`$(tr '\n' ' ' < "$request_err" | sed 's/`/'"'"'/g')\`" >> "$report"
      exit 1
    fi
    test -n "$selected_cert_arn"
    test "$selected_cert_arn" != "None"
    echo "- Apex certificate: requested a DNS-validated ACM certificate for \`${APEX_HOST}\`." >> "$report"

    record_json=""
    for _ in $(seq 1 60); do
      record_json="$(aws acm describe-certificate \
        --region "$AWS_REGION" \
        --certificate-arn "$selected_cert_arn" \
        --query 'Certificate.DomainValidationOptions[0].ResourceRecord' \
        --output json 2>/dev/null || true)"
      name="$(jq -r '.Name // ""' <<<"${record_json:-{}}")"
      value="$(jq -r '.Value // ""' <<<"${record_json:-{}}")"
      type="$(jq -r '.Type // ""' <<<"${record_json:-{}}")"
      if [[ -n "$name" && -n "$value" && "$type" == "CNAME" ]]; then break; fi
      sleep 5
    done

    name="$(jq -r '.Name // ""' <<<"${record_json:-{}}")"
    value="$(jq -r '.Value // ""' <<<"${record_json:-{}}")"
    type="$(jq -r '.Type // ""' <<<"${record_json:-{}}")"
    test -n "$name"
    test -n "$value"
    test "$type" = "CNAME"

    jq -n \
      --arg name "$name" \
      --arg value "$value" \
      '{Comment:"Validate SozoRock Foundation apex ACM certificate",Changes:[{Action:"UPSERT",ResourceRecordSet:{Name:$name,Type:"CNAME",TTL:300,ResourceRecords:[{Value:$value}]}}]}' \
      > "${RUNNER_TEMP:-/tmp}/apex-cert-validation.json"

    change_id="$(aws route53 change-resource-record-sets \
      --hosted-zone-id "$FOUNDATION_HOSTED_ZONE_ID" \
      --change-batch "file://${RUNNER_TEMP:-/tmp}/apex-cert-validation.json" \
      --query 'ChangeInfo.Id' \
      --output text)"
    aws route53 wait resource-record-sets-changed --id "$change_id"
    echo '- Apex certificate: DNS validation record published in the existing Foundation hosted zone.' >> "$report"

    aws acm wait certificate-validated \
      --region "$AWS_REGION" \
      --certificate-arn "$selected_cert_arn"

    if ! certificate_covers_apex "$selected_cert_arn"; then
      echo '- Apex certificate: validation completed but the certificate did not reach the expected issued/apex state.' >> "$report"
      exit 1
    fi
    echo '- Apex certificate: issued and verified for the Foundation apex.' >> "$report"
  fi
fi

if [[ -n "${GITHUB_ENV:-}" ]]; then
  echo "APEX_CERTIFICATE_ARN=$selected_cert_arn" >> "$GITHUB_ENV"
fi
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "certificate_arn=$selected_cert_arn" >> "$GITHUB_OUTPUT"
fi
