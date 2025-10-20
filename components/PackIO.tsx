'use client';

import { useId, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  importPromptPack,
  exportPromptPack,
  type ImportPackState,
  type ExportPackState,
} from '../app/actions';

type Props = {
  dict: {
    title: string;
    importTitle: string;
    importDescription: string;
    importFileLabel: string;
    importButton: string;
    importingButton: string;
    importSuccess: string;
    importError: string;
    exportTitle: string;
    exportDescription: string;
    exportPackTitleLabel: string;
    exportPackTitlePlaceholder: string;
    exportPackSummaryLabel: string;
    exportPackSummaryPlaceholder: string;
    exportSelectPrompts: string;
    exportButton: string;
    exportingButton: string;
    exportSuccess: string;
    exportError: string;
    downloadButton: string;
    noPromptsSelected: string;
    errorMessages: {
      NOT_AUTHENTICATED: string;
      PACK_JSON_REQUIRED: string;
      PACK_JSON_INVALID: string;
      NO_PROMPTS_FOUND: string;
      NO_VALID_PROMPTS: string;
      NO_PROMPTS_SELECTED: string;
    };
  };
  userPrompts?: Array<{ id: string; title: string; content: string }>;
};

const IMPORT_INITIAL_STATE: ImportPackState = { success: false };
const EXPORT_INITIAL_STATE: ExportPackState = { success: false };

function ImportButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? loadingLabel : label}
    </button>
  );
}

function ExportButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? loadingLabel : label}
    </button>
  );
}

export default function PackIO({ dict, userPrompts = [] }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputId = useId();

  const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(new Set());
  const [packTitle, setPackTitle] = useState('My Prompt Pack');
  const [packSummary, setPackSummary] = useState('');
  const [exportedJson, setExportedJson] = useState<string | null>(null);

  const [importState, importFormAction] = useFormState(importPromptPack, IMPORT_INITIAL_STATE);
  const [exportState, exportFormAction] = useFormState(async (prev: ExportPackState, formData: FormData) => {
    const result = await exportPromptPack(prev, formData);
    if (result.success && result.packJson) {
      setExportedJson(result.packJson);
    }
    return result;
  }, EXPORT_INITIAL_STATE);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileContent(null);
      setFileName(null);
      setFileError(null);
      return;
    }

    if (!file.name.endsWith('.json')) {
      setFileError(dict.errorMessages.PACK_JSON_REQUIRED);
      setFileContent(null);
      setFileName(null);
      return;
    }

    setFileName(file.name);
    setFileError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        JSON.parse(text); // Validate JSON
        setFileContent(text);
        setFileError(null);
      } catch {
        setFileError(dict.errorMessages.PACK_JSON_INVALID);
        setFileContent(null);
      }
    };
    reader.onerror = () => {
      setFileError(dict.importError);
      setFileContent(null);
    };
    reader.readAsText(file);
  };

  const handleTogglePrompt = (id: string) => {
    const newSet = new Set(selectedPromptIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedPromptIds(newSet);
  };

  const handleToggleAll = () => {
    if (selectedPromptIds.size === userPrompts.length) {
      setSelectedPromptIds(new Set());
    } else {
      setSelectedPromptIds(new Set(userPrompts.map((p) => p.id)));
    }
  };

  const handleDownload = () => {
    if (!exportedJson) return;
    const blob = new Blob([exportedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${packTitle.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getImportErrorMessage = (error: string | undefined) => {
    if (!error) return null;
    return dict.errorMessages[error as keyof typeof dict.errorMessages] || dict.importError;
  };

  const getExportErrorMessage = (error: string | undefined) => {
    if (!error) return null;
    return dict.errorMessages[error as keyof typeof dict.errorMessages] || dict.exportError;
  };

  return (
    <div className="col" style={{ gap: 24 }}>
      {/* Import Section */}
      <div className="card col" style={{ gap: 16 }}>
        <div className="col" style={{ gap: 8 }}>
          <h2 style={{ margin: 0 }}>{dict.importTitle}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {dict.importDescription}
          </p>
        </div>

        <form action={importFormAction} className="col" style={{ gap: 12 }}>
          <input type="hidden" name="pack_json" value={fileContent ?? ''} />

          <div className="col" style={{ gap: 4 }}>
            <label htmlFor={fileInputId}>{dict.importFileLabel}</label>
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="input"
              style={{
                padding: '8px',
                cursor: 'pointer',
              }}
            />
            {fileName && !fileError ? (
              <span className="muted" style={{ fontSize: 12, color: '#22c55e' }}>
                ✓ {fileName}
              </span>
            ) : null}
            {fileError ? (
              <span className="muted" style={{ fontSize: 12, color: '#ef4444' }}>
                {fileError}
              </span>
            ) : null}
          </div>

          {importState.success && importState.count ? (
            <div
              className="row"
              style={{
                gap: 8,
                padding: 12,
                borderRadius: 8,
                background: '#22c55e1a',
                border: '1px solid #22c55e33',
                color: '#22c55e',
              }}
            >
              <span style={{ fontSize: 14 }}>
                {dict.importSuccess.replace('{count}', String(importState.count))}
              </span>
            </div>
          ) : null}

          {importState.error ? (
            <div
              className="row"
              style={{
                gap: 8,
                padding: 12,
                borderRadius: 8,
                background: '#ef44441a',
                border: '1px solid #ef444433',
                color: '#ef4444',
              }}
            >
              <span style={{ fontSize: 14 }}>{getImportErrorMessage(importState.error)}</span>
            </div>
          ) : null}

          <div className="row" style={{ gap: 8 }}>
            <ImportButton label={dict.importButton} loadingLabel={dict.importingButton} />
          </div>
        </form>
      </div>

      {/* Export Section */}
      <div className="card col" style={{ gap: 16 }}>
        <div className="col" style={{ gap: 8 }}>
          <h2 style={{ margin: 0 }}>{dict.exportTitle}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {dict.exportDescription}
          </p>
        </div>

        <form action={exportFormAction} className="col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="export-pack-title">{dict.exportPackTitleLabel}</label>
            <input
              id="export-pack-title"
              name="pack_title"
              className="input"
              placeholder={dict.exportPackTitlePlaceholder}
              value={packTitle}
              onChange={(e) => setPackTitle(e.target.value)}
            />
          </div>

          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="export-pack-summary">{dict.exportPackSummaryLabel}</label>
            <textarea
              id="export-pack-summary"
              name="pack_summary"
              className="textarea"
              rows={3}
              placeholder={dict.exportPackSummaryPlaceholder}
              value={packSummary}
              onChange={(e) => setPackSummary(e.target.value)}
            />
          </div>

          <div className="col" style={{ gap: 8 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <label>{dict.exportSelectPrompts}</label>
              {userPrompts.length > 0 ? (
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="btn"
                  style={{
                    background: '#1a1f2c',
                    borderColor: '#343b4f',
                    padding: '4px 10px',
                    fontSize: 12,
                  }}
                >
                  {selectedPromptIds.size === userPrompts.length ? 'Deselect All' : 'Select All'}
                </button>
              ) : null}
            </div>

            {userPrompts.length === 0 ? (
              <span className="muted" style={{ fontSize: 13 }}>
                {dict.noPromptsSelected}
              </span>
            ) : (
              <div
                className="col"
                style={{
                  gap: 4,
                  maxHeight: 300,
                  overflowY: 'auto',
                  border: '1px solid #343b4f',
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                {userPrompts.map((prompt) => (
                  <label
                    key={prompt.id}
                    className="row"
                    style={{
                      gap: 8,
                      padding: 8,
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: selectedPromptIds.has(prompt.id) ? '#4f46e520' : 'transparent',
                      border: selectedPromptIds.has(prompt.id) ? '1px solid #4f46e5' : '1px solid transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="prompt_ids"
                      value={prompt.id}
                      checked={selectedPromptIds.has(prompt.id)}
                      onChange={() => handleTogglePrompt(prompt.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13 }}>{prompt.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {exportState.success && exportedJson ? (
            <div className="col" style={{ gap: 8 }}>
              <div
                className="row"
                style={{
                  gap: 8,
                  padding: 12,
                  borderRadius: 8,
                  background: '#22c55e1a',
                  border: '1px solid #22c55e33',
                  color: '#22c55e',
                }}
              >
                <span style={{ fontSize: 14 }}>{dict.exportSuccess}</span>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="btn"
                style={{
                  background: '#22c55e',
                  borderColor: '#22c55e',
                }}
              >
                {dict.downloadButton}
              </button>
            </div>
          ) : null}

          {exportState.error ? (
            <div
              className="row"
              style={{
                gap: 8,
                padding: 12,
                borderRadius: 8,
                background: '#ef44441a',
                border: '1px solid #ef444433',
                color: '#ef4444',
              }}
            >
              <span style={{ fontSize: 14 }}>{getExportErrorMessage(exportState.error)}</span>
            </div>
          ) : null}

          <div className="row" style={{ gap: 8 }}>
            <ExportButton label={dict.exportButton} loadingLabel={dict.exportingButton} />
          </div>
        </form>
      </div>
    </div>
  );
}
