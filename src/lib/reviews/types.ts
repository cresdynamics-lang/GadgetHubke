export type ProductReview = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  city?: string;
  createdAt: string;
  approved: boolean;
};

export type ReviewSummary = {
  count: number;
  average: number;
};

export type ReviewsPayload = {
  productId: string;
  summary: ReviewSummary;
  reviews: ProductReview[];
  persistence: "upstash" | "local" | "seed-only";
};
