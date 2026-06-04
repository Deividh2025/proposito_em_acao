const TOKEN_LIKE_SEGMENT = /([/?#&=])([A-Za-z0-9_-]{24,})(?=[$/?#&]|$)/g;
const INVITE_PATH_TOKEN = /(\/accountability\/partner\/)([^/?#\s]+)/g;
const WEBHOOK_SECRET_PATTERN = /\bwhsec_[A-Za-z0-9+/=_-]+\b/g;
const RESEND_KEY_PATTERN = /\bre_[A-Za-z0-9_-]+\b/g;

export function redactEmailOperationalText(value: string) {
  return value
    .replace(INVITE_PATH_TOKEN, "$1[redacted]")
    .replace(TOKEN_LIKE_SEGMENT, "$1[redacted]")
    .replace(WEBHOOK_SECRET_PATTERN, "[redacted-webhook-secret]")
    .replace(RESEND_KEY_PATTERN, "[redacted-resend-key]");
}

export function sanitizeEmailErrorCategory(status: number) {
  if (status === 401 || status === 403) {
    return "provider_auth_failed";
  }

  if (status === 429) {
    return "provider_rate_limited";
  }

  if (status >= 500) {
    return "provider_unavailable";
  }

  return "provider_rejected_request";
}
