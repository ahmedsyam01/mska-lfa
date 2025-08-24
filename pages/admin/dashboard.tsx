import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import AdminRouteGuard from '../../components/AdminRouteGuard';
import { useAuth } from '../../hooks/useAuth';
import { adminAPI } from '../../utils/api';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Shield,
  Settings,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Database,
  Activity
} from 'lucide-react';
import Cookies from 'js-cookie';
import CelebritiesAdminPanel from '@/components/CelebritiesAdminPanel';

interface AdminDashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalArticles: number;
    pendingArticles: number;
    totalReports: number;
    pendingReports: number;
    totalViews: number;
    totalComments: number;
  };
  recentActivities: Array<{
    id: string;
    type: 'USER_REGISTRATION' | 'ARTICLE_SUBMISSION' | 'REPORT_SUBMISSION' | 'COMMENT_POSTED';
    description: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
  pendingContent: Array<{
    id: string;
    type: 'ARTICLE' | 'REPORT' | 'COMMENT';
    title: string;
    author: string;
    createdAt: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  }>;
  systemMetrics: {
    serverUptime: string;
    databaseSize: string;
    activeConnections: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'system' | 'celebrities'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const USERS_LIMIT = 10;
  const [search, setSearch] = useState('');
  const [roleLoading, setRoleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesTotalPages, setArticlesTotalPages] = useState(1);
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotalPages, setReportsTotalPages] = useState(1);
  const CONTENT_LIMIT = 10;
  const [articleActionLoading, setArticleActionLoading] = useState<string | null>(null);
  const [reportActionLoading, setReportActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.getDashboard();
      
      // Log the successful data fetch
      console.log('Admin dashboard data fetched successfully:', {
        totalUsers: response.data.stats.totalUsers,
        totalArticles: response.data.stats.totalArticles,
        totalReports: response.data.stats.totalReports,
        pendingContent: response.data.pendingContent.length,
        recentActivities: response.data.recentActivities.length
      });
      
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
      
      // Show error message to user
      alert('Failed to load dashboard data. Please check your connection and try again.');
      
      // Optionally redirect to login if it's an auth error
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (contentId: string, action: 'approve' | 'reject') => {
    try {
      const contentType = data?.pendingContent.find(c => c.id === contentId)?.type.toLowerCase() || 'articles';
      
      if (action === 'approve') {
        await adminAPI.approveContent(contentType, contentId);
      } else {
        await adminAPI.rejectContent(contentType, contentId);
      }

      // Show success message
      alert(`Content ${action}ed successfully!`);
      
      // Refresh data
      fetchAdminData();
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
      alert(`Failed to ${action} content. Please try again.`);
    }
  };

  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await adminAPI.getUsers({ page, limit: USERS_LIMIT });
      setUsers(response.data.users);
      setUsersTotalPages(response.data.pagination.pages);
    } catch (e: any) {
      setUsersError(e.message || 'حدث خطأ');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers(usersPage);
    // eslint-disable-next-line
  }, [activeTab, usersPage]);

  const handleToggleUser = async (id: string, isActive: boolean, role: string) => {
    if (role === 'ADMIN') return alert('لا يمكن تعديل حالة المدير');
    try {
      await adminAPI.toggleUserStatus(id);
      fetchUsers(usersPage);
    } catch {
      alert('حدث خطأ أثناء التغيير');
    }
  };

  const filteredUsers = users.filter(u =>
    (u.firstName + ' ' + (u.lastName || '') + ' ' + u.username + ' ' + u.email)
      .toLowerCase().includes(search.toLowerCase())
  );

  const handleChangeRole = async (id: string, newRole: string) => {
    setRoleLoading(id);
    try {
      await adminAPI.changeUserRole(id, newRole);
      fetchUsers(usersPage);
    } catch {
      alert('حدث خطأ أثناء تغيير الدور');
    } finally {
      setRoleLoading(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع.')) return;
    setDeleteLoading(id);
    try {
      await adminAPI.deleteUser(id);
      fetchUsers(usersPage);
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeleteLoading(null);
    }
  };

  const fetchArticles = async (page = 1) => {
    setArticlesLoading(true);
    setArticlesError(null);
    try {
      const response = await adminAPI.getArticles({ page, limit: CONTENT_LIMIT });
      setArticles(response.data.articles);
      setArticlesTotalPages(response.data.pagination.pages);
    } catch (e: any) {
      setArticlesError(e.message || 'حدث خطأ');
    } finally {
      setArticlesLoading(false);
    }
  };

  const fetchReports = async (page = 1) => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const response = await adminAPI.getReports({ page, limit: CONTENT_LIMIT });
      setReports(response.data.reports);
      setReportsTotalPages(response.data.pagination.pages);
    } catch (e: any) {
      setReportsError(e.message || 'حدث خطأ');
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'content') {
      fetchArticles(articlesPage);
      fetchReports(reportsPage);
    }
    // eslint-disable-next-line
  }, [activeTab, articlesPage, reportsPage]);

  const handlePublishArticle = async (id: string) => {
    setArticleActionLoading(id + '-approve');
    try {
      await adminAPI.approveArticle(id);
      fetchArticles(articlesPage);
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('فشل في نشر المقال');
    } finally {
      setArticleActionLoading(null);
    }
  };

  const handleRejectArticle = async (id: string) => {
    setArticleActionLoading(id + '-reject');
    try {
      await adminAPI.rejectArticle(id);
      fetchArticles(articlesPage);
    } catch (error) {
      console.error('Error rejecting article:', error);
      alert('فشل في رفض المقال');
    } finally {
      setArticleActionLoading(null);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا المقال؟ لا يمكن التراجع.')) return;
    setArticleActionLoading(id + '-delete');
    try {
      await adminAPI.deleteArticle(id);
      fetchArticles(articlesPage);
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('فشل في حذف المقال');
    } finally {
      setArticleActionLoading(null);
    }
  };

  const handleEditArticle = (id: string) => {
    router.push(`/admin/articles/${id}/edit`);
  };

  const handleApproveReport = async (id: string) => {
    setReportActionLoading(id + '-approve');
    try {
      await adminAPI.approveReport(id);
      fetchReports(reportsPage);
    } catch (error) {
      console.error('Error approving report:', error);
      alert('فشل في الموافقة على البلاغ');
    } finally {
      setReportActionLoading(null);
    }
  };

  const handleRejectReport = async (id: string) => {
    setReportActionLoading(id + '-reject');
    try {
      await adminAPI.rejectReport(id);
      fetchReports(reportsPage);
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert('فشل في رفض البلاغ');
    } finally {
      setReportActionLoading(null);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا البلاغ؟ لا يمكن التراجع.')) return;
    setReportActionLoading(id + '-delete');
    try {
      await adminAPI.deleteReport(id);
      fetchReports(reportsPage);
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('فشل في حذف البلاغ');
    } finally {
      setReportActionLoading(null);
    }
  };

  const handleEditReport = (id: string) => {
    router.push(`/admin/reports/${id}/edit`);
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              وصول ممنوع
            </h1>
            <p className="text-gray-600 mb-8">
              هذه الصفحة متاحة فقط للمديرين.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              العودة إلى لوحة التحكم
            </button>
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
    <AdminRouteGuard>
      <Layout title="لوحة الإدارة - ريمنا">
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    مرحباً، {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={() => {
                      Cookies.remove('rimna_token');
                      router.push('/admin/login');
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                  {[
                    { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                    { key: 'content', label: 'المحتوى', icon: FileText },
                    { key: 'users', label: 'المستخدمون', icon: Users },
                    { key: 'celebrities', label: 'المشاهير', icon: Shield },
                    { key: 'system', label: 'النظام', icon: Database },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                          activeTab === tab.key
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-medium text-gray-600">
                          إجمالي المستخدمين
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {data?.stats.totalUsers.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">
                          {data?.stats.activeUsers.toLocaleString()} نشط
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-medium text-gray-600">
                          إجمالي المقالات
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {data?.stats.totalArticles.toLocaleString()}
                        </p>
                        <p className="text-sm text-orange-600">
                          {data?.stats.pendingArticles} قيد الانتظار
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-medium text-gray-600">
                          إجمالي البلاغات
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {data?.stats.totalReports.toLocaleString()}
                        </p>
                        <p className="text-sm text-red-600">
                          {data?.stats.pendingReports} قيد الانتظار
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Eye className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-medium text-gray-600">
                          إجمالي المشاهدات
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {data?.stats.totalViews.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-600">
                          {data?.stats.totalComments.toLocaleString()} تعليقات
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      أحدث الأنشطة
                    </h3>
                    <div className="space-y-4">
                      {data?.recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <Activity className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-sm text-gray-500">بواسطة {activity.user.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(activity.createdAt).toLocaleString('ar-EG')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      محتوى قيد الانتظار
                    </h3>
                    <div className="space-y-4">
                      {data?.pendingContent.map((content) => (
                        <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{content.title}</h4>
                              <p className="text-sm text-gray-500">بواسطة {content.author}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(content.createdAt).toLocaleString('ar-EG')}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleContentAction(content.id, 'approve')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="قبول"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleContentAction(content.id, 'reject')}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="رفض"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  مؤشرات النظام
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">مدة تشغيل الخادم</h4>
                    <p className="text-2xl font-semibold text-green-600">{data?.systemMetrics.serverUptime}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">حجم قاعدة البيانات</h4>
                    <p className="text-2xl font-semibold text-blue-600">{data?.systemMetrics.databaseSize}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">الاتصالات النشطة</h4>
                    <p className="text-2xl font-semibold text-purple-600">{data?.systemMetrics.activeConnections}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">استخدام الذاكرة</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${data?.systemMetrics.memoryUsage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{data?.systemMetrics.memoryUsage}%</span>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">استخدام المعالج</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${data?.systemMetrics.cpuUsage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{data?.systemMetrics.cpuUsage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="ml-2" />إدارة المستخدمين</h2>
                <div className="mb-4 flex flex-col md:flex-row gap-2 items-stretch md:items-center">
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو البريد الإلكتروني..."
                    className="border rounded px-3 py-2 w-full md:w-64 text-right"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    dir="rtl"
                  />
                </div>
                {usersLoading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : usersError ? (
                  <div className="text-center text-red-500 py-8">{usersError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-right border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 border">الاسم</th>
                          <th className="px-3 py-2 border">البريد الإلكتروني</th>
                          <th className="px-3 py-2 border">الدور</th>
                          <th className="px-3 py-2 border">الحالة</th>
                          <th className="px-3 py-2 border">تاريخ التسجيل</th>
                          <th className="px-3 py-2 border">المقالات</th>
                          <th className="px-3 py-2 border">البلاغات</th>
                          <th className="px-3 py-2 border">التعليقات</th>
                          <th className="px-3 py-2 border">إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b">
                            <td className="px-3 py-2 border">{u.firstName || u.username} {u.lastName || ''}</td>
                            <td className="px-3 py-2 border">{u.email}</td>
                            <td className="px-3 py-2 border">
                              {u.role === 'ADMIN' ? 'مدير' : 'مستخدم'}
                              {u.role !== 'ADMIN' && (
                                <select
                                  className="ml-2 border rounded px-1 py-0.5 text-xs"
                                  value={u.role}
                                  disabled={roleLoading === u.id}
                                  onChange={e => handleChangeRole(u.id, e.target.value)}
                                >
                                  <option value="USER">مستخدم</option>
                                  <option value="ADMIN">مدير</option>
                                </select>
                              )}
                              {roleLoading === u.id && <span className="ml-1 text-xs text-gray-400">...</span>}
                            </td>
                            <td className="px-3 py-2 border">{u.isActive ? <span className="text-green-600">نشط</span> : <span className="text-red-600">معطل</span>}</td>
                            <td className="px-3 py-2 border">{new Date(u.createdAt).toLocaleDateString('ar-EG')}</td>
                            <td className="px-3 py-2 border">{u._count.articles}</td>
                            <td className="px-3 py-2 border">{u._count.reports}</td>
                            <td className="px-3 py-2 border">{u._count.comments}</td>
                            <td className="px-3 py-2 border flex flex-col gap-1">
                              {u.role !== 'ADMIN' && (
                                <button
                                  className={`px-3 py-1 mb-1 rounded text-white ${u.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                  onClick={() => handleToggleUser(u.id, u.isActive, u.role)}
                                  disabled={deleteLoading === u.id}
                                >
                                  {u.isActive ? 'تعطيل' : 'تفعيل'}
                                </button>
                              )}
                              {u.role !== 'ADMIN' && (
                                <button
                                  className="px-3 py-1 rounded bg-gray-200 text-red-600 hover:bg-red-100 border border-red-200"
                                  onClick={() => handleDeleteUser(u.id)}
                                  disabled={deleteLoading === u.id}
                                >
                                  {deleteLoading === u.id ? 'جار الحذف...' : 'حذف'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="flex justify-center mt-4 gap-2">
                      <button disabled={usersPage === 1} onClick={() => setUsersPage(usersPage - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">السابق</button>
                      <span className="px-3 py-1">صفحة {usersPage} من {usersTotalPages}</span>
                      <button disabled={usersPage === usersTotalPages} onClick={() => setUsersPage(usersPage + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">التالي</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'celebrities' && (
              <div>
                <CelebritiesAdminPanel />
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-10">
                {/* Articles Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center"><FileText className="ml-2" />المقالات</h2>
                      {/* Debug Info */}
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Total:</span> {articles.length} | 
                        <span className="font-medium"> Pending:</span> {articles.filter(a => a.status === 'PENDING').length} | 
                        <span className="font-medium"> Published:</span> {articles.filter(a => a.status === 'PUBLISHED').length} | 
                        <span className="font-medium"> With Source:</span> {articles.filter(a => a.sourceName).length} | 
                        <span className="font-medium"> No Source:</span> {articles.filter(a => !a.sourceName).length}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/admin/articles/new')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      + إضافة مقال جديد
                    </button>
                  </div>
                  {articlesLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : articlesError ? (
                    <div className="text-center text-red-500 py-8">{articlesError}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-right border rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-3 py-2 border">العنوان</th>
                            <th className="px-3 py-2 border">الكاتب</th>
                            <th className="px-3 py-2 border">الحالة</th>
                            <th className="px-3 py-2 border">تاريخ الإنشاء</th>
                            <th className="px-3 py-2 border">إجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.map((a) => (
                            <tr key={a.id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 border font-medium">{a.title}</td>
                              <td className="px-3 py-2 border">
                                {a.author ? `${a.author.firstName || ''} ${a.author.lastName || ''}` : 
                                 a.authorId ? 'مستخدم محذوف' : 
                                 a.sourceName ? `مصدر: ${a.sourceName}` : 
                                 a.status === 'PENDING' ? 'صحفي (في انتظار المراجعة)' : 'مجهول المصدر'}
                              </td>
                              <td className="px-3 py-2 border">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${a.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : a.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{a.status === 'PUBLISHED' ? 'منشور' : a.status === 'PENDING' ? 'معلق' : 'مرفوض'}</span>
                              </td>
                              <td className="px-3 py-2 border">{new Date(a.createdAt).toLocaleDateString('ar-EG')}</td>
                              <td className="px-3 py-2 border flex gap-2">
                                <button onClick={() => handlePublishArticle(a.id)} disabled={articleActionLoading===a.id+'-approve'} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-300">نشر</button>
                                <button onClick={() => handleRejectArticle(a.id)} disabled={articleActionLoading===a.id+'-reject'} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300">رفض</button>
                                <button onClick={() => handleEditArticle(a.id)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">تعديل</button>
                                <button onClick={() => handleDeleteArticle(a.id)} disabled={articleActionLoading===a.id+'-delete'} className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300">حذف</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      <div className="flex justify-center mt-4 gap-2">
                        <button disabled={articlesPage === 1} onClick={() => setArticlesPage(articlesPage - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">السابق</button>
                        <span className="px-3 py-1">صفحة {articlesPage} من {articlesTotalPages}</span>
                        <button disabled={articlesPage === articlesTotalPages} onClick={() => setArticlesPage(articlesPage + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">التالي</button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Reports Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center"><AlertTriangle className="ml-2" />البلاغات</h2>
                  </div>
                  {reportsLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : reportsError ? (
                    <div className="text-center text-red-500 py-8">{reportsError}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-right border rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-3 py-2 border">العنوان</th>
                            <th className="px-3 py-2 border">المبلغ</th>
                            <th className="px-3 py-2 border">الحالة</th>
                            <th className="px-3 py-2 border">تاريخ الإنشاء</th>
                            <th className="px-3 py-2 border">إجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.map((r) => (
                            <tr key={r.id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2 border font-medium">{r.title}</td>
                              <td className="px-3 py-2 border">
                                {r.reporter ? `${r.reporter.firstName || ''} ${r.reporter.lastName || ''}` : 
                                 r.reporterId ? 'مستخدم محذوف' : 'مجهول المصدر'}
                              </td>
                              <td className="px-3 py-2 border">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : r.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{r.status === 'PUBLISHED' ? 'منشور' : r.status === 'PENDING' ? 'معلق' : 'مرفوض'}</span>
                              </td>
                              <td className="px-3 py-2 border">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</td>
                              <td className="px-3 py-2 border flex gap-2">
                                <button onClick={() => handleApproveReport(r.id)} disabled={reportActionLoading===r.id+'-approve'} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-300">موافقة</button>
                                <button onClick={() => handleRejectReport(r.id)} disabled={reportActionLoading===r.id+'-reject'} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300">رفض</button>
                                <button onClick={() => handleEditReport(r.id)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">تعديل</button>
                                <button onClick={() => handleDeleteReport(r.id)} disabled={reportActionLoading===r.id+'-delete'} className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300">حذف</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      <div className="flex justify-center mt-4 gap-2">
                        <button disabled={reportsPage === 1} onClick={() => setReportsPage(reportsPage - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">السابق</button>
                        <span className="px-3 py-1">صفحة {reportsPage} من {reportsTotalPages}</span>
                        <button disabled={reportsPage === reportsTotalPages} onClick={() => setReportsPage(reportsPage + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">التالي</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AdminRouteGuard>
  );
};

export default AdminDashboard; 