import type { TraceSpan } from './trace-data';

export function searchText(span: TraceSpan) {
  return [span.id, span.traceId, span.name, span.service, span.kind, span.status, span.detail].join(' ').toLowerCase();
}

export function matchesQuery(span: TraceSpan, query: string) {
  const normalized = query.trim().toLowerCase();
  return !normalized || searchText(span).includes(normalized);
}
