import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';
import { Trophy, Calendar, ArrowRight, Target, Users, Zap } from 'lucide-react';

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
        <div className="min-h-screen py-12" dir="rtl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-mauritania-gold-dark font-semibold">جاري تحميل أخبار الرياضة...</p>
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
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-6">الرياضة</h1>
            <p className="text-xl text-mauritania-gold-dark">أخبار وتحديثات الرياضة في موريتانيا</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-mauritania-red/10 to-mauritania-red/20 border-2 border-mauritania-red/30 text-mauritania-red-dark px-6 py-4 rounded-2xl mb-8 font-semibold">
              {error}
            </div>
          )}

          {/* Sports News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sportsNews.map((news) => (
              <div key={news.id} className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
                <div className="relative h-56">
                  <img
                    src={news.image || '/images/news/sports-festival.jpg'}
                    alt={news.titleAr || news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    رياضة
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-mauritania-green-dark mb-4 group-hover:text-mauritania-green transition-colors duration-300">
                    {news.titleAr || news.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {news.contentAr || news.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-mauritania-gold-dark">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">{formatDate(news.createdAt)}</span>
                    </div>
                    <button className="bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white px-6 py-3 rounded-xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
                      <span>اقرأ المزيد</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Sports Section */}
          <div className="modern-card p-12">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient">الرياضات المميزة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl">⚽</span>
                </div>
                <h3 className="text-xl font-bold text-mauritania-green-dark mb-3 group-hover:text-mauritania-green transition-colors duration-300">كرة القدم</h3>
                <p className="text-mauritania-gold-dark">الرياضة الأكثر شعبية في موريتانيا</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl">🏃</span>
                </div>
                <h3 className="text-xl font-bold text-mauritania-green-dark mb-3 group-hover:text-mauritania-green transition-colors duration-300">الجري</h3>
                <p className="text-mauritania-gold-dark">رياضة شعبية للجميع</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl">🏊</span>
                </div>
                <h3 className="text-xl font-bold text-mauritania-green-dark mb-3 group-hover:text-mauritania-green transition-colors duration-300">السباحة</h3>
                <p className="text-mauritania-gold-dark">رياضة صيفية ممتعة</p>
              </div>
            </div>
          </div>

          {/* Sports Stats */}
          <div className="mt-16 modern-card p-12">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient">إحصائيات الرياضة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-3">15+</div>
                <div className="text-mauritania-gold-dark font-semibold">فريق رياضي</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-3">500+</div>
                <div className="text-mauritania-gold-dark font-semibold">رياضي نشط</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-3">10+</div>
                <div className="text-mauritania-gold-dark font-semibold">رياضة مختلفة</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-3">25+</div>
                <div className="text-mauritania-gold-dark font-semibold">بطولة سنوية</div>
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
