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

// 本番は本番URL。プレビュー環境ではそのデプロイのURLを使い、検証時にリンクが404にならないようにする。
// 許可するのは自社ドメインとVercelプレビュー(*.vercel.app)だけ＝メールのリンクを第三者ホストへ差し替えられないようにする。
const ALLOWED_RESULT_HOSTS = ["kaiun-calendar.com", "www.kaiun-calendar.com"];
const ALLOWED_RESULT_HOST_SUFFIX = ".vercel.app";

function isAllowedResultOrigin(candidate: string): boolean {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  if (url.username !== "" || url.password !== "") return false;
  if (url.port !== "") return false;
  if (url.pathname !== "/" || url.search !== "" || url.hash !== "") return false;

  const host = url.hostname.toLowerCase();
  if (ALLOWED_RESULT_HOSTS.includes(host)) return true;
  if (!host.endsWith(ALLOWED_RESULT_HOST_SUFFIX)) return false;

  const label = host.slice(0, -ALLOWED_RESULT_HOST_SUFFIX.length);
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/.test(label)
    && !label.startsWith("xn--")
    && !label.includes(".xn--");
}

function resultOrigin(): string {
  const override = process.env.KANTEI_RESULT_ORIGIN?.trim();
  if (override && isAllowedResultOrigin(override)) return new URL(override).origin;

  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    const host = (process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL)?.trim();
    const candidate = host ? `https://${host}` : "";
    if (candidate && isAllowedResultOrigin(candidate)) return new URL(candidate).origin;
  }

  return getSiteUrl();
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
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:0;background-color:#2D2428;font-family:'Shippori Mincho','Hiragino Mincho ProN','Yu Mincho',serif;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background-color:#FDFBF7;border:1px solid #B08A4F;">
            <tr>
              <td style="padding:44px 24px;color:#4A3F3B;text-align:center;">
                <p style="margin:0;color:#8A6A3B;font-size:12px;font-weight:500;letter-spacing:0.12em;line-height:1.8;">SASA MAGDALENA SUPERVISED</p>
                <h1 style="margin:14px 0 0;color:#B08A4F;font-size:28px;font-weight:700;letter-spacing:0.12em;line-height:1.5;">鑑定書</h1>
                <p style="margin:18px 0 0;color:#8A6A3B;font-size:14px;line-height:2;">─ ✦ ─</p>

                <div style="margin:30px auto 0;max-width:520px;text-align:left;">
                  <p style="margin:0;color:#4A3F3B;font-size:18px;font-weight:500;line-height:2;word-break:break-word;">${safeName}様</p>
                  <p style="margin:16px 0 0;color:#4A3F3B;font-size:16px;line-height:2;">${message}</p>
                  <p style="margin:16px 0 0;color:#4A3F3B;font-size:16px;line-height:2;">鑑定書は24時間以内を目安に、順次メールでお届けします。</p>

                  <div style="margin:28px 0;padding:24px 0;border-top:1px solid #D9C08F;border-bottom:1px solid #D9C08F;">
                    <p style="margin:0;color:#B08A4F;font-size:19px;font-weight:700;letter-spacing:0.12em;line-height:1.7;">無料鑑定でお届けするもの</p>
                    <p style="margin:14px 0 0;color:#4A3F3B;font-size:16px;line-height:2;">・あなたが元々持っている強みと、本質のダイジェスト<br />・今のあなたに寄り添う「癒しの言葉」<br />・今年の流れを整えるためのヒント</p>
                  </div>

                  <p style="margin:0;color:#4A3F3B;font-size:16px;line-height:2;">作成状況と完成した無料鑑定は、以下のページからもご確認いただけます。</p>
                  <p style="margin:24px 0 0;text-align:center;">
                    <a href="${safeResultUrl}" style="display:inline-block;padding:13px 24px;background-color:#B08A4F;color:#2D2428;font-size:16px;font-weight:700;line-height:1.5;text-decoration:none;">鑑定の詳細を見る</a>
                  </p>
                  <p style="margin:24px 0 0;color:#4A3F3B;font-size:14px;line-height:2;">メールが見当たらない場合は、迷惑メールフォルダもご確認ください。</p>
                </div>

                <p style="margin:30px 0 0;color:#8A6A3B;font-size:14px;line-height:2;">─ ✦ ─</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

type KanteiEmailInput = {
  name: string;
  email: string;
  token: string;
};

async function sendKanteiEmail(input: KanteiEmailInput & { isDuplicate: boolean; idempotencyKey: string }): Promise<void> {
  const { apiKey, from } = getEmailConfig();
  const resultUrl = `${resultOrigin()}/kantei/result/${input.token}`;
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
