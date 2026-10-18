import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const categories: Category\[\] = (\[[\s\S]*?\n\]);', text)
cats = json.loads(m.group(1))

# Category mapping
cat_map = {
    'agriculture': 'agriculture',
    'fresh-vegetables': 'vegetables',
    'fresh-fruits': 'fruits',
    'spices': 'spices',
    'natural-stones': 'stones',
    'ceramic-tiles': 'stones'
}

# Specific high-precision subjects for non-powder products:
subjects = {
    # Vegetables (9)
    "nashik-red-onion": "three whole fresh red onions with crisp purple-red papery skin and one halved onion showing concentric purple rings",
    "white-onion": "three whole fresh white onions with papery cream-white skin and one halved onion showing translucent white crisp layers",
    "potato": "four smooth oval golden-brown potatoes with clean skin and one cut in half showing creamy starchy flesh",
    "tomato": "three ripe glossy red vine tomatoes with green calyx and one sliced tomato showing juicy seed cavities",
    "garlic": "two whole plump white garlic bulbs and several peeled and unpeeled creamy cloves",
    "ginger": "several knobby fresh ginger rhizomes with light tan skin and two cut pieces showing bright fibrous yellow flesh",
    "green-chilli": "a neat cluster of slender glossy vibrant green chillies with fresh stems, one sliced lengthwise",
    "carrot": "a bunch of slender crisp orange and red Delhi carrots with fresh green feathery tops, one cut in half",
    "drumstick-moringa": "several long slender ridged green moringa drumstick pods, one cut into pieces showing tender white seeds inside",

    # Fruits (9)
    "cavendish-banana": "a small pristine hand of bright yellow Cavendish bananas with green tips and one peeled banana",
    "alphonso-mango": "three ripe golden-yellow Alphonso mangoes with subtle red blush and one sliced cheek with neat cross-hatch pattern",
    "kesar-mango": "three ripe golden-yellow Kesar mangoes and one sliced cheek showing rich saffron-orange juicy flesh",
    "bhagwa-pomegranate": "one whole glossy deep-red Bhagwa pomegranate and one split open revealing glistening ruby-red arils",
    "thompson-seedless-grapes": "a generous tight bunch of translucent pale-green oval Thompson seedless grapes with a frosty natural bloom",
    "nagpur-orange": "three glossy bright-orange loose-jacket Nagpur mandarins and one halved showing segmented juicy vesicles",
    "lemon": "three whole bright yellow lemons with natural pebble texture and one sliced in half showing juicy translucent segments",
    "papaya": "one whole golden-green papaya and one long half showing vibrant orange pulp and shiny black round seeds",
    "pineapple": "one whole ripe golden-yellow Queen pineapple with sharp green crown and several golden juicy slices",

    # Spices (14)
    "turmeric": "whole cured golden-yellow turmeric finger rhizomes with a few pieces broken open showing intense deep-orange core",
    "guntur-red-chilli": "a small heap of dried whole glossy deep-red Guntur chillies with stems intact",
    "black-pepper": "whole wrinkled deep black Tellicherry peppercorns in a ceramic dish with loose peppercorns scattered",
    "cumin-seeds": "dried fragrant elongated greenish-brown cumin seeds (jeera) with fine longitudinal ridges",
    "cinnamon": "curled rolls of natural brown cinnamon quills and bark sticks with visible delicate woody layers",
    "fenugreek-seeds": "golden-amber hard rhombic fenugreek seeds (methi) with characteristic diagonal groove",
    "coriander-seeds": "whole dried spherical golden-tan coriander seeds (dhania) with distinct aromatic ridges",
    "green-cardamom": "whole plump vibrant green cardamom pods with a few pods split open showing shiny aromatic dark seeds",
    "cloves": "whole dark reddish-brown clove buds with plump unopened four-lobed flower heads and stems",
    "fennel-seeds": "dried whole fragrant pale green-brown fennel seeds (saunf) with prominent ridges",
    "mustard-seeds": "clean tiny spherical bold black and dark-brown Indian mustard seeds (rai)",
    "star-anise": "whole eight-pointed star anise pods with polished golden seeds visible inside each carpel boat",
    "bay-leaf": "dried whole aromatic olive-green Indian tejpatta bay leaves with three characteristic longitudinal veins",
    "garam-masala": "rich fragrant golden-brown ground garam masala blend in a rustic bowl beside whole cinnamon, cardamom and cloves",

    # Agriculture (16)
    "1121-basmati-rice": "extra-long aged slender polished white 1121 Basmati rice grains with glistening pearl translucent finish",
    "1509-basmati-rice": "aged long slender cream-white 1509 Basmati rice grains displayed in a wooden bowl with wooden scoop",
    "sella-basmati-rice": "golden parboiled extra-long slender Sella Basmati rice grains with golden-amber translucent hue",
    "non-basmati-white-rice-ir64": "clean milled medium-grain white raw IR-64 rice grains",
    "sona-masoori-rice": "delicate lightweight aromatic short-medium white Sona Masoori rice grains",
    "milling-wheat": "hard golden-amber wheat kernels (Sharbati milling wheat) with clean oval grooved grain structure",
    "yellow-maize": "clean bright golden-yellow dried maize corn kernels free of husk",
    "bajra-pearl-millet": "small greyish-blue oval pearl millet grains (bajra) with smooth sheen",
    "soybean": "clean round cream-yellow dried non-GMO soybean seeds with small brown hilum eye",
    "groundnut-peanut-kernels": "clean bold reddish-pink skinned peanut kernels (Java / Bold type) with whole kernels and split halves",
    "sesame-seeds": "pearlescent natural white sesame seeds with flat teardrop shape and silky sheen",
    "kabuli-chickpeas": "large plump wrinkly cream-beige 10mm+ bold Kabuli chickpeas (garbanzo beans)",
    "toor-dal": "split and polished golden-yellow pigeon pea lentils (toor / arhar dal) with bright clean edges",
    "moong-dal": "split and dehusked bright yellow mung bean lentils (moong dal) with clean lens-shaped kernels",
    "masoor-dal": "split and polished vivid reddish-coral orange masoor lentils with smooth clean surface",
    "urad-dal": "split and skinned ivory-white black gram lentils (urad dal / dhuli) with pristine pearl surface",

    # Natural Stones (12)
    "makrana-white-marble": "a neat stack of polished Makrana white marble slab samples with subtle grey feather veining and one sample angled, soft studio reflection",
    "statuario-marble": "a stack of polished white Statuario marble tiles with dramatic bold grey veining in a bright white studio setting",
    "indian-green-marble": "a stack of polished deep emerald-green Indian marble tile samples with white quartz veining on light surface",
    "black-galaxy-granite": "a stack of polished black galaxy granite tile samples with sparkling golden-bronze flecks in a bright studio",
    "tan-brown-granite": "a stack of polished Tan Brown granite slab samples with rich dark brown and black crystalline minerals",
    "kashmir-white-granite": "a stack of polished Kashmir White granite tiles with soft grey waves and burgundy garnet specks",
    "rainbow-sandstone": "honed architectural slabs of Rainbow sandstone showing fine multicolored purple, violet and golden-yellow wave banding",
    "kota-limestone": "a stack of calibrated blue-green Kota limestone paving slabs with smooth honed finish and sawn edges",
    "himachal-slate": "a stack of natural cleft Himachal slate tiles with subtle silvery mica sheen and layered stone edges",
    "quartzite": "a stack of hard dense golden-grey quartzite stone paving tiles with fine sparkling natural split surface",
    "cobblestones": "a neat grouping of hand-cut natural cleft granite cobblestones with textured six-sided surfaces",
    "pebbles-river-gravel": "tumble-polished smooth river pebbles in mixed black, white and honey-ochre colors in a shallow tray",

    # Ceramic & Vitrified Tiles (10)
    "vitrified-tiles": "a stack of polished double-charged vitrified floor tiles with mirror finish and calibrated edges in a studio",
    "porcelain-tiles": "a stack of large-format rectified porcelain tiles with matte warm-grey concrete surface texture",
    "ceramic-wall-tiles": "a display stack of glossy white beveled subway ceramic wall tiles with crisp clean edges",
    "glazed-vitrified-tiles": "a stack of high-gloss glazed vitrified tiles (GVT) with Italian Calacatta marble design reproduction",
    "large-format-porcelain-slabs": "large-format continuous porcelain slab sample showing seamless marble veining on bright studio plinth",
    "polished-porcelain-tiles": "a stack of nano-polished super-white porcelain tiles with brilliant reflective surface",
    "digital-wall-tiles": "a display set of digitally printed ceramic wall tiles with embossed decorative geometric texture",
    "subway-ceramic-tiles": "a stack of classic beveled white ceramic subway tiles with glossy glaze finish",
    "outdoor-parking-tiles": "heavy-duty textured anti-slip vitrified parking tiles with rustic terracotta-grey relief pattern",
    "anti-skid-ceramic-tiles": "a stack of matte textured anti-skid bathroom ceramic floor tiles with fine sugar-finish grip"
}

catalog = []
for c in cats:
    if c['slug'] in cat_map:
        category_name = cat_map[c['slug']]
        for p in c['products']:
            subject = subjects.get(p['slug'], p['name'])
            catalog.append({
                "slug": p['slug'],
                "name": p['name'],
                "category": category_name,
                "subject": subject
            })

print(f"Total catalog items built: {len(catalog)}")
with open('catalog.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2)

print("SUCCESS: wrote catalog.json with 70 items.")
