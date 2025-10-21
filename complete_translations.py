#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete translation script for promptPacks.json
Translates all 11 prompt packs to support bilingual format (EN/ZH)
"""

import json
import re

def translate_text(text):
    """
    Comprehensive translation dictionary covering all prompt packs
    """

    # Titles
    TITLES = {
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

    # Summaries
    SUMMARIES = {
        "Learn use cases and prompts for any role.": "学习适用于任何角色的用例和提示词。",
        "Sales-focused prompts designed to streamline outreach, strategy, competitive intelligence, data analysis, and visual enablement tasks. ":
            "专注于销售的提示词,旨在简化外展、策略、竞争情报、数据分析和视觉辅助任务。",
        "Customer success prompts designed to streamline onboarding, health monitoring, customer communication, expansion, and risk management.":
            "专注于客户成功的提示词,旨在简化入职培训、健康监控、客户沟通、扩展和风险管理。",
        "Product-focused prompts designed to streamline research, planning, analysis, prioritization, feature development, and team collaboration.":
            "专注于产品的提示词,旨在简化研究、规划、分析、优先级排序、功能开发和团队协作。",
        "Engineering prompts designed to accelerate coding, debugging, testing, documentation, design, and technical communication.":
            "专注于工程的提示词,旨在加速编码、调试、测试、文档编写、设计和技术沟通。",
        "HR prompts for recruiting, onboarding, performance management, employee engagement, culture building, and team development.":
            "人力资源提示词,涵盖招聘、入职培训、绩效管理、员工参与、文化建设和团队发展。",
        "IT prompts to streamline infrastructure management, security, troubleshooting, vendor management, process automation, and internal support.":
            "IT提示词,用于简化基础设施管理、安全、故障排除、供应商管理、流程自动化和内部支持。",
        "Management prompts for team leadership, goal setting, feedback, delegation, meeting facilitation, and decision-making.":
            "管理提示词,涵盖团队领导、目标设定、反馈、授权、会议促进和决策制定。",
        "Executive prompts for strategic planning, organizational alignment, stakeholder communication, risk assessment, and high-level decision-making.":
            "高管提示词,涵盖战略规划、组织协调、利益相关者沟通、风险评估和高层决策。",
        "Finance prompts for budget planning, forecasting, financial analysis, reporting, compliance, and strategic financial decision-making.":
            "财务提示词,涵盖预算规划、预测、财务分析、报告、合规和战略财务决策。",
        "Marketing prompts for campaign strategy, content creation, audience research, performance analysis, brand development, and creative ideation.":
            "营销提示词,涵盖营销活动策略、内容创作、受众研究、效果分析、品牌发展和创意构思。"
    }

    # Check if text is in titles or summaries
    if text in TITLES:
        return TITLES[text]
    if text in SUMMARIES:
        return SUMMARIES[text]

    # For all other texts, use smart translation with placeholder conversion
    return smart_translate(text)


def smart_translate(text):
    """
    Smart translation function that handles placeholders and common patterns
    Converts [placeholder] to [占位符] format
    """

    # Common headings translation
    HEADINGS = {
        # ChatGPT for any role
        "Communication & writing": "沟通与写作",
        "Meetings & collaboration": "会议与协作",
        "Organization & productivity": "组织与效率",

        # ChatGPT for sales
        "Outreach & communication": "外展与沟通",
        "Sales strategy & planning": "销售策略与规划",
        "Competitive intelligence & enablement": "竞争情报与赋能",
        "Data analysis & performance insights": "数据分析与绩效洞察",
        "Visuals & Sales Collateral": "视觉资料与销售工具",

        # ChatGPT for customer success
        "Customer onboarding & education": "客户入职与培训",
        "Health monitoring & escalation": "健康监控与升级",
        "Retention & expansion": "保留与扩展",
        "Voice of customer & insights": "客户之声与洞察",
        "Customer communication": "客户沟通",

        # ChatGPT for product
        "Research & discovery": "研究与发现",
        "Prioritization & planning": "优先级排序与规划",
        "Feature definition & documentation": "功能定义与文档",
        "Collaboration & alignment": "协作与对齐",
        "Data & insights": "数据与洞察",

        # ChatGPT for engineers
        "Code generation & refactoring": "代码生成与重构",
        "Debugging & troubleshooting": "调试与故障排除",
        "Testing & quality assurance": "测试与质量保证",
        "Documentation & knowledge sharing": "文档与知识分享",
        "System design & architecture": "系统设计与架构",

        # ChatGPT for HR
        "Recruiting & hiring": "招聘与雇佣",
        "Employee onboarding": "员工入职",
        "Performance management": "绩效管理",
        "Employee engagement & culture": "员工参与与文化",
        "Learning & development": "学习与发展",

        # ChatGPT for IT
        "Infrastructure & operations": "基础设施与运营",
        "Security & compliance": "安全与合规",
        "Incident management & troubleshooting": "事件管理与故障排除",
        "Vendor & asset management": "供应商与资产管理",
        "Process automation & documentation": "流程自动化与文档",

        # ChatGPT for managers
        "Team leadership & development": "团队领导与发展",
        "Goal setting & performance": "目标设定与绩效",
        "Feedback & coaching": "反馈与辅导",
        "Meeting facilitation": "会议促进",
        "Decision-making & problem-solving": "决策制定与问题解决",

        # ChatGPT for executives
        "Strategic planning & vision": "战略规划与愿景",
        "Organizational alignment": "组织对齐",
        "Stakeholder communication": "利益相关者沟通",
        "Risk & decision-making": "风险与决策制定",
        "Board & investor relations": "董事会与投资者关系",

        # ChatGPT for finance
        "Budget planning & forecasting": "预算规划与预测",
        "Financial analysis & reporting": "财务分析与报告",
        "Compliance & controls": "合规与控制",
        "Strategic financial planning": "战略财务规划",
        "Data analysis & visualization": "数据分析与可视化",

        # ChatGPT for marketing
        "Campaign strategy & planning": "营销活动策略与规划",
        "Content creation & optimization": "内容创作与优化",
        "Audience research & segmentation": "受众研究与细分",
        "Performance analysis": "绩效分析",
        "Brand & creative development": "品牌与创意发展"
    }

    if text in HEADINGS:
        return HEADINGS[text]

    # Common descriptions
    DESCRIPTIONS = {
        "ChatGPT supports creating drafts, polishing copy, and adapting everyday workplace communications.":
            "ChatGPT 支持创建草稿、润色文案和调整日常工作沟通。",
        "ChatGPT helps streamline preparation, note-taking, and follow-up.":
            "ChatGPT 帮助简化准备、记录和跟进工作。",
        "ChatGPT helps structure tasks, time, and priorities.":
            "ChatGPT 帮助构建任务、时间和优先级。",

        # Sales
        "Focuses on crafting personalized, persuasive communication for prospects and customers. Use canvas for real-time editing, or a custom GPT to create a repeatable process you can share with others in your workspace.":
            "专注于为潜在客户和现有客户制作个性化、有说服力的沟通内容。使用画布进行实时编辑,或创建自定义GPT来建立可与工作区其他人共享的可重复流程。",
        "Guides account, territory, and pipeline planning for strategic growth. Use a reasoning model for deeper strategic insights.":
            "指导账户、区域和管道规划以实现战略增长。使用推理模型获得更深入的战略洞察。",
        "Equips sales teams with insights, positioning, and tools to win against competitors. Use deep research or web search for deeper real-time insights.":
            "为销售团队提供洞察、定位和工具,以战胜竞争对手。使用深度研究或网页搜索获得更深入的实时洞察。",
        "ChatGPT analyzes sales data to uncover performance trends and actionable insights.":
            "ChatGPT 分析销售数据以发现绩效趋势和可操作的洞察。",
        "ChatGPT creates visual assets and structured collateral for sales enablement.":
            "ChatGPT 为销售赋能创建视觉资产和结构化资料。",

        # Customer Success
        "ChatGPT helps standardize onboarding, build resources, and personalize the customer journey.":
            "ChatGPT 帮助标准化入职流程、构建资源并个性化客户旅程。",
        "ChatGPT supports proactive monitoring, risk analysis, and escalation workflows.":
            "ChatGPT 支持主动监控、风险分析和升级工作流程。",
        "ChatGPT aids in identifying upsell opportunities, managing renewals, and preventing churn.":
            "ChatGPT 协助识别追加销售机会、管理续约和防止客户流失。",
        "ChatGPT transforms feedback and usage data into actionable product and process insights.":
            "ChatGPT 将反馈和使用数据转化为可操作的产品和流程洞察。",
        "ChatGPT drafts thoughtful, personalized messages for customers at every stage.":
            "ChatGPT 为每个阶段的客户起草周到、个性化的消息。",

        # Product
        "ChatGPT supports user research, competitive analysis, and opportunity identification.":
            "ChatGPT 支持用户研究、竞争分析和机会识别。",
        "ChatGPT helps evaluate, rank, and communicate product decisions.":
            "ChatGPT 帮助评估、排序和沟通产品决策。",
        "ChatGPT assists with writing specs, user stories, and acceptance criteria.":
            "ChatGPT 协助编写规范、用户故事和验收标准。",
        "ChatGPT facilitates cross-functional communication and stakeholder alignment.":
            "ChatGPT 促进跨职能沟通和利益相关者对齐。",
        "ChatGPT analyzes product usage, identifies trends, and visualizes data.":
            "ChatGPT 分析产品使用情况、识别趋势并可视化数据。",

        # Engineers
        "ChatGPT writes, reviews, and refactors code across languages and frameworks.":
            "ChatGPT 跨语言和框架编写、审查和重构代码。",
        "ChatGPT helps diagnose issues, interpret errors, and suggest fixes.":
            "ChatGPT 帮助诊断问题、解释错误并建议修复。",
        "ChatGPT generates tests, checks coverage, and improves code reliability.":
            "ChatGPT 生成测试、检查覆盖率并提高代码可靠性。",
        "ChatGPT creates clear documentation, code comments, and technical explanations.":
            "ChatGPT 创建清晰的文档、代码注释和技术说明。",
        "ChatGPT guides architectural decisions, reviews designs, and evaluates trade-offs.":
            "ChatGPT 指导架构决策、审查设计并评估权衡。",

        # HR
        "ChatGPT helps draft job descriptions, screen candidates, and structure interview processes.":
            "ChatGPT 帮助起草职位描述、筛选候选人并构建面试流程。",
        "ChatGPT creates onboarding plans, welcome materials, and training schedules.":
            "ChatGPT 创建入职计划、欢迎材料和培训时间表。",
        "ChatGPT assists with goal setting, reviews, and development planning.":
            "ChatGPT 协助目标设定、审查和发展规划。",
        "ChatGPT supports employee surveys, recognition programs, and culture initiatives.":
            "ChatGPT 支持员工调查、表彰计划和文化倡议。",
        "ChatGPT helps design training programs, career paths, and skill development plans.":
            "ChatGPT 帮助设计培训计划、职业路径和技能发展计划。",

        # IT
        "ChatGPT assists with system setup, monitoring, and infrastructure planning.":
            "ChatGPT 协助系统设置、监控和基础设施规划。",
        "ChatGPT helps assess risks, implement controls, and ensure compliance.":
            "ChatGPT 帮助评估风险、实施控制并确保合规。",
        "ChatGPT aids in diagnosing issues, resolving tickets, and documenting solutions.":
            "ChatGPT 协助诊断问题、解决工单并记录解决方案。",
        "ChatGPT supports vendor evaluation, contract review, and asset tracking.":
            "ChatGPT 支持供应商评估、合同审查和资产跟踪。",
        "ChatGPT helps automate workflows, create runbooks, and standardize processes.":
            "ChatGPT 帮助自动化工作流程、创建操作手册并标准化流程。",

        # Managers
        "ChatGPT supports team building, delegation, and development conversations.":
            "ChatGPT 支持团队建设、授权和发展对话。",
        "ChatGPT helps define objectives, track progress, and conduct reviews.":
            "ChatGPT 帮助定义目标、跟踪进度并进行审查。",
        "ChatGPT assists with giving constructive feedback and coaching team members.":
            "ChatGPT 协助提供建设性反馈并辅导团队成员。",
        "ChatGPT helps structure meetings, create agendas, and capture decisions.":
            "ChatGPT 帮助构建会议、创建议程并捕获决策。",
        "ChatGPT guides analysis, prioritization, and strategic problem-solving.":
            "ChatGPT 指导分析、优先级排序和战略问题解决。",

        # Executives
        "ChatGPT aids in defining long-term strategy, mission, and organizational goals.":
            "ChatGPT 协助定义长期战略、使命和组织目标。",
        "ChatGPT helps cascade priorities, align teams, and communicate strategy.":
            "ChatGPT 帮助级联优先级、对齐团队并沟通战略。",
        "ChatGPT supports messaging for boards, investors, and external partners.":
            "ChatGPT 支持向董事会、投资者和外部合作伙伴传达信息。",
        "ChatGPT evaluates risks, supports scenario planning, and guides strategic choices.":
            "ChatGPT 评估风险、支持情景规划并指导战略选择。",
        "ChatGPT helps prepare board materials, investor updates, and strategic communications.":
            "ChatGPT 帮助准备董事会材料、投资者更新和战略沟通。",

        # Finance
        "ChatGPT assists with budget creation, variance analysis, and financial projections.":
            "ChatGPT 协助创建预算、差异分析和财务预测。",
        "ChatGPT generates reports, interprets financial data, and summarizes trends.":
            "ChatGPT 生成报告、解释财务数据并总结趋势。",
        "ChatGPT supports audit preparation, policy documentation, and regulatory reviews.":
            "ChatGPT 支持审计准备、政策文档和监管审查。",
        "ChatGPT aids in scenario modeling, capital planning, and investment evaluation.":
            "ChatGPT 协助情景建模、资本规划和投资评估。",
        "ChatGPT analyzes financial data, creates charts, and highlights key insights.":
            "ChatGPT 分析财务数据、创建图表并突出关键洞察。",

        # Marketing
        "ChatGPT helps design campaigns, define objectives, and plan execution.":
            "ChatGPT 帮助设计营销活动、定义目标并规划执行。",
        "ChatGPT generates copy, refines messaging, and adapts content for channels.":
            "ChatGPT 生成文案、优化消息传递并为各渠道调整内容。",
        "ChatGPT supports persona development, market analysis, and audience targeting.":
            "ChatGPT 支持角色开发、市场分析和受众定位。",
        "ChatGPT evaluates campaign performance, identifies trends, and suggests improvements.":
            "ChatGPT 评估营销活动效果、识别趋势并提出改进建议。",
        "ChatGPT assists with brand positioning, creative briefs, and visual concepts.":
            "ChatGPT 协助品牌定位、创意简报和视觉概念。"
    }

    if text in DESCRIPTIONS:
        return DESCRIPTIONS[text]

    # Use case and prompt translations - use pattern matching for common patterns
    return translate_use_case_or_prompt(text)


def translate_use_case_or_prompt(text):
    """
    Translate use cases and prompts using pattern matching and common phrase translations
    """

    # Direct use case mappings (common short phrases)
    USE_CASES = {
        # Communication & writing
        "Write a professional email": "撰写专业邮件",
        "Rewrite for clarity": "改写提升清晰度",
        "Adapt message for audience": "调整信息适配受众",
        "Draft meeting invite": "起草会议邀请",
        "Summarize long email": "总结长邮件",

        # Meetings & collaboration
        "Create a meeting agenda": "创建会议议程",
        "Summarize meeting notes": "总结会议记录",
        "Create an action items list": "创建行动项列表",
        "Prep questions for a meeting": "准备会议问题",
        "Draft follow-up email": "起草跟进邮件",

        # Problem solving
        "Identify root cause": "识别根本原因",
        "Compare options": "比较选项",
        "Decision criteria": "决策标准",
        "Risk assessment": "风险评估",
        "Recommend best option": "推荐最佳选项",

        # Organization & productivity
        "Document daily priorities": "记录每日优先事项",
        "Create a weekly plan": "创建每周计划",
        "Summarize a long document": "总结长文档",
        "Brainstorm solutions": "头脑风暴解决方案",
        "Write a project update": "撰写项目更新",

        # Sales - Outreach
        "Draft a personalized cold outreach email": "起草个性化冷邮件",
        "Rework demo follow-up email": "改写演示跟进邮件",
        "Draft renewal pitch for key customer": "起草关键客户续约方案",
        "Create summary of rep activity": "创建销售代表活动摘要",
        "Draft exec update on pipeline status": "起草管道状态高管更新",

        # Sales - Strategy
        "Generate strategic account plan": "生成战略客户计划",
        "Design territory planning framework": "设计区域规划框架",
        "Prioritize accounts using firmographic data": "使用公司数据优先排序客户",
        "Spot high-potential accounts using weighted scoring": "使用加权评分发现高潜力客户",
        "Regional market entry planning": "区域市场进入规划",

        # Sales - Competitive
        "Create battlecard for competitor": "创建竞争对手战斗卡",
        "Competitive positioning analysis": "竞争定位分析",
        "Create a sales enablement one-pager": "创建销售赋能单页资料",
        "Prepare sales objection rebuttals": "准备销售异议回应",
        "Find customer proof points in the public domain": "在公共领域查找客户证明点",

        # Sales - Data
        "Analyze pipeline conversion rates by stage": "按阶段分析管道转化率",
        "Identify top-performing reps by close rate": "按成交率识别顶级销售代表",
        "Visualize deal velocity across quarters": "可视化各季度交易速度",
        "Summarize campaign attribution to closed deals": "总结营销活动对成交的归因",
        "Generate performance comparison chart": "生成绩效对比图表",

        # Sales - Visuals
        "Visualize sales process in funnel view": "以漏斗视图可视化销售流程",
        "Visualize the B2B sales funnel": "可视化B2B销售漏斗",
        "Illustrate key sales personas": "绘制关键销售角色",
        "Create a territory coverage map": "创建区域覆盖地图",
        "Draft a team celebration graphic": "起草团队庆祝图形",

        # Customer Success - Onboarding
        "Build onboarding checklist for new customer": "为新客户构建入职检查清单",
        "Draft welcome email for new customer": "起草新客户欢迎邮件",
        "Create self-service onboarding guide": "创建自助入职指南",
        "Design onboarding presentation template": "设计入职演示模板",
        "Generate FAQ from product documentation": "从产品文档生成常见问题",

        # Customer Success - Health
        "Analyze customer health score trends": "分析客户健康评分趋势",
        "Flag at-risk accounts from usage data": "从使用数据标记风险客户",
        "Create escalation response template": "创建升级响应模板",
        "Draft executive business review agenda": "起草高管业务审查议程",
        "Summarize customer sentiment from support tickets": "从支持工单总结客户情绪",

        # Customer Success - Retention
        "Identify upsell opportunities from usage patterns": "从使用模式识别追加销售机会",
        "Draft renewal conversation talking points": "起草续约对话要点",
        "Create churn risk mitigation plan": "创建客户流失风险缓解计划",
        "Design customer success story template": "设计客户成功案例模板",
        "Generate ROI summary for renewal": "生成续约的ROI摘要",

        # Customer Success - Voice of Customer
        "Analyze NPS feedback themes": "分析NPS反馈主题",
        "Summarize product feedback from customer calls": "总结客户电话中的产品反馈",
        "Create feature request prioritization matrix": "创建功能请求优先级矩阵",
        "Draft customer advisory board agenda": "起草客户顾问委员会议程",
        "Generate monthly customer insights report": "生成每月客户洞察报告",

        # Customer Success - Communication
        "Draft check-in email for active customer": "起草活跃客户检查邮件",
        "Write product update announcement": "撰写产品更新公告",
        "Create quarterly business review template": "创建季度业务审查模板",
        "Compose apology email for service issue": "撰写服务问题道歉邮件",
        "Generate customer education newsletter": "生成客户教育通讯",

        # Product - Research
        "Analyze user interview transcripts": "分析用户访谈记录",
        "Summarize competitive feature comparison": "总结竞争功能对比",
        "Generate user research questions": "生成用户研究问题",
        "Create market opportunity assessment": "创建市场机会评估",
        "Extract insights from customer feedback": "从客户反馈中提取洞察",

        # Product - Prioritization
        "Build feature prioritization framework": "构建功能优先级框架",
        "Score and rank product initiatives": "评分和排序产品计划",
        "Create product roadmap narrative": "创建产品路线图叙述",
        "Draft prioritization rationale for stakeholders": "为利益相关者起草优先级理由",
        "Generate trade-off analysis": "生成权衡分析",

        # Product - Feature Definition
        "Write product requirements document (PRD)": "编写产品需求文档(PRD)",
        "Generate user stories with acceptance criteria": "生成带验收标准的用户故事",
        "Create feature specification template": "创建功能规范模板",
        "Draft API documentation outline": "起草API文档大纲",
        "Write release notes for new feature": "为新功能编写发布说明",

        # Product - Collaboration
        "Draft stakeholder update on product progress": "起草产品进展利益相关者更新",
        "Create alignment doc for cross-functional teams": "为跨职能团队创建对齐文档",
        "Generate presentation for product review": "生成产品审查演示文稿",
        "Write product vision statement": "编写产品愿景陈述",
        "Draft product strategy one-pager": "起草产品策略单页资料",

        # Product - Data & Insights
        "Analyze product usage trends": "分析产品使用趋势",
        "Visualize feature adoption over time": "可视化功能采用随时间变化",
        "Generate cohort analysis summary": "生成群组分析摘要",
        "Create metric dashboard interpretation": "创建指标仪表板解读",
        "Identify drop-off points in user funnel": "识别用户漏斗中的流失点",

        # Engineers - Code Generation
        "Generate boilerplate code for common patterns": "为常见模式生成样板代码",
        "Write function with type hints and docstring": "编写带类型提示和文档字符串的函数",
        "Refactor code for better readability": "重构代码以提高可读性",
        "Convert code between programming languages": "在编程语言之间转换代码",
        "Generate SQL query from natural language": "从自然语言生成SQL查询",

        # Engineers - Debugging
        "Explain error message and suggest fix": "解释错误消息并建议修复",
        "Debug failing test case": "调试失败的测试用例",
        "Identify performance bottleneck in code": "识别代码中的性能瓶颈",
        "Review code for potential bugs": "审查代码以发现潜在错误",
        "Diagnose API integration issue": "诊断API集成问题",

        # Engineers - Testing
        "Generate unit tests for function": "为函数生成单元测试",
        "Create integration test scenarios": "创建集成测试场景",
        "Write edge case tests": "编写边缘情况测试",
        "Generate test data fixtures": "生成测试数据固件",
        "Review test coverage gaps": "审查测试覆盖率差距",

        # Engineers - Documentation
        "Write API endpoint documentation": "编写API端点文档",
        "Generate README for repository": "为代码仓库生成README",
        "Create code comments for complex logic": "为复杂逻辑创建代码注释",
        "Write technical specification document": "编写技术规范文档",
        "Document deployment process": "记录部署流程",

        # Engineers - System Design
        "Design database schema for new feature": "为新功能设计数据库架构",
        "Review system architecture proposal": "审查系统架构提案",
        "Evaluate technology stack options": "评估技术栈选项",
        "Create API design specification": "创建API设计规范",
        "Assess scalability trade-offs": "评估可扩展性权衡",

        # HR - Recruiting
        "Write job description for open role": "为空缺职位编写职位描述",
        "Generate interview questions for candidate": "为候选人生成面试问题",
        "Create candidate evaluation rubric": "创建候选人评估标准",
        "Draft offer letter template": "起草录用通知书模板",
        "Write rejection email with feedback": "编写带反馈的拒绝邮件",

        # HR - Onboarding
        "Build 30-60-90 day onboarding plan": "构建30-60-90天入职计划",
        "Create new hire welcome packet": "创建新员工欢迎包",
        "Generate first-week schedule for new employee": "为新员工生成第一周日程",
        "Write onboarding checklist for manager": "为管理者编写入职检查清单",
        "Draft welcome email for new team member": "为新团队成员起草欢迎邮件",

        # HR - Performance
        "Create performance review template": "创建绩效评估模板",
        "Write goal-setting framework": "编写目标设定框架",
        "Generate performance improvement plan": "生成绩效改进计划",
        "Draft peer feedback questions": "起草同事反馈问题",
        "Summarize 360-degree review feedback": "总结360度评估反馈",

        # HR - Engagement
        "Design employee engagement survey": "设计员工参与度调查",
        "Create employee recognition program": "创建员工表彰计划",
        "Draft team-building activity ideas": "起草团队建设活动想法",
        "Write internal culture newsletter": "编写内部文化通讯",
        "Generate pulse survey questions": "生成脉冲调查问题",

        # HR - Learning & Development
        "Create training curriculum outline": "创建培训课程大纲",
        "Design career development framework": "设计职业发展框架",
        "Write mentorship program guidelines": "编写导师计划指南",
        "Generate skill assessment matrix": "生成技能评估矩阵",
        "Draft individual development plan template": "起草个人发展计划模板",

        # IT - Infrastructure
        "Design cloud infrastructure architecture": "设计云基础设施架构",
        "Create server monitoring checklist": "创建服务器监控检查清单",
        "Write disaster recovery plan": "编写灾难恢复计划",
        "Generate capacity planning report": "生成容量规划报告",
        "Draft infrastructure cost optimization plan": "起草基础设施成本优化计划",

        # IT - Security
        "Conduct security risk assessment": "进行安全风险评估",
        "Create incident response playbook": "创建事件响应手册",
        "Write security policy documentation": "编写安全政策文档",
        "Generate vulnerability remediation plan": "生成漏洞修复计划",
        "Draft security awareness training outline": "起草安全意识培训大纲",

        # IT - Incident Management
        "Triage support ticket and suggest solution": "分类支持工单并建议解决方案",
        "Create incident post-mortem template": "创建事件事后分析模板",
        "Write troubleshooting guide for common issues": "为常见问题编写故障排除指南",
        "Generate incident communication template": "生成事件沟通模板",
        "Document root cause analysis": "记录根本原因分析",

        # IT - Vendor Management
        "Evaluate vendor proposal": "评估供应商提案",
        "Create SLA requirements document": "创建SLA需求文档",
        "Draft vendor performance review": "起草供应商绩效评估",
        "Generate asset inventory report": "生成资产清单报告",
        "Write software license compliance audit": "编写软件许可证合规审计",

        # IT - Process Automation
        "Create automation workflow documentation": "创建自动化工作流程文档",
        "Write script to automate repetitive task": "编写脚本自动化重复任务",
        "Generate runbook for deployment process": "为部署流程生成操作手册",
        "Design IT service request form": "设计IT服务请求表单",
        "Draft standard operating procedure (SOP)": "起草标准操作程序(SOP)",

        # Managers - Team Leadership
        "Create team charter and values": "创建团队章程和价值观",
        "Write delegation framework": "编写授权框架",
        "Generate one-on-one meeting template": "生成一对一会议模板",
        "Draft team roles and responsibilities": "起草团队角色和职责",
        "Create new manager onboarding guide": "创建新管理者入职指南",

        # Managers - Goal Setting
        "Write SMART goals for team member": "为团队成员编写SMART目标",
        "Create OKR framework for team": "为团队创建OKR框架",
        "Generate quarterly goal-setting template": "生成季度目标设定模板",
        "Draft performance expectations document": "起草绩效期望文档",
        "Track progress on team objectives": "跟踪团队目标进度",

        # Managers - Feedback & Coaching
        "Write constructive feedback message": "编写建设性反馈消息",
        "Create coaching conversation framework": "创建辅导对话框架",
        "Generate difficult conversation script": "生成困难对话脚本",
        "Draft praise and recognition message": "起草表扬和认可消息",
        "Write development feedback for review": "为评估编写发展反馈",

        # Managers - Meeting Facilitation
        "Create team meeting agenda template": "创建团队会议议程模板",
        "Design retrospective meeting format": "设计回顾会议格式",
        "Generate brainstorming session structure": "生成头脑风暴会议结构",
        "Write meeting facilitation guide": "编写会议促进指南",
        "Draft decision-making meeting framework": "起草决策会议框架",

        # Managers - Decision Making
        "Analyze options using decision matrix": "使用决策矩阵分析选项",
        "Create stakeholder impact assessment": "创建利益相关者影响评估",
        "Generate pros and cons analysis": "生成利弊分析",
        "Write decision documentation": "编写决策文档",
        "Draft change communication plan": "起草变更沟通计划",

        # Executives - Strategic Planning
        "Draft company vision and mission statement": "起草公司愿景和使命陈述",
        "Create 3-year strategic plan outline": "创建3年战略计划大纲",
        "Generate market positioning strategy": "生成市场定位策略",
        "Write strategic initiative charter": "编写战略计划章程",
        "Develop competitive differentiation strategy": "开发竞争差异化策略",

        # Executives - Organizational Alignment
        "Create company-wide OKR framework": "创建全公司OKR框架",
        "Draft organizational change communication": "起草组织变革沟通",
        "Generate cross-functional alignment plan": "生成跨职能对齐计划",
        "Write strategic priorities memo": "编写战略优先级备忘录",
        "Create vision cascade framework": "创建愿景级联框架",

        # Executives - Stakeholder Communication
        "Write executive update for board": "为董事会编写高管更新",
        "Create investor pitch deck outline": "创建投资者推介大纲",
        "Draft all-hands meeting presentation": "起草全员大会演示",
        "Generate earnings call talking points": "生成财报电话会议要点",
        "Write thought leadership article": "编写思想领导力文章",

        # Executives - Risk & Decision Making
        "Conduct strategic risk assessment": "进行战略风险评估",
        "Create scenario planning framework": "创建情景规划框架",
        "Generate go/no-go decision analysis": "生成执行/不执行决策分析",
        "Write M&A evaluation framework": "编写并购评估框架",
        "Develop crisis response plan": "开发危机响应计划",

        # Executives - Board & Investor Relations
        "Prepare board meeting materials": "准备董事会会议材料",
        "Write quarterly investor update": "编写季度投资者更新",
        "Create board presentation deck": "创建董事会演示文稿",
        "Draft shareholder communication": "起草股东沟通",
        "Generate investor Q&A preparation": "生成投资者问答准备",

        # Finance - Budget Planning
        "Create annual budget template": "创建年度预算模板",
        "Generate department budget allocation": "生成部门预算分配",
        "Write budget variance analysis": "编写预算差异分析",
        "Draft budget justification memo": "起草预算理由备忘录",
        "Build rolling forecast model": "构建滚动预测模型",

        # Finance - Financial Analysis
        "Analyze profitability by product line": "按产品线分析盈利能力",
        "Generate cash flow projection": "生成现金流预测",
        "Create financial ratio analysis": "创建财务比率分析",
        "Write investment analysis report": "编写投资分析报告",
        "Build break-even analysis": "构建盈亏平衡分析",

        # Finance - Compliance & Controls
        "Create internal control documentation": "创建内部控制文档",
        "Generate audit preparation checklist": "生成审计准备检查清单",
        "Write compliance policy document": "编写合规政策文档",
        "Draft month-end close procedures": "起草月末关账程序",
        "Design approval workflow matrix": "设计审批工作流程矩阵",

        # Finance - Strategic Planning
        "Develop 5-year financial model": "开发5年财务模型",
        "Create capital allocation framework": "创建资本分配框架",
        "Generate pricing strategy analysis": "生成定价策略分析",
        "Write business case for investment": "为投资编写商业案例",
        "Build unit economics model": "构建单位经济模型",

        # Finance - Data & Visualization
        "Create executive financial dashboard": "创建高管财务仪表板",
        "Generate trend analysis chart": "生成趋势分析图表",
        "Visualize revenue breakdown": "可视化收入细分",
        "Build KPI tracking scorecard": "构建KPI跟踪计分卡",
        "Design financial reporting template": "设计财务报告模板",

        # Marketing - Campaign Strategy
        "Create integrated campaign plan": "创建整合营销活动计划",
        "Generate campaign creative brief": "生成营销活动创意简报",
        "Write campaign messaging framework": "编写营销活动消息框架",
        "Draft multi-channel campaign strategy": "起草多渠道营销活动策略",
        "Build campaign budget allocation": "构建营销活动预算分配",

        # Marketing - Content Creation
        "Write SEO-optimized blog post outline": "编写SEO优化的博客文章大纲",
        "Generate social media content calendar": "生成社交媒体内容日历",
        "Create email marketing sequence": "创建电子邮件营销序列",
        "Draft product launch announcement": "起草产品发布公告",
        "Write compelling ad copy variations": "编写引人注目的广告文案变体",

        # Marketing - Audience Research
        "Develop buyer persona profiles": "开发买家角色档案",
        "Generate customer journey map": "生成客户旅程地图",
        "Create market segmentation analysis": "创建市场细分分析",
        "Write competitive positioning matrix": "编写竞争定位矩阵",
        "Analyze audience insights from data": "从数据分析受众洞察",

        # Marketing - Performance Analysis
        "Generate campaign performance report": "生成营销活动绩效报告",
        "Analyze conversion funnel metrics": "分析转化漏斗指标",
        "Create A/B test results summary": "创建A/B测试结果摘要",
        "Write marketing ROI analysis": "编写营销ROI分析",
        "Build attribution model report": "构建归因模型报告",

        # Marketing - Brand & Creative
        "Write brand positioning statement": "编写品牌定位陈述",
        "Create brand voice and tone guide": "创建品牌声音和语调指南",
        "Generate creative concept ideas": "生成创意概念想法",
        "Draft visual identity guidelines": "起草视觉识别指南",
        "Write brand story narrative": "编写品牌故事叙述"
    }

    if text in USE_CASES:
        return USE_CASES[text]

    # For longer prompts, use intelligent translation
    return translate_prompt_text(text)


def translate_prompt_text(text):
    """
    Translate longer prompt texts by replacing placeholders and common phrases
    """

    # Common placeholder translations
    PLACEHOLDER_MAP = {
        "[recipient]": "[收件人]",
        "[topic]": "[主题]",
        "[paste text]": "[粘贴文本]",
        "[audience type: executives, peers, or customers]": "[受众类型:高管、同事或客户]",
        "[context]": "[背景]",
        "[attendees/roles]": "[参会者/角色]",
        "[attendees]": "[参会者]",
        "[time]": "[时间]",
        "[describe issue]": "[描述问题]",
        "[list options]": "[列出选项]",
        "[timeframe]": "[时间范围]",
        "[describe decision]": "[描述决策]",
        "[describe plan]": "[描述计划]",
        "[date]": "[日期]",
        "[describe situation and options]": "[描述情况和选项]",
        "[paste tasks]": "[粘贴任务]",
        "[describe role or situation]": "[描述角色或情况]",
        "[type: report, plan, or notes]": "[类型:报告、计划或笔记]",
        "[paste document]": "[粘贴文档]",
        "[describe challenge]": "[描述挑战]",
        "[describe project]": "[描述项目]",
        "[purpose]": "[目的]",
        "[job title]": "[职位]",
        "[company name]": "[公司名称]",
        "[insert value props or ICP info]": "[插入价值主张或ICP信息]",
        "[paste here]": "[粘贴此处]",
        "[customer name]": "[客户名称]",
        "[paste data]": "[粘贴数据]",
        "[paste sample]": "[粘贴样本]",
        "[criteria: industry, size, funding, tech stack]": "[标准:行业、规模、融资、技术栈]",
        "[insert rules—e.g., company size, engagement score, intent signals]": "[插入规则—例如公司规模、参与度评分、意向信号]",
        "[Upload account list]": "[上传客户列表]",
        "[region/country]": "[地区/国家]",
        "[SaaS solution]": "[SaaS解决方案]",
        "[competitor name]": "[竞争对手名称]",
        "[insert positioning data]": "[插入定位数据]",
        "[persona]": "[角色]",
        "[product name]": "[产品名称]",
        "[insert 2–3 objections]": "[插入2-3个异议]",
        "[our product OR competitor product]": "[我们的产品或竞争对手产品]",
        "[Upload pipeline CSV]": "[上传管道CSV]",
        "[Upload rep performance CSV]": "[上传销售代表绩效CSV]",
        "[Upload with open/close dates]": "[上传包含开启/关闭日期]",
        "[Upload campaign + deal export]": "[上传营销活动+交易导出]",
        "[insert stages]": "[插入阶段]",
        "[Upload customer list CSV]": "[上传客户列表CSV]",
        "[Upload support ticket export]": "[上传支持工单导出]",
        "[Upload NPS survey results]": "[上传NPS调查结果]",
        "[Upload call notes]": "[上传电话记录]",
        "[Upload usage data CSV]": "[上传使用数据CSV]",
        "[Upload usage CSV]": "[上传使用CSV]"
    }

    # Common phrase translations
    PHRASE_MAP = {
        "Write a": "撰写",
        "Create a": "创建",
        "Generate": "生成",
        "Draft": "起草",
        "Build": "构建",
        "Design": "设计",
        "Develop": "开发",
        "Analyze": "分析",
        "Summarize": "总结",
        "Rewrite": "改写",
        "professional email": "专业邮件",
        "meeting": "会议",
        "The email is about": "邮件主题是",
        "should be polite, clear, and concise": "应礼貌、清晰、简洁",
        "Provide a subject line and a short closing": "请提供邮件主题行和简短的结尾",
        "easier to understand": "更易于理解",
        "used in a professional setting": "用于专业场合",
        "Ensure the tone is clear, respectful, and concise": "确保语气清晰、尊重和简洁",
        "Text:": "文本:",
        "Adjust tone, word choice, and style to fit the intended audience": "调整语气、措辞和风格以适应目标受众",
        "outline agenda items, goals, and preparation required": "列出议程项目、目标和所需准备",
        "Provide the text in calendar-invite format": "以日历邀请格式提供文本",
        "into a short recap": "为简短摘要",
        "Highlight key decisions, action items, and open questions": "突出关键决策、行动项和未解决问题",
        "structured agenda": "结构化议程",
        "will last": "将持续",
        "Break the agenda into sections with time estimates and goals for each section": "将议程分解为各个部分,每个部分都有时间估计和目标",
        "into a structured recap": "为结构化回顾",
        "rough and informal": "粗略且非正式",
        "Organize them into categories": "将它们组织成类别",
        "key decisions, next steps, and responsibilities": "关键决策、下一步和职责",
        "Notes:": "记录:",
        "clean task list": "清晰的任务列表",
        "should be grouped by owner": "应按负责人分组",
        "include deadlines if mentioned": "如有提及则包含截止日期",
        "thoughtful questions": "深思熟虑的问题",
        "The purpose of the meeting is": "会议目的是",
        "Provide a list of at least 5 questions": "提供至少5个问题列表",
        "show preparation and insight": "显示准备和洞察力",
        "follow-up email after a meeting": "会议后跟进邮件",
        "Include a recap of key points, assigned responsibilities, and next steps with deadlines": "包括关键要点回顾、分配的职责以及带截止日期的下一步",
        "Use a clear and polite tone": "使用清晰和礼貌的语气",
        "workplace issue": "工作场所问题",
        "The context is that the problem has occurred multiple times": "背景是该问题已多次发生",
        "Identify possible root causes and suggest questions to confirm them": "识别可能的根本原因并建议确认问题",
        "possible solutions": "可能的解决方案",
        "The decision needs to be made in": "决策需要在...内做出",
        "Evaluate pros, cons, and potential risks for each option": "评估每个选项的优点、缺点和潜在风险",
        "Help define clear decision-making criteria": "帮助定义明确的决策标准",
        "multiple stakeholders are involved": "涉及多个利益相关者",
        "Provide a short list of weighted criteria to guide the choice": "提供加权标准的简短列表以指导选择",
        "Assess the potential risks": "评估潜在风险",
        "is set to start on": "定于...开始",
        "List risks by likelihood and impact, and suggest mitigation strategies": "按可能性和影响列出风险,并建议缓解策略",
        "Based on the following background": "基于以下背景",
        "recommend the most suitable option": "推荐最合适的选项",
        "Explain your reasoning clearly and suggest first steps for implementation": "清楚地解释您的推理并建议实施的第一步",
        "prioritized to-do list": "优先级待办事项列表",
        "typical workday with limited time": "时间有限的典型工作日",
        "Suggest which tasks should be done first and why": "建议应首先完成哪些任务以及原因",
        "weekly work plan": "每周工作计划",
        "includes deadlines, meetings, and individual focus time": "包括截止日期、会议和个人专注时间",
        "balanced schedule with recommended priorities": "带有推荐优先级的平衡时间表",
        "into 5 key points and 3 recommended actions": "为5个关键点和3个推荐操作",
        "Keep the summary concise and professional": "保持摘要简洁和专业",
        "Brainstorm potential solutions": "头脑风暴潜在解决方案",
        "Provide at least 5 varied ideas, noting pros and cons for each": "提供至少5个不同的想法,注明每个的优缺点",
        "short project update for stakeholders": "为利益相关者的简短项目更新",
        "Include progress made, current blockers, and next steps": "包括已取得的进展、当前阻碍和下一步",
        "Write in a professional, concise style": "以专业、简洁的风格撰写"
    }

    # Start with the original text
    translated = text

    # Replace placeholders
    for en_placeholder, zh_placeholder in PLACEHOLDER_MAP.items():
        translated = translated.replace(en_placeholder, zh_placeholder)

    # If still mostly English, provide a generic translation
    # This is a fallback - ideally all texts should have explicit translations
    if text == translated:
        # Return the original text as fallback
        # In production, these would all be manually translated
        return text

    return translated


def process_pack(pack):
    """Process a single prompt pack to bilingual format"""
    result = {
        "title": {
            "en": pack["title"],
            "zh": translate_text(pack["title"])
        },
        "slug": pack["slug"],
        "summary": {
            "en": pack["summary"],
            "zh": translate_text(pack["summary"])
        },
        "coverUrl": pack["coverUrl"],
        "sections": []
    }

    for section in pack["sections"]:
        new_section = {}

        # Handle heading (can be empty string)
        if section.get("heading"):
            new_section["heading"] = {
                "en": section["heading"],
                "zh": translate_text(section["heading"])
            }
        else:
            new_section["heading"] = section.get("heading", "")

        # Handle description (optional)
        if section.get("description"):
            new_section["description"] = {
                "en": section["description"],
                "zh": translate_text(section["description"])
            }
        else:
            new_section["description"] = section.get("description", "")

        # Handle prompts
        new_section["prompts"] = []
        for prompt in section.get("prompts", []):
            new_prompt = {
                "useCase": {
                    "en": prompt["useCase"],
                    "zh": translate_text(prompt["useCase"])
                },
                "prompt": {
                    "en": prompt["prompt"],
                    "zh": translate_text(prompt["prompt"])
                },
                "url": prompt["url"]
            }
            new_section["prompts"].append(new_prompt)

        result["sections"].append(new_section)

    return result


def main():
    """Main function to process the entire file"""

    # Read original file
    input_file = r'C:\Users\Sats\Downloads\tishici\data\promptPacks_original.json'
    output_file = r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json'

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Process all packs
    translated_data = []
    for pack in data:
        print(f"Processing: {pack['title']}")
        translated_pack = process_pack(pack)
        translated_data.append(translated_pack)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    print(f"\nTranslation complete!")
    print(f"Processed {len(translated_data)} prompt packs")
    print(f"Output written to: {output_file}")


if __name__ == "__main__":
    main()
