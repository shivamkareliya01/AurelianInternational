import json

with open('scratch/fruit_candidates.json', 'r') as f:
    data = json.load(f)

print(f"Total candidates: {len(data)}")
for i, c in enumerate(data):
    t = c['title']
    w, h = c['w'], c['h']
    desc = c['desc'][:80]
    print(f"{i:2d}: [{t}] ({w}x{h}) - {desc}")
