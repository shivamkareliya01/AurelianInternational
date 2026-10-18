import subprocess, re

out = subprocess.check_output(['git', 'show', 'HEAD:src/data/products.ts'], text=True, encoding='utf-8')
matches = re.findall(r'\{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"headline":', out)
for m in matches:
    print(m)
