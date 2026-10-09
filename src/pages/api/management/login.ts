import type { APIRoute } from "astro";
import { loginWithPassword, setAdminSession } from "../../../lib/admin";

export const prerender = false;

/** PDF sign-in: email + password, then OTP step (stub until owner chooses SMS/app). */
export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { email?: string; password?: string; otp?: string; step?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const otp = String(body.otp || "").replace(/\s/g, "");
  const step = body.step || "password";

  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ error: "Enter a valid staff email." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await loginWithPassword(password);
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Login failed." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (step !== "otp") {
    return new Response(JSON.stringify({ ok: false, needOtp: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return new Response(JSON.stringify({ error: "Enter the 6-digit code.", needOtp: true }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const expected = process.env.MANAGEMENT_OTP_CODE;
  if (expected && otp !== expected) {
    return new Response(JSON.stringify({ error: "Wrong code. Try again.", needOtp: true }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await setAdminSession(cookies);
  return new Response(JSON.stringify({ ok: true, email }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
