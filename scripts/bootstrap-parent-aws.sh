#!/usr/bin/env bash
set -euo pipefail

account_id="${EXPECTED_AWS_ACCOUNT_ID:-791860731989}"
foundation_role="GitHubActionsSozorockFoundationSiteDeployRole"
execution_role="SozoRockFoundationParentCloudFormationRole"
stack_name="sozorock-foundation-parent-cloudfront"
bucket_name="sozorock-foundation-parent-cloudfront-prod-${account_id}"

test "$(aws sts get-caller-identity --query Account --output text)" = "$account_id"

trust_file="$(mktemp)"
execution_policy="$(mktemp)"
deploy_policy="$(mktemp)"
cleanup() { rm -f "$trust_file" "$execution_policy" "$deploy_policy"; }
trap cleanup EXIT

jq -n '{
  Version:"2012-10-17",
  Statement:[{Effect:"Allow",Principal:{Service:"cloudformation.amazonaws.com"},Action:"sts:AssumeRole"}]
}' > "$trust_file"

if aws iam get-role --role-name "$execution_role" >/dev/null 2>&1; then
  aws iam update-assume-role-policy --role-name "$execution_role" --policy-document "file://$trust_file"
else
  aws iam create-role --role-name "$execution_role" --assume-role-policy-document "file://$trust_file" >/dev/null
fi

jq -n --arg account "$account_id" --arg bucket "$bucket_name" '{
  Version:"2012-10-17",
  Statement:[
    {Effect:"Allow",Action:["s3:CreateBucket","s3:DeleteBucket","s3:GetBucketPolicy","s3:PutBucketPolicy","s3:DeleteBucketPolicy","s3:GetBucketVersioning","s3:PutBucketVersioning","s3:GetBucketPublicAccessBlock","s3:PutBucketPublicAccessBlock","s3:GetEncryptionConfiguration","s3:PutEncryptionConfiguration","s3:GetBucketOwnershipControls","s3:PutBucketOwnershipControls"],Resource:("arn:aws:s3:::"+$bucket)},
    {Effect:"Allow",Action:["cloudfront:CreateDistribution","cloudfront:GetDistribution","cloudfront:GetDistributionConfig","cloudfront:UpdateDistribution","cloudfront:DeleteDistribution","cloudfront:CreateOriginAccessControl","cloudfront:GetOriginAccessControl","cloudfront:UpdateOriginAccessControl","cloudfront:DeleteOriginAccessControl","cloudfront:CreateFunction","cloudfront:DescribeFunction","cloudfront:GetFunction","cloudfront:UpdateFunction","cloudfront:PublishFunction","cloudfront:DeleteFunction","cloudfront:CreateResponseHeadersPolicy","cloudfront:GetResponseHeadersPolicy","cloudfront:UpdateResponseHeadersPolicy","cloudfront:DeleteResponseHeadersPolicy","cloudfront:TagResource","cloudfront:UntagResource","cloudfront:ListTagsForResource"],Resource:"*"},
    {Effect:"Allow",Action:["apigateway:GET","apigateway:POST","apigateway:PUT","apigateway:PATCH","apigateway:DELETE"],Resource:["arn:aws:apigateway:us-east-1::/apis","arn:aws:apigateway:us-east-1::/apis/*","arn:aws:apigateway:us-east-1::/domainnames","arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org","arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org/*","arn:aws:apigateway:us-east-1::/tags/*"]},
    {Effect:"Allow",Action:["acm:RequestCertificate","acm:DescribeCertificate","acm:DeleteCertificate","acm:AddTagsToCertificate","acm:RemoveTagsFromCertificate","acm:ListTagsForCertificate"],Resource:"*"},
    {Effect:"Allow",Action:["route53:GetHostedZone","route53:ListHostedZonesByName","route53:ListResourceRecordSets","route53:ChangeResourceRecordSets","route53:GetChange"],Resource:"*"},
    {Effect:"Allow",Action:["cloudwatch:GetMetricData","cloudwatch:GetMetricStatistics","cloudwatch:ListMetrics"],Resource:"*"}
  ]
}' > "$execution_policy"
aws iam put-role-policy --role-name "$execution_role" --policy-name SozoRockFoundationParentCloudFormation --policy-document "file://$execution_policy"

jq -n --arg account "$account_id" --arg bucket "$bucket_name" --arg stack "$stack_name" --arg execution "$execution_role" '{
  Version:"2012-10-17",
  Statement:[
    {Effect:"Allow",Action:["cloudformation:CreateStack","cloudformation:UpdateStack","cloudformation:CreateChangeSet","cloudformation:DescribeChangeSet","cloudformation:ExecuteChangeSet","cloudformation:DeleteChangeSet","cloudformation:DescribeStacks","cloudformation:DescribeStackEvents","cloudformation:DescribeStackResources","cloudformation:GetTemplate","cloudformation:GetTemplateSummary","cloudformation:ValidateTemplate"],Resource:("arn:aws:cloudformation:us-east-1:"+$account+":stack/"+$stack+"/*")},
    {Effect:"Allow",Action:"cloudformation:ValidateTemplate",Resource:"*"},
    {Effect:"Allow",Action:"iam:PassRole",Resource:("arn:aws:iam::"+$account+":role/"+$execution),Condition:{StringEquals:{"iam:PassedToService":"cloudformation.amazonaws.com"}}},
    {Effect:"Allow",Action:["s3:ListBucket","s3:GetBucketLocation"],Resource:("arn:aws:s3:::"+$bucket)},
    {Effect:"Allow",Action:["s3:PutObject","s3:DeleteObject","s3:GetObject"],Resource:("arn:aws:s3:::"+$bucket+"/*")},
    {Effect:"Allow",Action:["cloudfront:AssociateAlias","cloudfront:CreateInvalidation","cloudfront:GetDistribution","cloudfront:GetDistributionConfig","cloudfront:GetInvalidation","cloudfront:ListConflictingAliases","cloudfront:ListDistributions","cloudfront:UpdateDistribution"],Resource:"*"},
    {Effect:"Allow",Action:["apigateway:GET"],Resource:["arn:aws:apigateway:us-east-1::/apis","arn:aws:apigateway:us-east-1::/apis/*","arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org","arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org/apimappings","arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org/apimappings/*"]},
    {Effect:"Allow",Action:["apigateway:POST","apigateway:PATCH"],Resource:["arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org/apimappings","arn:aws:apigateway:us-east-1::/domainnames/www.sozorockfoundation.org/apimappings/*"]},
    {Effect:"Allow",Action:["route53:ListResourceRecordSets","route53:ChangeResourceRecordSets","route53:GetChange"],Resource:["arn:aws:route53:::hostedzone/Z07905293AANZWGYZ84F3","arn:aws:route53:::change/*"]}
  ]
}' > "$deploy_policy"
aws iam put-role-policy --role-name "$foundation_role" --policy-name SozoRockFoundationParentCloudFrontDeploy --policy-document "file://$deploy_policy"

actual_execution="$(aws iam get-role --role-name "$execution_role" --query Role.Arn --output text)"
test "$actual_execution" = "arn:aws:iam::${account_id}:role/${execution_role}"
aws iam get-role-policy --role-name "$foundation_role" --policy-name SozoRockFoundationParentCloudFrontDeploy >/dev/null
echo "Foundation CloudFront deployment authority is ready."
