import urllib.request
import os

headers = {'User-Agent': 'AurelianBatchCurator/1.0 (curator@aurelianinternational.com)'}

stones_to_download = {
    "cobblestones_clean.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/fc/GraniteKerbWithCobblestones.jpg",
    "himachal_slate_clean.jpg": "https://upload.wikimedia.org/wikipedia/commons/3/34/Blue_grey_speckled_clean_smooth_slate_rectangle_tile_ground_floor_texture.jpg",
    "limestone_clean.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/58/Portage_Park_Chicago_flagstone_steps.JPG",
    "sett_cobblestone.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/de/Camino_f%C3%A1cil.jpg",
    "granite_white_clean.jpg": "https://upload.wikimedia.org/wikipedia/commons/7/71/Bianco_Sardo_Granit_mit_polierter_Oberfl%C3%A4che.jpg",
}

for name, url in stones_to_download.items():
    out = os.path.join("scratch/candidates", name)
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        with open(out, 'wb') as f:
            f.write(data)
        print(f"  OK {len(data)/1024:.1f} KB")
    except Exception as e:
        print(f"  FAILED: {e}")
