import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
   import ImageUpload from '@/components/common/ImageUpload';
   import { useAuth } from '@/hooks/useAuth';
   import { articlesAPI } from '@/utils/api';

const CATEGORIES = [
  { value: 'POLITICS', label: 'سياسة' },
  { value: 'ECONOMY', label: 'اقتصاد' },
  { value: 'SPORTS', label: 'رياضة' },
  { value: 'TECHNOLOGY', label: 'تكنولوجيا' },
  { value: 'CULTURE', label: 'ثقافة' },
  { value: 'HEALTH', label: 'صحة' },
  { value: 'EDUCATION', label: 'تعليم' },
  { value: 'ENVIRONMENT', label: 'بيئة' },
  { value: 'INTERNATIONAL', label: 'دولي' },
  { value: 'LOCAL', label: 'محلي' },
  { value: 'BREAKING', label: 'عاجل' }
];

const EditArticlePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    titleAr: '',
    contentAr: '',
    excerptAr: '',
    imageUrl: '',
    category: 'LOCAL',
    isBreaking: false,
    isFeatured: false,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      setFetching(true);
      try {
        const response = await articlesAPI.getById(id as string);
        const article = response.data;
        setFormData({
          titleAr: article.titleAr || '',
          contentAr: article.contentAr || '',
          excerptAr: article.excerptAr || '',
          imageUrl: article.imageUrl || '',
          category: typeof article.category === 'object'
            ? (article.category.value || article.category.name || article.category.nameAr || 'LOCAL')
            : (article.category || 'LOCAL'),
          isBreaking: article.isBreaking || false,
          isFeatured: article.isFeatured || false,
          tags: Array.isArray(article.tags)
            ? article.tags.map((t: any) => typeof t === 'string' ? t : t.tag)
            : [],
        });
      } catch (e) {
        setError('تعذر تحميل بيانات المقال');
      } finally {
        setFetching(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({ ...prev, imageUrl: imageUrl || '' }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3001${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr || !formData.contentAr || !formData.category) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await articlesAPI.update(id as string, {
        title: formData.titleAr,
        content: formData.contentAr,
        excerpt: formData.excerptAr,
        imageUrl: getFullImageUrl(formData.imageUrl),
        category: formData.category,
        isBreaking: formData.isBreaking,
        isFeatured: formData.isFeatured,
        tags: formData.tags,
      });
      router.push('/admin/articles');
    } catch (e) {
      setError('فشل تعديل المقال. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'JOURNALIST')) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">الدخول مرفوض</h1>
            <p className="text-gray-600">ليس لديك صلاحية تعديل المقالات.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (fetching) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-600">جاري تحميل بيانات المقال...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">تعديل مقال</h1>
              <p className="text-gray-600 mt-2">يمكنك تعديل بيانات المقال أدناه</p>
            </div>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* رفع صورة المقال */}
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageChange={handleImageChange}
                label="صورة المقال"
                maxSize={5}
              />
              {/* العنوان */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titleAr"
                  value={formData.titleAr}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="rtl"
                  required
                />
              </div>
              {/* الملخص */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الملخص
                </label>
                <textarea
                  name="excerptAr"
                  value={formData.excerptAr}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="rtl"
                />
              </div>
              {/* المحتوى */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المحتوى <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="contentAr"
                  value={formData.contentAr}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="rtl"
                  required
                />
              </div>
              {/* التصنيف وخيارات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-4 justify-end gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">مقال مميز</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBreaking"
                      checked={formData.isBreaking}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">خبر عاجل</span>
                  </label>
                </div>
              </div>
              {/* الوسوم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوسوم
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="أضف وسمًا"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="mr-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {/* زر الإرسال */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditArticlePage; 