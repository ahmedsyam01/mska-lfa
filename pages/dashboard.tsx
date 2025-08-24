import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { 
  Plus, 
  FileText, 
  Users, 
  TrendingUp, 
  Star, 
  Calendar,
  Eye,
  MessageCircle,
  BarChart3,
  Settings,
  Upload,
  Bell,
  Award,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  User,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    // For reporters: article stats only
    totalArticles?: number;
    pendingArticles?: number;
    // For regular users: report stats only  
    totalReports?: number;
    publishedReports?: number;
    pendingReports?: number;
    // Common stats
    totalViews: number;
    totalComments: number;
  };
  // For reporters: articles only
  recentArticles?: Array<{
    id: string;
    title: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    createdAt: string;
    viewCount: number;
    _count: {
      comments: number;
    };
  }>;
  // For regular users: reports only
  recentReports?: Array<{
    id: string;
    title: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    createdAt: string;
    viewCount: number;
    _count: {
      comments: number;
    };
  }>;
  // Common: trending topics
  featuredNews: Array<{
    id: string;
    topic: string;
    topicAr?: string;
    description?: string;
    count: number;
    category?: string;
    isActive: boolean;
    weekOf: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Add refresh when component becomes visible (e.g., returning from article creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      if (!user) {
        console.error('No user data available');
        return;
      }

      if (user.role === 'REPORTER') {
        // For reporters, fetch all articles and calculate statistics on frontend
        // Since /articles/stats endpoint doesn't exist in backend
        const [articlesResponse, trendingResponse] = await Promise.all([
          api.get('/articles'), // Get all articles
          api.get('/trending?limit=5').catch(() => ({ data: [] })) // Fallback if trending fails
        ]);

        // Calculate statistics from the articles data
        const allArticles = articlesResponse.data.articles || [];
        
        // For reporters, we need to check both authorId and also look for articles created by the user
        // Some articles might not have authorId set correctly, so we'll also check by user ID in other ways
        const userArticles = allArticles.filter((article: any) => {
          // Check if article has authorId that matches user
          if (article.authorId === user.id) return true;
          
          // If no authorId, check if it's a user-created article (not imported)
          // Imported articles usually have sourceName, user-created ones don't
          if (!article.authorId && !article.sourceName && article.status === 'PENDING') {
            // This is likely a user-created article that needs authorId
            return true;
          }
          
          return false;
        });
        
        console.log('🔍 Dashboard Debug:', {
          totalArticlesFound: allArticles.length,
          userArticlesFound: userArticles.length,
          userId: user.id,
          userArticles: userArticles.map((a: any) => ({
            id: a.id,
            title: a.title,
            authorId: a.authorId,
            sourceName: a.sourceName,
            status: a.status,
            createdAt: a.createdAt
          })),
          allArticlesSample: allArticles.slice(0, 3).map((a: any) => ({
            id: a.id,
            title: a.title,
            authorId: a.authorId,
            sourceName: a.sourceName,
            status: a.status
          }))
        });
        
        const totalArticles = userArticles.length;
        const pendingArticles = userArticles.filter((article: any) => article.status === 'PENDING').length;
        const totalViews = userArticles.reduce((sum: number, article: any) => sum + (article.viewCount || 0), 0);
        const totalComments = userArticles.reduce((sum: number, article: any) => sum + (article._count?.comments || 0), 0);

        // Get recent articles (limit to 5)
        const recentArticles = userArticles
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setData({
          stats: {
            totalArticles,
            pendingArticles,
            totalViews,
            totalComments
          },
          recentArticles,
          featuredNews: trendingResponse.data || []
        });
      } else {
        // For regular users, fetch reports statistics
        const [reportsStatsResponse, reportsResponse, trendingResponse] = await Promise.all([
          api.get('/reports/stats?reporterId=' + user.id), // Get reports statistics for the user
          api.get('/reports?limit=5'),
          api.get('/trending?limit=5').catch(() => ({ data: [] })) // Fallback if trending fails
        ]);

        setData({
          stats: {
            totalReports: reportsStatsResponse.data.totalReports || 0,
            publishedReports: reportsStatsResponse.data.publishedReports || 0,
            pendingReports: reportsStatsResponse.data.pendingReports || 0,
            totalViews: reportsStatsResponse.data.totalViews || 0,
            totalComments: reportsStatsResponse.data.totalComments || 0
          },
          recentReports: reportsResponse.data.reports,
          featuredNews: trendingResponse.data || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default values if API fails
      if (user?.role === 'REPORTER') {
        setData({
          stats: {
            totalArticles: 0,
            pendingArticles: 0,
            totalViews: 0,
            totalComments: 0
          },
          recentArticles: [],
          featuredNews: []
        });
      } else {
        setData({
          stats: {
            totalReports: 0,
            publishedReports: 0,
            pendingReports: 0,
            totalViews: 0,
            totalComments: 0
          },
          recentReports: [],
          featuredNews: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'REJECTED':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl shadow-2xl mb-6">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              يجب تسجيل الدخول
            </h1>
            <p className="text-gray-600 mb-8">
              يرجى تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
            <Link 
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl shadow-2xl mb-6 animate-pulse">
              <Activity className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">جاري تحميل البيانات...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="لوحة التحكم - ريمنا">
      <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-mauritania-green to-mauritania-gold bg-clip-text text-transparent mb-2">
                لوحة التحكم
              </h1>
              <p className="text-gray-600 text-lg">
                مرحباً {user?.firstName} {user?.lastName}، كيف حالك اليوم؟
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <RefreshCw className={`w-5 h-5 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
              {user?.role === 'REPORTER' ? (
                <Link
                  href="/articles/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  إنشاء مقال جديد
                </Link>
              ) : (
                <Link
                  href="/reports/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  إنشاء بلاغ جديد
                </Link>
              )}
              <Link
                href="/profile"
                className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 rounded-2xl hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <User className="w-5 h-5 ml-2" />
                الملف الشخصي
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 text-lg">جاري تحديث البيانات...</p>
              </div>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {user?.role === 'REPORTER' ? (
              // Reporter Stats
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي المقالات</p>
                      <p className="text-3xl font-bold text-gray-900">{data?.stats.totalArticles || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-mauritania-green/20 to-mauritania-green/30 rounded-2xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-mauritania-green" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 ml-1" />
                    <span>مقالات منشورة</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">المقالات قيد المراجعة</p>
                      <p className="text-3xl font-bold text-gray-900">{data?.stats.pendingArticles || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-yellow-600">
                    <Clock className="w-4 h-4 ml-1" />
                    <span>في انتظار الموافقة</span>
                  </div>
                </div>
              </>
            ) : (
              // Regular User Stats
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي البلاغات</p>
                      <p className="text-3xl font-bold text-gray-900">{data?.stats.totalReports || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-mauritania-green/20 to-mauritania-green/30 rounded-2xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-mauritania-green" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 ml-1" />
                    <span>بلاغات مرسلة</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                                              <p className="text-sm font-medium text-gray-600 mb-2">البلاغات المنشورة</p>
                      <p className="text-3xl font-bold text-gray-900">{data?.stats.publishedReports || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 ml-1" />
                    <span>بلاغات معتمدة</span>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">إجمالي المشاهدات</p>
                  <p className="text-3xl font-bold text-gray-900">{data?.stats.totalViews || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <Zap className="w-4 h-4 ml-1" />
                <span>مشاهدات إجمالية</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">إجمالي التعليقات</p>
                  <p className="text-3xl font-bold text-gray-900">{data?.stats.totalComments || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <Users className="w-4 h-4 ml-1" />
                <span>تعليقات إجمالية</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {user?.role === 'REPORTER' ? (
              // Recent Articles for Reporters
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20 bg-gradient-to-r from-mauritania-gold/5 to-mauritania-red/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">المقالات الأخيرة</h2>
                    </div>
                    <Link
                      href="/articles"
                      className="text-mauritania-gold hover:text-mauritania-red font-semibold transition-colors hover:underline flex items-center gap-1"
                    >
                      عرض الكل
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {data?.recentArticles?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4 text-lg">لا توجد مقالات بعد</p>
                      <Link
                        href="/articles/create"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        <Plus className="w-5 h-5 ml-2" />
                        أنشئ أول مقال
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data?.recentArticles?.map((article) => (
                        <div key={article.id} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-mauritania-gold/30 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-mauritania-gold transition-colors">
                                {article.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(article.status)}`}>
                                  {getStatusIcon(article.status)}
                                  {article.status === 'PUBLISHED' ? 'منشور' : 
                                   article.status === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Eye className="w-4 h-4" />
                                  {article.viewCount}
                                </span>
                                <span className="flex items-center gap-1 text-gray-500">
                                  <MessageCircle className="w-4 h-4" />
                                  {article._count.comments}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/articles/${article.id}`}
                              className="text-mauritania-gold hover:text-mauritania-red text-sm font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              عرض
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Recent Reports for Regular Users
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20 bg-gradient-to-r from-mauritania-green/5 to-mauritania-gold/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-mauritania-green to-mauritania-gold rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">البلاغات الأخيرة</h2>
                    </div>
                    <Link
                      href="/reports"
                      className="text-mauritania-green hover:text-mauritania-green-dark font-semibold transition-colors hover:underline flex items-center gap-1"
                    >
                      عرض الكل
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {data?.recentReports?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4 text-lg">لا توجد بلاغات بعد</p>
                      <Link
                        href="/reports/create"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        <Plus className="w-5 h-5 ml-2" />
                        أنشئ أول بلاغ
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data?.recentReports?.map((report) => (
                        <div key={report.id} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-mauritania-green/30 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-mauritania-green transition-colors">
                                {report.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                  {getStatusIcon(report.status)}
                                  {report.status === 'PUBLISHED' ? 'منشور' : 
                                   report.status === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Eye className="w-4 h-4" />
                                  {report.viewCount}
                                </span>
                                <span className="flex items-center gap-1 text-gray-500">
                                  <MessageCircle className="w-4 h-4" />
                                  {report._count.comments}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/reports/${report.id}`}
                              className="text-mauritania-green hover:text-mauritania-green-dark text-sm font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              عرض
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trending Topics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/20 bg-gradient-to-r from-mauritania-gold/5 to-mauritania-red/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">المواضيع الرائجة</h2>
                  </div>
                  <Link
                    href="/trending"
                    className="text-mauritania-gold hover:text-mauritania-red font-semibold transition-colors hover:underline flex items-center gap-1"
                  >
                    عرض الكل
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {data?.featuredNews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">لا توجد مواضيع رائجة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data?.featuredNews.map((topic, index) => (
                      <div key={topic.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-mauritania-gold/30 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-gradient-to-br from-mauritania-green/20 to-mauritania-gold/20 text-mauritania-green'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {topic.topicAr || topic.topic || 'موضوع رائج'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {topic.description || 'موضوع شائع'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <BarChart3 className="w-4 h-4" />
                          <span className="font-semibold">{topic.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-mauritania-green to-mauritania-gold rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">إجراءات سريعة</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.role === 'REPORTER' ? (
                // Reporter Actions
                <Link
                  href="/articles/create"
                  className="group p-6 bg-gradient-to-br from-mauritania-gold/10 to-mauritania-red/20 rounded-2xl border border-mauritania-gold/30 hover:border-mauritania-gold/50 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-mauritania-gold transition-colors text-lg">
                        إنشاء مقال جديد
                      </h3>
                      <p className="text-gray-600">
                        كتابة مقال جديد للمراجعة
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                // Regular User Actions
                <Link
                  href="/reports/create"
                  className="group p-6 bg-gradient-to-br from-mauritania-green/10 to-mauritania-green/20 rounded-2xl border border-mauritania-green/30 hover:border-mauritania-green/50 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-mauritania-green to-mauritania-green-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-mauritania-green transition-colors text-lg">
                        إرسال بلاغ
                      </h3>
                      <p className="text-gray-600">
                        مشاركة خبر أو تقرير جديد
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              <Link
                href="/trending"
                className="group p-6 bg-gradient-to-br from-mauritania-gold/10 to-mauritania-red/20 rounded-2xl border border-mauritania-gold/30 hover:border-mauritania-gold/50 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-mauritania-gold transition-colors text-lg">
                      عرض الترندات
                    </h3>
                    <p className="text-gray-600">
                      استكشاف المواضيع الرائجة
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 left-20 w-32 h-32 bg-gradient-to-br from-mauritania-gold/10 to-mauritania-red/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-mauritania-green/10 to-mauritania-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </Layout>
  );
};

export default Dashboard; 