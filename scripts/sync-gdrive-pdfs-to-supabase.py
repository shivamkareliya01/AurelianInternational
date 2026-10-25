#!/usr/bin/env python3
import os
import sys
import subprocess
import urllib.request
import urllib.error
import json

SUPABASE_URL = "https://qvpbveosbgpfbovmvkwe.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGJ2ZW9zYmdwZmJvdm12a3dlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjgzMTQ2MCwiZXhwIjoyMTA4NDA3NDYwfQ.gWtcdU3RHVQkx9R1B8BhQ83IzMBSexIIgX-2TkFwzzE"
BUCKET = "pdfs"
MAX_UPLOAD_SIZE = 48 * 1024 * 1024  # 48 MB safety margin for 50 MB Supabase free-tier limit

SCRATCH_DIR = "/home/meet/.gemini/antigravity-ide/brain/148d9e9d-7639-44e5-9065-5e426e1c50f6/scratch/pdfs"
os.makedirs(SCRATCH_DIR, exist_ok=True)

# 12 Files to download and upload (EXCLUDING "ENDLESS COLLECTION WITHOUT LOGO.pdf")
FILES = [
    ("3d-collection-2026.pdf", "3D COLLECTION 2026.pdf", "1TplTfvwQrbU8MKJMJUEQOggKFYuW0Tv8"),
    ("bookmatch-collection-2026.pdf", "BOOKMATCH COLLECTION 2026.pdf", "12l5npsEfVqi79JHmJdL1IBUsQHETbhLy"),
    ("carving-collection-2026.pdf", "CARVING COLLECTION 2026.pdf", "1XistNZYcAzh_yc8JaRpKozjmJoi8UXw7"),
    ("decor-glossy-collection-2026.pdf", "DECOR GLOSSY COLLECTION 2026.pdf", "1KWFDKJ4m2Vqrw2OVa_-eq-pxn6gML-G-"),
    ("double-charge-collection-2026.pdf", "DOUBLE CHARGE COLLECTION 2026.pdf", "1b92FWXzXy9MPHQv9SIm52t7fgBxELVjO"),
    ("glossy-collection-without-logo.pdf", "GLOSSY COLLECTION  WITHOUT LOGO.pdf", "13lkBq-x51_n1b62MwCrUtFlnzw9zy3m4"),
    ("gold-collection.pdf", "GOLD COLLECTION.pdf", "1dDlCChS7lwsFxMxQQQ90z7crQQ7WVKSC"),
    ("matt-collection-without-logo.pdf", "MATT COLLECTION WITHOUT LOGO.pdf", "1543LLRFjTYs9DXNSN_sI41FoB5kk4BVA"),
    ("new-gold-and-endless-collection-without-logo.pdf", "NEW GOLD AND ENDLESS COLLECTION WITHOUT LOGO.pdf", "1wJJvzHJsuw3T1_czD6knp6ssqar9-5FC"),
    ("staturio-collection-2026-with-out.pdf", "STATURIO COLLECTION 2026 with out.pdf", "1CujuA8_CsBHxXMtOXkDyA6ZWbfxpl7fs"),
    ("terrazo-collection-2026-without-logo.pdf", "TERRAZO COLLECTION 2026 WITHOUT LOGO.pdf", "1QGqRv7C2crer4lmv0Raw8BBWYjA3wB6W"),
    ("wood-collection-without-logo.pdf", "WOOD COLLECTION WITHOUT LOGO.pdf", "1keRe-AnVPv9IruT6f02N1KHUZGKBa5jY"),
]

def list_bucket_files():
    req = urllib.request.Request(
        f"{SUPABASE_URL}/storage/v1/object/list/{BUCKET}",
        data=json.dumps({"prefix": "", "limit": 100}).encode(),
        headers={
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json"
        }
    )
    with urllib.request.urlopen(req) as resp:
        items = json.loads(resp.read().decode())
        return {item["name"]: item.get("metadata", {}).get("size", 0) for item in items}

def download_file(file_id, dest_path):
    url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open(dest_path, "wb") as f:
        while True:
            chunk = resp.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)

def compress_pdf(input_path, output_path):
    # Try ebook setting first
    print(f"  ⚡ Compressing {os.path.basename(input_path)} with Ghostscript (/ebook)...")
    cmd_ebook = [
        "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook", "-dNOPAUSE", "-dQUIET", "-dBATCH",
        f"-sOutputFile={output_path}", input_path
    ]
    subprocess.run(cmd_ebook, check=True)
    size = os.path.getsize(output_path)
    
    # If still above MAX_UPLOAD_SIZE, compress with /screen
    if size > MAX_UPLOAD_SIZE:
        print(f"  ⚠️ /ebook produced {size / (1024*1024):.2f} MB (> 48 MB limit). Recompressing with /screen...")
        temp_screen = output_path + ".screen.pdf"
        cmd_screen = [
            "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
            "-dPDFSETTINGS=/screen", "-dNOPAUSE", "-dQUIET", "-dBATCH",
            f"-sOutputFile={temp_screen}", input_path
        ]
        subprocess.run(cmd_screen, check=True)
        os.replace(temp_screen, output_path)

def upload_to_supabase(target_slug, file_path):
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{target_slug}"
    with open(file_path, "rb") as f:
        data = f.read()
    
    req = urllib.request.Request(
        upload_url,
        data=data,
        headers={
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/pdf",
            "x-upsert": "true",
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        return result

def main():
    print(f"🚀 Starting Google Drive -> Supabase sync ({len(FILES)} catalogues)...")
    existing_bucket_files = list_bucket_files()
    print(f"📦 Found {len(existing_bucket_files)} files already in bucket: {list(existing_bucket_files.keys())}")
    
    results = []

    for idx, (target_slug, original_name, file_id) in enumerate(FILES, start=1):
        print(f"\n[{idx}/{len(FILES)}] Processing: {original_name} -> {target_slug}")
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{target_slug}"

        # If already uploaded and > 0 bytes, skip unless reupload needed
        if target_slug in existing_bucket_files and existing_bucket_files[target_slug] > 0:
            existing_size_mb = existing_bucket_files[target_slug] / (1024 * 1024)
            print(f"  ⏭️ Already in Supabase bucket ({existing_size_mb:.2f} MB). Skipping!")
            results.append({
                "slug": target_slug,
                "name": original_name,
                "url": public_url,
                "size_mb": round(existing_size_mb, 2),
                "status": "already_uploaded"
            })
            continue

        raw_path = os.path.join(SCRATCH_DIR, f"raw_{target_slug}")
        compressed_path = os.path.join(SCRATCH_DIR, f"compressed_{target_slug}")

        try:
            # 1. Download if neither compressed nor raw exists
            if not os.path.exists(compressed_path) and not os.path.exists(raw_path):
                print(f"  📥 Downloading from Google Drive...")
                download_file(file_id, raw_path)

            # Determine which file to check
            if os.path.exists(compressed_path):
                upload_path = compressed_path
                file_size = os.path.getsize(upload_path)
                print(f"  📊 Using pre-existing compressed file: {file_size / (1024 * 1024):.2f} MB")
            else:
                raw_size = os.path.getsize(raw_path)
                print(f"  📊 Raw size: {raw_size / (1024 * 1024):.2f} MB")
                if raw_size > MAX_UPLOAD_SIZE:
                    compress_pdf(raw_path, compressed_path)
                    upload_path = compressed_path
                else:
                    upload_path = raw_path

            final_size = os.path.getsize(upload_path)
            print(f"  🚀 Final upload size: {final_size / (1024 * 1024):.2f} MB")

            # 2. Upload to Supabase Storage
            print(f"  ☁️ Uploading to Supabase Storage ({target_slug})...")
            res = upload_to_supabase(target_slug, upload_path)
            print(f"  🎉 Uploaded successfully: {public_url}")

            results.append({
                "slug": target_slug,
                "name": original_name,
                "url": public_url,
                "size_mb": round(final_size / (1024 * 1024), 2),
                "status": "success"
            })

            # Cleanup temporary scratch files for this catalogue
            for p in [raw_path, compressed_path]:
                if os.path.exists(p):
                    try:
                        os.remove(p)
                    except Exception:
                        pass

        except Exception as e:
            print(f"  ❌ Error processing {original_name}: {e}")
            results.append({
                "slug": target_slug,
                "name": original_name,
                "status": f"failed: {e}"
            })

    print("\n" + "=" * 60)
    print("SYNC SUMMARY:")
    print("=" * 60)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
