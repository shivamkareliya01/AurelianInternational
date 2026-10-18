import json

log_file = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\.system_generated\logs\transcript.jsonl'
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        if '"step_index":5483' in line:
            data = json.loads(line)
            tc = data.get('tool_calls', [])
            if tc:
                print('TargetFile:', tc[0]['args'].get('TargetFile'))
                print('CodeContent:\n', tc[0]['args'].get('CodeContent')[:600])
