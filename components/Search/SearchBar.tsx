import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Globe, TrendingUp } from 'lucide-react';
import { articlesAPI } from '../../utils/api';

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

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'POLITICS': return 'from-mauritania-red to-mauritania-red-dark';
      case 'ECONOMY': return 'from-mauritania-gold to-mauritania-gold-dark';
      case 'SPORTS': return 'from-mauritania-green to-mauritania-green-dark';
      case 'TECHNOLOGY': return 'from-mauritania-green to-mauritania-gold';
      case 'CULTURE': return 'from-mauritania-gold to-mauritania-red';
      case 'HEALTH': return 'from-mauritania-green to-mauritania-green-light';
      default: return 'from-mauritania-green to-mauritania-gold';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="modern-card w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Search Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/20 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-t-2xl">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">البحث في الموقع</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-mauritania-green" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="ابحث عن المقالات..."
                className="w-full pl-4 pr-14 py-4 border-2 border-mauritania-green/30 rounded-2xl text-lg focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 bg-white/50 backdrop-blur-sm"
                dir="rtl"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white py-4 px-8 rounded-2xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              بحث
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="px-8 pb-8 overflow-y-auto max-h-96">
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <Loader2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-mauritania-green-dark text-lg font-medium">جاري البحث...</p>
              <p className="text-gray-500 text-sm mt-2">يرجى الانتظار</p>
            </div>
          )}

          {!loading && hasSearched && (
            <div>
              {results.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2 space-x-reverse">
                    <TrendingUp className="w-6 h-6 text-mauritania-green" />
                    <span>نتائج البحث ({results.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="modern-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex gap-6">
                          {result.image && (
                            <div className="relative">
                              <img
                                src={result.image}
                                alt={result.titleAr || result.title}
                                className="w-24 h-24 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute -top-2 -right-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(result.category)} shadow-lg`}>
                                  {result.categoryAr || result.category}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-mauritania-green transition-colors duration-300">
                              {result.titleAr || result.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                              {result.excerptAr || result.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className={`bg-gradient-to-r ${getCategoryColor(result.category)} text-white px-3 py-1.5 rounded-full font-medium shadow-md`}>
                                {result.categoryAr || result.category}
                              </span>
                              <div className="flex items-center gap-1 space-x-reverse text-mauritania-gold-dark">
                                <Globe className="w-3 h-3" />
                                <span>{formatDate(result.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-gray-700 text-xl font-bold mb-2">لم يتم العثور على نتائج</p>
                  <p className="text-gray-500">جرب كلمات بحث مختلفة</p>
                </div>
              )}
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-700 text-xl font-bold mb-2">البحث في ريمنا</p>
              <p className="text-gray-500">اكتب في مربع البحث للبدء في العثور على المقالات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
