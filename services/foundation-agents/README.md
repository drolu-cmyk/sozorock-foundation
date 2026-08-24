# SozoRock Foundation agent runtime

Internal model-backed workflow service for The SozoRock Foundation parent site and SozoRock AI Lab. It is not public website content and must not be exposed as a visitor-facing feature description.

## Boundaries

- The parent Foundation and AI Lab use separate named graphs and may share one Foundation-level OpenAI project credential.
- The browser never receives `OPENAI_API_KEY`.
- `/v1/run` requires a separate `FOUNDATION_AGENT_SERVICE_TOKEN`.
- Graph results end in `review_required`; this service does not publish, deploy, email, post to social media, alter DOI routes, or release publication files.
- Do not submit patient records, diagnoses, passwords, API keys, authentication tokens, government identifiers, or other regulated/sensitive records to this service.
- Learner workflows should use an opaque learner reference and the minimum evidence needed for the learning task. Do not send unnecessary identifying information.

## Graphs

- `foundationContentRefresh` — source analysis → institute analysis → verification → copy → distribution candidate → evaluation
- `publicationRelease` — source analysis → publication review → verification → copy → distribution candidate → evaluation
- `foundationSiteAssurance` — product → UI/UX → accessibility → security → evaluation
- `aiLabLearnerLoop` — learning plan → coaching → project review → evaluation
- `aiLabProgramImprovement` — program evidence → learning analysis → bounded learning-plan revision → review → evaluation

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

The OpenAI credential must be stored in the deployment platform's secret manager or equivalent environment-secret facility. Never commit it to GitHub or a browser bundle.

## Local checks

```bash
npm install
npm run smoke
npm start
```

`npm run smoke` does not call the model and does not require a key. Live graph runs use the OpenAI Agents SDK and therefore require `OPENAI_API_KEY`.

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

Use `Authorization: Bearer <FOUNDATION_AGENT_SERVICE_TOKEN>`. Responses are non-cacheable and remain internal review artifacts until an authorized human approves a downstream action.
