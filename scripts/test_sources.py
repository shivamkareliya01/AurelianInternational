import os

mapping = {
    # Agriculture
    "1121-basmati-rice": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\test_gen_1792073994501.jpg",
    "1509-basmati-rice": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_1509_basmati_1792074056511.jpg",
    "sella-basmati-rice": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_sella_basmati_1792074089904.jpg",
    "non-basmati-white-rice-ir64": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_ir64_rice_1792074122327.jpg",
    "sona-masoori-rice": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_sona_masoori_1792074155279.jpg",
    "milling-wheat": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_milling_wheat_1792074186585.jpg",
    "yellow-maize": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_yellow_maize_1792074228678.jpg",
    "bajra-pearl-millet": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_bajra_millet_1792074261578.jpg",
    "soybean": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_soybean_1792074302377.jpg",
    "toor-dal": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_toor_dal_1792074337819.jpg",
    "moong-dal": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_moong_dal_1792074378414.jpg",
    "masoor-dal": r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\gen_masoor_dal_1792074413439.jpg",
    "urad-dal": "scratch/candidates/Vigna_mungo_without_skin.jpg",

    # Fresh Vegetables
    "white-onion": "scratch/candidates/white_onions.jpg",
    "garlic": "public/products/garlic-test.jpg",
    "ginger": "scratch/candidates/batch2/ginger.jpg",
    "green-chilli": "scratch/candidates/batch2/green-chilli.jpg",
    "cauliflower": "scratch/test_images/cauliflower.jpg",

    # Fresh Fruits
    "cavendish-banana": "scratch/test_images/banana.jpg",
    "alphonso-mango": "scratch/test_images/mango.jpg",
    "kesar-mango": "scratch/candidates/kesar-mango.jpg",
    "thompson-seedless-grapes": "scratch/candidates/green-grapes.jpg",
    "nagpur-orange": "scratch/test_images/orange.jpg",
    "papaya": "scratch/test_images/papaya.jpg",

    # Spices
    "turmeric": "scratch/candidates/turmeric-roots.jpg",
    "guntur-red-chilli": "scratch/candidates/batch2/guntur-red-chilli.jpg",
    "black-pepper": "scratch/candidates/black-pepper.jpg",
    "cumin-seeds": "scratch/candidates/batch2/cumin-seeds.jpg",
    "coriander-seeds": "scratch/candidates/coriander.jpg",
    "green-cardamom": "scratch/candidates/cardamom-pods.jpg",
    "cloves": "scratch/candidates/batch2/cloves.jpg",
    "fenugreek-seeds": "scratch/candidates/batch2/fenugreek-seeds.jpg",
    "fennel-seeds": "scratch/candidates/batch2/fennel-seeds.jpg",
    "garam-masala": "scratch/candidates/batch2/garam-masala.jpg",

    # Natural Stones & Tiles
    "tan-brown-granite": "scratch/candidates/tan-brown-granite.jpg",
    "statuario-marble": "scratch/candidates/batch2/statuario-marble.jpg",
    "indian-green-marble": "scratch/candidates/batch2/indian-green-marble.jpg",
    "kashmir-white-granite": "scratch/candidates/granite_white_clean.jpg",
    "rainbow-sandstone": "scratch/candidates/batch2/rainbow-sandstone.jpg",
    "kota-limestone": "scratch/candidates/limestone_clean.jpg",
    "himachal-slate": "scratch/candidates/himachal_slate_clean.jpg",
    "quartzite": "scratch/candidates/batch2/quartzite.jpg",
    "vitrified-tiles": "scratch/candidates/batch2/vitrified-tiles.jpg",
    "porcelain-tiles": "scratch/candidates/batch2/porcelain-tiles.jpg",
    "ceramic-wall-tiles": "scratch/candidates/batch2/ceramic-wall-tiles.jpg",
    "cobblestones": "scratch/candidates/sett_cobblestone.jpg",

    # Dry Fruits & Nuts
    "cashew-nuts-w320": "scratch/candidates/batch2/cashew-nuts-w320.jpg",
    "cashew-nuts-w240": "scratch/candidates/batch2/cashew-nuts-w240.jpg",
    "pistachios": "scratch/candidates/batch2/pistachios.jpg",
    "dates": "scratch/candidates/batch2/dates.jpg",
    "figs": "scratch/candidates/batch2/figs.jpg",
    "apricots": "scratch/candidates/batch2/apricots.jpg",
    "makhana-fox-nut": "scratch/candidates/batch2/makhana-fox-nut.jpg",
}

print(f"Total mapped: {len(mapping)}")
all_exist = True
for slug, path in mapping.items():
    exists = os.path.exists(path)
    if not exists:
        print(f"MISSING: {slug} -> {path}")
        all_exist = False

if all_exist:
    print("ALL 53 SOURCE FILES EXIST!")
