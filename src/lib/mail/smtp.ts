/**
 * Outgoing email. Resend (HTTPS API) when a Resend key is set — the VPS host
 * blocks SMTP ports — otherwise SMTP via nodemailer.
 * Each stream can use its own Resend key (RESEND_API_KEY_ORDERS / _ACCOUNTS);
 * notifications and anything unlabelled use RESEND_API_KEY.
 */
import nodemailer from "nodemailer";
import { mailFrom, mailReplyTo, resendKey, smtpConfigured, smtpOptions, type MailStream } from "./config";

let transporter: nodemailer.Transporter | null = null;

function getTransport() {
  if (!smtpConfigured()) {
    throw new Error("Email is not configured. Set SMTP_USER and SMTP_PASS.");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport(smtpOptions());
  }
  return transporter;
}

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

async function sendViaResend(input: Parameters<typeof sendMail>[0], key: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      reply_to: mailReplyTo(),
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content.toString("base64"),
      })),
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok) throw new Error(`Resend ${res.status}: ${data.message || res.statusText}`);
  return { messageId: data.id || "" };
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: MailAttachment[];
  stream?: MailStream;
}) {
  const key = resendKey(input.stream);
  if (key) return sendViaResend(input, key);
  const info = await getTransport().sendMail({
    from: mailFrom(),
    replyTo: mailReplyTo(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    attachments: input.attachments,
  });
  return { messageId: info.messageId };
}

export async function trySendMail(
  input: Parameters<typeof sendMail>[0],
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!resendKey(input.stream) && !smtpConfigured()) return { ok: false, error: "Email is not configured." };
  try {
    await sendMail(input);
    return { ok: true };
  } catch (e) {
    console.error("[mail]", e instanceof Error ? e.message : e);
    return { ok: false, error: e instanceof Error ? e.message : "Send failed." };
  }
}
