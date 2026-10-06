# Image staging

Drop product photos here before they go live. Prefer owner / press photography you are allowed to use.

## Folders

- `hero/` signature home hero phones
- `iphone/` model galleries (pro, air, 16, duo, …)
- `mac/` `ipad/` `watch/` `airpods/` `accessories/`

## Adding new iPhone photos

1. Drop files into `public/_image-staging/iphone/`
2. Prefer clear names, e.g. `iphone-18-pro-blue-angle.jpg`
3. Run: `npm run images:process`
4. Tell the agent which model / colour each file is for so paths can be wired in `src/lib/images.ts` and PDPs

Processed copies land in `public/product-media/` as JPEG + WebP (macOS `sips`). Staging files are left in place.

Existing pack: `public/Gadget_Hub_Images/` (already wired for home / mega menus).
