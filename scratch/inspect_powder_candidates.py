import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/remaining_powder_matches.json', 'r', encoding='utf-8') as f:
    m1 = json.load(f)
with open('scratch/extra_powder_matches.json', 'r', encoding='utf-8') as f:
    m2 = json.load(f)

all_matches = {**m1, **m2}

for slug, items in all_matches.items():
    print(f"\n=== {slug} ({len(items)} items) ===")
    seen = set()
    for it in items[:4]:
        t = it['title']
        if t not in seen:
            seen.add(t)
            print(f"  [{t}] ({it['w']}x{it['h']}) - {it['desc'][:60]}")
