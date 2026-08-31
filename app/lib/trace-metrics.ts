import type { TraceSpan } from './trace-data';

export function percentile(values: number[], point: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(point * sorted.length) - 1));
  return sorted[index] ?? 0;
}

export function durationMetrics(spans: TraceSpan[]) {
  const durations = spans.map((span) => span.duration);
  return { count: durations.length, p50: percentile(durations, 0.5), p95: percentile(durations, 0.95), max: Math.max(0, ...durations) };
}
