#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# 读取文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 营销专用 Section headings 修正和翻译映射
marketing_section_headings = {
    "Campaign planning & strategy": "活动规划与策略",
    "Competitive and market research": "竞争与市场研究",
    "Content & creative development": "内容与创意开发",
    "Data analysis & optimization": "数据分析与优化",
    "Visual & brand communication": "视觉与品牌传播"
}

# 营销专用完整翻译
marketing_translations = {
    # Section 1 - Campaign planning & strategy
    "Visualize campaign timeline": "可视化活动时间线",
    "Build a timeline for our upcoming multi-channel campaign. Key dates and milestones are: [insert info]. Output as a horizontal timeline with phases, owners, and deadlines.": "为即将进行的多渠道活动构建时间线。关键日期和里程碑是:[插入信息]。以水平时间线形式输出,包含阶段、负责人和截止日期。",

    "Brainstorm campaign ideas": "头脑风暴活动创意",
    "Brainstorm 5 creative campaign ideas for our upcoming [event/launch]. The audience is [insert target], and our goal is [insert goal]. Include a theme, tagline, and 1-2 core tactics per idea.": "为即将到来的[活动/发布]头脑风暴5个创意活动想法。受众是[插入目标],我们的目标是[插入目标]。每个想法包括主题、标语和1-2个核心策略。",

    "Draft a creative brief": "起草创意简报",
    "Create a creative brief for our next paid media campaign. Here's the goal, audience, and offer: [insert info]. Include sections for objective, audience insights, tone, assets needed, and KPIs.": "为下一个付费媒体活动创建创意简报。目标、受众和优惠是:[插入信息]。包括目标、受众洞察、语气、所需资产和KPI的部分。",

    "Build a messaging framework": "构建信息框架",
    "Build a messaging framework for a new product. The product details are: [insert info]. Output a table with 3 pillars: key benefits, proof points, and emotional triggers.": "为新产品构建信息框架。产品详情是:[插入信息]。输出包含3个支柱的表格:关键利益、证明点和情感触发点。",

    "Build a customer journey map": "构建客户旅程图",
    "Create a customer journey map for our [product/service]. Our typical customer is [insert profile]. Break it into stages, goals, touchpoints, and potential pain points per stage. Output as a table.": "为我们的[产品/服务]创建客户旅程图。我们的典型客户是[插入档案]。将其分解为各阶段的目标、接触点和潜在痛点。以表格形式输出。",

    # Section 2 - Competitive and market research
    "Competitive content analysis": "竞争内容分析",
    "Research how top 5 competitors structure their blog content strategy. Include tone, topics, frequency, SEO focus, and CTAs. Provide URLs, takeaways, and a table summarizing common and standout tactics.": "研究前5名竞争对手如何构建博客内容策略。包括语气、主题、频率、SEO焦点和CTA。提供URL、要点和总结常见和突出策略的表格。",

    "Research emerging trends in buyer behavior": "研究买家行为的新兴趋势",
    "Research 2024 trends in how [type] buyers research and evaluate [industry] products. Include behavior shifts, content preferences, and channel usage. Cite sources and format as a short briefing with bullet-point insights.": "研究2024年[类型]买家如何研究和评估[行业]产品的趋势。包括行为转变、内容偏好和渠道使用情况。引用来源并以带要点洞察的简短简报格式呈现。",

    "Research regional campaign benchmarks": "研究区域活动基准",
    "Research typical CTRs, CPCs, and conversion rates for digital campaigns targeting [location] in 2024. Focus on [ad channels]. Include source links and a table comparing each metric by country.": "研究2024年针对[地点]的数字活动的典型CTR、CPC和转化率。关注[广告渠道]。包括来源链接和按国家比较每个指标的表格。",

    "Research industry event competitor presence": "研究行业活动竞争对手存在",
    "Compile a summary of how our competitors are participating in [insert upcoming event]. Include booth activations, speaking sessions, sponsorships, and media coverage. Output as a table with links and analysis.": "编制竞争对手如何参与[插入即将举行的活动]的摘要。包括展位激活、演讲会议、赞助和媒体报道。以带链接和分析的表格形式输出。",

    "Research AI tools for marketers": "研究营销人员的AI工具",
    "Research the most recommended [tools] for marketers by function (e.g. copywriting, planning, analytics, design). Create a table with features, pricing, pros/cons, and primary use case. Include sources.": "按功能研究营销人员最推荐的[工具](例如文案撰写、规划、分析、设计)。创建包含功能、定价、优缺点和主要用例的表格。包括来源。",

    # Section 3 - Content & creative development
    "Draft a product launch email": "起草产品发布电子邮件",
    "Write a launch email for our new product. Use the following info about the product and target audience: [insert details]. Make it engaging and persuasive, formatted as a marketing email ready for review.": "为新产品撰写发布电子邮件。使用以下产品和目标受众信息:[插入详情]。使其引人入胜且有说服力,格式化为准备审核的营销电子邮件。",

    "Generate ad copy variations": "生成广告文案变体",
    "Create 5 ad copy variations for a [channel] campaign. Here's the campaign theme and audience info: [insert context]. Each version should test a different hook or tone.": "为[渠道]活动创建5个广告文案变体。活动主题和受众信息:[插入背景]。每个版本应测试不同的钩子或语气。",

    "Create a social post series": "创建社交帖子系列",
    "Draft a 3-post social media series promoting [event, product, or milestone]. Use this background for context: [paste details]. Each post should include copy and a suggested visual description.": "起草推广[活动、产品或里程碑]的3篇社交媒体系列。使用此背景:[粘贴详情]。每篇帖子应包括文案和建议的视觉描述。",

    "Create a customer spotlight post": "创建客户聚焦帖子",
    "Write a customer spotlight post based on this success story: [paste key details]. Make it conversational, authentic, and aligned to our brand voice. Output as a LinkedIn post draft.": "基于此成功故事撰写客户聚焦帖子:[粘贴关键详情]。使其对话化、真实,并与我们的品牌声音保持一致。以LinkedIn帖子草稿形式输出。",

    "Create an explainer video script": "创建解释视频脚本",
    "Draft a script for a 60-second explainer video about [product/topic]. Here's what it should cover: [insert info]. Make it punchy and clear, with suggested visuals or animations.": "为关于[产品/主题]的60秒解释视频起草脚本。它应涵盖:[插入信息]。使其简洁明了,附带建议的视觉效果或动画。",

    # Section 4 - Data analysis & optimization
    "Identify top-performing marketing channels": "识别表现最佳的营销渠道",
    "Analyze this marketing performance spreadsheet and identify which channels had the highest ROI. The file includes data from Q1–Q2 campaigns across email, social, paid search, and events. Summarize top 3 channels and create a chart showing ROI by channel.": "分析此营销绩效电子表格并识别哪些渠道的ROI最高。文件包括第1-2季度跨电子邮件、社交、付费搜索和活动的数据。总结前3个渠道并创建按渠道显示ROI的图表。",

    "Uncover customer churn patterns": "揭示客户流失模式",
    "Review this customer churn dataset and identify common characteristics of churned customers. Use columns like tenure, product usage, and support tickets to group insights. Output a short summary with a chart or table showing top risk factors.": "审查此客户流失数据集并识别流失客户的共同特征。使用任期、产品使用和支持票等列来分组洞察。输出带图表或表格的简短摘要,显示主要风险因素。",

    "Summarize survey results": "总结调查结果",
    "Summarize insights from this post-campaign customer feedback survey. The file includes satisfaction ratings and open-ended responses. Provide a 3-bullet executive summary and a chart of top satisfaction drivers.": "总结活动后客户反馈调查的洞察。文件包括满意度评分和开放式回答。提供3点执行摘要和显示主要满意度驱动因素的图表。",

    "Forecast next quarter's lead volume": "预测下一季度的潜在客户量",
    "Use this historical lead volume data from the past 6 quarters to project expected lead volume for the next quarter. Highlight any trends, seasonal patterns, and output a simple forecast chart.": "使用过去6个季度的历史潜在客户量数据来预测下一季度的预期潜在客户量。突出任何趋势、季节性模式,并输出简单的预测图表。",

    "Optimize campaign budget allocation": "优化活动预算分配",
    "Based on this spreadsheet of previous campaign spend and returns, recommend a revised budget allocation for next quarter. Focus on maximizing ROI while reducing spend on underperforming channels. Output as a table with new % allocations.": "基于以前活动支出和回报的电子表格,推荐下一季度的修订预算分配。专注于最大化ROI,同时减少表现不佳渠道的支出。以包含新百分比分配的表格形式输出。",

    # Section 5 - Visual & brand communication
    "Develop a brand style guide outline": "制定品牌风格指南大纲",
    "Create an outline for a brand style guide for [company/product]. Include sections for typography, color palette, logo usage, tone of voice, imagery style, and do's/don'ts.": "为[公司/产品]创建品牌风格指南大纲。包括排版、调色板、徽标使用、语气、图像风格和注意事项的部分。",
}

# 更新营销专用包
for pack in data:
    if pack.get('slug') == 'use-cases-marketing':
        # 修正section headings
        for i, section in enumerate(pack.get('sections', [])):
            section_en = section['heading']['en']
            if section_en in marketing_section_headings:
                section['heading']['zh'] = marketing_section_headings[section_en]

            # 更新description以匹配section heading
            if section_en == "Campaign planning & strategy":
                section['description']['zh'] = "ChatGPT支持构建、组织和头脑风暴营销活动。使用推理模型进行战略性头脑风暴。"
            elif section_en == "Competitive and market research":
                section['description']['zh'] = "ChatGPT支持竞争对手分析、基准研究和新兴趋势研究。使用网页搜索或深度研究获得更深入的实时洞察。"
            elif section_en == "Content & creative development":
                section['description']['zh'] = "ChatGPT支持生成营销文案、视觉效果和资产。使用画布功能进行实时编辑。"
            elif section_en == "Data analysis & optimization":
                section['description']['zh'] = "ChatGPT分析数据、预测趋势并改善决策。上传数据以进行更深入的分析。"
            elif section_en == "Visual & brand communication":
                section['description']['zh'] = "专注于制定连贯的视觉策略、品牌叙事和创意概念。使用ChatGPT创建图像。"

            # 翻译prompts
            for prompt in section.get('prompts', []):
                usecase_en = prompt['useCase']['en']
                prompt_en = prompt['prompt']['en']

                if usecase_en in marketing_translations:
                    prompt['useCase']['zh'] = marketing_translations[usecase_en]
                if prompt_en in marketing_translations:
                    prompt['prompt']['zh'] = marketing_translations[prompt_en]

# 写回文件
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("营销专用翻译完成!")
print(f"修正了 {len(marketing_section_headings)} 个section headings")
print(f"翻译了约 {len([k for k in marketing_translations.keys() if len(k) < 100])} 个用例")
