import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';
import { Clock, User, Eye, ChevronLeft, ChevronRight, Newspaper, Sparkles, ArrowRight } from 'lucide-react';

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

const Page2: React.FC = () => {
  const { t } = useTranslation('common');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage2News = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use the same API call pattern as the news page
        const response = await articlesAPI.getAll({ 
          status: 'PUBLISHED', 
          limit: 20,
          page: 2
        });
        
        if (response.data && response.data.articles) {
          setArticles(response.data.articles);
          console.log('Articles fetched for page 2:', response.data.articles.length);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error('Error fetching articles for page 2:', err);
        setError('فشل في تحميل الأخبار من الخادم');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPage2News();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12" dir="rtl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-mauritania-gold-dark font-semibold">جاري تحميل الأخبار...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen py-12" dir="rtl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-mauritania-red/10 to-mauritania-red/20 border-2 border-mauritania-red/30 text-mauritania-red-dark px-8 py-6 rounded-2xl inline-block font-semibold">
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
      <div className="min-h-screen py-12" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-6">الصفحة 2</h1>
            <p className="text-xl text-mauritania-gold-dark">أخبار موريتانيا - مجموعة مختارة</p>
          </div>

          {/* Articles Count */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-mauritania-gold/10 to-mauritania-red/10 border-2 border-mauritania-gold/30 text-mauritania-gold-dark px-8 py-4 rounded-full inline-flex items-center gap-3 font-bold">
              <Sparkles className="w-5 h-5" />
              <span>{articles.length} مقالة</span>
            </div>
          </div>

          {/* News Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article) => (
                <article key={article.id} className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
                  {article.image && (
                    <div className="relative h-56">
                      <img
                        src={article.image}
                        alt={article.titleAr || article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark text-xs font-bold px-4 py-2 rounded-full border border-mauritania-green/20">
                        {article.categoryAr || article.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-mauritania-green-dark mb-4 line-clamp-2 group-hover:text-mauritania-green transition-colors duration-300">
                      {article.titleAr || article.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {article.excerptAr || article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-mauritania-gold-dark mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold">{article.authorAr || article.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold">{article.readTime} دقيقة</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-mauritania-green/20">
                      <span className="text-sm text-mauritania-gold-dark font-semibold">
                        {new Date(article.createdAt).toLocaleDateString('ar-MA')}
                      </span>
                      <div className="flex items-center gap-2 text-mauritania-gold-dark">
                        <div className="w-6 h-6 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-full flex items-center justify-center">
                          <Eye className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold">{article.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 border-2 border-mauritania-green/30 text-mauritania-green-dark px-8 py-6 rounded-2xl inline-block font-semibold">
                <p className="text-lg">لا توجد أخبار متاحة في هذه الصفحة</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center items-center gap-6">
            <a href="/" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <ChevronRight className="w-5 h-5" />
              <span className="font-bold">الصفحة الأولى</span>
            </a>
            <div className="flex items-center gap-3">
              <span className="px-6 py-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white rounded-2xl font-bold shadow-lg">
                2
              </span>
            </div>
            <a href="/3" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white rounded-2xl hover:from-mauritania-red hover:to-mauritania-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <span className="font-bold">الصفحة التالية</span>
              <ChevronLeft className="w-5 h-5" />
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

export default Page2;
