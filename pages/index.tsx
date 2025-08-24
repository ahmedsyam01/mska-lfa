import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import { GetStaticProps } from 'next';
import { articlesAPI } from '../utils/api';

interface Article {
  id: string;
  title: string;
  titleAr?: string;
  excerpt?: string;
  excerptAr?: string;
  content?: string;
  contentAr?: string;
  imageUrl?: string;
  publishedAt?: string;
  createdAt: string;
  category: string;
  viewCount: number;
  status: string;
  isBreaking: boolean;
  isFeatured: boolean;
  sourceUrl?: string;
  sourceName?: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

interface NewsSection {
  id: string;
  name: string;
  nameAr: string;
  color: 'blue' | 'orange' | 'red' | 'green';
  articles: Article[];
  sourceUrl?: string;
  sourceName?: string;
  category?: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch articles from API with auto-refresh
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await articlesAPI.getAll({ limit: 500, status: 'PUBLISHED' });
        const data = response.data;
        setArticles(data.articles || []);
          setLastUpdated(new Date());
          console.log(`✅ Fetched ${data.articles?.length || 0} articles from API`);
          
          // Log articles by source for debugging
          const articlesBySource = data.articles?.reduce((acc: any, article: Article) => {
            const source = article.sourceName || 'Unknown';
            acc[source] = (acc[source] || 0) + 1;
            return acc;
          }, {});
          console.log('📊 Articles by source:', articlesBySource);
      } catch (error) {
        console.error('❌ Error fetching articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchArticles();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchArticles, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Define news sections with dynamic content from news aggregator
  const newsSections: NewsSection[] = [
    // Column 1 - الأخبار (News) - Alakhbar
    {
      id: 'news',
      name: 'News',
      nameAr: 'الأخبار',
      color: 'blue',
      articles: articles.filter(a => a.sourceName === 'الأخبار')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://alakhbar.info',
      sourceName: 'الأخبار',
      category: 'GENERAL'
    },
    
    // Column 2 - الصحراء (The Desert) - Essahraa
    {
      id: 'essahraa',
      name: 'Essahraa',
      nameAr: 'الصحراء',
      color: 'orange',
      articles: articles.filter(a => a.sourceName === 'الصحراء')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.essahraa.net',
      sourceName: 'الصحراء',
      category: 'INTERNATIONAL'
    },
    
    // Column 3 - مدار (Orbit) - Madar
    {
      id: 'madar',
      name: 'Madar',
      nameAr: 'مدار',
      color: 'red',
      articles: articles.filter(a => a.sourceName === 'مدار')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.madar.news',
      sourceName: 'مدار',
      category: 'ECONOMY'
    },
    
    // Column 4 - الوكالة الموريتانية للأنباء (Mauritanian News Agency)
    {
      id: 'mauritanian-news-agency',
      name: 'Mauritanian News Agency',
      nameAr: 'الوكالة الموريتانية للأنباء',
      color: 'green',
      articles: articles.filter(a => a.sourceName === 'الوكالة الموريتانية للأنباء')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.ami.mr',
      sourceName: 'الوكالة الموريتانية للأنباء',
      category: 'OFFICIAL'
    },
    
    // Column 5 - تجكجة انفو (Tidjikja Info)
    {
      id: 'tidjikja-info',
      name: 'Tidjikja Info',
      nameAr: 'تجكجة انفو',
      color: 'orange',
      articles: articles.filter(a => a.sourceName === 'تجكجة انفو')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.tidjikja.info',
      sourceName: 'تجكجة انفو',
      category: 'REGIONAL'
    },
    
    // Column 6 - الفكر (Thought)
    {
      id: 'thought',
      name: 'Thought',
      nameAr: 'الفكر',
      color: 'green',
      articles: articles.filter(a => a.sourceName === 'الفكر')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.thought.mr',
      sourceName: 'الفكر',
      category: 'OPINION'
    },
    
    // Column 7 - صحراء ميديا (Sahara Media)
    {
      id: 'sahara-media',
      name: 'Sahara Media',
      nameAr: 'صحراء ميديا',
      color: 'blue',
      articles: articles.filter(a => a.sourceName === 'صحراء ميديا')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.saharamedias.net',
      sourceName: 'صحراء ميديا',
      category: 'LOCAL'
    },
    
    // Column 8 - الصدى (The Echo)
    {
      id: 'echo',
      name: 'Echo',
      nameAr: 'الصدى',
      color: 'orange',
      articles: articles.filter(a => a.sourceName === 'الصدى')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.echo.mr',
      sourceName: 'الصدى',
      category: 'CULTURE'
    },
    
    // Column 9 - السراج الإخباري (Al-Siraj News)
    {
      id: 'al-siraj-news',
      name: 'Al-Siraj News',
      nameAr: 'السراج الإخباري',
      color: 'red',
      articles: articles.filter(a => a.sourceName === 'السراج الإخباري')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.alsiraj.mr',
      sourceName: 'السراج الإخباري',
      category: 'BREAKING'
    },
    
    // Column 10 - مراسلون (Reporters)
    {
      id: 'reporters',
      name: 'Reporters',
      nameAr: 'مراسلون',
      color: 'green',
      articles: articles.filter(a => a.sourceName === 'مراسلون')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://mourassiloun.com',
      sourceName: 'مراسلون',
      category: 'REPORTS'
    },
    
    // Column 11 - التيار (The Current)
    {
      id: 'current',
      name: 'Current',
      nameAr: 'التيار',
      color: 'blue',
      articles: articles.filter(a => a.sourceName === 'التيار')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.current.mr',
      sourceName: 'التيار',
      category: 'HEALTH'
    },
    
    // Column 12 - الوئام الوطني (National Harmony)
    {
      id: 'national-harmony',
      name: 'National Harmony',
      nameAr: 'الوئام الوطني',
      color: 'orange',
      articles: articles.filter(a => a.sourceName === 'الوئام الوطني')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.harmony.mr',
      sourceName: 'الوئام الوطني',
      category: 'POLITICS'
    },
    
    // Column 13 - موريتانيا اليوم (Mauritania Today)
    {
      id: 'mauritania-today',
      name: 'Mauritania Today',
      nameAr: 'موريتانيا اليوم',
      color: 'blue',
      articles: articles.filter(a => a.sourceName === 'موريتانيا اليوم')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.mauritania-today.mr',
      sourceName: 'موريتانيا اليوم',
      category: 'DAILY'
    },
    
    // Column 14 - نوافذ (Windows)
    {
      id: 'windows',
      name: 'Windows',
      nameAr: 'نوافذ',
      color: 'orange',
      articles: articles.filter(a => a.sourceName === 'نوافذ')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.windows.mr',
      sourceName: 'نوافذ',
      category: 'POLICY'
    },
    
    // Column 15 - وكالة كيفه للأنباء (Kiffa News Agency)
    {
      id: 'kiffa-news-agency',
      name: 'Kiffa News Agency',
      nameAr: 'وكالة كيفه للأنباء',
      color: 'red',
      articles: articles.filter(a => a.sourceName === 'وكالة كيفه للأنباء')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.kiffa-news.mr',
      sourceName: 'وكالة كيفه للأنباء',
      category: 'LOCAL'
    },
    
    // Column 16 - نواكشوط مباشر (Nouakchott Live)
    {
      id: 'nouakchott-live',
      name: 'Nouakchott Live',
      nameAr: 'نواكشوط مباشر',
      color: 'green',
      articles: articles.filter(a => a.sourceName === 'نواكشوط مباشر')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.nouakchott-live.mr',
      sourceName: 'نواكشوط مباشر',
      category: 'LIVE'
    },
    
    // Column 17 - الوكالة الموريتانية للصحافة (Mauritanian Press Agency)
    {
      id: 'mauritanian-press-agency',
      name: 'Mauritanian Press Agency',
      nameAr: 'الوكالة الموريتانية للصحافة',
      color: 'green',
      articles: articles.filter(a => a.sourceName === 'الوكالة الموريتانية للصحافة')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
      sourceUrl: 'https://www.amp.mr',
      sourceName: 'الوكالة الموريتانية للصحافة',
      category: 'OFFICIAL'
    }
  ];

  const getHeaderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-mauritania-green to-mauritania-green-dark';
      case 'orange': return 'from-mauritania-gold to-mauritania-gold-dark';
      case 'red': return 'from-mauritania-red to-mauritania-red-dark';
      case 'green': return 'from-mauritania-green to-mauritania-green-dark';
      default: return 'from-mauritania-green to-mauritania-green-dark';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('ar', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-mauritania-green-light/10 via-white to-mauritania-gold-light/10 flex items-center justify-center" dir="rtl">
          <div className="text-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
            <div className="text-xl text-mauritania-green font-bold mt-6 mb-2">جاري تحميل الأخبار...</div>
            <div className="text-mauritania-gold-dark">يتم جلب أحدث الأخبار من جميع المصادر</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-mauritania-green-light/10 via-white to-mauritania-gold-light/10 flex items-center justify-center" dir="rtl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-white text-4xl">⚠️</span>
            </div>
            <div className="text-2xl text-mauritania-red font-bold mb-4">خطأ في تحميل الأخبار</div>
            <div className="text-gray-600 mb-6">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white px-8 py-3 rounded-full font-bold hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-mauritania-green-light/5 via-white to-mauritania-gold-light/5" dir="rtl">
        {/* Modern Status Bar */}
        {lastUpdated && (
          <div className="bg-white/80 backdrop-blur-md border-b border-mauritania-green/20 py-4 px-6 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-mauritania-green rounded-full animate-pulse"></div>
                  <span className="text-mauritania-green font-semibold">آخر تحديث: {formatLastUpdated(lastUpdated)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-mauritania-gold rounded-full"></div>
                  <span className="text-mauritania-gold-dark font-semibold">إجمالي المقالات: {articles.length} مقالة</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  articles.reduce((acc: any, article) => {
                    const source = article.sourceName || 'Unknown';
                    acc[source] = (acc[source] || 0) + 1;
                    return acc;
                  }, {})
                )
                .filter(([_, count]) => (count as number) > 0)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([source, count]) => (
                  <span key={source} className="bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 text-mauritania-green-dark px-3 py-1 rounded-full text-xs font-medium border border-mauritania-green/30">
                    {source}: {count as number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section with Logo and Promotions */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Row 1: Logo + Main Promotion */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              {/* Logo Section */}
              <div className="lg:col-span-1">
                <div className="modern-card p-8 text-center h-full flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gradient mb-3">موريتانيا الآن</div>
                    <div className="text-sm text-mauritania-gold-dark font-medium">WWW.RIMNOW.COM</div>
                  </div>
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg animate-float">
                    <div className="text-white text-2xl font-bold">ر</div>
                  </div>
                </div>
              </div>

              {/* Main Promotion */}
              <div className="lg:col-span-3">
                <div className="modern-card p-8 h-full bg-gradient-to-r from-mauritania-green via-mauritania-gold to-mauritania-red text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-4xl font-bold mb-4">Bankily Promotion</div>
                    <div className="text-lg opacity-90">Promotional Image Placeholder</div>
                    <div className="mt-6">
                      <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
                        اكتشف المزيد
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Two Promotions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Environmental Study */}
              <div className="modern-card p-6 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-mauritania-green mb-2">Environmental Study</div>
                  <div className="text-mauritania-gold-dark">Promotional Image Placeholder</div>
                </div>
              </div>

              {/* Chinguitel */}
              <div className="modern-card p-6 h-32 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">Chinguitel Promotion</div>
                  <div className="opacity-90">Promotional Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main News Sections */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {newsSections.map((section) => (
                <div key={section.id} className="modern-card overflow-hidden">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${getHeaderColor(section.color)} text-white p-4 rounded-t-2xl`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">
                        <a 
                          href={section.sourceUrl} 
                          target="_blank" 
                          className="hover:opacity-80 transition-opacity duration-200"
                        >
                          {section.nameAr} ({section.articles.length})
                        </a>
                      </h3>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Articles List */}
                  <div className="bg-white">
                    <ul className="divide-y divide-gray-100">
                      {section.articles.length > 0 ? (
                        section.articles.map((article, index) => {
                          const isNew = new Date(article.createdAt).getTime() > Date.now() - (24 * 60 * 60 * 1000);
                          return (
                            <li key={article.id} className="article-item group">
                              {isNew && <div className="status-new"></div>}
                              <a 
                                href={`/articles/${article.id}`}
                                className={`block text-sm leading-relaxed pr-${isNew ? '6' : '0'} group-hover:text-mauritania-green transition-colors duration-200 ${
                                  article.isBreaking ? 'status-breaking' : 
                                  isNew ? 'text-mauritania-green font-semibold' : 
                                  'text-gray-700'
                                }`}
                                title={article.title}
                              >
                                {article.title}
                              </a>
                            </li>
                          );
                        })
                      ) : (
                        <li className="p-6 text-center text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">📰</span>
                          </div>
                          لا توجد أخبار متاحة حالياً
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Promotion Banner */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="modern-card p-8 bg-gradient-to-r from-mauritania-green via-mauritania-gold to-mauritania-red text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="text-3xl font-bold mb-3">Bottom Promotion Banner</div>
                <div className="text-lg opacity-90">Promotional Image Placeholder</div>
                <div className="mt-6">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
                    تواصل معنا
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 