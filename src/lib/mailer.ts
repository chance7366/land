import nodemailer from "nodemailer";

const DEFAULT_FROM_NAME = "찬스부동산";

function getMailer() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim());
}

/** 환경변수 한글이 깨진 경우 기본 표시명으로 복구 */
function resolveFromName(): string {
  const raw = process.env.MAIL_FROM_NAME?.trim();
  if (!raw) return DEFAULT_FROM_NAME;
  // 한글 음절이 하나라도 있으면 사용, 아니면 깨진 값으로 보고 기본값
  if (/[\uAC00-\uD7A3]/.test(raw)) return raw;
  return DEFAULT_FROM_NAME;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const transport = getMailer();
  if (!transport) {
    return { ok: false, error: "Gmail 환경변수가 설정되지 않았습니다." };
  }

  const fromUser = process.env.GMAIL_USER!.trim();
  const fromName = resolveFromName();
  const replyTo = process.env.MAIL_REPLY_TO?.trim() || fromUser;

  try {
    await transport.sendMail({
      // 객체 형식으로 넘겨 MIME 인코딩(한글 From 이름) 보장
      from: { name: fromName, address: fromUser },
      to: options.to,
      replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "메일 발송 실패";
    return { ok: false, error: message };
  }
}
