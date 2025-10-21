#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# 读取文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 高管专用翻译映射 - Section 3
executives_section3_translations = {
    "Prioritize growth levers": "优先考虑增长杠杆",
    "Given our goals [insert business goals], identify 3 high-potential growth levers and estimate effort vs. impact. Include a table with short descriptions and trade-offs.": "根据我们的目标[插入业务目标],识别3个高潜力增长杠杆并估算努力与影响。包括带简短描述和权衡的表格。",

    "Analyze market entry risks": "分析市场进入风险",
    "We are considering entering [new market/region]. Based on current economic, legal, and competitive factors, summarize key risks and mitigation strategies in bullet format.": "我们正在考虑进入[新市场/地区]。基于当前经济、法律和竞争因素,以项目符号格式总结关键风险和缓解策略。",

    "Reframe strategic trade-offs": "重构战略权衡",
    "We're choosing between [Option A] and [Option B] for our next big investment. Compare trade-offs across cost, time, team capacity, and customer impact. Recommend based on goal fit.": "我们正在为下一个重大投资在[选项A]和[选项B]之间选择。比较成本、时间、团队能力和客户影响的权衡。根据目标契合度推荐。",

    "Design a 3-year strategy outline": "设计3年战略大纲",
    "Based on these business priorities [insert high-level goals], help me develop a high-level 3-year strategy. Include major focus areas, risks, and milestones per year.": "基于这些业务优先事项[插入高层目标],帮助我制定高层次的3年战略。包括每年的主要关注领域、风险和里程碑。",
}

# Section 4
executives_section4_translations = {
    "Identify top and bottom performing segments": "识别表现最好和最差的细分市场",
    "This is a dataset of performance across [regions/products/customers]. Identify which segments are over- and under-performing relative to the average. Show the metrics driving this and recommend 2 actions based on the findings.": "这是跨[地区/产品/客户]的绩效数据集。识别哪些细分市场相对于平均水平表现过高或过低。显示驱动因素的指标并基于发现推荐2个行动。",

    "Analyze quarterly business metrics": "分析季度业务指标",
    "I'm reviewing performance data for Q[insert quarter]. Analyze this dataset [upload CSV] for key trends in revenue, churn, and customer acquisition. Highlight 3 insights I should share with the board and suggest follow-up questions I should ask.": "我正在审查第[插入季度]季度的绩效数据。分析此数据集[上传CSV]以了解收入、流失和客户获取的关键趋势。突出我应与董事会分享的3个洞察,并建议我应提出的后续问题。",

    "Analyze customer journey drop-off": "分析客户旅程流失",
    "I uploaded a funnel dataset showing customer journey stages. Analyze conversion rates between each stage and identify the largest drop-offs. Suggest 2–3 hypotheses and next steps to test or investigate.": "我上传了显示客户旅程阶段的漏斗数据集。分析每个阶段之间的转化率并识别最大的流失点。建议2-3个假设和要测试或调查的后续步骤。",

    "Forecast next quarter based on historical trends": "基于历史趋势预测下一季度",
    "Based on this historical data [upload], build a simple forecast for [KPI, e.g. revenue] over the next quarter. Use a basic time-series model and explain any assumptions made. Present as a short briefing I can share with my leadership team.": "基于此历史数据[上传],为下一季度的[KPI,例如收入]建立简单预测。使用基本时间序列模型并解释所做的任何假设。以我可以与领导团队分享的简短简报形式呈现。",

    "Prioritize strategic investments": "优先考虑战略投资",
    "I uploaded a dataset of ongoing or proposed initiatives with cost, impact score, and estimated time to ROI. Help me prioritize these initiatives by building a simple scoring model and plotting effort vs. impact. Summarize the top 3 recommendations.": "我上传了包含成本、影响评分和估计投资回报时间的正在进行或拟议计划的数据集。通过构建简单评分模型并绘制努力与影响来帮助我优先排序这些计划。总结前3个建议。",
}

# Section 5
executives_section5_translations = {
    "Build a competitive landscape grid": "构建竞争格局网格",
    "Based on the following list of competitors and their differentiators [paste], create a 2x2 matrix plotting them by [x axis] and [y axis]. Label each quadrant and include our position.": "基于以下竞争对手及其差异化因素列表[粘贴],创建一个2x2矩阵,按[x轴]和[y轴]绘制它们。标记每个象限并包括我们的位置。",

    "Design a 2x2 market positioning matrix": "设计2x2市场定位矩阵",
    "Create a 2x2 matrix plotting companies in [industry] by [X-axis: e.g. pricing] and [Y-axis: e.g. innovation]. Label each quadrant, add 6–8 companies, and highlight where we fit. Keep it suitable for a board presentation.": "创建一个2x2矩阵,按[X轴:例如定价]和[Y轴:例如创新]绘制[行业]中的公司。标记每个象限,添加6-8家公司,并突出显示我们的位置。使其适合董事会演示。",

    "Show transformation timeline": "展示转型时间线",
    "Create a visual timeline showing a company transformation journey from [year 1] to [year 3]. Include key milestones: strategy shifts, team growth, market expansion. Style: simple, bold, professional.": "创建一个视觉时间线,展示公司从[第1年]到[第3年]的转型旅程。包括关键里程碑:战略转变、团队增长、市场扩张。风格:简单、大胆、专业。",

    "Visualize strategic vision or flywheel": "可视化战略愿景或飞轮",
    "Create a high-level strategic flywheel or vision diagram for a company focused on [industry or goal]. Show how inputs (e.g. customers, data, feedback) loop into outputs (e.g. growth, innovation). Keep it clean, modern, and executive-ready.": "为专注于[行业或目标]的公司创建高层战略飞轮或愿景图。展示输入(例如客户、数据、反馈)如何循环到输出(例如增长、创新)。保持简洁、现代且适合高管。",

    "Illustrate a future product Vision": "描绘未来产品愿景",
    "Create a conceptual image of a future product vision for [industry/product]. Highlight features that reflect innovation and customer benefit. Style should be forward-looking, abstract but clear.": "为[行业/产品]创建未来产品愿景的概念图像。突出反映创新和客户利益的功能。风格应面向未来、抽象但清晰。",
}

# 找到高管专用包并更新
for pack in data:
    if pack.get('slug') == 'use-cases-executives':
        # Section 3
        if len(pack['sections']) > 2:
            for prompt in pack['sections'][2]['prompts']:
                usecase_en = prompt['useCase']['en']
                prompt_en = prompt['prompt']['en']
                if usecase_en in executives_section3_translations:
                    prompt['useCase']['zh'] = executives_section3_translations[usecase_en]
                if prompt_en in executives_section3_translations:
                    prompt['prompt']['zh'] = executives_section3_translations[prompt_en]

        # Section 4
        if len(pack['sections']) > 3:
            for prompt in pack['sections'][3]['prompts']:
                usecase_en = prompt['useCase']['en']
                prompt_en = prompt['prompt']['en']
                if usecase_en in executives_section4_translations:
                    prompt['useCase']['zh'] = executives_section4_translations[usecase_en]
                if prompt_en in executives_section4_translations:
                    prompt['prompt']['zh'] = executives_section4_translations[prompt_en]

        # Section 5
        if len(pack['sections']) > 4:
            for prompt in pack['sections'][4]['prompts']:
                usecase_en = prompt['useCase']['en']
                prompt_en = prompt['prompt']['en']
                if usecase_en in executives_section5_translations:
                    prompt['useCase']['zh'] = executives_section5_translations[usecase_en]
                if prompt_en in executives_section5_translations:
                    prompt['prompt']['zh'] = executives_section5_translations[prompt_en]

# 写回文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("翻译完成!")
