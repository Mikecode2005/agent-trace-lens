const SENSITIVE_KEYS = /prompt|content|token|secret|authorization|argument/i;

export function redactAttributes(attributes: Record<string, unknown> = {}) {
  return Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, SENSITIVE_KEYS.test(key) ? '[REDACTED]' : value]));
}
