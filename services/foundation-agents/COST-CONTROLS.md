# Operating limits

Model execution is paused by default following the owner's October 19, 2026 cost instruction. The production workflow explicitly sets `FOUNDATION_MODEL_EXECUTION_ENABLED` to `false`. Re-enabling it requires an approved code change and an operating budget.

The public navigator returns approved Foundation copy without requesting model inference. Its interface remains absent from the approved parent pages. The public-guidance deployment updates the existing Lambda package and pauses model execution while preserving its redirect, existing environment values, API routes and AWS IAM authorization. It creates no infrastructure or model capacity and makes no model probes.

The release must verify the updated program answer, canonical redirect, unsigned rejection of private routes, authenticated health status and rejection of private model execution. Failed verification restores the prior code and environment. The full model deployment retains its existing real-model canary requirements when explicitly enabled.

This prevents model inference from the paused Lambda entry points. Existing Lambda, API Gateway, logging and other AWS resources may still incur charges. It is not a zero-cost claim.
