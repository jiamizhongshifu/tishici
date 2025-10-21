import json
import re

# Translation mappings
TITLE_TRANSLATIONS = {
    "ChatGPT for any role": "ChatGPT 全角色应用",
    "ChatGPT for sales": "ChatGPT 销售专用",
    "ChatGPT for customer success": "ChatGPT 客户成功专用",
    "ChatGPT for product": "ChatGPT 产品专用",
    "ChatGPT for engineers": "ChatGPT 工程师专用",
    "ChatGPT for HR": "ChatGPT 人力资源专用",
    "ChatGPT for IT": "ChatGPT IT专用",
    "ChatGPT for managers": "ChatGPT 管理者专用",
    "ChatGPT for executives": "ChatGPT 高管专用",
    "ChatGPT for finance": "ChatGPT 财务专用",
    "ChatGPT for marketing": "ChatGPT 营销专用"
}

SUMMARY_TRANSLATIONS = {
    "Learn use cases and prompts for any role.": "学习适用于任何角色的用例和提示词。",
    "Sales-focused prompts designed to streamline outreach, strategy, competitive intelligence, data analysis, and visual enablement tasks. ": "专注于销售的提示词,旨在简化外展、策略、竞争情报、数据分析和视觉辅助任务。",
    "Customer success prompts designed to streamline onboarding, health monitoring, customer communication, expansion, and risk management.": "专注于客户成功的提示词,旨在简化入职培训、健康监控、客户沟通、扩展和风险管理。",
    "Product-focused prompts designed to streamline research, planning, analysis, prioritization, feature development, and team collaboration.": "专注于产品的提示词,旨在简化研究、规划、分析、优先级排序、功能开发和团队协作。",
    "Engineering prompts designed to accelerate coding, debugging, testing, documentation, design, and technical communication.": "专注于工程的提示词,旨在加速编码、调试、测试、文档编写、设计和技术沟通。",
    "HR prompts for recruiting, onboarding, performance management, employee engagement, culture building, and team development.": "人力资源提示词,涵盖招聘、入职培训、绩效管理、员工参与、文化建设和团队发展。",
    "IT prompts to streamline infrastructure management, security, troubleshooting, vendor management, process automation, and internal support.": "IT提示词,用于简化基础设施管理、安全、故障排除、供应商管理、流程自动化和内部支持。",
    "Management prompts for team leadership, goal setting, feedback, delegation, meeting facilitation, and decision-making.": "管理提示词,涵盖团队领导、目标设定、反馈、授权、会议促进和决策制定。",
    "Executive prompts for strategic planning, organizational alignment, stakeholder communication, risk assessment, and high-level decision-making.": "高管提示词,涵盖战略规划、组织协调、利益相关者沟通、风险评估和高层决策。",
    "Finance prompts for budget planning, forecasting, financial analysis, reporting, compliance, and strategic financial decision-making.": "财务提示词,涵盖预算规划、预测、财务分析、报告、合规和战略财务决策。",
    "Marketing prompts for campaign strategy, content creation, audience research, performance analysis, brand development, and creative ideation.": "营销提示词,涵盖营销活动策略、内容创作、受众研究、效果分析、品牌发展和创意构思。"
}

# Comprehensive translations dictionary
TRANSLATIONS = {
    # Communication & writing section
    "Communication & writing": "沟通与写作",
    "Write a professional email": "撰写专业邮件",
    "Write a professional email to [recipient]. The email is about [topic] and should be polite, clear, and concise. Provide a subject line and a short closing.":
        "撰写一封发送给 [收件人] 的专业邮件。邮件主题是 [主题],语气应礼貌、清晰、简洁。请提供邮件主题行和简短的结尾。",
    "Rewrite for clarity": "改写提升清晰度",
    "Rewrite the following text so it is easier to understand. The text will be used in a professional setting. Ensure the tone is clear, respectful, and concise. Text: [paste text].":
        "改写以下文本使其更易于理解。文本将用于专业场合。确保语气清晰、尊重和简洁。文本:[粘贴文本]。",
    "Adapt message for audience": "调整信息适配受众",
    "Reframe this message for [audience type: executives, peers, or customers]. The message was originally written for [context]. Adjust tone, word choice, and style to fit the intended audience. Text: [paste text].":
        "为 [受众类型:高管、同事或客户] 重新编写此消息。该消息最初是为 [背景] 编写的。调整语气、措辞和风格以适应目标受众。文本:[粘贴文本]。",
    "Draft meeting invite": "起草会议邀请",
    "Draft a meeting invitation for a session about [topic]. The meeting will include [attendees/roles] and should outline agenda items, goals, and preparation required. Provide the text in calendar-invite format.":
        "为关于 [主题] 的会议起草邀请函。会议将包括 [参会者/角色],应列出议程项目、目标和所需准备。以日历邀请格式提供文本。",
    "Summarize long email": "总结长邮件",
    "Summarize this email thread into a short recap. The thread includes several back-and-forth messages. Highlight key decisions, action items, and open questions. Email: [paste text].":
        "将此邮件线程总结为简短摘要。线程包含多个来回消息。突出关键决策、行动项和未解决问题。邮件:[粘贴文本]。",
    "ChatGPT supports creating drafts, polishing copy, and adapting everyday workplace communications.":
        "ChatGPT 支持创建草稿、润色文案和调整日常工作沟通。",

    # Meetings & collaboration section
    "Meetings & collaboration": "会议与协作",
    "Create a meeting agenda": "创建会议议程",
    "Create a structured agenda for a meeting about [topic]. The meeting will last [time] and include [attendees]. Break the agenda into sections with time estimates and goals for each section.":
        "为关于 [主题] 的会议创建结构化议程。会议将持续 [时间] 并包括 [参会者]。将议程分解为各个部分,每个部分都有时间估计和目标。",
    "Summarize meeting notes": "总结会议记录",
    "Summarize these meeting notes into a structured recap. The notes are rough and informal. Organize them into categories: key decisions, next steps, and responsibilities. Notes: [paste text].":
        "将这些会议记录总结为结构化回顾。记录粗略且非正式。将它们组织成类别:关键决策、下一步和职责。记录:[粘贴文本]。",
    "Create an action items list": "创建行动项列表",
    "Turn the following meeting notes into a clean task list. The tasks should be grouped by owner and include deadlines if mentioned. Notes: [paste text].":
        "将以下会议记录转换为清晰的任务列表。任务应按负责人分组,如有提及则包含截止日期。记录:[粘贴文本]。",
    "Prep questions for a meeting": "准备会议问题",
    "Suggest thoughtful questions to ask in a meeting about [topic]. The purpose of the meeting is [purpose]. Provide a list of at least 5 questions that show preparation and insight.":
        "建议在关于 [主题] 的会议中提出的深思熟虑的问题。会议目的是 [目的]。提供至少5个显示准备和洞察力的问题列表。",
    "Draft follow-up email": "起草跟进邮件",
    "Write a professional follow-up email after a meeting about [topic]. Include a recap of key points, assigned responsibilities, and next steps with deadlines. Use a clear and polite tone.":
        "在关于 [主题] 的会议后撰写专业跟进邮件。包括关键要点回顾、分配的职责以及带截止日期的下一步。使用清晰和礼貌的语气。",
    "ChatGPT helps streamline preparation, note-taking, and follow-up.":
        "ChatGPT 帮助简化准备、记录和跟进工作。",

    # Problem solving section
    "Identify root cause": "识别根本原因",
    "Analyze the following workplace issue: [describe issue]. The context is that the problem has occurred multiple times. Identify possible root causes and suggest questions to confirm them.":
        "分析以下工作场所问题:[描述问题]。背景是该问题已多次发生。识别可能的根本原因并建议确认问题。",
    "Compare options": "比较选项",
    "Compare the following two or more possible solutions: [list options]. The decision needs to be made in [timeframe]. Evaluate pros, cons, and potential risks for each option.":
        "比较以下两个或多个可能的解决方案:[列出选项]。决策需要在 [时间范围] 内做出。评估每个选项的优点、缺点和潜在风险。",
    "Decision criteria": "决策标准",
    "Help define clear decision-making criteria for [describe decision]. The context is that multiple stakeholders are involved. Provide a short list of weighted criteria to guide the choice.":
        "帮助为 [描述决策] 定义明确的决策标准。背景是涉及多个利益相关者。提供加权标准的简短列表以指导选择。",
    "Risk assessment": "风险评估",
    "Assess the potential risks of the following plan: [describe plan]. The plan is set to start on [date]. List risks by likelihood and impact, and suggest mitigation strategies.":
        "评估以下计划的潜在风险:[描述计划]。计划定于 [日期] 开始。按可能性和影响列出风险,并建议缓解策略。",
    "Recommend best option": "推荐最佳选项",
    "Based on the following background: [describe situation and options], recommend the most suitable option. Explain your reasoning clearly and suggest first steps for implementation.":
        "基于以下背景:[描述情况和选项],推荐最合适的选项。清楚地解释您的推理并建议实施的第一步。",

    # Organization & productivity section
    "Organization & productivity": "组织与效率",
    "Document daily priorities": "记录每日优先事项",
    "Create a prioritized to-do list from the following tasks: [paste tasks]. The context is a typical workday with limited time. Suggest which tasks should be done first and why.":
        "从以下任务创建优先级待办事项列表:[粘贴任务]。背景是时间有限的典型工作日。建议应首先完成哪些任务以及原因。",
    "Create a weekly plan": "创建每周计划",
    "Build a weekly work plan for [describe role or situation]. The week includes deadlines, meetings, and individual focus time. Provide a balanced schedule with recommended priorities.":
        "为 [描述角色或情况] 制定每周工作计划。本周包括截止日期、会议和个人专注时间。提供带有推荐优先级的平衡时间表。",
    "Summarize a long document": "总结长文档",
    "Summarize the following document into 5 key points and 3 recommended actions. The document is [type: report, plan, or notes]. Keep the summary concise and professional. Text: [paste document].":
        "将以下文档总结为5个关键点和3个推荐操作。文档类型为 [类型:报告、计划或笔记]。保持摘要简洁和专业。文本:[粘贴文档]。",
    "Brainstorm solutions": "头脑风暴解决方案",
    "Brainstorm potential solutions to the following workplace challenge: [describe challenge]. Provide at least 5 varied ideas, noting pros and cons for each.":
        "为以下工作场所挑战头脑风暴潜在解决方案:[描述挑战]。提供至少5个不同的想法,注明每个的优缺点。",
    "Write a project update": "撰写项目更新",
    "Draft a short project update for stakeholders. The project is [describe project]. Include progress made, current blockers, and next steps. Write in a professional, concise style.":
        "为利益相关者起草简短的项目更新。项目是 [描述项目]。包括已取得的进展、当前阻碍和下一步。以专业、简洁的风格撰写。",
    "ChatGPT helps structure tasks, time, and priorities.":
        "ChatGPT 帮助构建任务、时间和优先级。",
}

def translate_string_to_bilingual(text, translations):
    """Convert a string to bilingual format"""
    if text in translations:
        return {
            "en": text,
            "zh": translations[text]
        }
    # If no translation found, return original text with placeholder
    return {
        "en": text,
        "zh": text  # Will need manual translation
    }

def process_prompt_pack(pack_data, translations, title_trans, summary_trans):
    """Process a single prompt pack"""
    result = {}

    for key, value in pack_data.items():
        if key == "title":
            result[key] = {
                "en": value,
                "zh": title_trans.get(value, value)
            }
        elif key == "summary":
            result[key] = {
                "en": value,
                "zh": summary_trans.get(value, value)
            }
        elif key in ["slug", "coverUrl"]:
            # Keep as is
            result[key] = value
        elif key == "sections":
            result[key] = []
            for section in value:
                new_section = {}
                for sec_key, sec_value in section.items():
                    if sec_key == "heading":
                        if sec_value:  # Only translate non-empty headings
                            new_section[sec_key] = translate_string_to_bilingual(sec_value, translations)
                        else:
                            new_section[sec_key] = sec_value
                    elif sec_key == "description":
                        new_section[sec_key] = translate_string_to_bilingual(sec_value, translations)
                    elif sec_key == "prompts":
                        new_section[sec_key] = []
                        for prompt in sec_value:
                            new_prompt = {}
                            for p_key, p_value in prompt.items():
                                if p_key in ["useCase", "prompt"]:
                                    new_prompt[p_key] = translate_string_to_bilingual(p_value, translations)
                                else:  # url
                                    new_prompt[p_key] = p_value
                            new_section[sec_key].append(new_prompt)
                    else:
                        new_section[sec_key] = sec_value
                result[key].append(new_section)
        else:
            result[key] = value

    return result

# Read original file
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Process each pack
translated_data = []
for pack in data:
    translated_pack = process_prompt_pack(pack, TRANSLATIONS, TITLE_TRANSLATIONS, SUMMARY_TRANSLATIONS)
    translated_data.append(translated_pack)

# Write to file
with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'w', encoding='utf-8') as f:
    json.dump(translated_data, f, ensure_ascii=False, indent=2)

print("Translation completed!")
print(f"Processed {len(translated_data)} prompt packs")
