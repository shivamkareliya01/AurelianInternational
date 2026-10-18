import glob, os

powders = [
    'lemon-powder', 'rose-petal-powder', 'guava-powder', 'papaya-powder',
    'banana-powder', 'amla-powder', 'aloe-vera-powder', 'wheatgrass-powder',
    'bitter-gourd-karela-powder', 'pomegranate-anardana-powder',
    'mango-powder-amchur', 'pumpkin-powder', 'green-chilli-powder'
]

for p in powders:
    prefix = p.split('-')[0]
    matches = glob.glob(f'scratch/**/*{prefix}*', recursive=True)
    clean_matches = [m for m in matches if not m.endswith('.py') and not m.endswith('.json')]
    print(f"{p}: {len(clean_matches)} matches")
    for m in clean_matches[:3]:
        print("  ", m)
