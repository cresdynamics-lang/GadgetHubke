import type { APIRoute } from "astro";
import { loginWithPassword, setAdminSession } from "../../../lib/admin";
import { clientKey, lockedMinutes, recordFailure, recordSuccess } from "../../../lib/admin/throttle";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  let body: { password?: string; email?: string };
  try {
    body = (await request.json()) as { password?: string; email?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }
  const key = clientKey(request, clientAddress);
  const wait = lockedMinutes(key);
  if (wait) {
    return new Response(JSON.stringify({ error: `Too many wrong tries. Try again in ${wait} minute${wait === 1 ? "" : "s"}.` }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    await loginWithPassword(String(body.password || ""), String(body.email || ""));
    recordSuccess(key);
    await setAdminSession(cookies);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    recordFailure(key);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Login failed." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
