import type { APIRoute } from "astro";
import { requireAdmin } from "../../../lib/admin";
import {
  deleteJournalPost,
  getJournalPost,
  listJournalPosts,
  saveJournalPost,
  type JournalStatus,
} from "../../../lib/journal";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, url }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  const slug = url.searchParams.get("slug");
  if (slug) {
    const post = await getJournalPost(slug);
    if (!post) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const posts = await listJournalPosts();
  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }
  const title = String(body.title || "").trim();
  if (!title) {
    return new Response(JSON.stringify({ error: "Title is required." }), { status: 400 });
  }
  const paragraphsRaw = body.paragraphs;
  let paragraphs: string[] = [];
  if (typeof body.body === "string") {
    paragraphs = body.body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  } else if (Array.isArray(paragraphsRaw)) {
    paragraphs = paragraphsRaw.map((p) => String(p));
  }
  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t))
    : String(body.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  try {
    const post = await saveJournalPost({
      id: body.id ? String(body.id) : undefined,
      title,
      slug: body.slug ? String(body.slug) : undefined,
      excerpt: body.excerpt ? String(body.excerpt) : undefined,
      seoTitle: body.seoTitle ? String(body.seoTitle) : undefined,
      seoDescription: body.seoDescription ? String(body.seoDescription) : undefined,
      category: body.category ? String(body.category) : undefined,
      tags,
      author: body.author ? String(body.author) : undefined,
      status: body.status as JournalStatus | undefined,
      date: body.date !== undefined ? String(body.date) : undefined,
      coverAlt: body.coverAlt ? String(body.coverAlt) : undefined,
      paragraphs: paragraphs.length ? paragraphs : undefined,
      needsReview: Boolean(body.needsReview),
    });
    return new Response(JSON.stringify({ ok: true, post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Save failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const denied = await requireAdmin(cookies);
  if (denied) return denied;
  let body: { id?: string };
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), { status: 400 });
  }
  if (!body.id) {
    return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
  }
  await deleteJournalPost(body.id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
