import "server-only";

import { getSiteUrl } from "@/lib/site";

const RESEND_TIMEOUT_MS = 10_000;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    return entities[character];
  });
}

function getEmailConfig(): { apiKey: string; from: string } {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.KANTEI_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Kantei email configuration is missing.");
  }

  return { apiKey, from };
}

function createAcceptanceEmailHtml(name: string, resultUrl: string, isDuplicate: boolean): string {
  const safeName = escapeHtml(name);
  const safeResultUrl = escapeHtml(resultUrl);
  const message = isDuplicate
    ? "このメールアドレスでは、すでに無料AI鑑定のお申し込みを受け付けています。"
    : "無料AI鑑定へお申し込みいただき、ありがとうございます。";

  return `
    <p>${safeName}様</p>
    <p>${message}</p>
    <p>鑑定書は24時間以内を目安に、順次メールでお届けします。作成状況と完成した無料鑑定は、以下のページからもご確認いただけます。</p>
    <p><a href="${safeResultUrl}">鑑定結果ページを開く</a></p>
    <p>メールが見当たらない場合は、迷惑メールフォルダもご確認ください。</p>
    <hr />
    <p>本鑑定はAI鑑定システムが生成しています（紗々・マグダレナ監修）</p>
  `;
}

type KanteiEmailInput = {
  name: string;
  email: string;
  token: string;
};

async function sendKanteiEmail(input: KanteiEmailInput & { isDuplicate: boolean; idempotencyKey: string }): Promise<void> {
  const { apiKey, from } = getEmailConfig();
  const resultUrl = `${getSiteUrl()}/kantei/result/${input.token}`;
  const subject = input.isDuplicate ? "無料AI鑑定のお申し込みを受け付けています" : "無料AI鑑定を受け付けました";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject,
      html: createAcceptanceEmailHtml(input.name, resultUrl, input.isDuplicate)
    }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error("Kantei acceptance email failed.");
  }
}

export async function sendKanteiAcceptanceEmail(input: KanteiEmailInput): Promise<void> {
  return sendKanteiEmail({
    ...input,
    isDuplicate: false,
    idempotencyKey: `kantei-accept-${input.token}`
  });
}

export async function sendKanteiDuplicateEmail(input: KanteiEmailInput): Promise<void> {
  return sendKanteiEmail({
    ...input,
    isDuplicate: true,
    idempotencyKey: `kantei-duplicate-${input.token}-${new Date().toISOString().slice(0, 13).replace(/[-T]/g, "")}`
  });
}
