#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# 读取文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 营销专用剩余翻译
marketing_remaining = {
    # Section 5剩余prompts
    "Conceptualize visual storytelling": "概念化视觉叙事",
    "Brainstorm 3 visual storytelling concepts for a brand campaign on [theme]. Include a concept name, visual style, and key narrative elements (e.g., story arc, mood, colors).": "为关于[主题]的品牌活动头脑风暴3个视觉叙事概念。包括概念名称、视觉风格和关键叙事元素(例如故事弧、情绪、颜色)。",

    "Create visual campaign moodboard": "创建视觉活动情绪板",
    "Create a moodboard with 4 visuals for our [campaign or brand update]. Theme is [describe theme], and the tone should be [describe tone]. Use photoreal or illustrated style.": "为[活动或品牌更新]创建包含4个视觉效果的情绪板。主题是[描述主题],语气应该是[描述语气]。使用写实或插画风格。",

    "Evaluate brand consistency": "评估品牌一致性",
    "Review the following marketing assets [insert links/files] and evaluate brand consistency in terms of tone, visuals, and messaging. Provide 3 strengths and 3 gaps with recommendations.": "审查以下营销资产[插入链接/文件]并从语气、视觉效果和信息角度评估品牌一致性。提供3个优势和3个差距及建议。",

    "Refresh brand identity concepts": "更新品牌识别概念",
    "Suggest 3 creative directions to refresh our brand identity. Include possible color palettes, typography styles, visual motifs, and tone updates that align with [audience/market shift].": "建议3个更新品牌识别的创意方向。包括可能的调色板、排版风格、视觉图案和与[受众/市场转变]一致的语气更新。",
}

# 更新营销专用包
for pack in data:
    if pack.get('slug') == 'use-cases-marketing':
        # 遍历所有sections
        for section in pack.get('sections', []):
            for prompt in section.get('prompts', []):
                usecase_en = prompt['useCase']['en']
                prompt_en = prompt['prompt']['en']

                if usecase_en in marketing_remaining:
                    prompt['useCase']['zh'] = marketing_remaining[usecase_en]
                if prompt_en in marketing_remaining:
                    prompt['prompt']['zh'] = marketing_remaining[prompt_en]

# 写回文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("营销专用剩余翻译完成!")
print(f"翻译了 {len([k for k in marketing_remaining.keys() if len(k) < 100])} 个剩余用例")
