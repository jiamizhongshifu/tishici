#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
完整翻译promptPacks.json中剩余9个提示包
"""

import json
import sys

# 翻译映射表 - 完整的prompt翻译
# 每个包的每个prompt都需要完整翻译

def translate_prompt_packs():
    # 读取原文件
    with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # ChatGPT for customer success (索引2) 的完整翻译
    if len(data) > 2 and data[2]['slug'] == 'use-cases-customer-success':
        pack = data[2]

        # 翻译summary
        pack['summary']['zh'] = '为客户成功团队提供涵盖用户引导策略、竞争研究、客户规划、数据分析和可视化沟通的用例。它能够快速、结构化地生成模板、洞察和图表,以优化客户生命周期管理和留存。'

        # 翻译第一个section: Onboarding & lifecycle strategy
        if len(pack['sections']) > 0:
            section = pack['sections'][0]
            section['heading']['zh'] = '用户引导与生命周期策略'
            section['description']['zh'] = 'ChatGPT 可以通过模板、反馈综合、研究和主动行动手册来起草客户引导和生命周期留存策略。'

            # 翻译每个prompt
            prompts_translations = [
                {
                    'useCase': '创建用户引导计划模板',
                    'prompt': '为 [客户类型] 创建可重复使用的用户引导计划模板。参考典型的时间线、里程碑和利益相关者协调需求。以按周划分的表格格式输出,包含任务负责人和目标。'
                },
                {
                    'useCase': '总结用户引导反馈',
                    'prompt': '总结我们在 [细分市场] 最近10个客户的用户引导反馈。使用这些共享笔记和调查答案。按主题输出简短段落:成功点、阻碍因素、建议。'
                },
                {
                    'useCase': '识别高接触用户引导最佳实践',
                    'prompt': '研究领先的B2B公司如何构建高接触用户引导流程。重点关注ACV超过100万美元且采用混合引导模式的公司。包含来源,并将输出结构化为带引用的关键策略要点列表。'
                },
                {
                    'useCase': '建议主动行动手册',
                    'prompt': '为 [行业/细分市场] 中有流失风险的客户推荐3个主动外展行动手册。使用近期流失、功能不活跃和低参与度的趋势。输出应包括:目标、触发条件、行动号召和时机。'
                },
                {
                    'useCase': '头脑风暴留存激励措施',
                    'prompt': '为 [行业] 中可能降级的客户建议创意留存策略。使用我们观察到的使用趋势和续约犹豫情况。输出5个经过测试的想法和5个新颖想法,附优缺点。'
                }
            ]

            for i, trans in enumerate(prompts_translations):
                if i < len(section['prompts']):
                    section['prompts'][i]['useCase']['zh'] = trans['useCase']
                    section['prompts'][i]['prompt']['zh'] = trans['prompt']

        # 翻译第二个section: Competitive & benchmark research
        if len(pack['sections']) > 1:
            section = pack['sections'][1]
            section['heading']['zh'] = '竞争与基准研究'
            section['description']['zh'] = 'ChatGPT 进行外部研究以基准化组织结构、指标、工具和竞争成功项目策略,以支持明智决策。使用深度研究功能可获得更全面的结果。'

            prompts_translations = [
                {
                    'useCase': '基准化客户成功组织结构',
                    'prompt': '为 [行业、规模] 中与我们类似的公司基准化客户成功组织结构。重点关注每个客户细分的角色以及与收入的比率。以比较表格形式输出,附人员配比说明。'
                },
                {
                    'useCase': '按行业基准化成功指标',
                    'prompt': '研究 [行业] 部门中用于客户健康评分的前3个成功指标。包括CSAT、NRR、使用频率或其他新兴基准。以表格形式输出,比较指标、来源和基准值,附引用。'
                },
                {
                    'useCase': '评估客户成功工具栈',
                    'prompt': '研究早期阶段、成长阶段和企业级公司的典型客户成功技术栈。包括类别(例如CRM、成功平台、分析)。输出比较图表,附示例和使用说明。'
                },
                {
                    'useCase': '竞争赋能总结',
                    'prompt': '研究竞争对手如何在 [行业] 中为企业客户提供售后支持。包括成功资源、团队结构和引导格式的示例。以表格形式输出,比较3个竞争对手,每种策略附优缺点。'
                },
                {
                    'useCase': '创建客户成功项目竞争比较',
                    'prompt': '研究我们前3个竞争对手的客户成功项目。重点关注引导、健康跟踪和扩展策略。输出比较矩阵。'
                }
            ]

            for i, trans in enumerate(prompts_translations):
                if i < len(section['prompts']):
                    section['prompts'][i]['useCase']['zh'] = trans['useCase']
                    section['prompts'][i]['prompt']['zh'] = trans['prompt']

        # 翻译第三个section: Account planning & renewal prep
        if len(pack['sections']) > 2:
            section = pack['sections'][2]
            section['heading']['zh'] = '客户规划与续约准备'
            section['description']['zh'] = 'ChatGPT 指导为高管沟通、QBR、续约准备和战略客户规划进行结构化准备。使用画布功能进行实时编辑。'

            prompts_translations = [
                {
                    'useCase': '起草高管邮件更新',
                    'prompt': '为 [客户的高管利益相关者] 撰写每周更新邮件。使用本周电话会议和使用指标的内部笔记:[粘贴此处]。输出应为包含3个要点的简短、精炼的邮件。'
                },
                {
                    'useCase': '起草QBR讨论要点',
                    'prompt': '在QBR之前,总结 [客户名称] 的主要成功点、风险和产品使用亮点。使用其最新健康评分、使用趋势和支持工单历史。以要点形式输出,用于内部审查。'
                },
                {
                    'useCase': '准备续约电话',
                    'prompt': '为 [客户名称] 创建续约电话准备清单。包括合同条款、当前使用情况、已知风险和追加销售潜力。以要点清单形式输出。'
                },
                {
                    'useCase': '创建客户计划摘要',
                    'prompt': '为 [客户名称] 起草单页客户计划。使用我们最近2次电话的笔记+合同信息+目标:[粘贴此处]。输出应格式化为:目标、阻碍因素、行动和续约事项。'
                },
                {
                    'useCase': '概述续约风险摘要',
                    'prompt': '在内部预测电话之前,为 [客户名称] 起草续约风险摘要。包括其续约日期、使用趋势、情绪和合同备注。输出应为段落摘要+单行建议。'
                }
            ]

            for i, trans in enumerate(prompts_translations):
                if i < len(section['prompts']):
                    section['prompts'][i]['useCase']['zh'] = trans['useCase']
                    section['prompts'][i]['prompt']['zh'] = trans['prompt']

        # 翻译第四个section: Data & health analysis
        if len(pack['sections']) > 3:
            section = pack['sections'][3]
            section['heading']['zh'] = '数据与健康分析'
            section['description']['zh'] = '分析定量和定性客户信号,以生成指标定义、绩效洞察、风险检测和评分框架。为经常完成的分析任务创建自定义GPT。'

            prompts_translations = [
                {
                    'useCase': '按细分市场概述成功指标',
                    'prompt': '为 [细分市场] 客户概述成功指标草案列表。包括采用目标、参与度目标和续约基准。以2列表格格式输出:指标 | 定义。'
                },
                {
                    'useCase': '评估CSAT分数分布',
                    'prompt': '审查第二季度的CSAT调查数据。计算总体平均值,识别异常分数,并总结反馈主题(如有)。输出为简短摘要,包含关键统计数据和正面/负面反馈示例。'
                },
                {
                    'useCase': '分析支持工单趋势',
                    'prompt': '检查上季度的支持工单导出数据。识别前5个重复问题并提供根本原因的简短摘要。输出应包括排名列表,附问题、频率和潜在的客户成功行动。'
                },
                {
                    'useCase': '发现流失早期迹象',
                    'prompt': '审查过去90天的客户使用数据。根据使用下降、登录频率或支持互动,识别可能有流失风险的客户。以表格形式总结结果,列包括:客户名称 | 风险因素 | 备注。'
                },
                {
                    'useCase': '标准化客户健康评分',
                    'prompt': '为 [细分市场或地区] 构建健康评分标准草案。使用输入如使用百分比、NPS、续约状态和工单量。以表格形式输出,包含评分范围、权重和颜色指示器。'
                }
            ]

            for i, trans in enumerate(prompts_translations):
                if i < len(section['prompts']):
                    section['prompts'][i]['useCase']['zh'] = trans['useCase']
                    section['prompts'][i]['prompt']['zh'] = trans['prompt']

        # 翻译第五个section: Visual & diagram design
        if len(pack['sections']) > 4:
            section = pack['sections'][4]
            section['heading']['zh'] = '可视化与图表设计'
            section['description']['zh'] = 'ChatGPT 创建清晰的、可用于演示的可视化图表和模型,以传达客户旅程、流程、成熟度阶段和健康指标。'

            prompts_translations = [
                {
                    'useCase': '设计客户健康评分模型',
                    'prompt': '设计客户颜色编码健康评分仪表的可视化模型。包括低、中、高范围,附建议的数值范围和图标。风格:仪表板风格、简洁线条、专业。'
                },
                {
                    'useCase': '可视化客户旅程图',
                    'prompt': '将此客户生命周期阶段大纲转换为可视化旅程图。使用此处列出的阶段和痛点:[粘贴文本]。输出为带标签的图表,包含5个生命周期阶段。'
                },
                {
                    'useCase': '说明升级流程',
                    'prompt': '创建图表,说明从客户成功经理到支持到工程的内部升级流程。包括3个严重性级别和标记的交接点。风格:流程图格式、最少颜色、可用于内部wiki。'
                },
                {
                    'useCase': '构建可视化客户成熟度模型',
                    'prompt': '创建图像,可视化SaaS平台的4阶段客户成熟度模型。每个阶段应有标题、关键行为模式和建议的客户成功接触点。风格:专业、简洁、可用于幻灯片。'
                }
            ]

            for i, trans in enumerate(prompts_translations):
                if i < len(section['prompts']):
                    section['prompts'][i]['useCase']['zh'] = trans['useCase']
                    section['prompts'][i]['prompt']['zh'] = trans['prompt']

    print('翻译第1个包完成: ChatGPT for customer success')

    # 保存文件
    with open(r'C:\Users\Sats\Downloads\tishici\data\promptPacks.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print('文件已保存')
    return data

if __name__ == '__main__':
    translate_prompt_packs()
    print('第一批翻译完成!')
