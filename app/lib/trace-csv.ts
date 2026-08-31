import type { TraceSpan } from './trace-data';

const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export function spansToCsv(spans: TraceSpan[]) {
  const header = ['id','traceId','name','service','kind','status','duration','tokens','cost','detail'].join(',');
  const rows = spans.map((span) => [span.id,span.traceId,span.name,span.service,span.kind,span.status,span.duration,span.tokens,span.cost,span.detail].map(quote).join(','));
  return [header, ...rows].join('\n') + '\n';
}
