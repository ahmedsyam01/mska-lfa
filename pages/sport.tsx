import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';

interface SportsArticle {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  image?: string;
  createdAt: string;
  category: string;
  author?: {
    username: string;
    firstName: string;
    lastName: string;
  };
}

const SportPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [sportsNews, setSportsNews] = useState<SportsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSportsNews = async () => {
      try {
        setLoading(true);
        const response = await articlesAPI.getAll({
          category: 'sports',
          limit: 6,
          status: 'published'
        });
        setSportsNews(response.data.articles || []);
      } catch (err) {
        console.error('Error fetching sports news:', err);
        setError('فشل في تحميل أخبار الرياضة من الخادم');
        setSportsNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">جاري تحميل أخبار الرياضة...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">الرياضة</h1>
            <p className="text-xl text-gray-600">أخبار وتحديثات الرياضة في موريتانيا</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Sports News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sportsNews.map((news) => (
              <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={news.image || '/images/news/sports-festival.jpg'}
                    alt={news.titleAr || news.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    رياضة
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {news.titleAr || news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {news.contentAr || news.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{formatDate(news.createdAt)}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      اقرأ المزيد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Sports Section */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">الرياضات المميزة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚽</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">كرة القدم</h3>
                <p className="text-gray-600">الرياضة الأكثر شعبية في موريتانيا</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏃</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الجري</h3>
                <p className="text-gray-600">رياضة شعبية للجميع</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">السباحة</h3>
                <p className="text-gray-600">رياضة صيفية ممتعة</p>
              </div>
            </div>
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

export default SportPage;
