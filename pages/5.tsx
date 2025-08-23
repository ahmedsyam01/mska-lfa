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
  author: string;
  authorAr?: string;
  publishedAt: string;
  category: string;
  categoryAr?: string;
  image?: string;
  readTime: string;
  views: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const Page5: React.FC = () => {
  const { t } = useTranslation('common');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 5,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const fetchPage5News = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await articlesAPI.getAll({
          page: 5,
          limit: 12,
          status: 'published'
        });
        
        if (response.data.articles) {
          setArticles(response.data.articles);
        }
        
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } catch (err) {
        setError('فشل في تحميل الأخبار من الخادم');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPage5News();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">جاري التحميل...</p>
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
            <div className="text-center">
              <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg inline-block">
                <p className="text-lg font-medium">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  إعادة المحاولة
                </button>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">الصفحة 5</h1>
            <p className="text-xl text-gray-600">أخبار موريتانيا - الصفحة الخامسة</p>
          </div>

          {/* Pagination Info */}
          <div className="text-center mb-8">
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full inline-flex items-center gap-2">
              <span className="font-medium">الصفحة {pagination.page} من {pagination.pages}</span>
              <span className="text-sm">({pagination.total} مقالة)</span>
            </div>
          </div>

          {/* News Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <img
                      src={article.image || '/images/news/placeholder-1.jpg'}
                      alt={article.titleAr || article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.categoryAr || article.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.titleAr || article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerptAr || article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{article.authorAr || article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{article.views} مشاهدة</span>
                      </div>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200">
                        اقرأ المزيد
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 text-gray-600 px-6 py-4 rounded-lg inline-block">
                <p className="text-lg">لا توجد أخبار متاحة في هذه الصفحة</p>
              </div>
            </div>
          )}

          {/* Pagination Navigation */}
          <div className="flex justify-center items-center gap-4">
            <a
              href="/4"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
              الصفحة السابقة
            </a>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-orange-600 text-white rounded-md font-medium">
                {pagination.page}
              </span>
              <span className="text-gray-600">من {pagination.pages}</span>
            </div>
            
            <a
              href="/6"
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
            >
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

export default Page5;
