# SozoRock Foundation agent runtime

Internal model-backed control service for The SozoRock Foundation parent site and SozoRock AI Lab. It is not public website content and must not be exposed as a visitor-facing feature description.

## Operating model

Each graph starts with the Foundation Orchestrator, passes through deterministic specialist gates, and ends with a structured evaluator decision. The evaluator may return `pass`, `revise`, or `escalate`.

- `pass` means the candidate is coherent enough for authorized human review. It does not mean published, deployed, approved, certified, released, or complete.
- `revise` names one permitted specialist. The runtime reruns that specialist and every downstream specialist needed to rebuild the candidate, then evaluates again.
- `escalate` stops the autonomous loop and requires human judgment.
- Revision cycles are bounded. The deployed Lambda permits one revision cycle per request; the library hard-caps the value at two.
- Every run has a `runId`. Sensitive model inputs and outputs are excluded from deployment trace export.

## Boundaries

- The parent Foundation and AI Lab use separate named graphs while sharing one Foundation-level control plane.
- The browser never receives model credentials.
- The service does not publish, deploy, email, post to social media, alter DOI routes, authorize access, issue credentials, or release publication files.
- Publication release, deployment, external communication, access control, learner completion/credential decisions, and other high-impact actions remain human approval gates.
- Requests are size-limited, non-cacheable, and rejected when they contain known sensitive field names or common credential/private-key patterns.
- Do not submit patient records, diagnoses, passwords, API keys, authentication tokens, government identifiers, or other regulated/sensitive records to this service.
- Learner workflows should use an opaque learner reference and the minimum evidence needed for the learning task.

## AWS production edge

The production control plane reuses the Foundation-owned `SozoRockFoundationParentOrigin` Lambda and `SozoRockFoundationParentSite` HTTP API instead of creating a public AI endpoint.

- Every non-internal Lambda request returns HTTP 308 to `https://www.sozorockfoundation.org`, preserving path and query.
- The only agent routes are `GET /internal/health`, `GET /internal/v1/graphs`, and `POST /internal/v1/run`.
- API Gateway configures all three internal routes with `AWS_IAM`. Unauthenticated network access must return 403 before Lambda execution.
- The deployment script snapshots Lambda code/configuration and all three routes before mutation. If redirect or IAM-route verification fails, the prior Lambda and route state is restored.
- The internal API has no visitor-facing custom domain and is not linked from the public website.

The local Node HTTP server remains useful for controlled development and requires `FOUNDATION_AGENT_SERVICE_TOKEN`; production authorization is AWS IAM at API Gateway.

## Graphs

- `foundationContentRefresh` — orchestrator → source analysis → institute analysis → verification → copy → distribution candidate → evaluation
- `publicationRelease` — orchestrator → source analysis → publication review → verification → copy → distribution candidate → evaluation
- `foundationSiteAssurance` — orchestrator → product → UI/UX → accessibility → security → evaluation
- `aiLabLearnerLoop` — orchestrator → learning plan → coaching → project review → evaluation
- `aiLabProgramImprovement` — orchestrator → program evidence analysis → learning plan → project review → evaluation

The execution graph is not the institutional knowledge graph. Source provenance, publication records, learner state, approvals, and durable evidence remain versioned application data rather than inferred from conversation history.

## Model authentication

Production uses Amazon Bedrock's OpenAI-compatible Responses API with `openai.gpt-5.6-sol` in `us-east-1`. The exact production Lambda derives a short-term Bedrock API key from its IAM role using `@aws/bedrock-token-generator`. The key is generated for a graph run, is never persisted or logged, and expires with the underlying AWS session. The Lambda role is restricted to GPT-5.6 Sol inference and `SHORT_TERM` bearer-token use.

The runtime keeps two controlled alternatives for non-production environments:

API-key mode:

```text
OPENAI_API_KEY
```

OpenAI workload-identity mode:

```text
OPENAI_IDENTITY_PROVIDER_ID
OPENAI_SERVICE_ACCOUNT_ID
OPENAI_WIF_AUDIENCE=https://api.openai.com/v1
AWS_REGION=us-east-1
```

An explicit non-production Bedrock run may set:

```text
FOUNDATION_MODEL_PROVIDER=bedrock
AWS_REGION=us-east-1
```

The production fallback to Bedrock is scoped to the exact Lambda name `SozoRockFoundationParentOrigin`; an unrelated Lambda does not acquire model access automatically. Bedrock and WIF modes disable the Agents SDK key-based trace exporter while retaining non-sensitive run IDs and CloudWatch operational telemetry.

Optional local runtime settings:

```text
OPENAI_AGENT_MODEL=gpt-5.6-sol
PORT=8788
FOUNDATION_AGENT_SERVICE_TOKEN=<local-service-only secret>
TRUST_PROXY_HEADERS=false
```

Never commit model credentials or service tokens to GitHub or a browser bundle.

## Checks

```bash
npm install
npm run smoke
npm run eval
```

`npm run smoke` validates graph structure, service-boundary guards, model-auth selection, the combined Lambda redirect, and internal Lambda routes without calling a model.

The live eval harness exercises the real graph path, allows one bounded revision, and uses a separate structured grader against each case's expected behavior. Regressions cover conflicting evidence, unsupported funding claims, prompt injection embedded in source material, permanent publication routes, false release/deployment claims, cross-property routing, AI Lab completion gates, and overgeneralization from a single learner. The expected-behavior text is withheld from the graph and supplied only to the grader.

## Local request contract

`POST /v1/run` on the local HTTP service accepts:

```json
{
  "graphId": "foundationSiteAssurance",
  "input": {
    "change": "Description of the reviewed change",
    "evidence": "Source-backed implementation evidence"
  },
  "context": {
    "repository": "sozorock-foundation"
  }
}
```

Use `Authorization: Bearer <FOUNDATION_AGENT_SERVICE_TOKEN>` locally. Production uses the equivalent `/internal/v1/run` route protected by AWS IAM. Responses remain internal review artifacts until an authorized human approves any downstream action.
