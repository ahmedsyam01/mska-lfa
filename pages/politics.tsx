import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';
import { Clock, User, Eye, Building2 } from 'lucide-react';

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

const PoliticsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoliticsNews = async () => {
      try {
        setLoading(true);
        const response = await articlesAPI.getAll({
          category: 'politics',
          limit: 15,
          status: 'published'
        });
        setArticles(response.data.articles || []);
      } catch (err) {
        setError('فشل في تحميل الأخبار السياسية');
        // Fallback to mock data
        const mockArticles: NewsArticle[] = [
          {
            id: '1',
            title: 'اجتماع مجلس الوزراء الأسبوعي',
            titleAr: 'اجتماع مجلس الوزراء الأسبوعي',
            excerpt: 'عقد مجلس الوزراء اجتماعه الأسبوعي لمناقشة القضايا المهمة...',
            excerptAr: 'عقد مجلس الوزراء اجتماعه الأسبوعي لمناقشة القضايا المهمة...',
            author: 'أحمد محمد',
            authorAr: 'أحمد محمد',
            publishedAt: '2024-01-15',
            category: 'سياسة',
            categoryAr: 'سياسة',
            image: '/images/news/economics-nouakchott.jpg',
            readTime: '5 دقائق',
            views: 1250
          },
          {
            id: '2',
            title: 'زيارة رسمية لوفد أجنبي',
            titleAr: 'زيارة رسمية لوفد أجنبي',
            excerpt: 'استقبل الرئيس وفداً رسمياً من دولة صديقة لتعزيز العلاقات...',
            excerptAr: 'استقبل الرئيس وفداً رسمياً من دولة صديقة لتعزيز العلاقات...',
            author: 'فاطمة أحمد',
            authorAr: 'فاطمة أحمد',
            publishedAt: '2024-01-14',
            category: 'سياسة',
            categoryAr: 'سياسة',
            image: '/images/news/education-rural.jpg',
            readTime: '4 دقائق',
            views: 980
          },
          {
            id: '3',
            title: 'إعلان عن تشكيل حكومة جديدة',
            titleAr: 'إعلان عن تشكيل حكومة جديدة',
            excerpt: 'تم الإعلان عن تشكيل حكومة جديدة برئاسة رئيس الوزراء...',
            excerptAr: 'تم الإعلان عن تشكيل حكومة جديدة برئاسة رئيس الوزراء...',
            author: 'د. محمد علي',
            authorAr: 'د. محمد علي',
            publishedAt: '2024-01-13',
            category: 'سياسة',
            categoryAr: 'سياسة',
            image: '/images/news/healthcare-mobile.jpg',
            readTime: '6 دقائق',
            views: 1100
          }
        ];
        setArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticsNews();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">جاري التحميل...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">أخبار موريتانيا السياسية</h1>
            <p className="text-xl text-gray-600">أحدث الأخبار والتطورات السياسية في البلاد</p>
          </div>

          {/* Category Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">أخبار سياسية</span>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={article.image || '/images/news/placeholder-1.jpg'}
                    alt={article.titleAr || article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200">
                      اقرأ المزيد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Info */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">عن الأخبار السياسية</h2>
            <div className="text-center text-gray-600">
              <p className="mb-4">
                تقدم هذه الصفحة أحدث الأخبار والتطورات السياسية في موريتانيا، 
                بما في ذلك قرارات الحكومة والزيارات الرسمية والتطورات الدبلوماسية.
              </p>
              <p>
                نركز على الأخبار السياسية المهمة التي تؤثر على مستقبل البلاد 
                والعلاقات الدولية لموريتانيا.
              </p>
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

export default PoliticsPage;
