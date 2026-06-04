const sensitiveMetadataKeys = new Set([
  "api_key",
  "apikey",
  "authorization",
  "content",
  "input",
  "messages",
  "output",
  "prompt",
  "raw_prompt",
  "raw_response",
  "response",
  "secret",
  "token"
]);

export function redactAiAuditMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const redactedFields: string[] = [];
  const redacted = redactValue(metadata, "", redactedFields) as Record<string, unknown>;

  if (redactedFields.length > 0) {
    redacted.redacted_fields = redactedFields;
  }

  return redacted;
}

function redactValue(value: unknown, path: string, redactedFields: string[]): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => redactValue(item, appendPath(path, String(index)), redactedFields));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const safe: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    const nestedPath = appendPath(path, key);

    if (isSensitiveMetadataKey(key)) {
      redactedFields.push(nestedPath);
      continue;
    }

    safe[key] = redactValue(nestedValue, nestedPath, redactedFields);
  }

  return safe;
}

function isSensitiveMetadataKey(key: string) {
  return sensitiveMetadataKeys.has(key.toLowerCase());
}

function appendPath(path: string, key: string) {
  return path ? `${path}.${key}` : key;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
