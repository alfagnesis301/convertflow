import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import type { BlogPost } from '../content/blog.en';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { t, lang } = useTranslation();

  const formattedDate = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.date));

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        {/* Category badge */}
        {post.category && (
          <span className="inline-block text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full mb-4 self-start">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2 line-clamp-2">
          <Link
            to={`/${lang}/blog/${post.slug}`}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
          {post.author && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formattedDate}
          </span>
        </div>

        {/* Read more */}
        <Link
          to={`/${lang}/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mt-4"
        >
          {t('blog.readMore')}
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
