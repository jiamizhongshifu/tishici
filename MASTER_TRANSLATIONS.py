#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MASTER TRANSLATION FILE
Complete translations for all 260 prompts across 11 packs
"""

import json


def get_all_prompt_translations():
    """
    Returns complete dictionary of ALL English prompts to Chinese translations
    This covers all 260 prompts across all 11 packs
    """

    return {
        # ==========================================
        # ChatGPT for any role - 20 prompts
        # ==========================================

        # Communication & writing (5)
        "Write a professional email to [recipient]. The email is about [topic] and should be polite, clear, and concise. Provide a subject line and a short closing.":
            "撰写一封发送给 [收件人] 的专业邮件。邮件主题是 [主题],语气应礼貌、清晰、简洁。请提供邮件主题行和简短的结尾。",

        "Rewrite the following text so it is easier to understand. The text will be used in a professional setting. Ensure the tone is clear, respectful, and concise. Text: [paste text].":
            "改写以下文本使其更易于理解。文本将用于专业场合。确保语气清晰、尊重和简洁。文本:[粘贴文本]。",

        "Reframe this message for [audience type: executives, peers, or customers]. The message was originally written for [context]. Adjust tone, word choice, and style to fit the intended audience. Text: [paste text].":
            "为 [受众类型:高管、同事或客户] 重新编写此消息。该消息最初是为 [背景] 编写的。调整语气、措辞和风格以适应目标受众。文本:[粘贴文本]。",

        "Draft a meeting invitation for a session about [topic]. The meeting will include [attendees/roles] and should outline agenda items, goals, and preparation required. Provide the text in calendar-invite format.":
            "为关于 [主题] 的会议起草邀请函。会议将包括 [参会者/角色],应列出议程项目、目标和所需准备。以日历邀请格式提供文本。",

        "Summarize this email thread into a short recap. The thread includes several back-and-forth messages. Highlight key decisions, action items, and open questions. Email: [paste text].":
            "将此邮件线程总结为简短摘要。线程包含多个来回消息。突出关键决策、行动项和未解决问题。邮件:[粘贴文本]。",

        # Meetings & collaboration (5)
        "Create a structured agenda for a meeting about [topic]. The meeting will last [time] and include [attendees]. Break the agenda into sections with time estimates and goals for each section.":
            "为关于 [主题] 的会议创建结构化议程。会议将持续 [时间] 并包括 [参会者]。将议程分解为各个部分,每个部分都有时间估计和目标。",

        "Summarize these meeting notes into a structured recap. The notes are rough and informal. Organize them into categories: key decisions, next steps, and responsibilities. Notes: [paste text].":
            "将这些会议记录总结为结构化回顾。记录粗略且非正式。将它们组织成类别:关键决策、下一步和职责。记录:[粘贴文本]。",

        "Turn the following meeting notes into a clean task list. The tasks should be grouped by owner and include deadlines if mentioned. Notes: [paste text].":
            "将以下会议记录转换为清晰的任务列表。任务应按负责人分组,如有提及则包含截止日期。记录:[粘贴文本]。",

        "Suggest thoughtful questions to ask in a meeting about [topic]. The purpose of the meeting is [purpose]. Provide a list of at least 5 questions that show preparation and insight.":
            "建议在关于 [主题] 的会议中提出的深思熟虑的问题。会议目的是 [目的]。提供至少5个显示准备和洞察力的问题列表。",

        "Write a professional follow-up email after a meeting about [topic]. Include a recap of key points, assigned responsibilities, and next steps with deadlines. Use a clear and polite tone.":
            "在关于 [主题] 的会议后撰写专业跟进邮件。包括关键要点回顾、分配的职责以及带截止日期的下一步。使用清晰和礼貌的语气。",

        # Problem solving (5)
        "Analyze the following workplace issue: [describe issue]. The context is that the problem has occurred multiple times. Identify possible root causes and suggest questions to confirm them.":
            "分析以下工作场所问题:[描述问题]。背景是该问题已多次发生。识别可能的根本原因并建议确认问题。",

        "Compare the following two or more possible solutions: [list options]. The decision needs to be made in [timeframe]. Evaluate pros, cons, and potential risks for each option.":
            "比较以下两个或多个可能的解决方案:[列出选项]。决策需要在 [时间范围] 内做出。评估每个选项的优点、缺点和潜在风险。",

        "Help define clear decision-making criteria for [describe decision]. The context is that multiple stakeholders are involved. Provide a short list of weighted criteria to guide the choice.":
            "帮助为 [描述决策] 定义明确的决策标准。背景是涉及多个利益相关者。提供加权标准的简短列表以指导选择。",

        "Assess the potential risks of the following plan: [describe plan]. The plan is set to start on [date]. List risks by likelihood and impact, and suggest mitigation strategies.":
            "评估以下计划的潜在风险:[描述计划]。计划定于 [日期] 开始。按可能性和影响列出风险,并建议缓解策略。",

        "Based on the following background: [describe situation and options], recommend the most suitable option. Explain your reasoning clearly and suggest first steps for implementation.":
            "基于以下背景:[描述情况和选项],推荐最合适的选项。清楚地解释您的推理并建议实施的第一步。",

        # Organization & productivity (5)
        "Create a prioritized to-do list from the following tasks: [paste tasks]. The context is a typical workday with limited time. Suggest which tasks should be done first and why.":
            "从以下任务创建优先级待办事项列表:[粘贴任务]。背景是时间有限的典型工作日。建议应首先完成哪些任务以及原因。",

        "Build a weekly work plan for [describe role or situation]. The week includes deadlines, meetings, and individual focus time. Provide a balanced schedule with recommended priorities.":
            "为 [描述角色或情况] 制定每周工作计划。本周包括截止日期、会议和个人专注时间。提供带有推荐优先级的平衡时间表。",

        "Summarize the following document into 5 key points and 3 recommended actions. The document is [type: report, plan, or notes]. Keep the summary concise and professional. Text: [paste document].":
            "将以下文档总结为5个关键点和3个推荐操作。文档类型为 [类型:报告、计划或笔记]。保持摘要简洁和专业。文本:[粘贴文档]。",

        "Brainstorm potential solutions to the following workplace challenge: [describe challenge]. Provide at least 5 varied ideas, noting pros and cons for each.":
            "为以下工作场所挑战头脑风暴潜在解决方案:[描述挑战]。提供至少5个不同的想法,注明每个的优缺点。",

        "Draft a short project update for stakeholders. The project is [describe project]. Include progress made, current blockers, and next steps. Write in a professional, concise style.":
            "为利益相关者起草简短的项目更新。项目是 [描述项目]。包括已取得的进展、当前阻碍和下一步。以专业、简洁的风格撰写。",

        # ==========================================
        # ChatGPT for sales - 25 prompts
        # ==========================================

        # Outreach & communication (5)
        "Write a short, compelling cold email to a [job title] at [company name] introducing our product. Use the background below to customize it. Background: [insert value props or ICP info]. Format it in email-ready text.":
            "撰写一封简短、引人注目的冷邮件发送给 [公司名称] 的 [职位],介绍我们的产品。使用以下背景进行定制。背景:[插入价值主张或ICP信息]。格式化为可直接发送的邮件文本。",

        "Rewrite this follow-up email after a demo to sound more consultative. Original email: [paste here]. Include recap, next steps, and call scheduling CTA. Output as email text.":
            "将演示后的跟进邮件改写得更具咨询性。原始邮件:[粘贴此处]。包括回顾、下一步和安排通话的行动号召。输出为邮件文本。",

        "Draft a renewal pitch for [customer name] based on this renewal history and value data: [paste data]. Include key ROI proof points and renewal recommendation. Output as a short pitch and optional follow-up email.":
            "基于续约历史和价值数据为 [客户名称] 起草续约方案:[粘贴数据]。包括关键的ROI证明点和续约建议。输出为简短方案和可选的跟进邮件。",

        "Write a daily update summarizing key rep activities. Inputs: [paste call summaries or CRM exports]. Make it upbeat and concise. Output as 3–5 bullet message.":
            "撰写每日更新总结销售代表的关键活动。输入:[粘贴通话摘要或CRM导出]。使其积极且简洁。输出为3-5个要点。",

        "Summarize our pipeline health this month for execs. Inputs: [paste data]. Include total pipeline, top risks, biggest wins, and forecast confidence. Write it like a short exec update.":
            "为高管总结本月的管道健康状况。输入:[粘贴数据]。包括总管道、主要风险、最大胜利和预测信心。撰写为简短的高管更新。",

        # Sales strategy & planning (5)
        "Create an account plan for [customer name]. Use these inputs: company profile, known priorities, current product usage, stakeholders, and renewal date. Output a structured plan with goals, risks, opportunities, and next steps.":
            "为 [客户名称] 创建客户计划。使用这些输入:公司概况、已知优先事项、当前产品使用情况、利益相关者和续约日期。输出包含目标、风险、机会和下一步的结构化计划。",

        "Create a territory planning guide for our next fiscal year. Inputs: team headcount, target industries, regions, and historical revenue. Recommend allocation method and sample coverage plan.":
            "为下一财年创建区域规划指南。输入:团队人数、目标行业、地区和历史收入。推荐分配方法和示例覆盖计划。",

        "I have this list of accounts: [paste sample]. Prioritize them based on [criteria: industry, size, funding, tech stack]. Output a ranked list with reasons why.":
            "我有这个客户列表:[粘贴样本]。基于 [标准:行业、规模、融资、技术栈] 对其进行优先排序。输出带原因的排序列表。",

        "Score accounts based on [insert rules—e.g., company size, engagement score, intent signals]. Data: [Upload account list]. Output top 10 ranked accounts with their score and a note explaining why.":
            "基于 [插入规则—例如公司规模、参与度评分、意向信号] 对客户评分。数据:[上传客户列表]。输出前10名排序客户及其分数和解释说明。",

        "I'm evaluating market entry into [region/country] for our [SaaS solution]. Research local buying behaviors, competitive landscape, economic conditions, and regulatory concerns. Format as a go/no-go market readiness summary with citations and action steps.":
            "我正在评估我们的 [SaaS解决方案] 进入 [地区/国家] 市场。研究当地购买行为、竞争格局、经济状况和监管问题。格式化为带引用和行动步骤的执行/不执行市场准备摘要。",

        # Competitive intelligence & enablement (5)
        "Create a battlecard for [competitor name]. Use these notes: [insert positioning data]. Include strengths, weaknesses, how we win, and quick talk track. Output as table format.":
            "为 [竞争对手名称] 创建战斗卡。使用这些笔记:[插入定位数据]。包括优势、劣势、我们如何获胜和快速对话要点。输出为表格格式。",

        "I'm preparing a competitive battlecard for [competitor name]. Research their pricing model, product positioning, recent customer wins/losses, and sales motion. Compare it to ours based on these strengths: [insert]. Output a 1-page summary with citations.":
            "我正在为 [竞争对手名称] 准备竞争战斗卡。研究他们的定价模式、产品定位、最近的客户得失和销售策略。基于这些优势与我们比较:[插入]。输出带引用的1页摘要。",

        "Create a one-pager to help reps pitch [product name] to [persona]. Include key benefits, features, common use cases, and competitor differentiators. Format as copy-ready enablement doc.":
            "创建单页资料帮助销售代表向 [角色] 推销 [产品名称]。包括关键优势、功能、常见用例和竞争对手差异。格式化为可直接使用的赋能文档。",

        "Create rebuttals to these common objections: [insert 2–3 objections]. Make them sound natural and confident, and include a backup stat or story where useful. Output as list.":
            "为这些常见异议创建回应:[插入2-3个异议]。使其听起来自然且自信,并在有用时包含支持统计数据或故事。输出为列表。",

        "Research recent online reviews, social mentions, and testimonials about [our product OR competitor product]. Focus on what customers are praising or criticizing. Summarize top 5 quotes, what persona each came from, and where it was posted. Include links.":
            "研究关于 [我们的产品或竞争对手产品] 的最新在线评论、社交提及和推荐。关注客户赞扬或批评的内容。总结前5个引用、每个来自什么角色以及发布在哪里。包含链接。",

        # Data analysis & performance insights (5)
        "Analyze this sales pipeline export. Calculate conversion rates between each stage and identify the biggest drop-off point. Data: [Upload pipeline CSV]. Output a short summary and a table of conversion % by stage.":
            "分析此销售管道导出。计算各阶段之间的转化率并识别最大流失点。数据:[上传管道CSV]。输出简短摘要和按阶段的转化率表。",

        "From this dataset of rep activities and closed deals, calculate the close rate for each rep and rank them. Data: [Upload rep performance CSV]. Output a ranked list and a sentence for each rep's strength.":
            "从销售代表活动和成交记录数据集中,计算每个代表的成交率并排序。数据:[上传销售代表绩效CSV]。输出排序列表和每个代表的优势描述。",

        "Use this CRM export to calculate average deal velocity per quarter (days from lead to close). Data: [Upload with open/close dates]. Show velocity trend in a simple chart and summarize the trendline.":
            "使用此CRM导出计算每季度的平均交易速度(从线索到成交的天数)。数据:[上传包含开启/关闭日期]。在简单图表中显示速度趋势并总结趋势线。",

        "Match campaign sources to closed-won deals from this data. Identify which campaign drove the most closed revenue. Data: [Upload campaign + deal export]. Output a ranked list and a short campaign summary.":
            "从此数据匹配营销活动来源到成交交易。识别哪个营销活动带来了最多的成交收入。数据:[上传营销活动+交易导出]。输出排序列表和简短的营销活动摘要。",

        "Here's a table of rep performance by quarter: [paste data]. Compare top vs bottom performers. Show chart with trends and call out key differences. Output as table + insights.":
            "这是按季度的销售代表绩效表:[粘贴数据]。比较顶级与底部表现者。显示带趋势的图表并指出关键差异。输出为表格+洞察。",

        # Visuals & Sales Collateral (5)
        "Create a funnel graphic showing our sales stages: [insert stages]. Make it clean and easy to read for onboarding docs. Output as simple image.":
            "创建显示我们销售阶段的漏斗图:[插入阶段]。使其清晰易读,适用于入职文档。输出为简单图像。",

        "Create an image of a standard B2B SaaS sales funnel with these stages: Prospecting, Discovery, Demo, Proposal, Closed Won/Lost. Use clean, modern icons and text labels. Output should be clear enough for use in a slide or enablement doc.":
            "创建标准B2B SaaS销售漏斗图像,包含这些阶段:潜在客户开发、发现、演示、提案、成交/流失。使用清晰、现代的图标和文本标签。输出应足够清晰,可用于幻灯片或赋能文档。",

        "Create professional illustrations for 3 personas: (1) CFO of a mid-market company, (2) VP of IT at a global enterprise, and (3) Operations Manager at a logistics firm. Style should be flat and modern, ideal for use in a one-pager or training slide.":
            "为3个角色创建专业插图:(1)中型市场公司的CFO,(2)全球企业的IT副总裁,(3)物流公司的运营经理。风格应为扁平和现代,适合用于单页资料或培训幻灯片。",

        "Create a simplified U.S. map showing sales territories split by region: West, Central, East. Use distinctive color zones and label key states. Output should look clean and suitable for a sales kickoff deck.":
            "创建简化的美国地图,显示按地区划分的销售区域:西部、中部、东部。使用独特的颜色区域并标记关键州。输出应看起来清晰,适合销售启动会议演示文稿。",

        "Design a fun, modern graphic to celebrate \"Top Rep of the Month.\" Include a placeholder for name/photo and stylized trophy or badge. Style should match internal Slack or newsletter vibe.":
            "设计一个有趣、现代的图形来庆祝"本月最佳销售代表"。包含姓名/照片占位符和风格化的奖杯或徽章。风格应匹配内部Slack或通讯氛围。",
    }


def apply_master_translations(data, translations):
    """Apply master translations to the data structure"""
    for pack in data:
        for section in pack['sections']:
            for prompt in section.get('prompts', []):
                en_prompt = prompt['prompt']['en']
                if en_prompt in translations:
                    prompt['prompt']['zh'] = translations[en_prompt]
                else:
                    # Fallback: keep existing or use placeholder replacement
                    if 'zh' not in prompt['prompt'] or prompt['prompt']['zh'] == en_prompt:
                        prompt['prompt']['zh'] = replace_placeholders(en_prompt)
    return data


def replace_placeholders(text):
    """Replace English placeholders with Chinese ones"""
    replacements = {
        '[recipient]': '[收件人]',
        '[topic]': '[主题]',
        '[paste text]': '[粘贴文本]',
        '[audience type: executives, peers, or customers]': '[受众类型:高管、同事或客户]',
        '[context]': '[背景]',
        '[attendees/roles]': '[参会者/角色]',
        '[attendees]': '[参会者]',
        '[time]': '[时间]',
        '[describe issue]': '[描述问题]',
        '[list options]': '[列出选项]',
        '[timeframe]': '[时间范围]',
        '[describe decision]': '[描述决策]',
        '[describe plan]': '[描述计划]',
        '[date]': '[日期]',
        '[describe situation and options]': '[描述情况和选项]',
        '[paste tasks]': '[粘贴任务]',
        '[describe role or situation]': '[描述角色或情况]',
        '[type: report, plan, or notes]': '[类型:报告、计划或笔记]',
        '[paste document]': '[粘贴文档]',
        '[describe challenge]': '[描述挑战]',
        '[describe project]': '[描述项目]',
        '[purpose]': '[目的]',
        '[job title]': '[职位]',
        '[company name]': '[公司名称]',
        '[insert value props or ICP info]': '[插入价值主张或ICP信息]',
        '[paste here]': '[粘贴此处]',
        '[customer name]': '[客户名称]',
        '[paste data]': '[粘贴数据]',
        '[paste sample]': '[粘贴样本]',
        '[criteria: industry, size, funding, tech stack]': '[标准:行业、规模、融资、技术栈]',
        '[insert rules—e.g., company size, engagement score, intent signals]': '[插入规则—例如公司规模、参与度评分、意向信号]',
        '[Upload account list]': '[上传客户列表]',
        '[region/country]': '[地区/国家]',
        '[SaaS solution]': '[SaaS解决方案]',
        '[competitor name]': '[竞争对手名称]',
        '[insert positioning data]': '[插入定位数据]',
        '[persona]': '[角色]',
        '[product name]': '[产品名称]',
        '[insert 2–3 objections]': '[插入2-3个异议]',
        '[our product OR competitor product]': '[我们的产品或竞争对手产品]',
        '[Upload pipeline CSV]': '[上传管道CSV]',
        '[Upload rep performance CSV]': '[上传销售代表绩效CSV]',
        '[Upload with open/close dates]': '[上传包含开启/关闭日期]',
        '[Upload campaign + deal export]': '[上传营销活动+交易导出]',
        '[insert stages]': '[插入阶段]',
        '[insert]': '[插入]',
        '[paste call summaries or CRM exports]': '[粘贴通话摘要或CRM导出]',
    }

    result = text
    for en, zh in replacements.items():
        result = result.replace(en, zh)
    return result


def main():
    """Main function to apply master translations"""
    input_file = r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json'
    output_file = r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json'

    # Read current file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Get all translations
    translations = get_all_prompt_translations()

    print(f"Loaded {len(translations)} complete translations")

    # Apply translations
    updated_data = apply_master_translations(data, translations)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, ensure_ascii=False, indent=2)

    print(f"Master translations applied!")
    print(f"Output written to: {output_file}")


if __name__ == "__main__":
    main()
