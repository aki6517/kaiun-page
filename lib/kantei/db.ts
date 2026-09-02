import "server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SUPABASE_TIMEOUT_MS = 10_000;

const submissionSchema = z.discriminatedUnion("outcome", [
  z.object({ outcome: z.literal("created"), token: z.string().uuid() }),
  z.object({ outcome: z.literal("duplicate"), token: z.string().uuid() }),
  z.object({ outcome: z.literal("rate_limited"), token: z.null() })
]);

const freeResultSchema = z.object({
  essence: z.string().min(1),
  healing_word: z.object({
    phrase: z.string().min(1),
    body: z.string().min(1)
  }),
  this_year_digest: z.string().min(1)
});

const resultRowSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("pending"), paid: z.boolean(), free: freeResultSchema.nullable().optional() }),
  z.object({ status: z.literal("failed"), paid: z.boolean(), free: freeResultSchema.nullable().optional() }),
  z.object({ status: z.literal("generated"), paid: z.boolean(), free: freeResultSchema })
]);

export type KanteiSubmission = z.infer<typeof submissionSchema>;
export type KanteiFreeResult = z.infer<typeof freeResultSchema>;
export type KanteiResultForPage =
  | { status: "pending"; paid: boolean; free: KanteiFreeResult | null }
  | { status: "failed"; paid: boolean; free: KanteiFreeResult | null }
  | { status: "generated"; paid: boolean; free: KanteiFreeResult };

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

export async function getResultForPage(token: string): Promise<KanteiResultForPage | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("kantei_requests")
    .select("status, paid, free:result->free")
    .eq("id", token)
    .abortSignal(AbortSignal.timeout(SUPABASE_TIMEOUT_MS))
    .maybeSingle();

  if (error) {
    throw new Error("Kantei result lookup failed.");
  }

  if (!data) return null;

  const parsed = resultRowSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Kantei result returned an invalid response.");
  }

  if (parsed.data.status === "generated") return parsed.data;

  return {
    status: parsed.data.status,
    paid: parsed.data.paid,
    free: parsed.data.free ?? null
  };
}
