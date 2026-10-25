#!/usr/bin/env python3
import os
import subprocess
import urllib.request
import glob

SUPABASE_URL = "https://qvpbveosbgpfbovmvkwe.supabase.co"
BUCKET = "pdfs"

FILES = [
    ("3d-collection-2026.pdf", "3d-collection-2026"),
    ("bookmatch-collection-2026.pdf", "bookmatch-collection-2026"),
    ("carving-collection-2026.pdf", "carving-collection-2026"),
    ("decor-glossy-collection-2026.pdf", "decor-glossy-collection-2026"),
    ("double-charge-collection-2026.pdf", "double-charge-collection-2026"),
    ("glossy-collection-without-logo.pdf", "glossy-collection-without-logo"),
    ("gold-collection.pdf", "gold-collection"),
    ("matt-collection-without-logo.pdf", "matt-collection-without-logo"),
    ("new-gold-and-endless-collection-without-logo.pdf", "new-gold-and-endless-collection-without-logo"),
    ("staturio-collection-2026-with-out.pdf", "staturio-collection-2026-with-out"),
    ("terrazo-collection-2026-without-logo.pdf", "terrazo-collection-2026-without-logo"),
    ("wood-collection-without-logo.pdf", "wood-collection-without-logo"),
]

os.makedirs("public/products", exist_ok=True)
os.makedirs("public/catalogues", exist_ok=True)

for idx, (filename, slug) in enumerate(FILES, 1):
    dest_product_webp = f"public/products/{slug}.webp"
    dest_cat_webp = f"public/catalogues/{slug}-cover.webp"
    
    if os.path.exists(dest_product_webp) and os.path.getsize(dest_product_webp) > 1000:
        print(f"[{idx}/{len(FILES)}] {slug} already has cover. Skipping.")
        continue
        
    print(f"[{idx}/{len(FILES)}] Generating cover for {slug}...")
    pdf_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
    tmp_pdf = f"/tmp/{slug}.pdf"
    
    req = urllib.request.Request(pdf_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open(tmp_pdf, "wb") as f:
        while True:
            chunk = resp.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)
            
    prefix = f"/tmp/cov_{slug}"
    subprocess.run(["pdftoppm", "-f", "1", "-l", "1", "-png", "-r", "150", tmp_pdf, prefix], check=True)
    
    # Find generated png
    pngs = glob.glob(f"{prefix}*.png")
    if pngs:
        png_path = pngs[0]
        # Convert to high-quality webp
        subprocess.run(["magick", png_path, "-resize", "900x", "-quality", "85", dest_product_webp], check=True)
        # Also copy/link for catalogue cover
        subprocess.run(["cp", dest_product_webp, dest_cat_webp], check=True)
        print(f"  ✅ Created {dest_product_webp} ({round(os.path.getsize(dest_product_webp)/1024, 1)} KB)")
        os.remove(png_path)
    
    if os.path.exists(tmp_pdf):
        os.remove(tmp_pdf)

print("🎉 All covers generated successfully!")
