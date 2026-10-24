import type { APIRoute } from "astro";
import { setCustomerSession } from "../../../lib/customers/session";
import { loginCustomer } from "../../../lib/customers/store";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  try {
    const customer = await loginCustomer(String(body.email || ""), String(body.password || ""));
    setCustomerSession(cookies, customer);
    return json({ customer });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Sign in failed." }, 401);
  }
};
