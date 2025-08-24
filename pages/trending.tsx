import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout/Layout';
import NewsCard from '../components/common/NewsCard';
import { TrendingUp, Flame, Hash, Eye, BarChart3, Zap } from 'lucide-react';
import { articlesAPI } from '@/utils/api';

interface Article {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  source: {
    id: string;
    name: string;
  };
  viewCount: number;
  _count: {
    comments: number;
  };
}

interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  trending: boolean;
}

const TrendingPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'topics'>('articles');

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      // Fetch trending articles
      const articlesResponse = await articlesAPI.getAll({ trending: 'true' as any });
      setArticles(articlesResponse.data.articles || []);

      // Mock trending topics data
      setTopics([
        { id: '1', name: 'موريتانيا', count: 1250, trending: true },
        { id: '2', name: 'نواكشوط', count: 890, trending: true },
        { id: '3', name: 'الاقتصاد', count: 654, trending: true },
        { id: '4', name: 'السياسة', count: 543, trending: true },
        { id: '5', name: 'الرياضة', count: 432, trending: true },
        { id: '6', name: 'التعليم', count: 321, trending: true },
        { id: '7', name: 'الصحة', count: 287, trending: true },
        { id: '8', name: 'التكنولوجيا', count: 234, trending: true },
      ]);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12" dir="rtl">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded-2xl w-1/3 mb-8"></div>
            <div className="flex gap-6 mb-12 justify-end">
              <div className="h-12 bg-gradient-to-r from-mauritania-gold/20 to-mauritania-red/20 rounded-xl w-32"></div>
              <div className="h-12 bg-gradient-to-r from-mauritania-red/20 to-mauritania-green/20 rounded-xl w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="modern-card p-6 h-64">
                  <div className="h-48 bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-mauritania-gold/20 to-mauritania-red/20 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12" dir="rtl">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center mb-6 justify-start space-x-start">
            <div className="w-16 h-16 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                الرائج
              </h1>
              <p className="text-xl text-mauritania-gold-dark text-right mt-2">
                اكتشف ما هو رائج في موريتانيا الآن
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <nav className="flex gap-2 justify-start">
              <button
                onClick={() => setActiveTab('topics')}
                className={`py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'topics'
                    ? 'bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white shadow-lg'
                    : 'text-mauritania-green-dark hover:bg-mauritania-green/10'
                }`}
              >
                <div className="flex items-center gap-2 space-x-reverse">
                  <span>المواضيع الرائجة</span>
                  <Hash className="h-5 w-5" />
                </div>
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'articles'
                    ? 'bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white shadow-lg'
                    : 'text-mauritania-green-dark hover:bg-mauritania-green/10'
                }`}
              >
                <div className="flex items-center gap-2 space-x-reverse">
                  <span>المقالات الرائجة</span>
                  <Flame className="h-5 w-5" />
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'articles' ? (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 px-6 py-3 rounded-full border border-mauritania-green/20">
                <Zap className="w-5 h-5 text-mauritania-green" />
                <p className="text-mauritania-green-dark font-semibold">
                  {articles.length} مقال رائج
                </p>
              </div>
            </div>
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    variant="featured"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6">
                  <Flame className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-mauritania-green-dark mb-3">
                  لا توجد مقالات رائجة
                </h3>
                <p className="text-mauritania-gold-dark text-lg">
                  تحقق مرة أخرى لاحقًا للمحتوى الرائج
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-mauritania-gold/10 to-mauritania-red/10 px-6 py-3 rounded-full border border-mauritania-gold/20">
                <Hash className="w-5 h-5 text-mauritania-gold" />
                <p className="text-mauritania-gold-dark font-semibold">
                  {topics.length} موضوع رائج
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="modern-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between mb-4 flex-row-reverse">
                    <span className={`text-sm font-bold text-white px-3 py-1.5 rounded-full ${
                      index < 3 
                        ? 'bg-gradient-to-r from-mauritania-gold to-mauritania-red' 
                        : 'bg-gradient-to-r from-mauritania-green to-mauritania-green-dark'
                    } shadow-lg`}>
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2 space-x-reverse">
                      <span className="font-bold text-lg text-mauritania-green-dark group-hover:text-mauritania-green transition-colors duration-300">#{topic.name}</span>
                      <Hash className="h-5 w-5 text-mauritania-gold" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-mauritania-gold-dark justify-end space-x-reverse">
                    <span className="font-semibold">{topic.count.toLocaleString()} مشاهدة</span>
                    <Eye className="h-4 w-4" />
                  </div>
                  {topic.trending && (
                    <div className="absolute top-3 left-3">
                      <div className="w-3 h-3 bg-mauritania-red rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Stats */}
        <div className="mt-16 modern-card p-8" dir="rtl">
          <div className="flex items-center mb-8 flex-row-start">
            <div className="w-12 h-12 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-xl flex items-center justify-center mr-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">
              إحصائيات الرائج
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-3">
                {articles.reduce((sum, article) => sum + article.viewCount, 0).toLocaleString()}
              </div>
              <div className="text-mauritania-gold-dark font-semibold">إجمالي المشاهدات</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-3">
                {topics.reduce((sum, topic) => sum + topic.count, 0).toLocaleString()}
              </div>
              <div className="text-mauritania-gold-dark font-semibold">إشارات المواضيع</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-3">
                {articles.reduce((sum, article) => sum + article._count.comments, 0).toLocaleString()}
              </div>
              <div className="text-mauritania-gold-dark font-semibold">إجمالي التعليقات</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default TrendingPage; 