/**
 * GET  /api/reviews?productId=iphone-pro
 * POST /api/reviews  { productId, author, rating, title?, body, city? }
 */
import type { APIRoute } from "astro";
import { addReview, listReviews, validateReview } from "../../lib/reviews";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const productId = url.searchParams.get("productId")?.trim() || "";
  if (!productId) return json({ error: "productId is required." }, 400);
  try {
    const payload = await listReviews(productId);
    return json(payload);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Could not load reviews." }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const input = {
    productId: String(body.productId || ""),
    author: String(body.author || ""),
    rating: Number(body.rating),
    title: String(body.title || ""),
    body: String(body.body || ""),
    city: body.city != null ? String(body.city) : undefined,
  };

  const validation = validateReview(input);
  if (validation) return json({ error: validation }, 400);

  try {
    const review = await addReview(input);
    const payload = await listReviews(input.productId);
    return json({ ok: true, review, ...payload }, 201);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save review.";
    const status = /not configured/i.test(message) ? 503 : 400;
    return json({ error: message }, status);
  }
};
