import crypto from "crypto";
import { normalizePhone } from "@/lib/subscription";

function solapiAuthHeader(): { Authorization: string; Date: string } | null {
  const apiKey = process.env.SOLAPI_API_KEY?.trim();
  const apiSecret = process.env.SOLAPI_API_SECRET?.trim();
  if (!apiKey || !apiSecret) return null;

  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const signature = crypto.createHmac("sha256", apiSecret).update(date + salt).digest("hex");

  return {
    Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
    Date: date,
  };
}

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.SOLAPI_API_KEY?.trim() &&
      process.env.SOLAPI_API_SECRET?.trim() &&
      process.env.SOLAPI_SENDER_PHONE?.trim(),
  );
}

export function isKakaoEnabled(): boolean {
  return (
    process.env.NOTIFY_KAKAO_ENABLED === "true" &&
    Boolean(process.env.SOLAPI_KAKAO_PF_ID?.trim()) &&
    isSmsConfigured()
  );
}

type SolapiResult = { ok: true } | { ok: false; error: string };

async function postSolapi(message: Record<string, unknown>): Promise<SolapiResult> {
  const auth = solapiAuthHeader();
  const from = process.env.SOLAPI_SENDER_PHONE?.trim();
  if (!auth || !from) {
    return { ok: false, error: "Solapi 환경변수가 설정되지 않았습니다." };
  }

  try {
    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        Authorization: auth.Authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          from: normalizePhone(from),
          ...message,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `Solapi ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Solapi 요청 실패" };
  }
}

function solapiMessageType(text: string): "SMS" | "LMS" {
  // 한글 기준 90자 초과 시 LMS (grapheme/code point)
  return [...text].length > 90 ? "LMS" : "SMS";
}

export async function sendSms(to: string, text: string): Promise<SolapiResult> {
  return postSolapi({
    to: normalizePhone(to),
    text,
    type: solapiMessageType(text),
  });
}

export async function sendKakaoAlimtalk(options: {
  to: string;
  templateId: string;
  variables: Record<string, string>;
  /** 대체 문자 (알림톡 실패 시) */
  text?: string;
}): Promise<SolapiResult> {
  if (!isKakaoEnabled()) {
    return { ok: false, error: "카카오 알림톡이 비활성화되어 있습니다." };
  }

  const pfId = process.env.SOLAPI_KAKAO_PF_ID!.trim();

  return postSolapi({
    to: normalizePhone(options.to),
    kakaoOptions: {
      pfId,
      templateId: options.templateId,
      variables: options.variables,
    },
    ...(options.text ? { text: options.text } : {}),
  });
}
