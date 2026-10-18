import re
content = open('src/data/exportCountries.ts', 'r', encoding='utf-8').read()
matches = re.finditer(r'\{\s*iso2:\s*"(US|NL|DE|ZA|KE|AU)".*?routeD:.*?\n\s*topCargo:.*?\n\s*legTwoDays:.*?\n\s*\}', content, re.DOTALL)
out = []
for m in matches:
    out.append(m.group(0))

with open('scratch/existing_entries.txt', 'w', encoding='utf-8') as f:
    f.write("\n\n--------------------\n\n".join(out))
    f.write("\n\n--- Origin Gateway ---\n")
    m_orig = re.search(r'originGateway.*?\};', content, re.DOTALL)
    if m_orig: f.write(m_orig.group(0))
    f.write("\n\n--- UAE Hub ---\n")
    m_hub = re.search(r'uaeCentralHub.*?\};', content, re.DOTALL)
    if m_hub: f.write(m_hub.group(0))

print("Dumped successfully, len:", len(out))
