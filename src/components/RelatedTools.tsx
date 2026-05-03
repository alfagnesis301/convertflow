import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Tool, ToolCategory } from '../lib/toolsConfig';
import { tools } from '../lib/toolsConfig';
import { useTranslation } from '../lib/i18n';
import { getIcon } from '../lib/iconMap';

interface RelatedToolsProps {
  currentToolId: string;
  category: ToolCategory;
}

export default function RelatedTools({ currentToolId, category }: RelatedToolsProps) {
  const { t, lang } = useTranslation();

  const related: Tool[] = tools
    .filter((tool) => tool.id !== currentToolId && tool.category === category && tool.available)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        {lang === 'en' ? 'You might also like' : 'También te puede interesar'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {related.map((tool) => {
          const Icon = getIcon(tool.icon);
          const name = t(`tools.${tool.id}.name`);
          return (
            <Link
              key={tool.id}
              to={`/${lang}/${tool.slug[lang]}`}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all duration-200 group"
            >
              <Icon size={18} className="text-primary-500 shrink-0" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {name}
              </span>
              <ArrowRight size={14} className="text-gray-400 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
