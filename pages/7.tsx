import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';
import { Clock, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  content: string;
  contentAr?: string;
  image?: string;
  author: string;
  authorAr?: string;
  category: string;
  categoryAr?: string;
  createdAt: string;
  readTime: number;
  views: number;
  status: string;
}

const Page7: React.FC = () => {
  const { t } = useTranslation('common');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage7News = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await articlesAPI.getAll({
          limit: 20,
          status: 'published'
        });

        if (response.data.articles) {
          setArticles(response.data.articles);
        }
      } catch (err) {
        setError('فشل في تحميل الأخبار من الخادم');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPage7News();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الأخبار...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg inline-block">
                <p className="text-lg">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">الصفحة 7</h1>
            <p className="text-xl text-gray-600">أخبار موريتانيا - مجموعة مختارة</p>
          </div>

          {/* Articles Count */}
          <div className="text-center mb-8">
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full inline-flex items-center gap-2">
              <span className="font-medium">{articles.length} مقالة</span>
            </div>
          </div>

          {/* News Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {article.image && (
                    <div className="relative h-48">
                      <img
                        src={article.image}
                        alt={article.titleAr || article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {article.categoryAr || article.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.titleAr || article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerptAr || article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.authorAr || article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} دقيقة</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString('ar-MA')}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">{article.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 text-gray-600 px-6 py-4 rounded-lg inline-block">
                <p className="text-lg">لا توجد أخبار متاحة في هذه الصفحة</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4">
            <a href="/6" className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
              الصفحة السابقة
            </a>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-orange-600 text-white rounded-md font-medium">
                7
              </span>
            </div>
            <a href="/8" className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200">
              الصفحة التالية
              <ChevronLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Page7;
