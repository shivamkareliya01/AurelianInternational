import os, json

transcript_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\.system_generated\logs\transcript.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if line_idx >= 3220 and line_idx <= 3270:
            try:
                data = json.loads(line)
                role = data.get('source')
                tp = data.get('type')
                content = str(data.get('content', ''))
                tool_calls = data.get('tool_calls', [])
                if tool_calls:
                    print(f"[{line_idx}] {role} CALL: {[tc.get('name') for tc in tool_calls]}")
                elif 'ARTIFACT' in content or '.png' in content or '.jpg' in content:
                    print(f"[{line_idx}] {role} RESP: {content[:150]}")
            except Exception:
                pass
