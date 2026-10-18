import os, json

transcript_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\.system_generated\logs\transcript.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if any(term in line for term in ['tomato_powder', 'beetroot_powder', 'carrot_powder', 'potato_flakes', 'pumpkin_powder', 'banana_powder', 'lemon_powder', 'amla_powder', 'aloe_vera_powder', 'hibiscus_powder']):
            try:
                data = json.loads(line)
                role = data.get('source')
                tool_calls = data.get('tool_calls', [])
                if tool_calls:
                    for tc in tool_calls:
                        print(f"[{line_idx}] CALL: {tc.get('name')} -> {tc.get('args', {}).get('CommandLine') or tc.get('args', {}).get('TargetFile') or tc.get('args')}")
                else:
                    content = str(data.get('content', ''))
                    print(f"[{line_idx}] RESP/MSG: {content[:120]}")
            except Exception:
                pass
