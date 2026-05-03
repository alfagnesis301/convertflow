import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { CloudUpload, FileCheck, AlertCircle, X } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface UploadBoxProps {
  acceptedFormats: string[];
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadBox({
  acceptedFormats,
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  disabled = false,
}: UploadBoxProps) {
  const { t, lang } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; error: string | null } => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      const valid: File[] = [];
      let errorMsg: string | null = null;

      for (const file of files) {
        if (file.size > maxBytes) {
          errorMsg = t('errors.fileTooLarge', { size: String(maxSizeMB) });
          continue;
        }
        const matchesMime = acceptedFormats.some((fmt) => {
          if (fmt.startsWith('.')) {
            return file.name.toLowerCase().endsWith(fmt.toLowerCase());
          }
          return file.type === fmt || file.type.startsWith(fmt.replace('*', ''));
        });
        if (!matchesMime) {
          errorMsg = t('errors.invalidFormat');
          continue;
        }
        valid.push(file);
      }
      return { valid, error: errorMsg };
    },
    [acceptedFormats, maxSizeMB, t]
  );

  const handleFiles = useCallback(
    (rawFiles: FileList | null) => {
      if (!rawFiles || rawFiles.length === 0) return;
      const list = Array.from(rawFiles).slice(0, multiple ? undefined : 1);
      const { valid, error: err } = validateFiles(list);
      setError(err);
      if (valid.length > 0) {
        setSelectedFiles(valid);
        onFilesSelected(valid);
      }
    },
    [multiple, validateFiles, onFilesSelected]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
    if (inputRef.current) inputRef.current.value = '';
  };

  const acceptAttr = acceptedFormats
    .map((f) => (f.startsWith('.') ? f : `.${f.split('/')[1] ?? f}`))
    .join(',');

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={t('common.dragDrop')}
        aria-disabled={disabled}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative min-h-[220px] flex flex-col items-center justify-center gap-4
          rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 scale-[1.01]'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/20'
          }
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          multiple={multiple}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          aria-label={t('common.chooseFile')}
          tabIndex={-1}
        />

        {selectedFiles.length === 0 ? (
          <>
            <div
              className={`p-4 rounded-2xl transition-colors ${
                dragOver ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-white dark:bg-gray-700'
              } shadow-sm`}
            >
              <CloudUpload
                size={40}
                className={dragOver ? 'text-primary-600' : 'text-gray-400 dark:text-gray-500'}
              />
            </div>
            <div className="text-center px-4">
              <p className="font-semibold text-gray-700 dark:text-gray-200 text-base">
                {t('common.dragDrop')}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('common.orClickToUpload')}</p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="btn-primary py-2.5 px-6 pointer-events-auto"
              tabIndex={-1}
            >
              {t('common.chooseFile')}
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('common.maxSize', { size: String(maxSizeMB) })}
            </p>
          </>
        ) : (
          <div className="w-full px-6 py-4 space-y-2 pointer-events-none">
            {selectedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileCheck size={20} className="text-green-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {formatBytes(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="pointer-events-auto p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 pt-2 pointer-events-none">
              {lang === 'en' ? 'Click to replace' : 'Haz clic para reemplazar'}
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
