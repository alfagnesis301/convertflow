import { useParams, Navigate, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, List } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { generateMetaTags } from '../lib/seo';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedTools from '../components/RelatedTools';
import { tools } from '../lib/toolsConfig';
import { blogPostsEn } from '../content/blog.en';
import { blogPostsEs } from '../content/blog.es';

function parseMarkdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-600 dark:text-gray-400">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-600 dark:text-gray-400">$2</li>')
    .replace(/\n{2,}/g, '</p><p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">')
    .replace(/^/, '<p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">')
    .replace(/$/, '</p>');
}

export default function BlogPostPage() {
  const { lang, t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [tocOpen, setTocOpen] = useState(false);

  const posts = lang === 'en' ? blogPostsEn : blogPostsEs;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to={`/${lang}/blog`} replace />;
  }

  const formattedDate = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.date));

  const meta = generateMetaTags('blog', lang);
  const postMeta = {
    ...meta,
    title: `${post.title} | FlowToPDF Blog`,
    description: post.excerpt,
    ogTitle: post.title,
    ogDescription: post.excerpt,
  };

  const htmlContent = parseMarkdownToHtml(post.content);

  // Extract headings for TOC
  const headings = Array.from(post.content.matchAll(/^## (.+)$/gm)).map((m) => m[1]);

  const relatedTool = post.relatedTools?.[0]
    ? tools.find((t) => t.id === post.relatedTools![0])
    : undefined;

  return (
    <>
      <SEOHead meta={postMeta} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          overrides={[
            { name: 'FlowToPDF', url: `https://flowtopdf.com/${lang}/` },
            { name: t('nav.blog'), url: `https://flowtopdf.com/${lang}/blog` },
            { name: post.title, url: `https://flowtopdf.com/${lang}/blog/${post.slug}` },
          ]}
        />

        <div className="flex gap-8">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              {post.category && (
                <span className="inline-block text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-3 py-1 rounded-full mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {post.author}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Mobile TOC toggle */}
            {headings.length > 0 && (
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setTocOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <List size={16} />
                  {lang === 'en' ? 'Table of Contents' : 'Índice de contenidos'}
                </button>
                {tocOpen && (
                  <nav className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <ul className="space-y-1">
                      {headings.map((h, i) => (
                        <li key={i}>
                          <a
                            href={`#${h.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {h}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            )}

            {/* Article content */}
            <div
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Back to blog */}
            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Link
                to={`/${lang}/blog`}
                className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                <ArrowLeft size={14} />
                {t('blog.backToBlog')}
              </Link>
            </div>

            {/* Related tool */}
            {relatedTool && (
              <div className="mt-8">
                <RelatedTools currentToolId={relatedTool.id} category={relatedTool.category} />
              </div>
            )}
          </article>

          {/* Desktop TOC sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-24">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {lang === 'en' ? 'On this page' : 'En esta página'}
                </p>
                <nav>
                  <ul className="space-y-1.5">
                    {headings.map((h, i) => (
                      <li key={i}>
                        <a
                          href={`#${h.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {h}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
