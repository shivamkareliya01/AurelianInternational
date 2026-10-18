import subprocess, re

for commit in ['86708e6', 'dbbedea']:
    try:
        out = subprocess.check_output(['git', 'show', f'{commit}:src/data/products.ts'], text=True)
        print(f"=== {commit} ===")
        for m in re.finditer(r'slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', out):
            print(m.groups())
    except Exception as e:
        print(commit, e)
