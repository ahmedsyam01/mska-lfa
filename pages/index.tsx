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
      case 'blue': return '#027ac6';
      case 'orange': return '#bd5900';
      case 'red': return '#c50400';
      case 'green': return '#008000';
      default: return '#027ac6';
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
        <div className="min-h-screen bg-[#d4edec] flex items-center justify-center" dir="rtl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">جاري تحميل الأخبار...</div>
            <div className="text-sm text-gray-500 mt-2">يتم جلب أحدث الأخبار من جميع المصادر</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#d4edec] flex items-center justify-center" dir="rtl">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <div className="text-xl text-gray-800 mb-2">خطأ في تحميل الأخبار</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      <div className="min-h-screen bg-[#d4edec]" dir="rtl">
        {/* Status Bar */}
        {lastUpdated && (
          <div className="bg-white border-b border-gray-200 py-2 px-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                آخر تحديث: {formatLastUpdated(lastUpdated)}
              </div>
              <div>
                إجمالي المقالات: {articles.length} مقالة
              </div>
              <div className="flex gap-4">
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
                  <span key={source} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {source}: {count as number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Promotional Section - 2 Rows */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Row 1: Logo (25%) + Promotion Image (75%) */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              {/* Column 1: Logo (25%) */}
              <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">موريتانيا الآن</div>
                  <div className="text-sm text-gray-600">WWW.RIMNOW.COM</div>
                  <div className="w-16 h-16 bg-green-500 border border-white mx-auto mt-4"></div>
                </div>
          </div>

              {/* Column 2: Promotion Image (75%) */}
              <div className="col-span-3">
                <div className="w-full h-48 bg-gradient-to-l from-blue-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">Bankily Promotion</div>
                    <div className="text-sm">Promotional Image Placeholder</div>
                  </div>
                </div>
              </div>
          </div>

            {/* Row 2: 2 Promotion Images (50% each) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Environmental Study Promotion Image (50%) */}
              <div className="w-full h-32 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-200">
                <div className="text-gray-600 text-center">
                  <div className="text-lg font-bold mb-1">Environmental Study</div>
                  <div className="text-sm">Promotional Image Placeholder</div>
                </div>
              </div>

              {/* Column 2: Chinguitel Promotion Image (50%) */}
              <div className="w-full h-32 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-lg font-bold mb-1">Chinguitel Promotion</div>
                  <div className="text-sm">Promotional Image Placeholder</div>
        </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - News Sections (2 Columns) */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {newsSections.map((section) => (
                <div key={section.id} id="rss_block" className="bg-white overflow-hidden w-full h-auto float-right border border-dotted border-gray-300 rounded-lg shadow-lg" style={{
                  borderRadius: '10px',
                  boxShadow: '0 1px 4px rgba(0,0,0,.3),0 0 40px rgba(0,0,0,.1) inset'
                }}>
                  <div className={section.color}>
                    <div>
                      <div>
                        <div>
                          <h3 style={{
                            textAlign: 'right',
                            border: 'solid 1px #eee',
                            backgroundColor: '#f4f4f4',
                            margin: 0,
                            height: '35px',
                            overflow: 'hidden',
                            marginTop: '1px'
                          }}>
                            <a href={section.sourceUrl} target="_blank" className="url_site" style={{
                              padding: '3px 10px',
                              background: getHeaderColor(section.color),
                              border: 'solid 1px #f4f4f4',
                              color: '#fff',
                              fontWeight: '400',
                              fontSize: '12px',
                              textDecoration: 'none',
                              lineHeight: '30px',
                              marginRight: '10px',
                              marginTop: '2px',
                              display: 'inline-block'
                            }}>
                              {section.nameAr} ({section.articles.length})
                            </a>
                        </h3>
                          
                          <div className="feed">
                            <ul className="item_rss" style={{
                              padding: 0,
                              margin: 0
                            }}>
                              {section.articles.length > 0 ? (
                                section.articles.map((article, index) => {
                                  const isNew = new Date(article.createdAt).getTime() > Date.now() - (24 * 60 * 60 * 1000); // Last 24 hours
                                  return (
                                    <li key={article.id} style={{
                                      listStyle: 'none',
                                      borderBottom: '1px solid #ebebeb',
                                      padding: '4px',
                                      height: '24px',
                                      overflow: 'hidden',
                                      position: 'relative'
                                    }}>
                                      {isNew && (
                                        <span style={{
                                          position: 'absolute',
                                          left: '4px',
                                          top: '50%',
                                          transform: 'translateY(-50%)',
                                          width: '6px',
                                          height: '6px',
                                          backgroundColor: '#ff4444',
                                          borderRadius: '50%',
                                          animation: 'pulse 2s infinite'
                                        }}></span>
                                      )}
                                      <a 
                                        href={`/articles/${article.id}`}
                                        style={{
                                          textDecoration: 'none',
                                          fontSize: '11px',
                                          textAlign: 'right',
                                          color: article.isBreaking ? 'red' : (isNew ? '#027ac6' : '#00437c'),
                                          display: 'block',
                                          lineHeight: '22px',
                                          overflow: 'hidden',
                                          fontWeight: isNew ? 'bold' : 'normal',
                                          paddingRight: isNew ? '12px' : '0'
                                        }}
                                        title={article.title}
                                      >
                                        {article.title}
                                      </a>
                                    </li>
                                  );
                                })
                              ) : (
                                // Show empty state when no articles are available
                                <li style={{
                                  listStyle: 'none',
                                  borderBottom: '1px solid #ebebeb',
                                  padding: '8px',
                                  textAlign: 'center',
                                  color: '#999',
                                  fontSize: '11px'
                                }}>
                                  لا توجد أخبار متاحة حالياً
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Bottom Promotional Banner */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="w-full h-24 bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-xl font-bold mb-1">Bottom Promotion Banner</div>
                <div className="text-sm">Promotional Image Placeholder</div>
              </div>
            </div>
          </div>
        </section>
        </div>
    </Layout>
  );
};



export default HomePage; 