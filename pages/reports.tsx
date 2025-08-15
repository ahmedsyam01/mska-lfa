import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon, FunnelIcon, MapIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout/Layout';
import { Report, FilterOptions } from '../src/types';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'next-i18next';
import { Dialog } from '@headlessui/react';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuth();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    category: '',
    priority: undefined,
    search: '',
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reportsPerPage = 12;

  const [reviewModal, setReviewModal] = useState<{ open: boolean; report: Report | null; action: 'approve' | 'reject' | null }>({ open: false, report: null, action: null });
  const [reviewNote, setReviewNote] = useState('');

  // Fetch reports
  const fetchReports = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await api.get('/reports', {
        params: {
          page,
          limit: reportsPerPage,
          ...filters,
        },
      });
      setReports(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalPages(response.data.pagination.pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject', note: string) => {
    try {
      await api.patch(`/reports/${reportId}/review`, { status: action === 'approve' ? 'APPROVED' : 'REJECTED', reviewNote: note });
      fetchReports(currentPage);
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('reports.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('reports.subtitle')}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              {t('common.filters')}
            </button>
            
            <button
              onClick={() => router.push('/reports/map')}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <MapIcon className="h-5 w-5 mr-2" />
              {t('reports.map_view')}
            </button>
            
            <button
              onClick={() => router.push('/reports/create')}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('reports.create_report')}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.search')}
                </label>
                <input
                  type="text"
                  placeholder={t('reports.search_placeholder') as string}
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.status')}
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="PENDING">{t('reports.status.pending')}</option>
                  <option value="APPROVED">{t('reports.status.approved')}</option>
                  <option value="REJECTED">{t('reports.status.rejected')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.category')}
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="breaking">{t('reports.category.breaking')}</option>
                  <option value="accident">{t('reports.category.accident')}</option>
                  <option value="crime">{t('reports.category.crime')}</option>
                  <option value="weather">{t('reports.category.weather')}</option>
                  <option value="politics">{t('reports.category.politics')}</option>
                  <option value="other">{t('reports.category.other')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.priority')}
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('common.all')}</option>
                  <option value="HIGH">{t('common.high')}</option>
                  <option value="MEDIUM">{t('common.medium')}</option>
                  <option value="LOW">{t('common.low')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => fetchReports(currentPage)}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : !Array.isArray(reports) || reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('reports.no_reports')}</p>
            <button
              onClick={() => router.push('/reports/create')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {t('reports.create_first_report')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  {report.mediaUrls && report.mediaUrls.length > 0 && (
                    <img
                      src={report.mediaUrls[0]}
                      alt={report.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {t(`reports.status.${report.status.toLowerCase()}`)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                        {t(`common.${report.priority.toLowerCase()}`)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {report.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {report.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{report.location}</span>
                      </div>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {t('common.view')}
                        </button>
                      </div>
                      
                      {user?.role === 'ADMIN' && report.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setReviewModal({ open: true, report, action: 'approve' })}
                            className="p-1 text-green-600 hover:text-green-700"
                            title={t('reports.approve') as string}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setReviewModal({ open: true, report, action: 'reject' })}
                            className="p-1 text-red-600 hover:text-red-700"
                            title={t('reports.reject') as string}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {t('common.previous')}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedReport.title}
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                    {t(`reports.status.${selectedReport.status.toLowerCase()}`)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                    {t(`common.${selectedReport.priority.toLowerCase()}`)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400">{selectedReport.content}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-gray-900 dark:text-white">{t('common.location')}:</strong>
                    <p className="text-gray-600 dark:text-gray-400">{selectedReport.location}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">{t('common.category')}:</strong>
                    <p className="text-gray-600 dark:text-gray-400">{selectedReport.category}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">{t('common.created_at')}:</strong>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">{t('reports.reporter')}:</strong>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedReport.isAnonymous ? t('reports.anonymous') : `${selectedReport.reporter.firstName} ${selectedReport.reporter.lastName}`}
                    </p>
                  </div>
                </div>
                
                {selectedReport.mediaUrls && selectedReport.mediaUrls.length > 0 && (
                  <div>
                    <strong className="text-gray-900 dark:text-white">{t('reports.media')}:</strong>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedReport.mediaUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedReport.tags && selectedReport.tags.length > 0 && (
                  <div>
                    <strong className="text-gray-900 dark:text-white">{t('common.tags')}:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedReport.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.open && reviewModal.report && (
        <Dialog open={reviewModal.open} onClose={() => setReviewModal({ open: false, report: null, action: null })} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-lg font-bold mb-4">
              {reviewModal.action === 'approve' ? t('reports.approve') : t('reports.reject')} - {reviewModal.report.title}
            </Dialog.Title>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              placeholder={t('reports.review_note_placeholder') as string}
              value={reviewNote}
              onChange={e => setReviewNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setReviewModal({ open: false, report: null, action: null })}
              >
                {t('common.cancel')}
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${reviewModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={async () => {
                  await handleReportAction(reviewModal.report!.id, reviewModal.action!, reviewNote);
                  setReviewModal({ open: false, report: null, action: null });
                  setReviewNote('');
                }}
              >
                {reviewModal.action === 'approve' ? t('reports.approve') : t('reports.reject')}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </Layout>
  );
};

export default ReportsPage; 