import type { SpanKind, SpanStatus, TraceSpan } from './trace-data';

export type RawSpan = Partial<TraceSpan> & { attributes?: Record<string, unknown> };

export function normalizeSpan(raw: RawSpan, index = 0): TraceSpan {
  return {
    id: raw.id ?? `span_${index + 1}`,
    traceId: raw.traceId ?? 'unknown-trace',
    name: raw.name ?? 'unnamed-span',
    service: raw.service ?? 'unknown-service',
    kind: (raw.kind ?? 'agent') as SpanKind,
    status: (raw.status ?? 'running') as SpanStatus,
    duration: Math.max(0, Number(raw.duration ?? 0)),
    start: raw.start ?? new Date(0).toISOString(),
    tokens: Math.max(0, Number(raw.tokens ?? 0)),
    cost: Math.max(0, Number(raw.cost ?? 0)),
    detail: raw.detail ?? 'No detail available',
  };
}
