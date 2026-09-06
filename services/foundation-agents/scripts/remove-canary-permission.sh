#!/usr/bin/env bash

# Remove the exact temporary grant and confirm absence using the same scoped
# action. No additional IAM permissions are needed for this verification.
remove_canary_permission() {
  local attempt output
  for attempt in 1 2 3; do
    if output="$(aws lambda remove-permission --function-name "$FUNCTION_NAME" \
      --statement-id FoundationAgentsDeployCanaryInvoke 2>&1)"; then
      if output="$(aws lambda remove-permission --function-name "$FUNCTION_NAME" \
        --statement-id FoundationAgentsDeployCanaryInvoke 2>&1)"; then
        :
      elif [[ "$output" == *'(ResourceNotFoundException)'* ]]; then
        return 0
      fi
    elif [[ "$output" == *'(ResourceNotFoundException)'* ]]; then
      return 0
    fi
    if [[ "$attempt" -lt 3 ]]; then sleep "$attempt"; fi
  done
  echo '::error::Cannot confirm removal of the temporary Lambda invocation grant.' >&2
  return 1
}
