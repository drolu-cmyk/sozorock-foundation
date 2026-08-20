#!/usr/bin/env bash
set -euo pipefail

ACCOUNT_ID="791860731989"
ROLE_NAME="GitHubActionsSozorockFoundationDnsRole"
POLICY_NAME="SozoRockFoundationParentDns"
ZONE_NAME="sozorockfoundation.org."
OIDC_PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
EXPECTED_SUBJECT="repo:drolu-cmyk@271617784/sozorock-foundation@1337104562:ref:refs/heads/main"

if [[ "${1:-}" != "--apply" ]]; then
  echo "Usage: $0 --apply" >&2
  echo "This command reconciles only the dedicated Foundation DNS role and does not change DNS records." >&2
  exit 2
fi

command -v aws >/dev/null
command -v jq >/dev/null

caller_account="$(aws sts get-caller-identity --query Account --output text)"
if [[ "$caller_account" != "$ACCOUNT_ID" ]]; then
  echo "Refusing to run in AWS account $caller_account; expected $ACCOUNT_ID." >&2
  exit 1
fi

provider_count="$(
  aws iam list-open-id-connect-providers --output json \
    | jq --arg arn "$OIDC_PROVIDER_ARN" '[.OpenIDConnectProviderList[] | select(.Arn == $arn)] | length'
)"
if [[ "$provider_count" != "1" ]]; then
  echo "Expected the GitHub Actions OIDC provider $OIDC_PROVIDER_ARN to exist exactly once." >&2
  echo "No IAM changes were made." >&2
  exit 1
fi

zone_json="$(aws route53 list-hosted-zones-by-name --dns-name "$ZONE_NAME" --output json)"
mapfile -t zone_ids < <(
  jq -r --arg name "$ZONE_NAME" \
    '.HostedZones[] | select(.Name == $name and .Config.PrivateZone == false) | .Id' \
    <<<"$zone_json"
)
if [[ ${#zone_ids[@]} -ne 1 ]]; then
  echo "Expected exactly one public hosted zone named $ZONE_NAME; found ${#zone_ids[@]}." >&2
  exit 1
fi
zone_id="${zone_ids[0]#/hostedzone/}"

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT
trust_file="$workdir/trust.json"
policy_file="$workdir/policy.json"

jq -n \
  --arg provider "$OIDC_PROVIDER_ARN" \
  --arg subject "$EXPECTED_SUBJECT" \
  '{
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AllowSozoRockFoundationMain",
        Effect: "Allow",
        Principal: {Federated: $provider},
        Action: "sts:AssumeRoleWithWebIdentity",
        Condition: {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub": $subject
          }
        }
      }
    ]
  }' > "$trust_file"

jq -n \
  --arg zone_arn "arn:aws:route53:::hostedzone/${zone_id}" \
  '{
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "DiscoverPublicHostedZone",
        Effect: "Allow",
        Action: ["route53:ListHostedZonesByName"],
        Resource: "*"
      },
      {
        Sid: "ReadTargetHostedZone",
        Effect: "Allow",
        Action: ["route53:GetHostedZone", "route53:ListResourceRecordSets"],
        Resource: $zone_arn
      },
      {
        Sid: "ChangeOnlyAuthorizedParentRecords",
        Effect: "Allow",
        Action: ["route53:ChangeResourceRecordSets"],
        Resource: $zone_arn,
        Condition: {
          "ForAllValues:StringEquals": {
            "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
              "www.sozorockfoundation.org",
              "_openai-site-verification.www.sozorockfoundation.org",
              "_cf-custom-hostname.www.sozorockfoundation.org"
            ],
            "route53:ChangeResourceRecordSetsRecordTypes": ["CNAME", "TXT"],
            "route53:ChangeResourceRecordSetsActions": ["UPSERT"]
          }
        }
      },
      {
        Sid: "WaitForRoute53Change",
        Effect: "Allow",
        Action: ["route53:GetChange"],
        Resource: "arn:aws:route53:::change/*"
      }
    ]
  }' > "$policy_file"

if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  echo "Reconciling trust policy for existing role $ROLE_NAME."
  aws iam update-assume-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-document "file://${trust_file}"
else
  echo "Creating dedicated role $ROLE_NAME."
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --description "Least-privilege DNS automation for the SozoRock Foundation parent website" \
    --max-session-duration 3600 \
    --assume-role-policy-document "file://${trust_file}" \
    >/dev/null
fi

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME" \
  --policy-document "file://${policy_file}"

actual_role="$(aws iam get-role --role-name "$ROLE_NAME" --output json)"
actual_subject="$(jq -r '.Role.AssumeRolePolicyDocument.Statement[] | select(.Sid == "AllowSozoRockFoundationMain") | .Condition.StringEquals["token.actions.githubusercontent.com:sub"]' <<<"$actual_role")"
if [[ "$actual_subject" != "$EXPECTED_SUBJECT" ]]; then
  echo "Role trust verification failed." >&2
  exit 1
fi

aws iam get-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME" \
  >/dev/null

cat <<EOF
Parent DNS role bootstrap verified.
Role: arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}
Hosted zone: ${zone_id}
Trusted subject: ${EXPECTED_SUBJECT}
DNS records changed: none
EOF
