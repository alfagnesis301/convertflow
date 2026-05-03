import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { Tool, ToolCategory } from '../lib/toolsConfig';
import { useTranslation } from '../lib/i18n';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  showCategoryFilter?: boolean;
  showSearch?: boolean;
}

const categoryLabels: Record<ToolCategory, { en: string; es: string }> = {
  'pdf-converter': { en: 'PDF Converter', es: 'Convertidor PDF' },
  'image-to-pdf': { en: 'Image to PDF', es: 'Imagen a PDF' },
  'pdf-tools': { en: 'PDF Tools', es: 'Herramientas PDF' },
  'office-to-pdf': { en: 'Office to PDF', es: 'Office a PDF' },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function ToolGrid({ tools, showCategoryFilter = false, showSearch = false }: ToolGridProps) {
  const { lang, t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const categories = useMemo<ToolCategory[]>(() => {
    return Array.from(new Set(tools.map((t) => t.category)));
  }, [tools]);

  const filtered = useMemo(() => {
    let list = tools;
    if (activeCategory !== 'all') {
      list = list.filter((tool) => tool.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (tool) =>
          t(`tools.${tool.id}.name`).toLowerCase().includes(q) ||
          tool.id.includes(q)
      );
    }
    return list;
  }, [tools, activeCategory, query, t]);

  return (
    <div>
      {/* Controls */}
      {(showSearch || showCategoryFilter) && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          {showSearch && (
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search tools...' : 'Buscar herramientas...'}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
          )}
          {showCategoryFilter && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {lang === 'en' ? 'All' : 'Todos'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {categoryLabels[cat][lang]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center">
          {lang === 'en' ? 'No tools found.' : 'No se encontraron herramientas.'}
        </p>
      ) : (
        <motion.div
          key={`${activeCategory}-${query}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
