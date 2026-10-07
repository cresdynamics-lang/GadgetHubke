# Customer product reviews

Reviews show on every product page. Shoppers can read existing reviews and post new ones. Posted reviews are stored so the next visitor sees them.

## How it works

1. **Display** – `ProductReviews` loads `GET /api/reviews?productId=…`
2. **Submit** – the form posts to `POST /api/reviews`
3. **Seeds** – starter reviews live in `src/data/product-reviews.json` (edit anytime, commit to ship)
4. **Persistence**
   - **Production:** Upstash Redis (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
   - **Local/dev:** `.data/reviews.json` (gitignored) when Redis is not set

Without Redis on the live host, customers can still *read* seed reviews, but new posts return an error until Redis is connected.

## Populate reviews

### Option A – seed file (owner-written)

Edit `src/data/product-reviews.json`. Keys are product IDs (`iphone-pro`, `macbook-air-13-m4`, …). Redeploy after commit.

### Option B – customers on the site

Open a product page → **Write a review** → Post. With Redis (or local `.data` in dev), it appears for everyone immediately.

### Option C – Upstash (production)

1. Create a free database at [upstash.com](https://upstash.com)
2. Copy REST URL + token into Vercel env (and local `.env`):

```bash
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
```

3. Redeploy

## API

```http
GET  /api/reviews?productId=iphone-pro
POST /api/reviews
Content-Type: application/json

{
  "productId": "iphone-pro",
  "author": "Amina K.",
  "rating": 5,
  "title": "Camera is worth it",
  "body": "Sealed box, serial on the invoice.",
  "city": "Nairobi"
}
```

## Notes

- Auto-approved for now (basic spam: min length, no URLs)
- Stars 1–5, name + body required
- Wired on shop Product Overview pages and all category PDPs (iPhone, Mac, iPad, Watch, AirPods, TV & Home, Accessories)
