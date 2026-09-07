# Sonnet 4.6 cost control

Verified 2026-09-07: the Foundation account's Sonnet 4.6 Bedrock agreement reports `NOT_AVAILABLE` after removal. The Marketplace notice's zero-dollar purchase amount did not mean free model invocations.

`iam-sonnet-cost-control.json` is the exact inline deny policy installed as `SozoRockBlockSonnet46Charges` on the nine existing principals identified as capable of invocation or subscription:

- Roles: AmplifyConsoleServiceRole-RockCare, AutomateSH, cdk-hnb659fds-cfn-exec-role-791860731989-us-east-1, claude-deployer, gh-deploy-prod, GitHubActionsRole, GitHubOIDC_SozoRockHealth_DeployRole, SozoRockFoundationParentLambdaRole.
- IAM user: claude-deployer.

IAM simulation verified an explicit deny on the Foundation runtime role and deployment user. The deployment script no longer probes Sonnet 4.6 as a fallback. This is a control over these principals and the named model, not an account-wide SCP or a guarantee against other AWS charges. New principals require corresponding review. Existing billing and historical usage remain separate questions.

The CloudWatch inventory contained seven metric alarms and zero composite alarms across the inspected regions. No new alarms were created and useful production monitoring was retained. Current alarm count alone cannot establish the month's final bill.
