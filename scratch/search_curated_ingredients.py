import urllib.request
import urllib.parse
import json
import os
from PIL import Image, ImageStat, ImageEnhance

os.makedirs('scratch/ingredients_clean', exist_ok=True)

# Curated high-quality Wikimedia Commons studio photography for each raw ingredient
EXACT_TITLES = {
    'white-onion-powder': [
        'File:White_onion_on_white_background.jpg',
        'File:White_onion.jpg',
        'File:Allium_cepa_-_white_onion.jpg'
    ],
    'pink-red-onion-powder': [
        'File:Red_Onion_Sliced.jpg',
        'File:Red_onion_isolated.jpg',
        'File:Red_Onions.jpg'
    ],
    'garlic-powder': [
        'File:Garlic_bulbs_and_clove.jpg',
        'File:Garlic_-_single_bulb_and_cloves.jpg',
        'File:Garlic_clove_and_bulb.jpg'
    ],
    'ginger-powder-saunth': [
        'File:Ginger_rhizome_fresh.jpg',
        'File:Ginger_root.jpg',
        'File:Fresh_Ginger_Rhizome.jpg',
        'File:Zingiber_officinale_rhizome.jpg'
    ],
    'moringa-leaf-powder': [
        'File:Moringa_leaves.jpg',
        'File:Moringa_oleifera_leaves.jpg',
        'File:Moringa_leaves_fresh.jpg'
    ],
    'moringa-seed-powder': [
        'File:Moringa_oleifera_seeds.jpg',
        'File:Moringa_seeds.jpg',
        'File:Moringa_seed.jpg'
    ],
    'spinach-powder': [
        'File:Spinach_leaves.jpg',
        'File:Spinacia_oleracea_leaves.jpg',
        'File:Fresh_spinach_leaves.jpg'
    ],
    'curry-leaf-powder': [
        'File:Curry_leaves.jpg',
        'File:Curry_leaf.jpg',
        'File:Murraya_koenigii_leaves.jpg'
    ],
    'mint-leaf-powder': [
        'File:Fresh_mint.jpg',
        'File:Mint_leaves.jpg',
        'File:Spearmint_leaves.jpg'
    ],
    'coriander-leaf-powder': [
        'File:Fresh_coriander.jpg',
        'File:Coriander_leaves.jpg',
        'File:Cilantro_leaves.jpg'
    ],
    'kasuri-methi-powder': [
        'File:Fenugreek_leaves.jpg',
        'File:Methi_leaves.jpg',
        'File:Trigonella_foenum-graecum_leaves.jpg'
    ],
    'tomato-powder': [
        'File:Tomatoes_on_vine.jpg',
        'File:Ripe_red_tomatoes.jpg',
        'File:Tomato_je.jpg'
    ],
    'beetroot-powder': [
        'File:Beetroot_fresh.jpg',
        'File:Beta_vulgaris_beetroot.jpg',
        'File:Beetroots.jpg'
    ],
    'carrot-powder': [
        'File:Carrots_with_tops.jpg',
        'File:Carrots.jpg',
        'File:Fresh_carrots.jpg'
    ],
    'green-chilli-powder': [
        'File:Green_chili_peppers.jpg',
        'File:Green_chillies.jpg',
        'File:Green_chili.jpg'
    ],
    'pumpkin-powder': [
        'File:Pumpkin_wedge.jpg',
        'File:Pumpkin_slice.jpg',
        'File:Cut_pumpkin.jpg'
    ],
    'mango-powder-amchur': [
        'File:Green_mangoes.jpg',
        'File:Raw_mango.jpg',
        'File:Unripe_mango.jpg'
    ],
    'banana-powder': [
        'File:Bananas_white_background.jpg',
        'File:Banana_and_cross_section.jpg',
        'File:Bananas.jpg'
    ],
    'lemon-powder': [
        'File:Lemon_and_cross_section.jpg',
        'File:Lemon_isolated.jpg',
        'File:Lemons.jpg'
    ],
    'amla-powder': [
        'File:Amla_fruit.jpg',
        'File:Phyllanthus_emblica_fruit.jpg',
        'File:Indian_gooseberry_amla.jpg'
    ],
    'aloe-vera-powder': [
        'File:Aloe_vera_leaf_cut.jpg',
        'File:Aloe_vera_slice.jpg',
        'File:Aloe_vera_gel_leaf.jpg'
    ],
    'hibiscus-powder': [
        'File:Hibiscus_sabdariffa_dried.jpg',
        'File:Roselle_calyx.jpg',
        'File:Hibiscus_flower.jpg'
    ]
}

def get_wikimedia_file(title_or_query):
    # Try direct imageinfo first
    if title_or_query.startswith('File:'):
        title = title_or_query
        url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    else:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(title_or_query)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"

    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalog/1.0 (contact@aurelianinternational.com)'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, info in pages.items():
                if 'imageinfo' in info and len(info['imageinfo']) > 0:
                    ii = info['imageinfo'][0]
                    img_url = ii.get('url')
                    w = ii.get('width', 0)
                    h = ii.get('height', 0)
                    mime = ii.get('mime', '')
                    if img_url and w >= 800 and 'image' in mime and not mime.endswith('svg'):
                        return img_url, w, h
    except Exception as e:
        print(f"Error for {title_or_query}: {e}")
    return None, 0, 0

print("Testing direct searches...")
for slug, titles in EXACT_TITLES.items():
    found = False
    for t in titles:
        url, w, h = get_wikimedia_file(t)
        if url:
            print(f"[OK] {slug} -> {t} ({w}x{h})")
            found = True
            break
    if not found:
        # fallback search
        clean_name = slug.replace('-powder-saunth', '').replace('-powder-amchur', '').replace('-powder', '').replace('-', ' ')
        url, w, h = get_wikimedia_file(f"{clean_name} isolated")
        if url:
            print(f"[FALLBACK OK] {slug} -> '{clean_name} isolated' ({w}x{h})")
        else:
            print(f"[MISSING] {slug}")
