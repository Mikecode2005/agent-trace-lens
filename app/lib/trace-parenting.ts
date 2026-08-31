import type { TraceSpan } from './trace-data';

export function groupByTrace(spans: TraceSpan[]) {
  return spans.reduce<Record<string, TraceSpan[]>>((groups, span) => {
    (groups[span.traceId] ??= []).push(span);
    return groups;
  }, {});
}
