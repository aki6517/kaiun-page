import { createHash } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";
import { submitKantei } from "@/lib/kantei/db";
import { sendKanteiAcceptanceEmail, sendKanteiDuplicateEmail } from "@/lib/kantei/email";
import { kanteiRequestSchema } from "@/lib/kantei/schema";

const MIN_FORM_DISPLAY_MS = 3_000;

export const maxDuration = 30;

type KanteiRequestOutcome =
  | "bot_filtered"
  | "rate_limited"
  | "created"
  | "duplicate"
  | "created_email_failed"
  | "duplicate_email_failed"
  | "request_failed";

type KanteiErrorType = "timeout" | "configuration" | "upstream" | "invalid_response" | "unexpected";

const honeypotSchema = z.object({
  website: z.unknown().optional()
});

const formTimingSchema = z.object({
  formStartedAt: z.coerce.number().finite().optional()
});

function successResponse() {
  return NextResponse.json({ ok: true });
}

function getClientIp(request: Request): string {
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelForwardedFor) return vercelForwardedFor;
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function classifyError(error: unknown): KanteiErrorType {
  if (!(error instanceof Error)) return "unexpected";
  if (error.name === "AbortError" || error.name === "TimeoutError") return "timeout";
  if (error.message.includes("configuration is missing")) return "configuration";
  if (error.message.includes("invalid response")) return "invalid_response";
  if (error.message.includes("failed")) return "upstream";
  return "unexpected";
}

function logKanteiOutcome(outcome: KanteiRequestOutcome, errorType?: KanteiErrorType): void {
  const entry = JSON.stringify({ event: "kantei_request", outcome, ...(errorType ? { errorType } : {}) });
  if (errorType) {
    console.error(entry);
    return;
  }
  console.info(entry);
}

function hashIp(ipAddress: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error("Kantei IP hashing configuration is missing.");
  }

  return createHash("sha256").update(`${ipAddress}${salt}`).digest("hex");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "入力内容を確認してください" }, { status: 400 });
  }

  const honeypot = honeypotSchema.safeParse(body);
  const honeypotValue = honeypot.success ? honeypot.data.website : undefined;
  const isHoneypotFilled = honeypotValue !== undefined && honeypotValue !== null && String(honeypotValue).trim() !== "";
  if (isHoneypotFilled) {
    logKanteiOutcome("bot_filtered");
    return successResponse();
  }

  const formTiming = formTimingSchema.safeParse(body);
  if (formTiming.success) {
    const elapsedMs = formTiming.data.formStartedAt ? Date.now() - formTiming.data.formStartedAt : null;
    if (elapsedMs !== null && elapsedMs < MIN_FORM_DISPLAY_MS) {
      logKanteiOutcome("bot_filtered");
      return successResponse();
    }
  }

  const parsed = kanteiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "入力内容を確認してください" }, { status: 400 });
  }

  try {
    // Phase 1 treats an accepted row as the consent record because this schema requires consent=true; consented_at is deferred to Phase 2.
    const submission = await submitKantei({
      name: parsed.data.name,
      birthDate: parsed.data.birthDate,
      email: parsed.data.email,
      ipHash: hashIp(getClientIp(request))
    });

    if (submission.outcome === "rate_limited") {
      logKanteiOutcome("rate_limited");
      return successResponse();
    }

    const sendEmail = submission.outcome === "duplicate" ? sendKanteiDuplicateEmail : sendKanteiAcceptanceEmail;
    try {
      await sendEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        token: submission.token
      });
    } catch (error) {
      // The database acceptance completes the funnel; the worker sends the finished reading later even if this receipt email fails.
      const outcome = submission.outcome === "duplicate" ? "duplicate_email_failed" : "created_email_failed";
      logKanteiOutcome(outcome, classifyError(error));
      return successResponse();
    }

    logKanteiOutcome(submission.outcome);
    return successResponse();
  } catch (error) {
    logKanteiOutcome("request_failed", classifyError(error));
    return NextResponse.json(
      { ok: false, message: "送信できませんでした。時間をおいてもう一度お試しください" },
      { status: 500 }
    );
  }
}
