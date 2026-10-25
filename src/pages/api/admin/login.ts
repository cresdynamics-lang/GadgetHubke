import type { APIRoute } from "astro";
import { loginWithPassword, setAdminSession } from "../../../lib/admin";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { password?: string; email?: string };
  try {
    body = (await request.json()) as { password?: string; email?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }
  try {
    await loginWithPassword(String(body.password || ""), String(body.email || ""));
    await setAdminSession(cookies);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Login failed." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
