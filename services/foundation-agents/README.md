# SozoRock Foundation agent runtime

Internal model-backed control service for The SozoRock Foundation parent site and SozoRock AI Lab. It is not public website content and must not be exposed as a visitor-facing feature description.

## Operating model

Each graph starts with the Foundation Orchestrator, passes through deterministic specialist gates, and ends with a structured evaluator decision. The evaluator may return `pass`, `revise`, or `escalate`.

- `pass` means the candidate is coherent enough for authorized human review. It does not mean published, deployed, approved, certified, released, or complete.
- `revise` names one permitted specialist. The runtime reruns that specialist and every downstream specialist needed to rebuild the candidate, then evaluates again.
- `escalate` stops the autonomous loop and requires human judgment.
- Revision cycles are bounded. The internal HTTP service permits one revision cycle per request; the library hard-caps the value at two.
- Every run has a `runId` used as the Agents SDK trace group, while trace payloads exclude model inputs and outputs.

## Boundaries

- The parent Foundation and AI Lab use separate named graphs and may share one Foundation-level OpenAI project credential.
- The browser never receives `OPENAI_API_KEY`.
- `/v1/run` and `/v1/graphs` require a separate `FOUNDATION_AGENT_SERVICE_TOKEN` of at least 24 characters.
- The service does not publish, deploy, email, post to social media, alter DOI routes, authorize access, issue credentials, or release publication files.
- Publication release, deployment, external communication, access control, learner completion/credential decisions, and other high-impact actions remain human approval gates.
- Requests are size-limited, rate-limited, non-cacheable, and rejected when they contain known sensitive field names or common credential/private-key patterns.
- Do not submit patient records, diagnoses, passwords, API keys, authentication tokens, government identifiers, or other regulated/sensitive records to this service.
- Learner workflows should use an opaque learner reference and the minimum evidence needed for the learning task. Do not send unnecessary identifying information.

## Graphs

- `foundationContentRefresh` — orchestrator → source analysis → institute analysis → verification → copy → distribution candidate → evaluation
- `publicationRelease` — orchestrator → source analysis → publication review → verification → copy → distribution candidate → evaluation
- `foundationSiteAssurance` — orchestrator → product → UI/UX → accessibility → security → evaluation
- `aiLabLearnerLoop` — orchestrator → learning plan → coaching → project review → evaluation
- `aiLabProgramImprovement` — orchestrator → program evidence analysis → learning plan → project review → evaluation

The execution graph is not the institutional knowledge graph. Source provenance, publication records, learner state, approvals, and durable evidence should remain versioned application data rather than being inferred from conversation history.

## Environment

Required for live runs:

```text
OPENAI_API_KEY
FOUNDATION_AGENT_SERVICE_TOKEN
```

Optional:

```text
OPENAI_AGENT_MODEL=gpt-5.6-sol
PORT=8788
```

The OpenAI credential and internal service token must be stored in the deployment platform's secret manager or equivalent environment-secret facility. Never commit either value to GitHub or a browser bundle.

## Local checks

```bash
npm install
npm run smoke
npm start
```

`npm run smoke` validates graph structure and deterministic service-boundary guards without calling a model. Live graph runs use the OpenAI Agents SDK and require `OPENAI_API_KEY`.

## Live semantic evals

```bash
npm run eval
```

The live eval harness exercises the real graph path, allows one bounded revision, and then uses a separate structured grader to judge the result against each case's expected behavior. Current regressions cover conflicting evidence, unsupported funding claims, prompt injection embedded in source material, permanent publication routes, false release/deployment claims, cross-property routing, AI Lab completion gates, and overgeneralization from a single learner.

## Request contract

`POST /v1/run`

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

Use `Authorization: Bearer <FOUNDATION_AGENT_SERVICE_TOKEN>`. Responses remain internal review artifacts until an authorized human approves any downstream action.
