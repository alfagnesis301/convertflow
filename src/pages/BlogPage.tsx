import { useTranslation } from '../lib/i18n';
import { generateMetaTags } from '../lib/seo';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogCard from '../components/BlogCard';
import { blogPostsEn } from '../content/blog.en';
import { blogPostsEs } from '../content/blog.es';

export default function BlogPage() {
  const { lang, t } = useTranslation();
  const meta = generateMetaTags('blog', lang);
  const posts = lang === 'en' ? blogPostsEn : blogPostsEs;

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('blog.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('blog.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-16">
            {lang === 'en' ? 'No posts yet. Check back soon!' : 'Sin publicaciones aún. ¡Vuelve pronto!'}
          </p>
        )}
      </main>
    </>
  );
}
