#!/usr/bin/env python3
"""
Aurelian International - generate real product photos for the 22 Dehydrated Powders.

Supports Google's Gemini image model through the Gemini API when GEMINI_API_KEY is provided,
with automatic fallback to the free Pollinations AI text-to-image endpoint if no key is set.

RUN (from your project root, so files land in ./public/products)
  python generate_powder_images.py                 # main + ingredient + 2 gallery images for all 22
  python generate_powder_images.py --main-only     # main + ingredient image of each (44 images)
  python generate_powder_images.py --only beetroot-powder carrot-powder
  python generate_powder_images.py --force         # regenerate even if the file exists
  python generate_powder_images.py --dry-run       # print prompts, call nothing
"""

import argparse
import base64
import io
import os
import sys
import time
import urllib.parse
import urllib.request
import random

try:
    import requests
    from PIL import Image, ImageStat, ImageEnhance
except ImportError:
    sys.exit("Please run:  pip install requests pillow")

DEFAULT_MODEL = "gemini-2.5-flash-image"
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

# slug, display name, powder color, raw ingredient
PRODUCTS = [
    ("white-onion-powder",      "white onion powder",              "cream-white ivory",     "whole white onions"),
    ("pink-red-onion-powder",   "red onion powder",                "soft pink-lilac",       "whole red onions"),
    ("garlic-powder",           "garlic powder",                   "off-white pale ivory",  "garlic bulbs and loose cloves"),
    ("ginger-powder-saunth",    "dry ginger (saunth) powder",      "pale yellow-beige",     "fresh ginger rhizomes"),
    ("moringa-leaf-powder",     "moringa leaf powder",             "deep emerald green",    "fresh moringa leaf sprigs"),
    ("moringa-seed-powder",     "moringa seed powder",             "pale beige-tan",        "moringa pods and seeds"),
    ("spinach-powder",          "spinach powder",                  "dark forest green",     "fresh spinach leaves"),
    ("curry-leaf-powder",       "curry leaf powder",               "dark olive green",      "glossy curry leaf sprigs"),
    ("mint-leaf-powder",        "mint leaf powder",                "bright light green",    "fresh mint sprigs"),
    ("coriander-leaf-powder",   "coriander leaf powder",           "medium fresh green",    "fresh cilantro leaves and stems"),
    ("kasuri-methi-powder",     "fenugreek leaf (kasuri methi) powder", "sage green",       "fenugreek leaves"),
    ("tomato-powder",           "tomato powder",                   "brick red-orange",      "ripe red tomatoes"),
    ("beetroot-powder",         "beetroot powder",                 "vivid magenta-purple",  "whole and halved beetroots with green tops"),
    ("carrot-powder",           "carrot powder",                   "bright orange",         "whole carrots with tops"),
    ("green-chilli-powder",     "green chilli powder",             "olive green",           "fresh green chillies"),
    ("pumpkin-powder",          "pumpkin powder",                  "golden orange",         "a cut pumpkin wedge"),
    ("mango-powder-amchur",     "mango powder (amchur)",           "pale golden beige",     "dried green mango slices and one raw green mango"),
    ("banana-powder",           "banana powder",                   "creamy off-white",      "peeled and unpeeled bananas"),
    ("lemon-powder",            "lemon powder",                    "pale lemon yellow",     "whole and halved lemons"),
    ("amla-powder",             "amla (Indian gooseberry) powder", "light greenish-brown",  "fresh green Indian gooseberries"),
    ("aloe-vera-powder",        "aloe vera powder",                "pale beige-green",      "a cut aloe vera leaf showing clear gel"),
    ("hibiscus-powder",         "hibiscus powder",                 "deep crimson red",      "dried and fresh red hibiscus flowers"),
    ("tulsi-holy-basil-leaf-powder", "tulsi (holy basil) leaf powder", "deep olive herbal green", "fresh sacred tulsi basil leaves and flowering purple tops"),
    ("neem-leaf-powder",        "neem leaf powder",                "rich forest green",     "fresh bitter neem sprigs and pinnate leaves"),
    ("ashwagandha-root-powder", "ashwagandha root powder",         "pale earthy tan-beige", "whole dried and fresh ashwagandha roots"),
    ("shatavari-root-powder",   "shatavari root powder",           "creamy ivory-beige",    "fresh peeled succulent shatavari roots"),
    ("wheatgrass-powder",       "wheatgrass powder",               "vibrant chlorophyll green", "fresh tender young green wheatgrass blades"),
    ("okra-lady-finger-powder", "okra (lady finger) powder",       "light moss green",      "fresh tender green okra pods whole and sliced into stars"),
    ("bitter-gourd-karela-powder", "bitter gourd (karela) powder", "medium olive green",   "fresh bumpy green bitter gourds whole and round slices"),
    ("papaya-powder",           "papaya powder",                   "warm golden orange-yellow", "ripe orange papaya fruit halves showing glistening black seeds"),
    ("pomegranate-anardana-powder", "pomegranate (anardana) powder", "deep ruby maroon red", "fresh ruby pomegranate fruit split open with juicy red arils"),
    ("guava-powder",            "guava powder",                    "pale creamy soft beige-pink", "fresh ripe Indian guavas whole and cut halves showing seeds"),
    ("jamun-black-plum-powder", "jamun (black plum) powder",       "deep royal purple-indigo", "ripe glossy dark purple jamun berries whole and halved"),
    ("tamarind-powder",         "tamarind powder",                 "rich caramel brown",    "fresh brown tamarind pods in brittle shells with sticky pulp"),
    ("kokum-powder",            "kokum powder",                    "deep dark purple-black", "sun-dried dark purple kokum fruit rinds and fresh purple fruit"),
    ("coconut-milk-powder",     "coconut milk powder",             "pure snow white",       "fresh cracked coconut halves with white kernel flesh"),
    ("butterfly-pea-flower-powder", "butterfly pea flower powder", "vivid electric sapphire blue", "fresh vibrant blue butterfly pea (Clitoria ternatea) blossoms"),
    ("rose-petal-powder",       "rose petal powder",               "soft romantic blush pink", "fresh fragrant Indian Damask rose petals"),
    ("purple-sweet-potato-powder", "purple sweet potato powder",   "intense vibrant violet purple", "fresh purple sweet potatoes whole and sliced showing deep violet flesh"),
    ("lemongrass-powder",       "lemongrass powder",               "pale sage straw-green", "fresh cut stalks and blades of fragrant lemongrass"),
]

STYLE = (
    "Photorealistic real photograph (not an illustration, not a 3D render, not CGI), "
    "professional commercial food photography, premium export catalog style, "
    "bright high-key lighting, clean light warm-cream marble or pale wood surface, "
    "soft natural daylight from the left, razor-sharp focus across the whole frame, "
    "vivid true colors, no dark vignette, no dark corners, "
    "4:3 landscape, no text, no logos, no people, no hands, no packaging, no labels."
)


def prompt_main(name, color, ingredient):
    return (
        f"Two-part product composition so a buyer instantly recognizes what the powder is made from. "
        f"On the left: a natural wooden bowl filled with fine, dry, matte {color} {name}, powder heaped "
        f"with visible fine grain texture, a wooden spoon resting in it and a little loose powder dusted "
        f"on the surface. On the right, next to the bowl and at the SAME size and prominence: the fresh "
        f"raw source, {ingredient}, arranged naturally and clearly recognizable, in sharp focus (not blurred). "
        f"Both the powder and the {ingredient} are fully visible, well lit and centered, filling most of the frame. "
        f"The powder color is exactly {color}. High camera angle. {STYLE}"
    )


def prompt_ingredient(name, color, ingredient):
    return (
        f"Hero shot of the fresh raw source of {name}: {ingredient}, beautifully arranged on a clean light "
        f"warm-cream marble surface, whole and cut pieces so the inside is visible, fresh, glossy and "
        f"appetizing, perfectly recognizable at a glance, centered and filling most of the frame. "
        f"No powder, no bowl. {STYLE}"
    )


def prompt_closeup(name, color, ingredient):
    return (
        f"Extreme macro close-up of fine dry {color} {name}, a small mound with a wooden spoon edge, "
        f"every fine particle and soft clump visible, shallow depth of field, "
        f"a hint of {ingredient} blurred far in the background. {STYLE}"
    )


def prompt_side(name, color, ingredient):
    return (
        f"Side-view of a rustic ceramic bowl brimming with fine {color} {name}, powder gently spilling over "
        f"the rim onto a cream stone surface, a wooden scoop beside it and {ingredient} arranged neatly "
        f"next to the bowl. {STYLE}"
    )


def call_gemini(api_key, model, prompt, retries=4):
    url = ENDPOINT.format(model=model)
    headers = {"x-goog-api-key": api_key, "Content-Type": "application/json"}
    bodies = [
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseModalities": ["IMAGE"],
                "imageConfig": {"aspectRatio": "4:3"},
            },
        },
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
        },
    ]
    last_err = None
    for attempt in range(retries):
        for body in bodies:
            try:
                r = requests.post(url, headers=headers, json=body, timeout=180)
            except requests.RequestException as e:
                last_err = str(e)
                continue
            if r.status_code == 429 or r.status_code >= 500:
                last_err = f"HTTP {r.status_code}: {r.text[:200]}"
                break
            if r.status_code != 200:
                last_err = f"HTTP {r.status_code}: {r.text[:300]}"
                continue
            data = r.json()
            for cand in data.get("candidates", []):
                for part in cand.get("content", {}).get("parts", []):
                    inline = part.get("inlineData") or part.get("inline_data")
                    if inline and inline.get("data"):
                        return base64.b64decode(inline["data"])
            last_err = "No image returned: " + str(data)[:300]
        time.sleep(4 * (attempt + 1))
    raise RuntimeError(last_err or "unknown error")


def call_pollinations(prompt, seed=None, retries=5):
    if seed is None:
        seed = random.randint(1000, 999999)
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1600&height=1200&nologo=true&seed={seed}"
    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=45) as resp:
                data = resp.read()
                if len(data) > 10000:
                    return data
        except Exception as e:
            last_err = str(e)
            time.sleep(12 + attempt * 5)
    raise RuntimeError(f"Pollinations failed after {retries} retries: {last_err}")


def to_webp_4x3(raw, path, target=(1600, 1200), max_kb=250):
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = img.size
    
    # Clean bottom-right watermark if present
    if w >= 250 and h >= 80:
        patch = img.crop((w - 230, h - 90, w - 5, h - 50))
        img.paste(patch, (w - 230, h - 45))

    want = target[0] / target[1]
    if w / h > want:
        nw = int(h * want)
        img = img.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want)
        img = img.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    img = img.resize(target, Image.Resampling.LANCZOS)

    # Brightness adjustment to ensure mean brightness >= 100
    stat = ImageStat.Stat(img.convert("L"))
    brightness = stat.mean[0]
    if brightness < 105:
        boost = 110.0 / max(brightness, 10.0)
        img = ImageEnhance.Brightness(img).enhance(boost)
        brightness = ImageStat.Stat(img.convert("L")).mean[0]

    for q in (82, 78, 74, 70, 65):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    with open(path, "wb") as f:
        f.write(buf.getvalue())
    return len(buf.getvalue()) // 1024, brightness


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="public/products")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--only", nargs="*", help="slugs to generate")
    ap.add_argument("--main-only", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--delay", type=float, default=10.0, help="seconds between calls")
    args = ap.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")

    os.makedirs(args.out, exist_ok=True)
    items = [p for p in PRODUCTS if not args.only or p[0] in args.only]
    if args.only:
        missing = set(args.only) - {p[0] for p in PRODUCTS}
        if missing:
            sys.exit(f"Unknown slug(s): {', '.join(sorted(missing))}")

    jobs = []
    for slug, name, color, ing in items:
        jobs.append((f"{slug}.webp", prompt_main(name, color, ing)))
        jobs.append((f"{slug}-ingredient.webp", prompt_ingredient(name, color, ing)))
        if not args.main_only:
            jobs.append((f"{slug}-2.webp", prompt_closeup(name, color, ing)))
            jobs.append((f"{slug}-3.webp", prompt_side(name, color, ing)))

    print(f"{len(jobs)} images -> {args.out}  (mode: {'gemini ' + args.model if api_key else 'pollinations fallback'})")
    failed = []
    for i, (fname, prompt) in enumerate(jobs, 1):
        path = os.path.join(args.out, fname)
        if os.path.exists(path) and not args.force:
            print(f"[{i}/{len(jobs)}] skip (exists) {fname}")
            continue
        if args.dry_run:
            print(f"[{i}/{len(jobs)}] {fname}\n   {prompt}\n")
            continue
        try:
            if api_key:
                raw = call_gemini(api_key, args.model, prompt)
            else:
                raw = call_pollinations(prompt)
            kb, bright = to_webp_4x3(raw, path)
            flag = "  (dark - check it)" if bright < 100 else ""
            print(f"[{i}/{len(jobs)}] ok  {fname}  {kb} KB  brightness {bright:.0f}{flag}")
        except Exception as e:
            print(f"[{i}/{len(jobs)}] FAILED {fname}: {e}")
            failed.append(fname)
        time.sleep(args.delay)

    if failed:
        print("\nFailed (re-run the script, it only retries missing files):")
        for f in failed:
            print("  ", f)
        sys.exit(1)
    print("\nDone. Generated all powder and raw ingredient photos.")


if __name__ == "__main__":
    main()
