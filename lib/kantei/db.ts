import "server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SUPABASE_TIMEOUT_MS = 10_000;

const submissionSchema = z.discriminatedUnion("outcome", [
  z.object({ outcome: z.literal("created"), token: z.string().uuid() }),
  z.object({ outcome: z.literal("duplicate"), token: z.string().uuid() }),
  z.object({ outcome: z.literal("rate_limited"), token: z.null() })
]);

const payPageRowSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("pending"), name: z.string().min(1) }),
  z.object({ status: z.literal("failed"), name: z.string().min(1) }),
  z.object({
    status: z.literal("generated"),
    name: z.string().min(1),
    paid: z.boolean(),
    artifact_ready_at: z.string().nullable(),
    paid_pdf_sent_at: z.string().nullable()
  })
]);

export type KanteiSubmission = z.infer<typeof submissionSchema>;
export type KanteiPayPageState = z.infer<typeof payPageRowSchema>;

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Kantei database configuration is missing.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function submitKantei(input: {
  name: string;
  birthDate: string;
  email: string;
  ipHash: string;
}): Promise<KanteiSubmission> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("kantei_submit", {
    p_name: input.name,
    p_birth_date: input.birthDate,
    p_email: input.email,
    p_ip_hash: input.ipHash
  }).abortSignal(AbortSignal.timeout(SUPABASE_TIMEOUT_MS));

  if (error) {
    throw new Error("Kantei submission failed.");
  }

  const parsed = z.array(submissionSchema).length(1).safeParse(data);
  if (!parsed.success) {
    throw new Error("Kantei submission returned an invalid response.");
  }

  return parsed.data[0];
}

export async function getPayPageState(token: string): Promise<KanteiPayPageState | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("kantei_requests")
    .select("status, paid, name, artifact_ready_at, paid_pdf_sent_at")
    .eq("id", token)
    .abortSignal(AbortSignal.timeout(SUPABASE_TIMEOUT_MS))
    .maybeSingle();

  if (error) {
    throw new Error("Kantei payment lookup failed.");
  }

  if (!data) return null;

  const parsed = payPageRowSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Kantei payment lookup returned an invalid response.");
  }

  return parsed.data;
}
