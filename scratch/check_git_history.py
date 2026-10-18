import subprocess

out = subprocess.check_output(['git', 'log', '-n', '15', '--stat'], text=True, encoding='utf-8')
print(out[:1500])
