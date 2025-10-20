'use client';

import { useState } from 'react';
import {
  getAllTemplateCategories,
  fillTemplateVariables,
  type PromptTemplate,
  type TemplateCategory,
} from '../lib/templates';

type Props = {
  locale: 'en' | 'zh';
  onSelect: (template: PromptTemplate, filledContent: string) => void;
  dict: {
    title: string;
    searchPlaceholder: string;
    selectCategory: string;
    selectTemplate: string;
    noResults: string;
    fillVariables: string;
    fillVariablesHint: string;
    useTemplate: string;
    cancel: string;
  };
};

export default function TemplatePicker({ locale, onSelect, dict }: Props) {
  const categories = getAllTemplateCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTemplate(null);
    setVariables({});
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    const initialVariables: Record<string, string> = {};
    for (const variable of template.variables) {
      initialVariables[variable.key] = variable.defaultValue || '';
    }
    setVariables(initialVariables);
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    const content = selectedTemplate.content[locale] || selectedTemplate.content.en;
    const filledContent = fillTemplateVariables(content, variables);
    onSelect(selectedTemplate, filledContent);
  };

  const handleBack = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
      setVariables({});
    } else {
      setSelectedCategory(null);
    }
  };

  const filteredCategories = searchQuery
    ? categories.filter((cat) => {
        const labelMatch =
          cat.label[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description[locale].toLowerCase().includes(searchQuery.toLowerCase());
        const templateMatch = cat.templates.some(
          (template) =>
            template.title[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return labelMatch || templateMatch;
      })
    : categories;

  const selectedCategoryData = selectedCategory
    ? categories.find((cat) => cat.category === selectedCategory)
    : null;

  const filteredTemplates = selectedCategoryData
    ? searchQuery
      ? selectedCategoryData.templates.filter(
          (template) =>
            template.title[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : selectedCategoryData.templates
    : [];

  return (
    <div className="col" style={{ gap: 16 }}>
      {/* Search */}
      <input
        type="text"
        className="input"
        placeholder={dict.searchPlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Navigation */}
      {(selectedCategory || selectedTemplate) && (
        <button
          type="button"
          onClick={handleBack}
          className="btn"
          style={{
            alignSelf: 'flex-start',
            background: '#1a1f2c',
            borderColor: '#343b4f',
            padding: '6px 12px',
            fontSize: 12,
          }}
        >
          ← {dict.cancel}
        </button>
      )}

      {/* Category Selection */}
      {!selectedCategory && !selectedTemplate && (
        <div className="col" style={{ gap: 8 }}>
          <h4 style={{ margin: 0 }}>{dict.selectCategory}</h4>
          <div className="col" style={{ gap: 8 }}>
            {filteredCategories.map((category) => (
              <button
                key={category.category}
                type="button"
                onClick={() => handleCategorySelect(category.category)}
                className="card"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid #343b4f',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#343b4f';
                }}
              >
                <div className="col" style={{ gap: 4 }}>
                  <strong style={{ fontSize: 14, color: '#ffffff' }}>{category.label[locale]}</strong>
                  <span style={{ fontSize: 12, color: '#c4c4c4' }}>
                    {category.description[locale]}
                  </span>
                  <span style={{ fontSize: 11, color: '#b0b0b0' }}>
                    {category.templates.length} {locale === 'zh' ? '个模板' : 'templates'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template Selection */}
      {selectedCategory && !selectedTemplate && (
        <div className="col" style={{ gap: 8 }}>
          <h4 style={{ margin: 0 }}>{dict.selectTemplate}</h4>
          <div className="col" style={{ gap: 8 }}>
            {filteredTemplates.length === 0 ? (
              <span style={{ color: '#b0b0b0' }}>{dict.noResults}</span>
            ) : (
              filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className="card"
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid #343b4f',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#343b4f';
                  }}
                >
                  <div className="col" style={{ gap: 4 }}>
                    <strong style={{ fontSize: 14, color: '#ffffff' }}>{template.title[locale]}</strong>
                    <span style={{ fontSize: 12, color: '#c4c4c4' }}>
                      {template.description[locale]}
                    </span>
                    <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: '#343b4f',
                            color: '#c4c4c4',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Variable Fill */}
      {selectedTemplate && (
        <div className="col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 4 }}>
            <h4 style={{ margin: 0 }}>{selectedTemplate.title[locale]}</h4>
            <p style={{ margin: 0, fontSize: 13, color: '#c4c4c4' }}>
              {selectedTemplate.description[locale]}
            </p>
          </div>

          {selectedTemplate.variables.length > 0 && (
            <div className="col" style={{ gap: 8 }}>
              <div className="col" style={{ gap: 4 }}>
                <strong style={{ fontSize: 13 }}>{dict.fillVariables}</strong>
                <span style={{ fontSize: 11, color: '#b0b0b0' }}>
                  {dict.fillVariablesHint}
                </span>
              </div>

              {selectedTemplate.variables.map((variable) => (
                <div key={variable.key} className="col" style={{ gap: 4 }}>
                  <label htmlFor={`var-${variable.key}`} style={{ fontSize: 12 }}>
                    {variable.label[locale]}
                    {variable.required ? ' *' : ''}
                  </label>
                  {variable.key === 'tone' || variable.key === 'brand_voice' ? (
                    <select
                      id={`var-${variable.key}`}
                      className="select"
                      value={variables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      required={variable.required}
                    >
                      <option value="">{locale === 'zh' ? '请选择语气' : 'Please select tone'}</option>
                      <option value="neutral">{locale === 'zh' ? '中性' : 'Neutral'}</option>
                      <option value="friendly">{locale === 'zh' ? '友好' : 'Friendly'}</option>
                      <option value="professional">{locale === 'zh' ? '专业' : 'Professional'}</option>
                      <option value="concise">{locale === 'zh' ? '简洁' : 'Concise'}</option>
                      <option value="casual">{locale === 'zh' ? '随意' : 'Casual'}</option>
                      <option value="authoritative">{locale === 'zh' ? '权威' : 'Authoritative'}</option>
                      <option value="persuasive">{locale === 'zh' ? '有说服力' : 'Persuasive'}</option>
                      <option value="creative">{locale === 'zh' ? '创意' : 'Creative'}</option>
                    </select>
                  ) : variable.key === 'language' || variable.key === 'programming_language' ? (
                    <select
                      id={`var-${variable.key}`}
                      className="select"
                      value={variables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      required={variable.required}
                    >
                      <option value="">{locale === 'zh' ? '请选择语言' : 'Please select language'}</option>
                      <option value="Python">Python</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="Java">Java</option>
                      <option value="C++">C++</option>
                      <option value="C#">C#</option>
                      <option value="Go">Go</option>
                      <option value="Rust">Rust</option>
                      <option value="PHP">PHP</option>
                      <option value="Ruby">Ruby</option>
                      <option value="Swift">Swift</option>
                      <option value="Kotlin">Kotlin</option>
                      <option value="SQL">SQL</option>
                      <option value="HTML">HTML</option>
                      <option value="CSS">CSS</option>
                      <option value="Shell">Shell</option>
                    </select>
                  ) : variable.key === 'platform' ? (
                    <select
                      id={`var-${variable.key}`}
                      className="select"
                      value={variables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      required={variable.required}
                    >
                      <option value="">{locale === 'zh' ? '请选择平台' : 'Please select platform'}</option>
                      <option value="Twitter">Twitter</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube">YouTube</option>
                      <option value="WeChat">WeChat</option>
                      <option value="Weibo">Weibo</option>
                      <option value="Xiaohongshu">小红书</option>
                      <option value="Douyin">抖音</option>
                    </select>
                  ) : variable.key.includes('content') || variable.key.includes('description') || variable.key.includes('code') || variable.key.includes('sample') || variable.key.includes('data') || variable.key.includes('message') || variable.key.includes('sources') || variable.key.includes('constraints') ? (
                    <textarea
                      id={`var-${variable.key}`}
                      className="textarea"
                      rows={3}
                      value={variables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      placeholder={variable.placeholder?.[locale]}
                      required={variable.required}
                    />
                  ) : (
                    <input
                      id={`var-${variable.key}`}
                      type="text"
                      className="input"
                      value={variables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      placeholder={variable.placeholder?.[locale]}
                      required={variable.required}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleUseTemplate}
            className="btn"
            disabled={selectedTemplate.variables.some(
              (v) => v.required && !variables[v.key]?.trim()
            )}
          >
            {dict.useTemplate}
          </button>
        </div>
      )}
    </div>
  );
}



