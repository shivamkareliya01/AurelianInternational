import sys, os
sys.path.append(os.path.dirname(__file__))
from search_wiki_files import search_files

queries = {
    "kashmir-white-granite": ["White granite slab", "White granite texture", "Granite white"],
    "indian-green-marble": ["Green marble", "Green marble slab", "Verde marble"],
    "kota-limestone": ["Limestone slab", "Limestone flagstone", "Limestone tile"],
    "quartzite": ["Quartzite texture", "Quartzite rock", "Quartzite stone"],
    "himachal-slate": ["Slate slab", "Slate texture", "Natural slate"],
    "vitrified-tiles": ["Glazed tile", "Polished tile", "Porcelain tile"],
    "cobblestones": ["Granite cobblestones", "Cobblestone pavement"],
}

for slug, q_list in queries.items():
    print(f"=== {slug} ===")
    for q in q_list:
        res = search_files(q, 2)
        if res:
            safe_title = res[0]['title'].encode('ascii', errors='replace').decode('ascii')
            print(f"  [{q}]: {safe_title} -> {res[0]['url']}")
            break
