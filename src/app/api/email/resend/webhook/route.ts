import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerEnv } from "@/lib/config/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const resendWebhookPayloadSchema = z
  .object({
    created_at: z.string().optional(),
    data: z
      .object({
        email_id: z.string().optional(),
        id: z.string().optional(),
        tags: z
          .array(
            z.object({
              name: z.string(),
              value: z.string()
            })
          )
          .optional()
      })
      .passthrough(),
    type: z.string().min(1)
  })
  .passthrough();

type ResendWebhookPayload = z.infer<typeof resendWebhookPayloadSchema>;

function decodeSvixSecret(secret: string) {
  if (secret.startsWith("whsec_")) {
    return Buffer.from(secret.slice("whsec_".length), "base64");
  }

  return Buffer.from(secret, "utf8");
}

function secureCompareBase64(expected: string, candidate: string) {
  const expectedBuffer = Buffer.from(expected);
  const candidateBuffer = Buffer.from(candidate);

  return expectedBuffer.length === candidateBuffer.length && timingSafeEqual(expectedBuffer, candidateBuffer);
}

export function verifyResendWebhookSignature(input: {
  payload: string;
  secret: string;
  signature: string | null;
  timestamp: string | null;
  svixId: string | null;
}) {
  if (!input.secret || !input.signature || !input.timestamp || !input.svixId) {
    return false;
  }

  const timestamp = Number(input.timestamp);

  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 60 * 5) {
    return false;
  }

  const signedPayload = `${input.svixId}.${input.timestamp}.${input.payload}`;
  const expected = createHmac("sha256", decodeSvixSecret(input.secret)).update(signedPayload).digest("base64");
  const candidates = input.signature
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split(","))
    .filter(([version, signature]) => version === "v1" && Boolean(signature))
    .map(([, signature]) => signature);

  return candidates.some((candidate) => secureCompareBase64(expected, candidate));
}

function tagValue(payload: ResendWebhookPayload, name: string) {
  return payload.data.tags?.find((tag) => tag.name === name)?.value;
}

function normalizeDeliveryPatch(payload: ResendWebhookPayload, svixId: string | null) {
  const eventType = payload.type;
  const providerMessageId = payload.data.email_id ?? payload.data.id ?? null;
  const eventRecordedAt = new Date().toISOString();
  const basePayload = {
    delivery_event: eventType,
    event_recorded_at: eventRecordedAt,
    provider: "resend",
    provider_message_id: providerMessageId,
    webhook_event_id: svixId
  };

  if (eventType === "email.delivered" || eventType === "delivered") {
    return {
      blocked_reason: null,
      provider_status: "sent",
      sent_at: eventRecordedAt,
      sent_payload_redacted: basePayload,
      status: "sent"
    };
  }

  if (eventType === "email.sent" || eventType === "sent") {
    return {
      blocked_reason: null,
      provider_status: "queued",
      sent_payload_redacted: basePayload,
      status: "queued"
    };
  }

  if (eventType === "email.cancelled" || eventType === "cancelled") {
    return {
      blocked_reason: "resend_cancelled",
      provider_status: "cancelled",
      sent_payload_redacted: basePayload,
      status: "cancelled"
    };
  }

  if (
    eventType === "email.bounced" ||
    eventType === "bounced" ||
    eventType === "email.complained" ||
    eventType === "complained" ||
    eventType === "email.delivery_failed" ||
    eventType === "delivery_failed"
  ) {
    return {
      blocked_reason: `resend_${eventType.replace(/^email\./, "")}`,
      provider_status: "blocked",
      sent_payload_redacted: basePayload,
      status: "blocked"
    };
  }

  return null;
}

export async function POST(request: Request) {
  const env = getServerEnv();
  const payloadText = await request.text();

  if (!env.RESEND_WEBHOOK_SECRET?.trim()) {
    return NextResponse.json(
      { ok: false, error: env.APP_RUNTIME_MODE === "local-demo" ? "webhook-secret-missing" : "webhook-disabled" },
      { status: env.APP_RUNTIME_MODE === "local-demo" ? 400 : 503 }
    );
  }

  const svixId = request.headers.get("svix-id");
  const validSignature = verifyResendWebhookSignature({
    payload: payloadText,
    secret: env.RESEND_WEBHOOK_SECRET,
    signature: request.headers.get("svix-signature"),
    svixId,
    timestamp: request.headers.get("svix-timestamp")
  });

  if (!validSignature) {
    return NextResponse.json({ ok: false, error: "invalid-signature" }, { status: 400 });
  }

  let parsedPayload: unknown;

  try {
    parsedPayload = JSON.parse(payloadText);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const payload = resendWebhookPayloadSchema.safeParse(parsedPayload);

  if (!payload.success) {
    return NextResponse.json({ ok: false, error: "invalid-payload" }, { status: 400 });
  }

  const notificationId = tagValue(payload.data, "notification_id");
  const patch = normalizeDeliveryPatch(payload.data, svixId);

  if (!notificationId || !patch) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("accountability_notifications")
    .update(patch)
    .eq("id", notificationId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: "status-update-failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, updated: Boolean(data?.id) });
}
