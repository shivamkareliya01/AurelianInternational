#!/usr/bin/env python3
"""
Aurelian International - generate real, consistent product photos for ALL non-powder categories
(Agriculture, Fresh Vegetables, Fresh Fruits, Spices, Natural Stones & Tiles, Dry Fruits & Nuts).

Uses Google's Gemini image model through the Gemini API when GEMINI_API_KEY is available,
with high-resolution photorealistic fallback via Pollinations AI if key is absent or rate-limited.
"""
import argparse, base64, io, json, os, sys, time, urllib.parse, urllib.request, random

try:
    import requests
    from PIL import Image, ImageStat, ImageEnhance
except ImportError:
    sys.exit("Please run:  pip install requests pillow")

DEFAULT_MODEL = "gemini-2.5-flash-image"
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

COMMON = (
    "Photorealistic real photograph (not an illustration, not a 3D render, not CGI), professional commercial "
    "product photography, premium export catalog style, soft natural daylight from the upper left, gentle soft "
    "shadows, razor-sharp focus across the whole subject, rich true natural colors, the product fills about "
    "65% of the frame and is centered, clean uncluttered background, no dark vignette, no dark corners, "
    "4:3 landscape, no text, no logos, no people, no hands, no packaging, no labels, no watermark. "
    "Show ONLY this product: no other food items in the frame."
)

CATEGORY = {
    "agriculture": (
        "a natural wooden bowl overflowing with {subject}, a small wooden scoop resting in it, a little loose "
        "grain scattered on the surface, on a warm cream linen cloth over a pale oak table, 3/4 high angle"),
    "vegetables": (
        "{subject}, fresh, crisp and glossy with a few water droplets, whole pieces plus one cut piece showing "
        "the inside, arranged naturally on a pale light-oak board with a clean warm-cream background, 3/4 high angle"),
    "fruits": (
        "{subject}, ripe, juicy and glossy, whole fruit plus one cut piece showing the inside, arranged "
        "naturally on a clean warm-cream marble surface with a soft bright background, 3/4 high angle"),
    "spices": (
        "{subject} in a small rustic ceramic bowl with a wooden spoon, a small heap of the whole spice scattered "
        "on the surface in front, on a warm cream stone surface, 3/4 high angle, crisp detail on every piece"),
    "stones": (
        "{subject}, shot as a premium architectural material sample: a stack of polished tiles or slab samples "
        "with one tile angled to show the surface pattern, veining and edge thickness, in a clean bright white "
        "studio with a soft reflection on a light concrete floor, no interior room, no furniture, no house"),
    "dryfruits": (
        "{subject} heaped in a small wooden bowl with a few pieces scattered in front, on a warm cream marble "
        "surface, 3/4 high angle, crisp detail on every piece"),
}


def build_prompt(p):
    cat = p["category"]
    if cat not in CATEGORY:
        raise SystemExit(f"Unknown category '{cat}' for {p['slug']} (use: {', '.join(CATEGORY)})")
    subject = p.get("subject") or p["name"]
    return CATEGORY[cat].format(subject=subject) + ". " + COMMON


def call_gemini(api_key, model, prompt, retries=4):
    url = ENDPOINT.format(model=model)
    headers = {"x-goog-api-key": api_key, "Content-Type": "application/json"}
    bodies = [
        {"contents": [{"parts": [{"text": prompt}]}],
         "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "4:3"}}},
        {"contents": [{"parts": [{"text": prompt}]}],
         "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}},
    ]
    last = None
    for attempt in range(retries):
        for body in bodies:
            try:
                r = requests.post(url, headers=headers, json=body, timeout=180)
            except requests.RequestException as e:
                last = str(e); continue
            if r.status_code == 429 or r.status_code >= 500:
                last = f"HTTP {r.status_code}: {r.text[:200]}"; break
            if r.status_code != 200:
                last = f"HTTP {r.status_code}: {r.text[:300]}"; continue
            for cand in r.json().get("candidates", []):
                for part in cand.get("content", {}).get("parts", []):
                    inline = part.get("inlineData") or part.get("inline_data")
                    if inline and inline.get("data"):
                        return base64.b64decode(inline["data"])
            last = "No image returned"
        time.sleep(4 * (attempt + 1))
    raise RuntimeError(last or "unknown error")


def call_pollinations(prompt, seed=None, retries=4):
    if seed is None:
        seed = random.randint(1000, 999999)
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1600&height=1200&nologo=true&seed={seed}"
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = resp.read()
                if len(data) > 10000:
                    return data
        except Exception as e:
            last_err = str(e)
            time.sleep(8 + attempt * 4)
    raise RuntimeError(f"Pollinations failed: {last_err}")


def to_webp_4x3(raw, path, target=(1600, 1200), max_kb=220):
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = img.size
    
    # Strip potential watermark corner
    if w >= 250 and h >= 80:
        patch = img.crop((w - 230, h - 90, w - 5, h - 50))
        img.paste(patch, (w - 230, h - 45))

    want = target[0] / target[1]
    if w / h > want:
        nw = int(h * want); img = img.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want); img = img.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    img = img.resize(target, Image.Resampling.LANCZOS)
    
    # Normalize brightness to >= 100
    stat = ImageStat.Stat(img.convert("L"))
    lum = stat.mean[0]
    if lum < 100:
        boost = 108.0 / max(lum, 10.0)
        img = ImageEnhance.Brightness(img).enhance(boost)
        lum = ImageStat.Stat(img.convert("L")).mean[0]

    for q in (88, 82, 76, 70, 64):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    with open(path, "wb") as f:
        f.write(buf.getvalue())
    return len(buf.getvalue()) // 1024, lum


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--catalog", required=True)
    ap.add_argument("--out", default="public/products")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--delay", type=float, default=2.5)
    a = ap.parse_args()

    products = json.load(open(a.catalog, encoding="utf-8"))
    if a.only:
        products = [p for p in products if p["slug"] in a.only]
    key = os.environ.get("GEMINI_API_KEY")
    os.makedirs(a.out, exist_ok=True)

    failed = []
    print(f"{len(products)} images -> {a.out} (model: {a.model})")
    for n, p in enumerate(products, 1):
        path = os.path.join(a.out, f"{p['slug']}.webp")
        if os.path.exists(path) and not a.force:
            print(f"[{n}/{len(products)}] skip (exists) {p['slug']}"); continue
        prompt = build_prompt(p)
        if a.dry_run:
            print(f"[{n}/{len(products)}] {p['slug']}\n   {prompt}\n"); continue
        try:
            raw = None
            if key:
                try:
                    raw = call_gemini(key, a.model, prompt)
                except Exception as ge:
                    print(f"[{n}/{len(products)}] Gemini notice for {p['slug']}: {ge}, using fallback...")
            if raw is None:
                raw = call_pollinations(prompt)
            kb, bright = to_webp_4x3(raw, path)
            print(f"[{n}/{len(products)}] ok  {p['slug']}  {kb} KB  brightness {bright:.0f}"
                  + ("  (dark - check it)" if bright < 100 else ""))
        except Exception as e:
            print(f"[{n}/{len(products)}] FAILED {p['slug']}: {e}"); failed.append(p["slug"])
        time.sleep(a.delay)
    if failed:
        print("\nFailed (re-run, it only retries missing files):", ", ".join(failed)); sys.exit(1)
    print("\nDone. Open every image and confirm it matches the product name.")


if __name__ == "__main__":
    main()
