import type { APIRoute } from "astro";

export const prerender = false;

/** Stanbic confirmed they cannot support card integrations at this time. */
export const POST: APIRoute = async () =>
  new Response(
    JSON.stringify({
      error:
        "Card payments are not available. Please pay with M-Pesa. Stanbic is not supporting card integrations at this time.",
    }),
    {
      status: 501,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
