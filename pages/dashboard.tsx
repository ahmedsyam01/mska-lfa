import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
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
  ArrowRight,
  Shield,
  Sparkles,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    totalReports: number;
    approvedReports: number;
    pendingReports: number;
    totalViews: number;
    totalComments: number;
  };
  recentReports: Array<{
    id: string;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    viewCount: number;
    _count: {
      comments: number;
    };
  }>;
  trending: Array<{
    id: string;
    topic: string;
    count: number;
    weekOf: string;
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

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, reportsResponse, trendingResponse] = await Promise.all([
        api.get('/users/stats'),
        api.get('/reports?limit=5'),
        api.get('/trending?limit=5')
      ]);

      setData({
        stats: statsResponse.data,
        recentReports: reportsResponse.data.reports,
        trending: trendingResponse.data
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mauritania-red via-mauritania-gold to-mauritania-green rounded-3xl shadow-2xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            يجب تسجيل الدخول
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            يرجى تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5" />
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl shadow-2xl mx-auto mb-6 animate-pulse"></div>
          <div className="w-32 h-8 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-mauritania-green to-mauritania-gold bg-clip-text text-transparent">
                    لوحة التحكم
                  </h1>
                  <p className="text-gray-600 text-lg">
                    مرحباً بعودتك، {user?.firstName || user?.username}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                هنا يمكنك إدارة حسابك والتقارير
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reports/create"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                إنشاء بلاغ
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold hover:bg-white hover:shadow-lg border border-gray-200 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                الملف الشخصي
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-mauritania-green to-mauritania-green-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي البلاغات
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data?.stats.totalReports || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  البلاغات المعتمدة
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data?.stats.approvedReports || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-mauritania-blue to-mauritania-blue-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي المشاهدات
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data?.stats.totalViews || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-mauritania-purple to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي التعليقات
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {data?.stats.totalComments || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Reports */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-mauritania-green to-mauritania-gold rounded-xl flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  البلاغات الأخيرة
                </h2>
                <Link
                  href="/reports"
                  className="text-mauritania-green hover:text-mauritania-green-dark font-semibold transition-colors hover:underline"
                >
                  عرض الكل
                </Link>
              </div>
            </div>
            <div className="p-6">
              {data?.recentReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-mauritania-gold/20 to-mauritania-red/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-mauritania-gold" />
                  </div>
                  <p className="text-gray-500 mb-4 text-lg">لا توجد بلاغات بعد</p>
                  <Link
                    href="/reports/create"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    أنشئ أول بلاغ
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : report.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {report.status === 'APPROVED' ? 'معتمد' : report.status === 'PENDING' ? 'قيد الانتظار' : 'مرفوض'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-mauritania-blue" />
                            {report.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-mauritania-purple" />
                            {report._count.comments}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/reports/${report.id}`}
                        className="text-mauritania-green hover:text-mauritania-green-dark text-sm font-semibold hover:underline transition-colors"
                      >
                        عرض
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  المواضيع الرائجة
                </h2>
                <Link
                  href="/trending"
                  className="text-mauritania-gold hover:text-mauritania-red font-semibold transition-colors hover:underline"
                >
                  عرض الكل
                </Link>
              </div>
            </div>
            <div className="p-6">
              {data?.trending.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-mauritania-gold/20 to-mauritania-red/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-mauritania-gold" />
                  </div>
                  <p className="text-gray-500 text-lg">لا توجد مواضيع رائجة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.trending.map((topic, index) => (
                    <div key={topic.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          index === 0 ? 'bg-gradient-to-br from-mauritania-gold to-mauritania-red' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                          index === 2 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                          'bg-gradient-to-br from-mauritania-green to-mauritania-green-dark'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {topic.topic}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {topic.count} ذكر
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BarChart3 className="w-4 h-4 text-mauritania-green" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/reports/create"
              className="group flex items-center p-6 bg-gradient-to-r from-mauritania-green/10 to-mauritania-green/20 rounded-2xl hover:from-mauritania-green/20 hover:to-mauritania-green/30 transition-all duration-300 border border-mauritania-green/20 hover:border-mauritania-green/40 hover:shadow-lg transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-mauritania-green to-mauritania-green-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mr-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-mauritania-green-dark transition-colors">
                  إرسال بلاغ
                </h3>
                <p className="text-sm text-gray-600">
                  مشاركة خبر
                </p>
              </div>
            </Link>

            <Link
              href="/upload"
              className="group flex items-center p-6 bg-gradient-to-r from-mauritania-blue/10 to-mauritania-blue/20 rounded-2xl hover:from-mauritania-blue/20 hover:to-mauritania-blue/30 transition-all duration-300 border border-mauritania-blue/20 hover:border-mauritania-blue/40 hover:shadow-lg transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-mauritania-blue to-mauritania-blue-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mr-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-mauritania-blue-dark transition-colors">
                  رفع وسائط
                </h3>
                <p className="text-sm text-gray-600">
                  رفع صور/فيديوهات
                </p>
              </div>
            </Link>

            <Link
              href="/trending"
              className="group flex items-center p-6 bg-gradient-to-r from-mauritania-gold/10 to-mauritania-red/20 rounded-2xl hover:from-mauritania-gold/20 hover:to-mauritania-red/30 transition-all duration-300 border border-mauritania-gold/20 hover:border-mauritania-gold/40 hover:shadow-lg transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-mauritania-gold-dark transition-colors">
                  عرض الترندات
                </h3>
                <p className="text-sm text-gray-600">
                  استكشاف الرائج
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-gradient-to-br from-mauritania-gold/10 to-mauritania-red/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-mauritania-green/10 to-mauritania-gold/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Dashboard; 