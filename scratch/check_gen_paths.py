import os, json

transcript_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\.system_generated\logs\transcript.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if line_idx in [3229, 3239, 3241, 3243, 3245, 3247, 3249, 3251, 3253, 3255, 3257, 3259, 3261]:
            data = json.loads(line)
            print(f"[{line_idx}]: {data.get('content')}")
