import os
from PIL import Image, ImageDraw

def create_favicon(size):
    # Create high-res supersampled image for maximum crispness
    scale = 4
    w = size * scale
    h = size * scale
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # Rounded rectangle coordinates
    pad = int(w * 0.04)
    radius = int(w * 0.22)
    rect = [pad, pad, w - pad, h - pad]

    # Draw navy background rounded rectangle with subtle gradient simulation
    # Navy: #071A33
    draw.rounded_rectangle(rect, radius=radius, fill=(7, 26, 51, 255), outline=(201, 151, 63, 160), width=max(1, int(w * 0.015)))

    # We can render the infinity symbol with precision
    # Using parametric lemniscate: x = a * cos(t) / (1 + sin^2(t)), y = b * sin(t) * cos(t) / (1 + sin^2(t))
    # or bezier arcs. Or draw two overlapping loop circles with inner cutouts.
    import math
    cx = w / 2
    cy = h / 2
    scale_x = w * 0.35
    scale_y = h * 0.22
    stroke_w = max(2, int(w * 0.075))

    # Points along lemniscate of Bernoulli
    points = []
    num_pts = 600
    for i in range(num_pts):
        t = (2 * math.pi * i) / num_pts
        denom = 1 + math.sin(t)**2
        x = cx + (scale_x * math.cos(t)) / denom
        y = cy + (scale_y * math.sin(t) * math.cos(t) * 1.5) / denom
        points.append((x, y, t))

    # Draw lines with gold-to-silver gradient
    # Left loop (t ~ 0.5pi to 1.5pi) is gold (#F2C86E / #C9973F)
    # Right loop (t ~ -0.5pi to 0.5pi) transitions to silver (#FAF8F3 / #D9DDE3)
    for i in range(len(points)):
        p1 = points[i]
        p2 = points[(i + 1) % len(points)]
        t = p1[2]
        # Calculate horizontal fraction from 0 (left) to 1 (right)
        frac = (p1[0] - (cx - scale_x)) / (2 * scale_x)
        frac = max(0.0, min(1.0, frac))

        # Color: Gold (201, 151, 63) -> Gold Light (242, 200, 110) -> Silver Light (245, 246, 248) -> Silver (217, 221, 227)
        if frac < 0.45:
            # Gold dark to gold light
            f = frac / 0.45
            r = int(154 + (242 - 154) * f)
            g = int(107 + (200 - 107) * f)
            b = int(31 + (110 - 31) * f)
        elif frac < 0.75:
            # Gold light to silver light
            f = (frac - 0.45) / 0.30
            r = int(242 + (245 - 242) * f)
            g = int(200 + (246 - 200) * f)
            b = int(110 + (248 - 110) * f)
        else:
            # Silver light to silver
            f = (frac - 0.75) / 0.25
            r = int(245 + (217 - 245) * f)
            g = int(246 + (221 - 246) * f)
            b = int(248 + (227 - 248) * f)

        # Draw segment as small circle/thick line
        draw.line([p1[0], p1[1], p2[0], p2[1]], fill=(r, g, b, 255), width=stroke_w)
        draw.ellipse([p1[0] - stroke_w/2, p1[1] - stroke_w/2, p1[0] + stroke_w/2, p1[1] + stroke_w/2], fill=(r, g, b, 255))

    # Resize with high quality Lanczos resampling
    final = im.resize((size, size), Image.Resampling.LANCZOS)
    return final

print('Generating favicons...')
im512 = create_favicon(512)
im192 = create_favicon(192)
im180 = create_favicon(180)
im64 = create_favicon(64)
im48 = create_favicon(48)
im32 = create_favicon(32)
im16 = create_favicon(16)

# Save images
im512.save('public/brand/favicon-512.png', 'PNG')
im192.save('public/favicon.png', 'PNG')
im180.save('public/apple-touch-icon.png', 'PNG')
im32.save('public/favicon-32x32.png', 'PNG')
im16.save('public/favicon-16x16.png', 'PNG')

# Save multi-size ICO
im256 = create_favicon(256)
im256.save(
    'public/favicon.ico',
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
)

# Also copy to .output/public if it exists
import shutil
for f in ['favicon.ico', 'favicon.png', 'favicon.svg', 'apple-touch-icon.png', 'favicon-32x32.png', 'favicon-16x16.png']:
    src = os.path.join('public', f)
    dst = os.path.join('.output', 'public', f)
    if os.path.exists('.output/public'):
        shutil.copy2(src, dst)

print('Successfully generated all favicons!')
