# agent-trace-lens

> See what your AI agents actually did.

[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-ready-425cc7)](https://opentelemetry.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**agent-trace-lens** is a local-first observability dashboard for AI-agent and MCP workflows. It helps developers follow the handoff from model call to tool result, then identify the latency, token usage, and failure that changed the outcome.

The first release is a focused dashboard experience with clearly labeled synthetic data. The ingestion boundary is designed for OpenTelemetry traces, but this repository does not pretend to contain live telemetry until a source is connected.

## Why this exists

Traditional application logs tell you that a request failed. Agent systems need more context: which model call made the decision, which tool was selected, how long the tool waited, whether a retry changed the result, and how many tokens were spent along the way.

Trace Lens is designed around that investigation loop:

1. Find the trace or span that looks unusual.
2. See the agent/tool boundary and duration outlier.
3. Read a compact human explanation of the likely signal.
4. Drill into raw attributes when the real ingestion adapter is enabled.

## Current experience

- KPI cards for trace volume, error rate, p95 duration, and tokens observed.
- Latency chart with p50 and p95 lines.
- Human-readable lens summary for the current outlier.
- Filterable span table by search, service, and status.
- Explicit sample mode labeling and freshness metadata.
- Responsive UI built with React Router, Tailwind, shadcn-style primitives, and Recharts.

## Quick start

```bash
bun install
bun run dev
```

Then open the local URL printed by React Router.

To validate a production build:

```bash
bun run typecheck
bun run build
```

## Data contract

The dashboard is shaped around a normalized span record:

```ts
type TraceSpan = {
  id: string;
  traceId: string;
  parentId?: string;
  name: string;
  service: string;
  kind: "agent" | "model" | "tool" | "retrieval";
  status: "ok" | "error" | "running";
  start: string;
  duration: number;
  tokens?: number;
  cost?: number;
  attributes?: Record<string, unknown>;
};
```

The planned ingestion adapter will map OpenTelemetry spans into this shape. The UI should continue to distinguish `live`, `sample`, `cached`, and `delayed` data instead of silently substituting one for another.

## Planned ingestion path

1. Receive OTLP spans through a local collector or documented adapter.
2. Normalize model, agent, and MCP tool attributes.
3. Store short-lived local trace data with explicit retention controls.
4. Aggregate duration, errors, retries, token usage, and estimated cost.
5. Render the same dashboard with a `live` or `delayed` freshness label.

No credentials, prompts, or trace payloads are uploaded by the current dashboard.

## Design principles

- **Local-first:** debugging data can contain sensitive prompts and customer context.
- **Explainable:** aggregate metrics should always link back to spans.
- **Honest freshness:** synthetic data is labeled as sample data.
- **Small surface area:** add dependencies only when they improve telemetry correctness.
- **Failure visibility:** ingestion errors should remain visible instead of becoming an empty dashboard.

## Roadmap

- [ ] Add an OTLP HTTP ingestion endpoint.
- [ ] Normalize common OpenTelemetry GenAI semantic conventions.
- [ ] Add trace detail and parent/child span views.
- [ ] Add retry and tool-timeout analysis.
- [ ] Add local retention and redaction policies.
- [ ] Add export to JSONL and standalone HTML reports.
- [ ] Add deterministic fixtures for model/tool traces.

## Contributing

Issues and pull requests are welcome. Keep sample data synthetic, add tests for aggregation or normalization logic, and document the freshness mode of any new data source.

## License

MIT. See [LICENSE](LICENSE).
