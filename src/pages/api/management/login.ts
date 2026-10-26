import type { APIRoute } from "astro";
import { loginWithPassword, setAdminSession } from "../../../lib/admin";
import { clientKey, lockedMinutes, recordFailure, recordSuccess } from "../../../lib/admin/throttle";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

/** Staff sign-in: email + password, one step. Locked for 15 minutes after 5 wrong tries. */
export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !email.includes("@")) return json({ error: "Enter a valid staff email." }, 400);

  const key = clientKey(request, clientAddress);
  const wait = lockedMinutes(key);
  if (wait) return json({ error: `Too many wrong tries. Try again in ${wait} minute${wait === 1 ? "" : "s"}.` }, 429);

  try {
    await loginWithPassword(password, email);
  } catch (e) {
    recordFailure(key);
    return json({ error: e instanceof Error ? e.message : "Login failed." }, 401);
  }

  recordSuccess(key);
  await setAdminSession(cookies);
  return json({ ok: true, email });
};
