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
  Upload
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
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              يجب تسجيل الدخول
            </h1>
            <p className="text-gray-600 mb-8">
              يرجى تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="لوحة التحكم - Rimna">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  مرحباً بعودتك، {user?.firstName || user?.username}
                </h1>
                <p className="text-gray-600 mt-1">
                  هنا يمكنك إدارة حسابك والتقارير
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/reports/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إنشاء بلاغ
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  الملف الشخصي
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    إجمالي البلاغات
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data?.stats.totalReports || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    البلاغات المعتمدة
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data?.stats.approvedReports || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    إجمالي المشاهدات
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data?.stats.totalViews || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    إجمالي التعليقات
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {data?.stats.totalComments || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    البلاغات الأخيرة
                  </h2>
                  <Link
                    href="/reports"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    عرض الكل
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {data?.recentReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">لا توجد بلاغات بعد</p>
                    <Link
                      href="/reports/create"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      أنشئ أول بلاغ
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data?.recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {report.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800'
                                : report.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {report.status.toLowerCase()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {report.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {report._count.comments}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/reports/${report.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
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
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    المواضيع الرائجة
                  </h2>
                  <Link
                    href="/trending"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    عرض الكل
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {data?.trending.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد مواضيع رائجة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data?.trending.map((topic, index) => (
                      <div key={topic.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {topic.topic}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {topic.count} ذكر
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <BarChart3 className="w-4 h-4" />
                          <span>{topic.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              إجراءات سريعة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/reports/create"
                className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors group"
              >
                <Plus className="w-8 h-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-700">
                    إرسال بلاغ
                  </h3>
                  <p className="text-sm text-gray-600">
                    مشاركة خبر
                  </p>
                </div>
              </Link>

              <Link
                href="/upload"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Upload className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                    رفع وسائط
                  </h3>
                  <p className="text-sm text-gray-600">
                    رفع صور/فيديوهات
                  </p>
                </div>
              </Link>

              <Link
                href="/trending"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-green-700">
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
      </div>
    </Layout>
  );
};

export default Dashboard; 