import type { TraceSpan } from './trace-data';

export function totalEstimatedCost(spans: TraceSpan[]) {
  return spans.reduce((sum, span) => sum + Math.max(0, span.cost), 0);
}

export function formatCost(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 3 }).format(value);
}
