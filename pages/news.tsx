import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout/Layout';
import NewsCard from '../components/common/NewsCard';
import { Search, Filter, Calendar, TrendingUp, ChevronLeft, ChevronRight, Newspaper, Sparkles } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const articlesPerPage = 20;

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory, sortBy]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll({ 
        status: 'PUBLISHED', 
        limit: articlesPerPage,
        page: currentPage
      });
      const data = response.data;
      console.log('API Response:', data);
      console.log('Articles:', data.articles?.length || 0);
      console.log('Total from pagination:', data.pagination?.total);
      console.log('Current Page:', currentPage);
      
      setArticles(data.articles || []);
      // Fix: Get total from pagination object
      const totalCount = data.pagination?.total || 0;
      setTotalArticles(totalCount);
      const calculatedPages = Math.ceil(totalCount / articlesPerPage);
      setTotalPages(calculatedPages);
      console.log('Calculated Total Pages:', calculatedPages);
      console.log('Articles fetched:', data.articles?.length || 0, 'Total:', totalCount);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset to first page when sort changes
  };

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
        <div className="max-w-7xl mx-auto px-6 py-12 font-[Tajawal]" dir="rtl">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded-2xl w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="modern-card p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12 font-[Tajawal]" dir="rtl">
        {/* Page Header */}
        <div className="mb-12 text-right">
          <div className="flex items-center justify-end space-x-4 space-x-reverse mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">الأخبار</h1>
              <p className="text-xl text-mauritania-gold-dark">آخر الأخبار من موريتانيا</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="modern-card p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-mauritania-green" />
              <input
                type="text"
                placeholder="ابحث في الأخبار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border-2 border-mauritania-green/30 rounded-2xl focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg bg-white/50 backdrop-blur-sm"
                dir="rtl"
              />
            </div>
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-mauritania-gold" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="pr-12 pl-8 py-4 border-2 border-mauritania-gold/30 rounded-2xl focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 appearance-none bg-white text-right text-lg min-w-[200px]"
                dir="rtl"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Sort By */}
            <div className="relative">
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-mauritania-red" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="pr-12 pl-8 py-4 border-2 border-mauritania-red/30 rounded-2xl focus:ring-4 focus:ring-mauritania-red/20 focus:border-mauritania-red transition-all duration-300 appearance-none bg-white text-right text-lg min-w-[200px]"
                dir="rtl"
              >
                <option value="latest">الأحدث</option>
                <option value="trending">الأكثر رواجًا</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count and Pagination Info */}
        <div className="mb-8 text-right">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 px-6 py-3 rounded-full border border-mauritania-green/20">
            <Sparkles className="w-5 h-5 text-mauritania-green" />
            <p className="text-mauritania-green-dark font-semibold">
              عرض {((currentPage - 1) * articlesPerPage) + 1} - {Math.min(currentPage * articlesPerPage, totalArticles)} من {totalArticles} خبر
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sortedArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-mauritania-green-dark mb-3">لا توجد نتائج</h3>
            <p className="text-mauritania-gold-dark text-lg">حاول تغيير كلمات البحث أو الفلاتر</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mb-12">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white hover:from-mauritania-green-dark hover:to-mauritania-green shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white shadow-lg'
                        : 'bg-white/50 text-mauritania-green-dark hover:bg-mauritania-green/10 border border-mauritania-green/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white hover:from-mauritania-green-dark hover:to-mauritania-green shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              التالي
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Debug Info - Remove this after testing */}
        <div className="mt-8 p-6 bg-gradient-to-r from-mauritania-red/10 to-mauritania-red/20 rounded-2xl border border-mauritania-red/30">
          <p className="text-mauritania-red-dark font-semibold mb-2">Debug Info:</p>
          <p className="text-mauritania-red-dark text-sm">Total Articles: {totalArticles}</p>
          <p className="text-mauritania-red-dark text-sm">Total Pages: {totalPages}</p>
          <p className="text-mauritania-red-dark text-sm">Current Page: {currentPage}</p>
          <p className="text-mauritania-red-dark text-sm">Articles Per Page: {articlesPerPage}</p>
          <p className="text-mauritania-red-dark text-sm">Should Show Pagination: {totalPages > 1 ? 'Yes' : 'No'}</p>
        </div>

        {/* Trending Topics Sidebar */}
        <div className="mt-16 modern-card p-8">
          <div className="flex items-center mb-6 flex-row-start">
            <div className="w-12 h-12 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-xl flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">المواضيع الرائجة</h2>
          </div>
          <div className="space-y-3 text-right">
            {['موريتانيا', 'نواكشوط', 'الاقتصاد', 'السياسة', 'الرياضة'].map((topic, index) => (
              <button
                key={index}
                className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 hover:from-mauritania-green/20 hover:to-mauritania-gold/20 text-mauritania-green-dark hover:text-mauritania-green px-4 py-2 rounded-full transition-all duration-300 border border-mauritania-green/20 hover:border-mauritania-green/40 mr-2"
              >
                <span className="text-lg">#</span>
                <span className="font-semibold">{topic}</span>
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