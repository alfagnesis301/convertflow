import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function FileSafetyNotice() {
  const { lang } = useTranslation();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
      <ShieldCheck size={18} className="shrink-0" />
      <span>
        {lang === 'en'
          ? 'Your files are encrypted in transit and deleted immediately after conversion.'
          : 'Tus archivos están cifrados en tránsito y se eliminan inmediatamente después de la conversión.'}
      </span>
    </div>
  );
}
