import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { articlesAPI } from '@/utils/api';

const AdminArticlesPage: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await articlesAPI.getAll();
        setArticles(res.data.articles || []);
      } catch (e) {
        setError('تعذر تحميل المقالات');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/admin/articles/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    try {
      await articlesAPI.delete(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch {
      setError('فشل حذف المقال');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const article = articles.find(a => a.id === id);
      if (!article) return;
      const payload = {
        ...article,
        status: 'PUBLISHED'
      };
      delete payload.id;
      if (!(typeof article.titleAr === 'string' && article.titleAr.trim() !== '')) delete payload.titleAr;
      if (!(typeof article.excerptAr === 'string' && article.excerptAr.trim() !== '')) delete payload.excerptAr;
      if (!(typeof article.contentAr === 'string' && article.contentAr.trim() !== '')) delete payload.contentAr;
      if (!(typeof article.videoUrl === 'string' && article.videoUrl.trim() !== '')) delete payload.videoUrl;
      if (!(typeof article.imageUrl === 'string' && article.imageUrl.trim() !== '')) delete payload.imageUrl;
      if (!(typeof article.sourceUrl === 'string' && article.sourceUrl.trim() !== '')) delete payload.sourceUrl;
      if (!(typeof article.sourceName === 'string' && article.sourceName.trim() !== '')) delete payload.sourceName;
      if (payload.imageUrl && !payload.imageUrl.startsWith('http')) {
        payload.imageUrl = `http://localhost:3001${payload.imageUrl}`;
      }
      await articlesAPI.update(id, payload);
      setArticles(articles => articles.map(a => a.id === id ? { ...a, status: 'PUBLISHED' } : a));
    } catch {
      setError('فشل نشر المقال');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 font-[Tajawal]" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">إدارة المقالات</h1>
            <button
              onClick={() => router.push('/admin/articles/new')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              مقال جديد
            </button>
          </div>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-600">جاري تحميل المقالات...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-right">العنوان</th>
                    <th className="px-4 py-2 text-right">التصنيف</th>
                    <th className="px-4 py-2 text-right">تاريخ الإنشاء</th>
                    <th className="px-4 py-2 text-right">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id} className="border-t">
                      <td className="px-4 py-2">{article.titleAr || article.title}</td>
                      <td className="px-4 py-2">{article.category}</td>
                      <td className="px-4 py-2">{new Date(article.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          حذف
                        </button>
                        {article.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            نشر
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">لا توجد مقالات</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminArticlesPage; 