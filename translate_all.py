#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re

# 读取文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 财务专用完整翻译
finance_translations = {
    # Section 1
    "Competitive fundraising analysis": "竞争性融资分析",
    "I'm a CFO preparing for our next fundraising round. Research recent funding rounds (past 12 months) in [insert industry]. Summarize deal sizes, valuations, lead investors, and positioning. Format as a briefing memo with source citations and clear bullet-point insights.": "我是CFO,正在准备下一轮融资。研究[插入行业]的近期融资轮次(过去12个月)。总结交易规模、估值、主要投资者和定位。以带来源引用和清晰要点洞察的简报备忘录格式呈现。",

    "Compare global tax regulations": "比较全球税收法规",
    "I manage global finance compliance. Research and compare corporate tax rates and reporting requirements in [insert countries]. Focus on tax incentives, reporting thresholds, and penalties. Deliver a comparison chart with links to official sources.": "我管理全球财务合规。研究并比较[插入国家]的公司税率和报告要求。关注税收激励、报告门槛和处罚。提供带官方来源链接的比较图表。",

    "ESG finance strategy benchmark": "ESG财务策略基准",
    "I'm updating our ESG financial strategy. Research how leading companies in [insert industry] integrate ESG into financial planning and disclosures. Summarize 3–5 examples with their KPIs, reporting cadence, and financial impact. Include references.": "我正在更新ESG财务策略。研究[插入行业]领先公司如何将ESG整合到财务规划和披露中。总结3-5个示例及其KPI、报告节奏和财务影响。包括参考文献。",

    # Section 2
    "Forecast revenue trends": "预测收入趋势",
    "Forecast next quarter's revenue based on the past 6 quarters of data. Use the trends from our [insert dataset or industry] to explain your reasoning. Present the forecast in a table and write a short executive summary.": "基于过去6个季度的数据预测下一季度的收入。使用来自[插入数据集或行业]的趋势来解释您的推理。以表格形式呈现预测并撰写简短的执行摘要。",

    "Draft budget assumptions for planning": "为规划起草预算假设",
    "Help me draft budget assumptions for our next annual plan. Context: [insert department/region/product info]. Output should include key assumptions, rationale, and any dependencies.": "帮助我为下一个年度计划起草预算假设。背景:[插入部门/地区/产品信息]。输出应包括关键假设、理由和任何依赖关系。",

    "Model cash flow scenarios": "建模现金流场景",
    "Model 3 cash flow scenarios based on these variables: [insert inputs such as revenue range, delays, or costs]. Output as a table with assumptions, key drivers, and estimated cash impact.": "基于这些变量建模3个现金流场景:[插入输入,如收入范围、延迟或成本]。以表格形式输出,包括假设、关键驱动因素和估计现金影响。",

    "Conduct ROI analysis for tooling": "进行工具投资回报率分析",
    "Conduct an ROI analysis for a new [insert software or tool] we're considering. Context: [insert usage or pricing data]. Output should include payback period, assumptions, and a short risk assessment.": "对我们正在考虑的新[插入软件或工具]进行ROI分析。背景:[插入使用或定价数据]。输出应包括回收期、假设和简短的风险评估。",

    "Compare pricing strategies": "比较定价策略",
    "Compare 3 potential pricing strategies for our [insert product or service]. Use prior pricing data from [insert past year] for context. Output should be a side-by-side comparison table with pros, cons, and estimated impact.": "比较[插入产品或服务]的3个潜在定价策略。使用[插入过去年份]的先前定价数据作为背景。输出应为并排比较表,包括优缺点和估计影响。",

    # Section 3
    "Prepare board meeting talking points": "准备董事会会议谈话要点",
    "Draft financial talking points for an upcoming board meeting. Use our [insert Q2 results or P&L summary] as input. Write the talking points in bullet format, focusing on topline metrics and risk/upsides.": "为即将召开的董事会会议起草财务谈话要点。使用[插入Q2结果或损益表摘要]作为输入。以项目符号格式撰写谈话要点,关注顶线指标和风险/上行空间。",

    "Write investor update summary": "撰写投资者更新摘要",
    "Write a summary for our next investor update. Use highlights from [insert performance report or fundraising update]. Format the output as a concise executive email suitable for external stakeholders.": "为下一次投资者更新撰写摘要。使用[插入绩效报告或融资更新]的亮点。将输出格式化为适合外部利益相关者的简洁执行电子邮件。",

    "Draft QBR financial slide content": "起草QBR财务幻灯片内容",
    "Draft the financial performance section for our next QBR deck. Use these inputs: [insert Q2 revenue, margin trends, notable cost changes]. Output as slide bullets with 1–2 takeaway lines.": "为下一个QBR演示起草财务绩效部分。使用这些输入:[插入Q2收入、利润率趋势、值得注意的成本变化]。以幻灯片要点形式输出,附带1-2行要点。",

    "Translate variance analysis": "转换方差分析",
    "Translate this variance analysis into a manager-friendly summary. Source: [insert analysis]. Write in plain language with a brief explanation of why each variance occurred.": "将此方差分析转换为管理者友好的摘要。来源:[插入分析]。用通俗语言撰写,简要解释每个方差发生的原因。",

    "Summarize audit findings": "总结审计发现",
    "Summarize key findings from our internal audit. Use this document: [insert findings]. Output should be a summary for executives, with 3 themes and recommended next steps.": "总结内部审计的关键发现。使用此文档:[插入发现]。输出应为面向高管的摘要,包含3个主题和建议的后续步骤。",

    # Section 4
    "Analyze cost reduction opportunities": "分析成本削减机会",
    "Identify cost reduction opportunities from our recent budget report. Use the breakdown from [insert cost center or department] to evaluate. Provide a table with opportunities, projected savings, and any potential risks.": "从最近的预算报告中识别成本削减机会。使用[插入成本中心或部门]的细分进行评估。提供包含机会、预计节省和潜在风险的表格。",

    "Evaluate M&A target fit": "评估并购目标契合度",
    "Evaluate the financial and strategic fit of an M&A target. Use this context: [insert company profile or key metrics]. Output should be a table of pros/cons and a 3-paragraph summary of risk/reward.": "评估并购目标的财务和战略契合度。使用此背景:[插入公司概况或关键指标]。输出应为优缺点表格和3段风险/回报摘要。",

    "Identify accounting process gaps": "识别会计流程差距",
    "Review our current accounting close checklist and suggest improvements. Use this documentation: [insert SOP or task list]. Output should highlight bottlenecks and recommend process updates.": "审查我们当前的会计结账检查清单并提出改进建议。使用此文档:[插入SOP或任务列表]。输出应突出瓶颈并推荐流程更新。",

    "Review vendor payments for consolidation": "审查供应商付款以进行整合",
    "Analyze vendor payments in this data [upload file]. Identify top 10 vendors by spend, spot any duplication (e.g., similar vendor names), and recommend vendors to consolidate. Output a table and short cost-reduction summary.": "分析此数据中的供应商付款[上传文件]。按支出识别前10名供应商,发现任何重复(例如相似的供应商名称),并推荐要整合的供应商。输出表格和简短的成本削减摘要。",

    "Procurement strategy cost levers": "采购策略成本杠杆",
    "I'm leading a finance initiative to cut procurement costs. Research strategies used by Fortune 500 companies to reduce procurement spend without harming supplier relationships. Present 3–5 tactics with cost impact examples and cited sources.": "我正在领导削减采购成本的财务计划。研究财富500强公司在不损害供应商关系的情况下减少采购支出的策略。提出3-5种策略,附带成本影响示例和引用来源。",

    # Section 5
    "Visualize revenue growth funnel": "可视化收入增长漏斗",
    "Create an image of a revenue growth funnel with labeled stages: Acquisition → Activation → Revenue → Retention → Expansion. Use a clean, modern style suitable for an executive finance presentation. Include icons for each stage.": "创建收入增长漏斗图像,标记阶段:获取 → 激活 → 收入 → 保留 → 扩展。使用适合高管财务演示的简洁、现代风格。为每个阶段包含图标。",

    "Illustrate budget planning workflow": "说明预算规划工作流程",
    "Create a horizontal process flow diagram showing a budget planning cycle: Forecasting → Review → Stakeholder Input → Approval → Tracking → Adjustment. Use corporate-style visuals with subtle color and labels.": "创建水平流程图,显示预算规划周期:预测 → 审查 → 利益相关者输入 → 批准 → 跟踪 → 调整。使用带有微妙色彩和标签的企业风格视觉效果。",

    "ESG finance impact visual": "ESG财务影响可视化",
    "Create a visual showing how ESG initiatives can impact finance metrics. Show links between sustainability investments and cost savings, risk mitigation, and investor interest. Use a modern, green-themed design with arrows.": "创建显示ESG计划如何影响财务指标的视觉效果。显示可持续性投资与成本节约、风险缓解和投资者兴趣之间的联系。使用带箭头的现代绿色主题设计。",

    "Executive dashboard concept": "高管仪表板概念",
    "Generate a conceptual image of a finance executive dashboard showing high-level KPIs: Revenue, Gross Margin, Burn Rate, Runway, and Budget vs. Actual. Use a clean layout with panels and placeholder numbers.": "生成财务高管仪表板的概念图像,显示高级KPI:收入、毛利率、燃烧率、跑道和预算与实际。使用带面板和占位符数字的简洁布局。",
}

# 更新财务专用包
for pack in data:
    if pack.get('slug') == 'use-cases-finance':
        # 遍历所有sections
        for section in pack.get('sections', []):
            for prompt in section.get('prompts', []):
                usecase_en = prompt['useCase']['en']
                prompt_en = prompt['prompt']['en']

                if usecase_en in finance_translations:
                    prompt['useCase']['zh'] = finance_translations[usecase_en]
                if prompt_en in finance_translations:
                    prompt['prompt']['zh'] = finance_translations[prompt_en]

# 写回文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("财务专用翻译完成!")
print(f"翻译了 {len([k for k in finance_translations.keys() if not k.startswith('I')])} 个用例")
