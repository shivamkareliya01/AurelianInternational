import urllib.request
import urllib.parse
import json
import os
import sys

headers = {'User-Agent': 'AurelianCatalogBot/2.0 (curator@aurelianinternational.com)'}

def search_files(term, n=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(term)}&gsrnamespace=6&gsrlimit={n}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url')
                w = info.get('width', 0)
                h = info.get('height', 0)
                mime = info.get('mime', '')
                if url and ('image/jpeg' in mime or 'image/png' in mime) and w >= 800 and h >= 600:
                    results.append({'title': title, 'url': url, 'w': w, 'h': h})
            return results
    except Exception as e:
        return []

def download_file(url, out_path):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    with open(out_path, 'wb') as f:
        f.write(data)
    print(f"Downloaded {len(data)/1024:.1f} KB -> {out_path}")

targets = {
    "white-onion": ["White onions.jpg", "File:White onion cross section.jpg", "white onion bulbs", "Allium cepa white"],
    "ginger": ["File:Zingiber officinale rhizome.jpg", "fresh ginger rhizome", "ginger root", "Zingiber officinale"],
    "green-chilli": ["File:Green chili peppers.jpg", "green chili peppers", "Capsicum annuum green"],
    "kesar-mango": ["File:Mango Kesar Indian variety IMG 20230603 114021 (3).jpg", "ripe mangoes fruit"],
    "thompson-seedless-grapes": ["File:Thompson Seedless grapes.jpg", "Sultana grapes", "green grapes bunch"],
    "guntur-red-chilli": ["File:Dry red chillies.jpg", "dried red chili peppers", "dry red chillies"],
    "cumin-seeds": ["File:Cuminum cyminum seeds.jpg", "cumin seeds", "Cuminum cyminum"],
    "cloves": ["File:Syzygium aromaticum dried flower buds.jpg", "cloves spice", "Syzygium aromaticum"],
    "fenugreek-seeds": ["File:Fenugreek seeds.jpg", "fenugreek seeds", "Trigonella foenum-graecum"],
    "fennel-seeds": ["File:Foeniculum vulgare seeds.jpg", "fennel seeds", "Foeniculum vulgare seeds"],
    "garam-masala": ["File:Garam masala ingredients.jpg", "File:Garammasalaphoto.jpg", "garam masala"],
    "statuario-marble": ["File:Carrara marble texture.jpg", "Carrara marble slab", "white marble slab"],
    "indian-green-marble": ["File:Irish Green Marble (Connemara Marble Formation, Neoproterozoic; Ordovician metamorphism; Galway, Ireland) 2 (33630240620).jpg", "green marble texture"],
    "kashmir-white-granite": ["File:Rockville White Granite (porphyritic granite, Rockville Granite, late Paleoproterozoic, 1.73 to 1.78 Ga; quarry near Rockville, Minnesota, USA) 1 (25902855894).jpg", "white granite texture"],
    "rainbow-sandstone": ["sandstone texture slab", "banded sandstone"],
    "kota-limestone": ["limestone slab texture", "limestone flagstone"],
    "himachal-slate": ["slate stone texture slab", "riven slate"],
    "quartzite": ["quartzite rock texture", "quartzite stone slab"],
    "vitrified-tiles": ["porcelain tile floor", "vitrified floor tile"],
    "porcelain-tiles": ["porcelain floor tile", "ceramic tile texture"],
    "ceramic-wall-tiles": ["ceramic wall tile", "glazed subway tile"],
    "cobblestones": ["File:Cobblestones street Pompeii.jpg", "granite cobblestones pavement"],
    "cashew-nuts-w320": ["File:Cashew nuts.jpg", "cashew nuts bowl", "cashew kernels"],
    "cashew-nuts-w240": ["File:Cashew nuts raw.jpg", "whole cashew nuts"],
    "pistachios": ["File:Pistachios in shell.jpg", "pistachio nuts in shell"],
    "dates": ["File:Dried dates.jpg", "dried dates bowl"],
    "figs": ["File:Dried figs.jpg", "dried figs anjeer"],
    "apricots": ["File:Dried apricots.jpg", "dried apricots fruit"],
    "makhana-fox-nut": ["File:Fox nuts (Makhana).jpg", "phool makhana", "Euryale ferox seeds"]
}

manifest = {}
for slug, query_list in targets.items():
    found = None
    for q in query_list:
        res = search_files(q, 3)
        if res:
            found = res[0]
            print(f"[{slug}] matched '{q}' -> {found['title']} ({found['w']}x{found['h']})")
            break
    if found:
        manifest[slug] = found
    else:
        print(f"[{slug}] NO MATCH FOUND!")

with open('scratch/found_manifest.json', 'w') as f:
    json.dump(manifest, f, indent=2)
print(f"Done! Found {len(manifest)} of {len(targets)} targets.")
