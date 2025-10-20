import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createActionClient } from '../../../lib/supabase/server';
import { getDictionary } from '../../../lib/i18n';
import PackIO from '../../../components/PackIO';

export default async function PackIOPage() {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const dict = await getDictionary();

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, title, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  const packIODict = {
    title: dict.locale === 'zh' ? 'Pack 导入/导出' : 'Pack Import/Export',
    importTitle: dict.locale === 'zh' ? '导入 Prompt Pack' : 'Import Prompt Pack',
    importDescription:
      dict.locale === 'zh'
        ? '上传 JSON 格式的 Prompt Pack 文件，批量导入提示词到您的库中。'
        : 'Upload a JSON-formatted Prompt Pack file to batch import prompts into your library.',
    importFileLabel: dict.locale === 'zh' ? '选择 JSON 文件' : 'Select JSON file',
    importButton: dict.locale === 'zh' ? '导入' : 'Import',
    importingButton: dict.locale === 'zh' ? '导入中...' : 'Importing...',
    importSuccess: dict.locale === 'zh' ? '成功导入 {count} 个提示词' : 'Successfully imported {count} prompts',
    importError: dict.locale === 'zh' ? '导入失败，请检查文件格式' : 'Import failed, please check file format',
    exportTitle: dict.locale === 'zh' ? '导出 Prompt Pack' : 'Export Prompt Pack',
    exportDescription:
      dict.locale === 'zh'
        ? '选择您的提示词，导出为 JSON 格式的 Pack 文件，方便分享和备份。'
        : 'Select your prompts and export them as a JSON Pack file for sharing and backup.',
    exportPackTitleLabel: dict.locale === 'zh' ? 'Pack 标题' : 'Pack Title',
    exportPackTitlePlaceholder: dict.locale === 'zh' ? '例如：我的提示词集合' : 'e.g., My Prompt Collection',
    exportPackSummaryLabel: dict.locale === 'zh' ? 'Pack 描述' : 'Pack Summary',
    exportPackSummaryPlaceholder:
      dict.locale === 'zh' ? '简要描述这个 Pack 的用途' : 'Brief description of this pack',
    exportSelectPrompts: dict.locale === 'zh' ? '选择要导出的提示词' : 'Select prompts to export',
    exportButton: dict.locale === 'zh' ? '导出' : 'Export',
    exportingButton: dict.locale === 'zh' ? '导出中...' : 'Exporting...',
    exportSuccess: dict.locale === 'zh' ? '导出成功！点击下载按钮保存文件' : 'Export successful! Click download to save the file',
    exportError: dict.locale === 'zh' ? '导出失败' : 'Export failed',
    downloadButton: dict.locale === 'zh' ? '下载 JSON 文件' : 'Download JSON file',
    noPromptsSelected: dict.locale === 'zh' ? '您还没有创建任何提示词' : 'You have not created any prompts yet',
    errorMessages: {
      NOT_AUTHENTICATED: dict.locale === 'zh' ? '请先登录' : 'Please login first',
      PACK_JSON_REQUIRED: dict.locale === 'zh' ? '请选择要导入的 JSON 文件' : 'Please select a JSON file to import',
      PACK_JSON_INVALID: dict.locale === 'zh' ? 'JSON 格式无效' : 'Invalid JSON format',
      NO_PROMPTS_FOUND: dict.locale === 'zh' ? '文件中未找到有效的提示词' : 'No valid prompts found in file',
      NO_VALID_PROMPTS: dict.locale === 'zh' ? '没有可导入的有效提示词' : 'No valid prompts to import',
      NO_PROMPTS_SELECTED: dict.locale === 'zh' ? '请至少选择一个提示词' : 'Please select at least one prompt',
    },
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn-link">
          {dict.home.dashboardButton}
        </Link>
        <span className="muted">/</span>
        <span style={{ fontWeight: 600 }}>{packIODict.title}</span>
      </div>

      <PackIO dict={packIODict} userPrompts={prompts ?? []} />
    </div>
  );
}
