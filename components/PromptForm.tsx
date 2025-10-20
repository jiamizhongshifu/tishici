'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createPrompt, type CreatePromptState, type PromptActionHandler } from '../app/actions';
import type { Dictionary, Locale } from '../lib/i18n';

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  dict: Dictionary['promptForm'];
  locale: Locale;
  redirectTo?: string;
  initial?: {
    id?: string;
    title?: string;
    content?: string;
    categoryId?: string | null;
  };
  submitAction?: PromptActionHandler;
};

type Mode = 'manual' | 'generator';

const INITIAL_STATE: CreatePromptState = { success: false };

function FormFields({
  dict,
  categories,
  mode,
  title,
  setTitle,
  categoryId,
  setCategoryId,
  content,
  setContent,
  customCategory,
  setCustomCategory,
}: {
  dict: Dictionary['promptForm'];
  categories: Category[];
  mode: Mode;
  title: string;
  setTitle: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  customCategory: string;
  setCustomCategory: (value: string) => void;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-title">{dict.titleLabel}</label>
        <input
          id="prompt-title"
          name="title"
          className="input"
          placeholder={dict.titlePlaceholder}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={pending}
        />
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-category">{dict.categoryLabel}</label>
        <select
          id="prompt-category"
          name="category_id"
          className="select"
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            if (event.target.value) {
              setCustomCategory('');
            }
          }}
          disabled={pending}
        >
          <option value="">{dict.uncategorized}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {dict.categoryLabels?.[category.name] ?? category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-category-custom">{dict.customCategoryLabel}</label>
        <input
          id="prompt-category-custom"
          name="category_name"
          className="input"
          placeholder={dict.customCategoryPlaceholder}
          value={customCategory}
          onChange={(event) => {
            setCustomCategory(event.target.value);
            if (event.target.value.trim().length > 0) {
              setCategoryId('');
            }
          }}
          disabled={pending}
        />
        {dict.customCategoryHint ? (
          <span className="muted" style={{ fontSize: 12 }}>
            {dict.customCategoryHint}
          </span>
        ) : null}
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-content">{dict.contentLabel}</label>
        <textarea
          id="prompt-content"
          name="content"
          className="textarea"
          placeholder={dict.contentPlaceholder}
          rows={mode === 'manual' ? 12 : 8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          disabled={pending}
        />
      </div>
    </>
  );
}

function SaveButton({ label, saving }: { label: string; saving: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? saving : label}
    </button>
  );
}

export default function PromptForm({
  categories,
  dict,
  locale,
  redirectTo = '/',
  initial,
  submitAction,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<Mode>('manual');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '');
  const [customCategory, setCustomCategory] = useState('');

  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('neutral');
  const [language, setLanguage] = useState(locale === 'zh' ? 'zh' : 'en');
  const [style, setStyle] = useState('');
  const [generatorError, setGeneratorError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const action = submitAction ?? createPrompt;
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.success && redirectTo === 'stay' && !initial?.id) {
      formRef.current?.reset();
      setTitle('');
      setContent('');
      setCategoryId('');
      setCustomCategory('');
    }
  }, [state.success, redirectTo, initial?.id]);

  let saveError: string | null = null;
  if (state.error === 'CONTENT_REQUIRED') {
    saveError = dict.saveErrorContent;
  } else if (state.error === 'TITLE_REQUIRED') {
    saveError = dict.saveErrorTitle;
  } else if (state.error && state.error !== 'NOT_AUTHENTICATED') {
    saveError = dict.saveErrorGeneric;
  }

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setGeneratorError(null);
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    setGeneratorError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          audience,
          tone,
          language,
          style,
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.error || dict.generateError);
      }
      const json = await response.json();
      setTitle((json.title as string) ?? '');
      setContent((json.content as string) ?? '');
    } catch (error: any) {
      setGeneratorError(error?.message || dict.generateError);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn"
          onClick={() => handleModeChange('manual')}
          style={{
            background: mode === 'manual' ? '#4f46e5' : '#1a1f2c',
            borderColor: mode === 'manual' ? '#4f46e5' : '#343b4f',
          }}
        >
          {dict.modeToggleManual}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => handleModeChange('generator')}
          style={{
            background: mode === 'generator' ? '#4f46e5' : '#1a1f2c',
            borderColor: mode === 'generator' ? '#4f46e5' : '#343b4f',
          }}
        >
          {dict.modeToggleGenerator}
        </button>
      </div>

      <form ref={formRef} action={formAction} className="card col" style={{ gap: 16 }}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {initial?.id ? <input type="hidden" name="prompt_id" value={initial.id} /> : null}
        <FormFields
          dict={dict}
          categories={categories}
          mode={mode}
          title={title}
          setTitle={setTitle}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          content={content}
          setContent={setContent}
          customCategory={customCategory}
          setCustomCategory={setCustomCategory}
        />
        {saveError ? (
          <span className="muted" style={{ color: '#ef4444' }}>
            {saveError}
          </span>
        ) : null}
        <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
          <SaveButton label={dict.saveButton} saving={dict.savingButton} />
        </div>
      </form>

      {mode === 'generator' ? (
        <div className="card col" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>{dict.generatorTitle}</h3>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="prompt-goal">{dict.goalLabel}</label>
            <textarea
              id="prompt-goal"
              className="textarea"
              rows={3}
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder={dict.goalPlaceholder}
              disabled={generating}
            />
          </div>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 180 }}>
              <label htmlFor="prompt-audience">{dict.audienceLabel}</label>
              <input
                id="prompt-audience"
                className="input"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder={dict.audiencePlaceholder}
                disabled={generating}
              />
            </div>
            <div className="col" style={{ width: 180 }}>
              <label htmlFor="prompt-tone">{dict.toneLabel}</label>
              <select
                id="prompt-tone"
                className="select"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                disabled={generating}
              >
                {dict.toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col" style={{ width: 180 }}>
              <label htmlFor="prompt-language">{dict.languageLabel}</label>
              <select
                id="prompt-language"
                className="select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                disabled={generating}
              >
                {dict.languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="prompt-style">{dict.styleLabel}</label>
            <input
              id="prompt-style"
              className="input"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              placeholder={dict.stylePlaceholder}
              disabled={generating}
            />
          </div>
          {generatorError ? (
            <span className="muted" style={{ color: '#ef4444' }}>
              {generatorError}
            </span>
          ) : null}
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="btn" onClick={handleGenerate} disabled={generating}>
              {generating ? dict.generatingButton : dict.generateButton}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
