import nodemailer from "nodemailer";
import { mailFrom, mailReplyTo, smtpConfigured, smtpOptions } from "./config";

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

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: MailAttachment[];
}) {
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
  if (!smtpConfigured()) return { ok: false, error: "SMTP is not configured." };
  try {
    await sendMail(input);
    return { ok: true };
  } catch (e) {
    console.error("[mail]", e instanceof Error ? e.message : e);
    return { ok: false, error: e instanceof Error ? e.message : "Send failed." };
  }
}
