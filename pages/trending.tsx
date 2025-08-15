import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout/Layout';
import NewsCard from '../components/common/NewsCard';
import { TrendingUp, Flame, Hash, Eye } from 'lucide-react';

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
      const articlesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?trending=true`);
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.articles || []);
      }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex gap-4 mb-8 justify-end">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4 justify-start space-x-start">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              الرائج
            </h1>
            <TrendingUp className="h-8 w-8 text-primary-600 ml-3" />
          </div>
          <p className="text-lg text-gray-600 text-right">
            اكتشف ما هو رائج في موريتانيا الآن
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 justify-start">
              <button
                onClick={() => setActiveTab('topics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'topics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 space-x-reverse">
                  <span>المواضيع الرائجة</span>
                  <Hash className="h-4 w-4" />
                </div>
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 space-x-reverse">
                  <span>المقالات الرائجة</span>
                  <Flame className="h-4 w-4" />
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'articles' ? (
          <div>
            <div className="mb-6">
              <p className="text-gray-600 text-right">
                {articles.length} مقال رائج
              </p>
            </div>
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    variant="featured"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Flame className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  لا توجد مقالات رائجة
                </h3>
                <p className="text-gray-600">
                  تحقق مرة أخرى لاحقًا للمحتوى الرائج
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-gray-600 text-right">
                {topics.length} موضوع رائج
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between mb-2 flex-row-reverse">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2 space-x-reverse">
                      <span className="font-medium text-gray-900">#{topic.name}</span>
                      <Hash className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 justify-end space-x-reverse">
                    <span>{topic.count.toLocaleString()} مشاهدة</span>
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Stats */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6" dir="rtl">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">
            إحصائيات الرائج
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {articles.reduce((sum, article) => sum + article.viewCount, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">إجمالي المشاهدات</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {topics.reduce((sum, topic) => sum + topic.count, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">إشارات المواضيع</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {articles.reduce((sum, article) => sum + article._count.comments, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">إجمالي التعليقات</div>
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