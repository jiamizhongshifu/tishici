'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createPrompt, type CreatePromptState } from '../app/actions';

type Category = { id: string; name: string };

type FormDict = {
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  categoryLabel: string;
  uncategorized: string;
  saveButton: string;
  categoryLabels?: Record<string, string>;
  customCategoryLabel: string;
  customCategoryPlaceholder: string;
  customCategoryHint?: string;
};

type QuickDict = {
  title: string;
  saving: string;
  success: string;
  error: string;
  contentRequired: string;
  titleRequired: string;
};

type Props = {
  categories: Category[];
  formDict: FormDict;
  quickDict: QuickDict;
};

const INITIAL_STATE: CreatePromptState = { success: false };

function Fields({ categories, formDict, quickDict }: { categories: Category[]; formDict: FormDict; quickDict: QuickDict }) {
  const { pending } = useFormStatus();
  return (
    <>
      <h3 style={{ margin: 0 }}>{quickDict.title}</h3>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="quick-title">{formDict.titleLabel}</label>
        <input
          id="quick-title"
          name="title"
          className="input"
          placeholder={formDict.titlePlaceholder}
          disabled={pending}
        />
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="quick-content">{formDict.contentLabel}</label>
        <textarea
          id="quick-content"
          name="content"
          required
          rows={4}
          className="textarea"
          placeholder={formDict.contentPlaceholder}
          disabled={pending}
        />
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="quick-category">{formDict.categoryLabel}</label>
        <select id="quick-category" name="category_id" className="select" disabled={pending}>
          <option value="">{formDict.uncategorized}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {formDict.categoryLabels?.[category.name] ?? category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="quick-category-name">{formDict.customCategoryLabel}</label>
        <input
          id="quick-category-name"
          name="category_name"
          className="input"
          placeholder={formDict.customCategoryPlaceholder}
          disabled={pending}
        />
        {formDict.customCategoryHint ? (
          <span className="muted" style={{ fontSize: 12 }}>
            {formDict.customCategoryHint}
          </span>
        ) : null}
      </div>
    </>
  );
}

function SubmitButton({ label, saving }: { label: string; saving: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? saving : label}
    </button>
  );
}

export default function PromptQuickAddForm({ categories, formDict, quickDict }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createPrompt, INITIAL_STATE);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
    if (state.error) {
      setShowSuccess(false);
    }
    return undefined;
  }, [state]);

  let errorMessage: string | null = null;
  if (state.error === 'CONTENT_REQUIRED') {
    errorMessage = quickDict.contentRequired;
  } else if (state.error === 'TITLE_REQUIRED') {
    errorMessage = quickDict.titleRequired;
  } else if (state.error && state.error !== 'NOT_AUTHENTICATED') {
    errorMessage = quickDict.error;
  }

  return (
    <form ref={formRef} action={formAction} className="card col" style={{ gap: 12 }}>
      <input type="hidden" name="redirectTo" value="stay" />
      <Fields categories={categories} formDict={formDict} quickDict={quickDict} />
      {errorMessage ? (
        <span className="muted" style={{ color: '#ef4444' }}>
          {errorMessage}
        </span>
      ) : null}
      {showSuccess ? (
        <span className="muted" style={{ color: '#22c55e' }}>
          {quickDict.success}
        </span>
      ) : null}
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <SubmitButton label={formDict.saveButton} saving={quickDict.saving} />
      </div>
    </form>
  );
}
