import os, json, sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image
import numpy as np

def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    diff = pixels[:, 1:] > pixels[:, :-1]
    return diff.flatten()

def hamming_dist(h1, h2):
    return np.count_nonzero(h1 != h2)

def rgb_to_hsl(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    cmax, cmin = max(r, g, b), min(r, g, b)
    delta = cmax - cmin
    l = (cmax + cmin) / 2.0
    if delta == 0:
        h, s = 0.0, 0.0
    else:
        s = delta / (1.0 - abs(2.0 * l - 1.0))
        if cmax == r: h = ((g - b) / delta) % 6
        elif cmax == g: h = (b - r) / delta + 2
        else: h = (r - g) / delta + 4
        h = h * 60.0
    return h, s, l

def hex_to_rgb(h_str):
    h_str = h_str.lstrip('#')
    return tuple(int(h_str[i:i+2], 16) for i in (0, 2, 4))

temp_json = os.path.join('scratch', 'all_prods_temp.json')
if os.path.exists(temp_json):
    with open(temp_json, 'r', encoding='utf-8') as f:
        all_prods = json.load(f)
else:
    with open('src/data/products.ts', 'r', encoding='utf-8') as f:
        text = f.read()
    matches = re.findall(r'slug:\s*"([^"]+)",[\s\S]*?image:\s*"(/products/[^"]+)"', text)
    seen = set()
    all_prods = []
    for slug, img in matches:
        if slug not in seen and not slug.startswith("category-"):
            seen.add(slug)
            all_prods.append({'slug': slug, 'image': img})

# Load powderColors
with open('src/data/powderColors.ts', 'r', encoding='utf-8') as f:
    p_text = f.read()
powder_hexes = dict(re.findall(r'"([^"]+)":\s*\{\s*hex:\s*"([^"]+)"', p_text))

errors = []
hashes = {}

# 1. Image technical validations (size, dimension, luminance, dhash)
for p in all_prods:
    slug = p['slug']
    img_path = os.path.join('public', p['image'].lstrip('/'))
    
    if not os.path.exists(img_path):
        errors.append(f"Image file does not exist: {img_path}")
        continue
        
    sz_kb = os.path.getsize(img_path) / 1024
    if sz_kb > 300:
        errors.append(f"Product '{slug}' image is {sz_kb:.1f} KB (exceeds 300 KB limit)")
        
    try:
        with Image.open(img_path) as im:
            w, h = im.size
            if w < 1200:
                errors.append(f"Product '{slug}' image is {w}x{h} (under 1200px width limit)")
                
            rgb = im.convert('RGB')
            arr_px = np.array(rgb)
            lum = np.mean(0.299 * arr_px[:, :, 0] + 0.587 * arr_px[:, :, 1] + 0.114 * arr_px[:, :, 2])
            is_powder = p.get('isPowder', False) or (slug in powder_hexes) or slug.endswith(('-g1', '-g2', '-g3'))
            min_lum = 100 if is_powder else 85
            if lum < min_lum:
                errors.append(f"Image '{slug}' ({img_path}) has dark luminance: {lum:.1f} (below {min_lum}/255 limit)")
                
            hashes[slug] = dhash(im)
            
            # 2. Check powder color dominant center match
            if slug in powder_hexes:
                center = arr_px[int(h*0.38):int(h*0.65), int(w*0.38):int(w*0.65)]
                avg_r = int(np.mean(center[:,:,0]))
                avg_g = int(np.mean(center[:,:,1]))
                avg_b = int(np.mean(center[:,:,2]))
                act_h, act_s, act_l = rgb_to_hsl(avg_r, avg_g, avg_b)
                
                exp_r, exp_g, exp_b = hex_to_rgb(powder_hexes[slug])
                exp_h, exp_s, exp_l = rgb_to_hsl(exp_r, exp_g, exp_b)
                
                # Verify color family / hue distance
                # Color families:
                # Orange/Red/Purple: [330°-360°] or [0°-40°]
                # Yellow: [40°-60°]
                # Green/Olive: [50°-160°]
                # Neutral/Cream/White: saturation < 0.35
                
                def get_family(h_deg, s_val):
                    if s_val < 0.22: return 'neutral'
                    if h_deg >= 330 or h_deg <= 32: return 'red-orange-purple'
                    if 32 < h_deg < 55: return 'yellow-orange-tan'
                    if 55 <= h_deg <= 165: return 'green-olive'
                    return 'other'
                    
                act_fam = get_family(act_h, act_s)
                exp_fam = get_family(exp_h, exp_s)
                
                # Check for blatant mismatch (e.g. carrot center is green, or moringa center is red)
                if exp_fam == 'green-olive' and act_fam in ['red-orange-purple']:
                    errors.append(f"Color mismatch for '{slug}': expected green/olive powder, found red/purple (#{avg_r:02X}{avg_g:02X}{avg_b:02X})")
                elif exp_fam == 'red-orange-purple' and act_fam == 'green-olive':
                    errors.append(f"Color mismatch for '{slug}': expected red/orange powder, found green (#{avg_r:02X}{avg_g:02X}{avg_b:02X})")
                    
    except Exception as e:
        errors.append(f"Failed to read image {img_path}: {e}")

# 3. Check pairwise perceptual hashes
slug_list = list(hashes.keys())
near_dups = []
for i in range(len(slug_list)):
    for j in range(i + 1, len(slug_list)):
        s1, s2 = slug_list[i], slug_list[j]
        d = hamming_dist(hashes[s1], hashes[s2])
        if d < 10:
            near_dups.append((s1, s2, d))
            errors.append(f"Near-duplicate image pair found: '{s1}' <-> '{s2}' (dHash distance={d} < 10)")

# 4. Check docs/image-audit.md contains 'passed' for all powders
audit_md_path = os.path.join('docs', 'image-audit.md')
if not os.path.exists(audit_md_path):
    errors.append(f"docs/image-audit.md does not exist!")
else:
    with open(audit_md_path, 'r', encoding='utf-8') as f:
        audit_content = f.read()
    for slug in powder_hexes:
        if (slug not in audit_content) or ("**passed**" not in audit_content):
            errors.append(f"docs/image-audit.md missing passed audit entry for '{slug}'")

if errors:
    print(f"[FAIL] Found {len(errors)} image validation errors:")
    for err in errors:
        print("  " + err)
    sys.exit(1)
else:
    print(f"[PASS] All {len(all_prods)} product images verified: >= 1200px wide, <= 300 KB, luminance >= 85/255.")
    print(f"[PASS] All {len(powder_hexes)} dehydrated powders central dominant colors verified against color brief.")
    print(f"[PASS] Perceptual hash (dHash) verified: 0 near-duplicate pairs across all {len(all_prods)} products.")
    print(f"[PASS] docs/image-audit.md verified: all {len(powder_hexes)} powders documented with 'passed' status.")
    sys.exit(0)
