export type SpanStatus = "ok" | "error" | "running";
export type SpanKind = "agent" | "model" | "tool" | "retrieval";

export type TraceSpan = {
  id: string;
  traceId: string;
  parentId?: string;
  name: string;
  service: string;
  kind: SpanKind;
  status: SpanStatus;
  duration: number;
  start: string;
  tokens: number;
  cost: number;
  detail: string;
};

/** Synthetic fixture data for the UI until an OTLP source is connected. */
export const sampleSpans: TraceSpan[] = [
  { id: "sp_01", traceId: "tr_7f91", name: "customer_support_agent", service: "support-agent", kind: "agent", status: "ok", duration: 1840, start: "09:42:18.104", tokens: 2840, cost: 0.018, detail: "Classified request and selected search_documents" },
  { id: "sp_02", traceId: "tr_7f91", name: "search_documents", service: "mcp-server", kind: "tool", status: "ok", duration: 312, start: "09:42:19.021", tokens: 0, cost: 0, detail: "Returned 4 matching knowledge-base documents" },
  { id: "sp_03", traceId: "tr_b8c2", name: "invoice_reconciliation", service: "finance-agent", kind: "agent", status: "error", duration: 2680, start: "09:41:52.840", tokens: 4210, cost: 0.027, detail: "Tool timeout after 3 retries" },
  { id: "sp_04", traceId: "tr_b8c2", name: "fetch_invoice", service: "erp-mcp", kind: "tool", status: "error", duration: 2510, start: "09:41:53.010", tokens: 0, cost: 0, detail: "Upstream response exceeded 2s timeout" },
  { id: "sp_05", traceId: "tr_4a11", name: "release_notes_writer", service: "docs-agent", kind: "agent", status: "ok", duration: 940, start: "09:40:41.220", tokens: 1760, cost: 0.011, detail: "Drafted release summary from 12 commits" },
  { id: "sp_06", traceId: "tr_4a11", name: "get_commits", service: "github-mcp", kind: "tool", status: "ok", duration: 144, start: "09:40:41.401", tokens: 0, cost: 0, detail: "Read 12 commits from the default branch" },
  { id: "sp_07", traceId: "tr_229d", name: "onboarding_copilot", service: "onboarding-agent", kind: "agent", status: "running", duration: 2210, start: "09:39:10.771", tokens: 3290, cost: 0.021, detail: "Waiting for create_workspace confirmation" },
  { id: "sp_08", traceId: "tr_229d", name: "lookup_workspace", service: "workspace-mcp", kind: "tool", status: "ok", duration: 186, start: "09:39:11.022", tokens: 0, cost: 0, detail: "Found workspace configuration" },
];

export const durationSeries = [
  { time: "09:35", p50: 620, p95: 1610 }, { time: "09:36", p50: 710, p95: 1890 },
  { time: "09:37", p50: 580, p95: 1420 }, { time: "09:38", p50: 860, p95: 2240 },
  { time: "09:39", p50: 740, p95: 2110 }, { time: "09:40", p50: 680, p95: 1760 },
  { time: "09:41", p50: 920, p95: 2680 }, { time: "09:42", p50: 650, p95: 1840 },
];

export function filterSpans(spans: TraceSpan[], options: { query?: string; status?: string; service?: string }) {
  const query = (options.query ?? "").trim().toLowerCase();
  const status = options.status ?? "all";
  const service = options.service ?? "all";
  return spans.filter((span) => {
    const matchesQuery = !query || [span.name, span.service, span.detail, span.traceId].join(" ").toLowerCase().includes(query);
    const matchesStatus = status === "all" || span.status === status;
    const matchesService = service === "all" || span.service === service;
    return matchesQuery && matchesStatus && matchesService;
  });
}

export function summarizeSpans(spans: TraceSpan[]) {
  const errors = spans.filter((span) => span.status === "error").length;
  const tokens = spans.reduce((sum, span) => sum + span.tokens, 0);
  const cost = spans.reduce((sum, span) => sum + span.cost, 0);
  const longest = spans.reduce<TraceSpan | undefined>((current, span) => !current || span.duration > current.duration ? span : current, undefined);
  return { count: spans.length, errors, tokens, cost, longest };
}
