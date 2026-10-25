"""
Fetch Apple store per-colour angle images for iPad, Mac, Watch (composited band + case + face
layers), HomePod and AirPods Max; trim, resize, compress; write public files + manifest.

Re-run: python3 scripts/fetch-store-angles.py  (rewrites src/lib/store-angles.json; older-model and
identical-design entries were added by follow-up passes, so diff before committing).
"""
import io, json, os, re, sys, itertools, urllib.request, concurrent.futures as cf
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = f"{ROOT}/public/Gadget_Hub_Store_Angles"
CDN = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/{}?wid=1600&hei=1600&fmt={}"
MAXW = 1400

def fetch(name, fmt="jpeg"):
    try:
        r = urllib.request.urlopen(CDN.format(name, fmt), timeout=40)
        if not r.headers.get("content-type", "").startswith("image"):
            return None
        return r.read()
    except Exception:
        return None

def slug(c):
    return c.replace("-", "")

def save(img: Image.Image, model, colour, n):
    d = f"{OUT}/{model}"
    os.makedirs(d, exist_ok=True)
    img = img.convert("RGB")
    # trim flat background, then pad 6%
    bg = img.getpixel((0, 0))
    diff = Image.new("RGB", img.size, bg)
    from PIL import ImageChops
    box = ImageChops.difference(img, diff).convert("L").point(lambda p: 255 if p > 12 else 0).getbbox()
    if box:
        img = img.crop(box)
        pad = int(max(img.size) * 0.06)
        canvas = Image.new("RGB", (img.width + 2 * pad, img.height + 2 * pad), bg)
        canvas.paste(img, (pad, pad))
        img = canvas
    if img.width > MAXW:
        img = img.resize((MAXW, round(img.height * MAXW / img.width)), Image.LANCZOS)
    base = f"{d}/{colour}-{n}"
    img.save(base + ".jpg", "JPEG", quality=82, optimize=True, progressive=True)
    img.save(base + ".webp", "WEBP", quality=80, method=6)
    rel = base.replace(f"{ROOT}/public", "")
    return {"src": rel + ".jpg", "srcWebp": rel + ".webp"}

VIEWS = ["", "_AV1", "_AV2", "_AV3"]
LABELS = ["Front", "Back", "Side", "Detail"]

def store_set(model, colour, names):
    """names: candidate base names (first hit wins); returns list of saved views."""
    for base in names:
        first = fetch(base)
        if not first:
            continue
        out = []
        for i, v in enumerate(VIEWS):
            data = first if v == "" else fetch(base + v)
            if not data:
                continue
            item = save(Image.open(io.BytesIO(data)), model, colour, len(out) + 1)
            item["label"] = LABELS[i] if i < len(LABELS) else f"View {i+1}"
            item["source"] = base + v
            out.append(item)
        return out
    return []

jobs = []  # (model, colour, [candidate bases])

# ---- iPad
IPAD = {
    "ipad-pro-11-m5": (["202510", "202405"], "11inch", ["silver", "space-black"], "ipad-pro-finish-select-{d}-{s}-{c}"),
    "ipad-pro-13-m5": (["202510", "202405"], "13inch", ["silver", "space-black"], "ipad-pro-finish-select-{d}-{s}-{c}"),
    "ipad-pro-11-m4": (["202405"], "11inch", ["silver", "space-black"], "ipad-pro-finish-select-{d}-{s}-{c}"),
    "ipad-pro-13-m4": (["202405"], "13inch", ["silver", "space-black"], "ipad-pro-finish-select-{d}-{s}-{c}"),
    "ipad-air-11-m4": (["202603", "202503", "202405"], "11inch", ["blue", "purple", "starlight", "space-gray"], "ipad-air-finish-select-{d}-{s}-{c}"),
    "ipad-air-13-m4": (["202603", "202503", "202405"], "13inch", ["blue", "purple", "starlight", "space-gray"], "ipad-air-finish-select-{d}-{s}-{c}"),
    "ipad-air-11-m3": (["202503", "202405"], "11inch", ["blue", "purple", "starlight", "space-gray"], "ipad-air-finish-select-{d}-{s}-{c}"),
    "ipad-air-13-m3": (["202503", "202405"], "13inch", ["blue", "purple", "starlight", "space-gray"], "ipad-air-finish-select-{d}-{s}-{c}"),
    "ipad-air-11-m2": (["202405"], "11inch", ["blue", "purple", "starlight", "space-gray"], "ipad-air-finish-select-{d}-{s}-{c}"),
    "ipad-air-13-m2": (["202405"], "13inch", ["blue", "purple", "starlight", "space-gray"], "ipad-air-finish-select-{d}-{s}-{c}"),
    "ipad-mini-a17-pro": (["202410"], "", ["blue", "purple", "starlight", "space-gray"], "ipad-mini-finish-select-{d}-{c}"),
    "ipad-a16": (["202503"], "", ["blue", "pink", "yellow", "silver"], "ipad-finish-select-{d}-{c}"),
    "ipad-10": (["202212"], "", ["blue", "pink", "yellow", "silver"], "ipad-10th-gen-finish-select-{d}-{c}"),
}
for m, (dates, size, cols, pat) in IPAD.items():
    for c in cols:
        names = [pat.format(d=d, s=size, c=slug(c)) for d in dates]
        names += [n + "-wifi" for n in names]
        jobs.append((m, c, names))

# ---- Mac (one store photo per colour)
MAC = {
    "macbook-air-13-m5": ("mba13", ["202603", "202601"], ["sky-blue", "silver", "starlight", "midnight"]),
    "macbook-air-15-m5": ("mba15", ["202603", "202601"], ["sky-blue", "silver", "starlight", "midnight"]),
    "macbook-air-13-m4": ("mba13", ["202503"], ["midnight", "starlight", "silver", "sky-blue"]),
    "macbook-air-15-m4": ("mba15", ["202503"], ["midnight", "starlight", "silver", "sky-blue"]),
    "macbook-air-13-m3": ("mba13", ["202402", "202403"], ["midnight", "starlight", "space-gray", "silver"]),
    "macbook-air-15-m3": ("mba15", ["202402", "202403"], ["midnight", "starlight", "space-gray", "silver"]),
    "macbook-air-13-m2": ("mba13", ["202206", "202207"], ["midnight", "starlight", "space-gray", "silver"]),
    "macbook-air-15-m2": ("mba15", ["202306"], ["midnight", "starlight", "space-gray", "silver"]),
    "macbook-pro-14-m5": ("mbp14", ["202510"], ["silver", "space-black"]),
    "macbook-pro-14-m5-pro": ("mbp14", ["202510", "202601"], ["silver", "space-black"]),
    "macbook-pro-16-m5-pro": ("mbp16", ["202510", "202601"], ["silver", "space-black"]),
    "macbook-pro-14-m4": ("mbp14", ["202410"], ["silver", "space-black"]),
    "macbook-pro-14-m4-pro": ("mbp14", ["202410"], ["silver", "space-black"]),
    "macbook-pro-16-m4-pro": ("mbp16", ["202410"], ["silver", "space-black"]),
    "macbook-pro-14-m3": ("mbp14", ["202310"], ["space-gray", "silver"]),
    "macbook-pro-14-m3-pro": ("mbp14", ["202310"], ["space-black", "silver"]),
    "macbook-pro-16-m3-pro": ("mbp16", ["202310"], ["space-black", "silver"]),
    "macbook-pro-14-m2-pro": ("mbp14", ["202301"], ["space-gray", "silver"]),
    "macbook-pro-16-m2-pro": ("mbp16", ["202301"], ["space-gray", "silver"]),
}
for m, (pfx, dates, cols) in MAC.items():
    for c in cols:
        jobs.append((m, c, [f"{pfx}-{slug(c)}-select-{d}" for d in dates] + [f"{pfx}-{slug(c)}-cto-hero-{d}" for d in dates]))

# ---- HomePod / AirPods Max
OTHER = {
    "homepod-2": ["homepod-select-{c}-202610", "homepod-select-{c}-202210"],
    "homepod-mini": ["homepod-mini-select-{c}-202610_FV1", "homepod-mini-select-{c}-202110", "homepod-mini-select-{c}-202010"],
    "airpods-max-2": ["airpods-max-select-{c}-202609", "airpods-max-select-{c}-202409"],
    "airpods-max-usbc": ["airpods-max-select-{c}-202409"],
    "airpods-max-2020": ["airpods-max-select-{c}-202011"],
}
OTHER_COLS = {
    "homepod-2": ["midnight", "white"],
    "homepod-mini": ["midnight", "white", "blue", "orange", "yellow"],
    "airpods-max-2": ["midnight", "blue", "orange", "purple", "starlight"],
    "airpods-max-usbc": ["midnight", "blue", "orange", "purple", "starlight"],
    "airpods-max-2020": ["space-gray", "silver", "sky-blue", "green", "pink"],
}
for m, pats in OTHER.items():
    for c in OTHER_COLS[m]:
        jobs.append((m, c, [p.format(c=slug(c)) for p in pats]))

def run_store(job):
    m, c, names = job
    return m, c, store_set(m, c, names)

# ---- Watch composites (band + case + face), views 34FR and PF
WATCH = {
    "watch-s12-42": ("s12", 42), "watch-s12-46": ("s12", 46),
    "watch-s11-42": ("s11", 42), "watch-s11-46": ("s11", 46),
    "watch-s10-42": ("s10", 42), "watch-s10-46": ("s10", 46),
    "watch-s9-41": ("s9", 41), "watch-s9-45": ("s9", 45),
    "watch-se3-40": ("se3", 40), "watch-se3-44": ("se3", 44),
    "watch-se2-40": ("se", 40), "watch-se2-44": ("se", 44),
    "watch-ultra-4": ("ultra4", 49), "watch-ultra-3": ("ultra3", 49), "watch-ultra-2": ("ultra2", 49),
}
WATCH_COLS = {
    "s12": ["dark-bronze", "light-gold", "black", "space-gray", "radiant-gold", "natural", "pearl-white", "night-blue"],
    "s11": ["jet-black", "rose-gold", "silver", "space-gray", "natural", "gold", "slate"],
    "s10": ["jet-black", "rose-gold", "silver", "natural", "gold", "slate"],
    "s9": ["midnight", "starlight", "silver", "pink", "red", "ss-silver", "ss-gold", "ss-graphite"],
    "se3": ["midnight", "starlight"], "se": ["midnight", "starlight", "silver"],
    "ultra4": ["natural", "black"], "ultra3": ["natural", "black"], "ultra2": ["natural", "black"],
}
MATERIAL = {"radiant-gold": "titanium", "natural": "titanium", "gold": "titanium", "slate": "titanium",
            "pearl-white": "ceramic", "night-blue": "ceramic"}
DARK = {"black", "jet-black", "space-gray", "midnight", "dark-bronze", "night-blue", "slate", "ss-graphite"}

def band_for(code, colour, material):
    if code.startswith("ultra"):
        return "MKAY4" if colour == "black" else "MKAQ4"
    if material in ("titanium", "stainless"):
        return "MK0F4ref" if colour in ("slate", "ss-graphite") else "MK0A4ref"
    return "MY7N3ref" if colour in DARK else "MJUC4ref"

def png(name):
    data = fetch(name, "png-alpha")
    return Image.open(io.BytesIO(data)).convert("RGBA").resize((1600, 1600)) if data else None

def run_watch(item):
    model, code, size, colour = item
    if colour.startswith("ss-"):
        material, c = "stainless", colour[3:]
    else:
        material = "titanium" if code.startswith("ultra") else MATERIAL.get(colour, "aluminum")
        c = slug(colour)
    out = []
    for vi, view in enumerate(["34FR", "PF"]):
        if code.startswith("ultra"):
            cases = [f"watch-case-{size}-{material}-{c}-{code}_VW_{view}"]
            faces = [f"watch-face-{size}-{code}_VW_{view}", f"watch-face-{size}-{material}-{c}-{code}_VW_{view}"]
        else:
            cases = [f"watch-case-{size}-{material}-{c}-nc-{code}_VW_{view}", f"watch-case-{size}-{material}-{c}-cell-{code}_VW_{view}"]
            faces = [f"watch-face-{size}-{material}-{c}-{code}_VW_{view}"]
        case = next((x for x in (png(n) for n in cases) if x is not None), None)
        if case is None:
            continue
        face = next((x for x in (png(n) for n in faces) if x is not None), None)
        band = png(f"{band_for(code, colour, material)}_VW_{view}")
        canvas = Image.new("RGBA", (1600, 1600), (255, 255, 255, 255))
        for layer in (band, case, face):
            if layer is not None:
                canvas = Image.alpha_composite(canvas, layer)
        saved = save(canvas, model, colour, len(out) + 1)
        saved["label"] = "Front" if view == "34FR" else "Profile"
        saved["source"] = f"composite:{band_for(code, colour, material)}+{cases[0]}"
        out.append(saved)
    return model, colour, out

manifest = {}
with cf.ThreadPoolExecutor(8) as ex:
    for m, c, views in ex.map(run_store, jobs):
        if views:
            manifest.setdefault(m, {})[c] = views
    witems = [(m, code, size, col) for m, (code, size) in WATCH.items() for col in WATCH_COLS[code]]
    for m, c, views in ex.map(run_watch, witems):
        if views:
            manifest.setdefault(m, {})[c] = views

json.dump(manifest, open(f"{ROOT}/src/lib/store-angles.json", "w"), indent=1, sort_keys=True)
for m in sorted(manifest):
    print(m, {c: len(v) for c, v in manifest[m].items()})
missing = sorted({j[0] for j in jobs} - set(manifest)) + sorted(set(WATCH) - set(manifest))
print("models with nothing found:", missing)
