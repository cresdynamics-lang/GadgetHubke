import type { APIRoute } from "astro";
import { requestPasswordReset } from "../../../lib/customers/store";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }
  const email = String(body.email || "").trim();
  if (!email.includes("@")) {
    return new Response(JSON.stringify({ error: "Enter a valid email." }), { status: 400 });
  }
  await requestPasswordReset(email);
  return new Response(
    JSON.stringify({
      ok: true,
      message: "If an account exists for that email, we sent a reset link. Check your inbox and spam folder.",
    }),
    { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
};
