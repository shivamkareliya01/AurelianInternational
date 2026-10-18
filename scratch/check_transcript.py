import os, json

transcript_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\.system_generated\logs\transcript.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if 'generate_image' in line:
            try:
                data = json.loads(line)
                for tc in data.get('tool_calls', []):
                    if tc.get('name') == 'generate_image':
                        args = tc.get('args', {})
                        print(f"[{line_idx}] generate_image: {args.get('ImageName')} -> prompt: {args.get('Prompt')[:80]}...")
            except Exception:
                pass
