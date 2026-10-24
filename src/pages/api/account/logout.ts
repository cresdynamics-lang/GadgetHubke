import type { APIRoute } from "astro";
import { clearCustomerSession } from "../../../lib/customers/session";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  clearCustomerSession(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
