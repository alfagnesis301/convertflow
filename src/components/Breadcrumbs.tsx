import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { generateBreadcrumbs, breadcrumbsToJsonLd } from '../lib/seo';
import { useTranslation } from '../lib/i18n';

interface BreadcrumbsProps {
  overrides?: { name: string; url: string }[];
}

export default function Breadcrumbs({ overrides }: BreadcrumbsProps) {
  const { lang } = useTranslation();
  const location = useLocation();

  const crumbs = overrides ?? generateBreadcrumbs(location.pathname, lang);
  const jsonLd = breadcrumbsToJsonLd(crumbs);

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          // Convert absolute URL to relative path for Link
          const to = crumb.url.replace('https://convertflow.app', '');
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={14}
                  className="text-gray-400 dark:text-gray-600 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="text-gray-500 dark:text-gray-400 font-medium truncate max-w-[200px]"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={to || `/${lang}/`}
                  className="text-primary-600 dark:text-primary-400 hover:underline truncate max-w-[160px]"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
