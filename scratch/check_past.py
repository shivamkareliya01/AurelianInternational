import subprocess, re
out = subprocess.check_output(['git', 'show', '9ed57b0:src/data/products.ts'], text=True)
for m in re.finditer(r'{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"headline":', out):
    print(m.groups())
