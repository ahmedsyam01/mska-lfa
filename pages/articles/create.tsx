import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';
import { 
  ArrowLeft, 
  FileText, 
  Image, 
  Tag, 
  Globe, 
  Save, 
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface CreateArticleForm {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  sourceUrl: string;
}

const CreateArticle: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<CreateArticleForm>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    imageUrl: '',
    sourceUrl: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated or not a reporter
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.role !== 'REPORTER') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const articleData = {
        ...formData,
        status: 'PENDING', // Articles start as pending
        priority: 'MEDIUM',
        isBreaking: false
      };

      await api.post('/articles', articleData);
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء إنشاء المقال');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'REPORTER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-mauritania-green hover:text-mauritania-green-dark mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للوحة التحكم
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء مقال جديد</h1>
              <p className="text-gray-600">اكتب مقالك وسيتم مراجعته من قبل الإدارة</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">تم إنشاء المقال بنجاح!</h3>
              <p className="text-green-700">سيتم مراجعته من قبل الإدارة قريباً</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">حدث خطأ!</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                عنوان المقال *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg"
                placeholder="اكتب عنوان المقال هنا"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                ملخص المقال *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg resize-none"
                placeholder="اكتب ملخص مختصر للمقال"
              />
            </div>

            {/* Category and Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                  الفئة *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg"
                >
                  <option value="">اختر الفئة</option>
                  <option value="سياسة">سياسة</option>
                  <option value="اقتصاد">اقتصاد</option>
                  <option value="رياضة">رياضة</option>
                  <option value="تكنولوجيا">تكنولوجيا</option>
                  <option value="صحة">صحة</option>
                  <option value="تعليم">تعليم</option>
                  <option value="ثقافة">ثقافة</option>
                  <option value="محليات">محليات</option>
                  <option value="عالمية">عالمية</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 text-right mb-2">
                  الكلمات المفتاحية
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg"
                    placeholder="أضف كلمة مفتاحية"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 bg-mauritania-gold text-white rounded-2xl hover:bg-mauritania-red transition-colors duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {/* Display Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-mauritania-gold/10 text-mauritania-gold rounded-full text-sm"
                      >
                        <Tag className="w-4 h-4" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-mauritania-red hover:text-mauritania-red-dark"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                رابط الصورة
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Source URL */}
            <div>
              <label htmlFor="sourceUrl" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                رابط المصدر
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="sourceUrl"
                  name="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={handleChange}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg"
                  placeholder="https://example.com/source"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                محتوى المقال *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={10}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-gold/20 focus:border-mauritania-gold transition-all duration-300 text-right text-lg resize-none"
                placeholder="اكتب محتوى المقال هنا..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    إرسال المقال للمراجعة
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">معلومات مهمة</h3>
              <ul className="text-blue-700 space-y-1 text-right">
                <li>• سيتم مراجعة مقالك من قبل الإدارة قبل النشر</li>
                <li>• تأكد من صحة المعلومات والمصادر</li>
                <li>• يمكنك متابعة حالة مقالك من لوحة التحكم</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
