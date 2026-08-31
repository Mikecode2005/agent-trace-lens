export type RetentionPolicy = { maxSpans: number; maxAgeHours: number };

export function shouldRetain(spanStart: string, policy: RetentionPolicy, now = Date.now()) {
  const age = now - Date.parse(spanStart);
  return Number.isFinite(age) && age <= policy.maxAgeHours * 60 * 60 * 1000;
}
