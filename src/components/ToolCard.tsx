import { Link } from 'react-router-dom';
import type { Tool, ToolCategory } from '../lib/toolsConfig';
import { useTranslation } from '../lib/i18n';
import { getIcon } from '../lib/iconMap';

interface ToolCardProps {
  tool: Tool;
}

const categoryColors: Record<ToolCategory, { bg: string; iconColor: string }> = {
  'pdf-converter': { bg: 'bg-blue-50 dark:bg-blue-950/40', iconColor: 'text-blue-500' },
  'image-to-pdf': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', iconColor: 'text-emerald-500' },
  'pdf-tools': { bg: 'bg-violet-50 dark:bg-violet-950/40', iconColor: 'text-violet-500' },
  'office-to-pdf': { bg: 'bg-orange-50 dark:bg-orange-950/40', iconColor: 'text-orange-500' },
};

export default function ToolCard({ tool }: ToolCardProps) {
  const { t, lang } = useTranslation();
  const colors = categoryColors[tool.category];
  const IconComponent = getIcon(tool.icon);
  const slug = tool.slug[lang];
  const to = `/${lang}/${slug}`;

  const name = t(`tools.${tool.id}.name`);
  const desc = t(`tools.${tool.id}.desc`);

  return (
    <Link
      to={to}
      className="group relative block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5"
      aria-label={name}
    >
      {/* Coming soon badge */}
      {!tool.available && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
          {t('common.comingSoon')}
        </span>
      )}

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${colors.bg}`}>
        <IconComponent size={22} className={colors.iconColor} />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {name}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{desc}</p>
    </Link>
  );
}
