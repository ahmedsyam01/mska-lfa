import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';
import { Search, Clock, User, Eye } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  category: string;
  categoryAr?: string;
  image?: string;
  createdAt: string;
}

const SearchPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await articlesAPI.getAll({
        search: searchQuery.trim(),
        limit: 20,
        status: 'published'
      });

      if (response.data.articles) {
        setResults(response.data.articles);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">البحث في الموقع</h1>
            <p className="text-xl text-gray-600">ابحث عن المقالات والأخبار</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن المقالات..."
                  className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                بحث
              </button>
            </form>
          </div>

          {/* Search Results */}
          <div className="space-y-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري البحث...</p>
              </div>
            )}

            {!loading && hasSearched && (
              <div>
                {results.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      نتائج البحث ({results.length})
                    </h3>
                    <div className="space-y-4">
                      {results.map((result) => (
                        <div
                          key={result.id}
                          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex gap-4">
                            {result.image && (
                              <img
                                src={result.image}
                                alt={result.titleAr || result.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {result.titleAr || result.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">
                                {result.excerptAr || result.excerpt}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {result.categoryAr || result.category}
                                </span>
                                <span>{formatDate(result.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">لم يتم العثور على نتائج</p>
                    <p className="text-gray-500">جرب كلمات بحث مختلفة</p>
                  </div>
                )}
              </div>
            )}

            {!hasSearched && !loading && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">اكتب في مربع البحث للبدء</p>
              </div>
            )}
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

export default SearchPage;
