import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import { api } from '../utils/api';
import { 
  Globe, 
  Star, 
  ExternalLink, 
  Activity, 
  Calendar,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

interface NewsSource {
  id: string;
  name: string;
  nameAr?: string;
  url: string;
  rssUrl: string;
  description?: string;
  descriptionAr?: string;
  category: string;
  language: string;
  country: string;
  reliability: number;
  isActive: boolean;
  lastFetchedAt: string;
  _count: {
    articles: number;
  };
}

interface NewsSourcesPageProps {
  sources?: NewsSource[];
  categories?: string[];
  stats?: {
    totalSources: number;
    activeSources: number;
    totalArticles: number;
    averageReliability: number;
  };
}

const NewsSourcesPage: React.FC<NewsSourcesPageProps> = ({ 
  sources: initialSources = [], 
  categories = [], 
  stats = {
    totalSources: 0,
    activeSources: 0,
    totalArticles: 0,
    averageReliability: 0
  }
}) => {
  const router = useRouter();
  const { locale } = router;
  const isRTL = locale === 'ar';

  const [sources, setSources] = useState<NewsSource[]>(initialSources);
  const [filteredSources, setFilteredSources] = useState<NewsSource[]>(initialSources);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'reliability' | 'articles' | 'recent'>('reliability');

  // Fetch data if not provided via props
  useEffect(() => {
    const fetchData = async () => {
      if (initialSources.length === 0) {
        try {
          setLoading(true);
          // Since we don't have a backend, use mock data
          const mockSources: NewsSource[] = [
            {
              id: '1',
              name: 'Mauritania News',
              nameAr: 'أخبار موريتانيا',
              url: 'https://mauritanianews.mr',
              rssUrl: 'https://mauritanianews.mr/rss',
              description: 'Leading news source in Mauritania',
              descriptionAr: 'مصدر إخباري رائد في موريتانيا',
              category: 'General',
              language: 'ar',
              country: 'Mauritania',
              reliability: 85,
              isActive: true,
              lastFetchedAt: new Date().toISOString(),
              _count: { articles: 150 }
            },
            {
              id: '2',
              name: 'Sahara Media',
              nameAr: 'إعلام الصحراء',
              url: 'https://saharamedia.mr',
              rssUrl: 'https://saharamedia.mr/rss',
              description: 'Regional news and analysis',
              descriptionAr: 'الأخبار الإقليمية والتحليل',
              category: 'Politics',
              language: 'ar',
              country: 'Mauritania',
              reliability: 78,
              isActive: true,
              lastFetchedAt: new Date().toISOString(),
              _count: { articles: 89 }
            }
          ];
          
          setSources(mockSources);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching sources:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialSources]);

  useEffect(() => {
    let filtered = sources;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(source => 
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (source.nameAr && source.nameAr.includes(searchQuery)) ||
        (source.description && source.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(source => source.category === selectedCategory);
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reliability':
          return b.reliability - a.reliability;
        case 'articles':
          return b._count.articles - a._count.articles;
        case 'recent':
          return new Date(b.lastFetchedAt).getTime() - new Date(a.lastFetchedAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredSources(filtered);
  }, [sources, searchQuery, selectedCategory, sortBy]);

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 80) return 'text-green-600 bg-green-100';
    if (reliability >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getReliabilityText = (reliability: number) => {
    if (reliability >= 80) return 'High Reliability';
    if (reliability >= 60) return 'Medium Reliability';
    return 'Low Reliability';
  };

  // Compute stats and categories from current sources
  const computedStats = {
    totalSources: sources.length,
    activeSources: sources.filter(s => s.isActive).length,
    totalArticles: sources.reduce((sum, s) => sum + s._count.articles, 0),
    averageReliability: sources.length > 0 ? Math.round(sources.reduce((sum, s) => sum + s.reliability, 0) / sources.length) : 0
  };

  const computedCategories = Array.from(new Set(sources.map(s => s.category)));

  return (
    <Layout title="News Sources - Rimna">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                News Sources
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                News sources are important for keeping up-to-date with the latest news and events.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 text-center animate-pulse">
                  <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2" />
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Globe className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{computedStats.totalSources}</div>
                <div className="text-sm text-gray-600">Total Sources</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{computedStats.activeSources}</div>
                <div className="text-sm text-gray-600">Active Sources</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{computedStats.totalArticles.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Articles</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{computedStats.averageReliability}%</div>
                <div className="text-sm text-gray-600">Average Reliability</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sources"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {computedCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="reliability">Sort by Reliability</option>
                  <option value="name">Sort by Name</option>
                  <option value="articles">Sort by Articles</option>
                  <option value="recent">Sort by Recent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSources.map((source) => (
              <div key={source.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {isRTL ? source.nameAr || source.name : source.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {isRTL ? source.descriptionAr || source.description : source.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full">
                          {source.category.toLowerCase()}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full">
                          {source.country}
                        </span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getReliabilityColor(source.reliability)}`}>
                      <Star className="w-3 h-3 mr-1" />
                      {source.reliability}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{source._count.articles} Articles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(source.lastFetchedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${source.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-gray-500">
                        {source.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Visit Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No sources found</p>
              <p className="text-gray-400">Try different search</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewsSourcesPage; 