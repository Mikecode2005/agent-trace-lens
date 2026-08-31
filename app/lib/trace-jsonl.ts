import type { TraceSpan } from './trace-data';

export function spansToJsonl(spans: TraceSpan[]) {
  return spans.map((span) => JSON.stringify(span)).join('\n') + (spans.length ? '\n' : '');
}
