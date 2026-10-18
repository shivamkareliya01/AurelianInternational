import subprocess
out = subprocess.check_output(['git', 'show', '5392f1e:src/data/products.ts'], text=True)
import re
# find all category slugs
for m in re.finditer(r'{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"headline":', out):
    print(m.groups())
