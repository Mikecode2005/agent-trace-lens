export function isTraceId(value: string) {
  return /^[A-Za-z0-9_-]{3,128}$/.test(value);
}

export function safeTraceId(value: string | null | undefined) {
  return value && isTraceId(value) ? value : null;
}
