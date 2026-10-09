import type { APIRoute } from "astro";
import { requireAdmin } from "../../../lib/admin";
import {
  deleteReview,
  listAllReviewsForAdmin,
  setReviewApproved,
} from "../../../lib/reviews/store";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  const reviews = await listAllReviewsForAdmin();
  return json({ reviews });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  let body: { id?: string; approved?: boolean; delete?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const id = String(body.id || "");
  if (!id) return json({ error: "id is required." }, 400);
  try {
    if (body.delete) {
      await deleteReview(id);
    } else if (typeof body.approved === "boolean") {
      await setReviewApproved(id, body.approved);
    } else {
      return json({ error: "Provide approved or delete." }, 400);
    }
    return json({ ok: true, reviews: await listAllReviewsForAdmin() });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Update failed." }, 400);
  }
};
