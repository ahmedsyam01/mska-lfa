import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout/Layout';
import NewsCard from '../components/common/NewsCard';
import { Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { articlesAPI } from '@/utils/api';

interface Article {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  source?: {
    id: string;
    name: string;
  };
  viewCount: number;
  _count: {
    comments: number;
  };
}

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await articlesAPI.getAll({ status: 'PUBLISHED', limit: 50 });
      const data = response.data;
      setArticles(data.articles || []);
      console.log('Articles fetched:', data.articles?.length || 0);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortBy === 'trending') {
      return b.viewCount - a.viewCount;
    }
    return 0;
  });

  const categories = [
    { value: 'all', label: 'الكل' },
    { value: 'POLITICS', label: 'سياسة' },
    { value: 'ECONOMY', label: 'اقتصاد' },
    { value: 'SPORTS', label: 'رياضة' },
    { value: 'CULTURE', label: 'ثقافة' },
    { value: 'TECHNOLOGY', label: 'تكنولوجيا' },
    { value: 'HEALTH', label: 'صحة' },
    { value: 'EDUCATION', label: 'تعليم' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-[Tajawal]" dir="rtl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-[Tajawal]" dir="rtl">
        {/* Page Header */}
        <div className="mb-8 text-right">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">الأخبار</h1>
          <p className="text-lg text-gray-600">آخر الأخبار من موريتانيا</p>
        </div>
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الأخبار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                dir="rtl"
              />
            </div>
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pr-10 pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-right"
                dir="rtl"
              >
                <option value="all">الكل</option>
                <option value="POLITICS">سياسة</option>
                <option value="ECONOMY">اقتصاد</option>
                <option value="SPORTS">رياضة</option>
                <option value="CULTURE">ثقافة</option>
                <option value="TECHNOLOGY">تكنولوجيا</option>
                <option value="HEALTH">صحة</option>
                <option value="EDUCATION">تعليم</option>
              </select>
            </div>
            {/* Sort By */}
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pr-10 pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-right"
                dir="rtl"
              >
                <option value="latest">الأحدث</option>
                <option value="trending">الأكثر رواجًا</option>
              </select>
            </div>
          </div>
        </div>
        {/* Results Count */}
        <div className="mb-6 text-right">
          <p className="text-gray-600">{sortedArticles.length} خبر</p>
        </div>
        {/* Articles Grid */}
        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">حاول تغيير كلمات البحث أو الفلاتر</p>
          </div>
        )}
        {/* Trending Topics Sidebar */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4 flex-row-start">
            <TrendingUp className="h-6 w-6 text-primary-600 ml-2" />
            <h2 className="text-xl font-bold text-gray-900">المواضيع الرائجة</h2>
          </div>
          <div className="space-y-2 text-right">
            {['موريتانيا', 'نواكشوط', 'الاقتصاد', 'السياسة', 'الرياضة'].map((topic, index) => (
              <button
                key={index}
                className="text-primary-600 hover:underline ml-2"
              >
                #{topic}
              </button>
            ))}
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

export default NewsPage; 