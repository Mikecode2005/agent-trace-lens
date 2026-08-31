export type FreshnessMode = 'live' | 'sample' | 'cached' | 'delayed';

export type Freshness = { mode: FreshnessMode; capturedAt?: string; generatedAt?: string };

export function freshnessLabel(freshness: Freshness) {
  if (freshness.mode === 'live') return 'Live telemetry';
  if (freshness.mode === 'cached') return freshness.capturedAt ? `Cached · ${freshness.capturedAt}` : 'Cached telemetry';
  if (freshness.mode === 'delayed') return freshness.capturedAt ? `Delayed · captured ${freshness.capturedAt}` : 'Delayed telemetry';
  return 'Sample dataset';
}
