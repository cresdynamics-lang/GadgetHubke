/**
 * Product reviews store.
 * - Always merges seed reviews from src/data/product-reviews.json
 * - Persists customer reviews to Upstash Redis when env is set
 * - Falls back to .data/reviews.json in local/dev so reviews survive reloads
 */
import fs from "node:fs";
import path from "node:path";
import seedFile from "../../data/product-reviews.json";
import type { ProductReview, ReviewSummary, ReviewsPayload } from "./types";

const REDIS_KEY = "gh:product-reviews:v1";
const LOCAL_FILE = path.join(process.cwd(), ".data", "reviews.json");

type SeedMap = Record<string, ProductReview[]>;

function seeds(): SeedMap {
  return seedFile as SeedMap;
}

function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisCommand(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash command failed (${res.status})`);
  }
  return (await res.json()) as { result?: unknown };
}

async function redisGetAll(): Promise<ProductReview[]> {
  try {
    const data = await redisCommand(["GET", REDIS_KEY]);
    if (typeof data.result !== "string" || !data.result) return [];
    const parsed = JSON.parse(data.result) as ProductReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function redisSetAll(reviews: ProductReview[]) {
  await redisCommand(["SET", REDIS_KEY, JSON.stringify(reviews)]);
}

function readLocal(): ProductReview[] {
  try {
    if (!fs.existsSync(LOCAL_FILE)) return [];
    const raw = fs.readFileSync(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as ProductReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(reviews: ProductReview[]) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

export function persistenceMode(): ReviewsPayload["persistence"] {
  if (upstashConfigured()) return "upstash";
  // Dev, preview, and non-Vercel hosts can write .data/reviews.json
  if (
    import.meta.env.DEV ||
    process.env.REVIEWS_LOCAL_FILE === "1" ||
    !process.env.VERCEL
  ) {
    return "local";
  }
  return "seed-only";
}

async function loadStored(): Promise<ProductReview[]> {
  if (upstashConfigured()) return redisGetAll();
  if (persistenceMode() === "local") return readLocal();
  return [];
}

async function saveStored(reviews: ProductReview[]) {
  if (upstashConfigured()) {
    await redisSetAll(reviews);
    return;
  }
  if (persistenceMode() === "local") {
    writeLocal(reviews);
    return;
  }
  throw new Error("Review storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
}

function summarize(reviews: ProductReview[]): ReviewSummary {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    count: reviews.length,
    average: Math.round((sum / reviews.length) * 10) / 10,
  };
}

function seedFor(productId: string): ProductReview[] {
  return (seeds()[productId] || []).filter((r) => r.approved);
}

export async function listReviews(productId: string): Promise<ReviewsPayload> {
  const storedAll = await loadStored();
  const hidden = new Set(storedAll.filter((r) => !r.approved).map((r) => r.id));
  const stored = storedAll.filter((r) => r.productId === productId && r.approved);
  const seed = seedFor(productId).filter((r) => !hidden.has(r.id));
  const byId = new Map<string, ProductReview>();
  for (const r of seed) byId.set(r.id, r);
  for (const r of stored) byId.set(r.id, r);
  const reviews = [...byId.values()].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
  return {
    productId,
    summary: summarize(reviews),
    reviews,
    persistence: persistenceMode(),
  };
}

export type NewReviewInput = {
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  city?: string;
};

function cleanText(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function validateReview(input: NewReviewInput): string | null {
  const author = cleanText(input.author || "", 40);
  const title = cleanText(input.title || "", 80);
  const body = cleanText(input.body || "", 800);
  const city = cleanText(input.city || "", 40);
  if (!input.productId || !/^[a-z0-9][a-z0-9-]{1,80}$/i.test(input.productId)) {
    return "Invalid product.";
  }
  if (author.length < 2) return "Please enter your name (at least 2 characters).";
  if (!Number.isFinite(input.rating) || input.rating < 1 || input.rating > 5) {
    return "Choose a rating from 1 to 5 stars.";
  }
  if (body.length < 12) return "Tell us a bit more (at least 12 characters).";
  if (/https?:\/\/|www\./i.test(`${title} ${body}`)) {
    return "Links are not allowed in reviews.";
  }
  void city;
  return null;
}

export async function addReview(input: NewReviewInput): Promise<ProductReview> {
  const err = validateReview(input);
  if (err) throw new Error(err);

  const review: ProductReview = {
    id: `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    productId: input.productId,
    author: cleanText(input.author, 40),
    rating: Math.round(input.rating),
    title: cleanText(input.title || "Customer review", 80) || "Customer review",
    body: cleanText(input.body, 800),
    city: cleanText(input.city || "", 40) || undefined,
    createdAt: new Date().toISOString(),
    approved: true,
  };

  const all = await loadStored();
  all.push(review);
  await saveStored(all);
  return review;
}

/** Admin: all stored + seed reviews (including unapproved). */
export async function listAllReviewsForAdmin(): Promise<ProductReview[]> {
  const stored = await loadStored();
  const seedRows = Object.values(seeds()).flat();
  const byId = new Map<string, ProductReview>();
  for (const r of seedRows) byId.set(r.id, r);
  for (const r of stored) byId.set(r.id, r);
  return [...byId.values()].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function setReviewApproved(id: string, approved: boolean) {
  const all = await loadStored();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], approved };
    await saveStored(all);
    return all[idx];
  }
  // Seed reviews become stored copies when moderated
  const seedHit = Object.values(seeds())
    .flat()
    .find((r) => r.id === id);
  if (!seedHit) throw new Error("Review not found.");
  const copy = { ...seedHit, approved };
  all.push(copy);
  await saveStored(all);
  return copy;
}

export async function deleteReview(id: string) {
  const all = await loadStored();
  const next = all.filter((r) => r.id !== id);
  if (next.length === all.length) {
    // Hiding a seed: store a tombstone as unapproved empty marker via approved=false copy removal
    const seedHit = Object.values(seeds())
      .flat()
      .find((r) => r.id === id);
    if (!seedHit) throw new Error("Review not found.");
    all.push({ ...seedHit, approved: false, body: "[removed by admin]", title: "Removed" });
    await saveStored(all);
    return;
  }
  await saveStored(next);
}
