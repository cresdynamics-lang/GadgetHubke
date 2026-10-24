import type { APIRoute } from "astro";
import { setCustomerSession } from "../../../lib/customers/session";
import { registerCustomer } from "../../../lib/customers/store";

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
    const customer = await registerCustomer({
      name: String(body.name || ""),
      email: String(body.email || ""),
      phone: String(body.phone || ""),
      password: String(body.password || ""),
    });
    setCustomerSession(cookies, customer);
    return json({ customer }, 201);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not create account." }, 400);
  }
};
