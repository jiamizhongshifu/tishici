# -*- coding: utf-8 -*-
import json

# Read current partially translated file
with open('data/promptPacks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Read original for reference
with open('data/promptPacks_original.json', 'r', encoding='utf-8') as f:
    original = json.load(f)

# Build a map of EN -> ZH using the well-translated first pack as template
# Then apply systematic translation to all remaining prompts

# For now, let's just verify what we have
total_prompts = 0
fully_translated = 0
partial_translated = 0

for pack in data:
    for section in pack['sections']:
        for prompt in section.get('prompts', []):
            total_prompts += 1
            zh_prompt = prompt['prompt']['zh']
            en_prompt = prompt['prompt']['en']
            
            # Check if fully translated (no English words except in placeholders)
            # Simple heuristic: if it contains common English words like "the", "and", "or", etc.
            if any(word in zh_prompt.lower() for word in [' the ', ' and ', ' or ', ' is ', ' are ', ' should ', ' will ']):
                partial_translated += 1
            else:
                fully_translated += 1

print(f"Total prompts: {total_prompts}")
print(f"Fully translated: {fully_translated}")
print(f"Partially translated: {partial_translated}")
print(f"\nTranslation status: {fully_translated}/{total_prompts} ({100*fully_translated/total_prompts:.1f}%)")
