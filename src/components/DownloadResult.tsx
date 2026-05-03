import { Download, RefreshCw, Shield } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface DownloadResultProps {
  downloadUrl: string;
  fileName: string;
  fileSizeBytes?: number;
  onConvertAnother: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadResult({
  downloadUrl,
  fileName,
  fileSizeBytes,
  onConvertAnother,
}: DownloadResultProps) {
  const { t, lang } = useTranslation();

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      {/* Download button */}
      <button
        onClick={handleDownload}
        className="btn-primary text-base px-8 py-4 gap-3"
      >
        <Download size={22} />
        {t('common.downloadFile')}
      </button>

      {/* File info */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">{fileName}</p>
        {fileSizeBytes !== undefined && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatBytes(fileSizeBytes)}</p>
        )}
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 max-w-sm text-center">
        <Shield size={14} className="text-green-500 shrink-0" />
        <span>
          {lang === 'en'
            ? 'Your file will be automatically deleted from our servers within 30 minutes.'
            : 'Tu archivo será eliminado automáticamente de nuestros servidores en 30 minutos.'}
        </span>
      </div>

      {/* Convert another */}
      <button
        onClick={onConvertAnother}
        className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
      >
        <RefreshCw size={15} />
        {lang === 'en' ? 'Convert another file' : 'Convertir otro archivo'}
      </button>
    </div>
  );
}
