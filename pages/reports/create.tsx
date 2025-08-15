import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useRouter } from 'next/router';

const CreateReportPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, content }),
      });
      if (!res.ok) throw new Error('حدث خطأ أثناء إرسال البلاغ');
      setSuccess(true);
      setTitle('');
      setContent('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center bg-gray-50 font-[Tajawal]" dir="rtl">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
          {success ? (
            <div className="text-center space-y-6">
              <div className="text-5xl text-green-500">✔️</div>
              <h2 className="text-2xl font-bold text-gray-900">تم إرسال البلاغ بنجاح</h2>
              <p className="text-gray-600">شكرًا لمساهمتك في تحسين المجتمع!</p>
              <button
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                onClick={() => router.push('/reports')}
              >
                العودة إلى البلاغات
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">إرسال بلاغ جديد</h2>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">الاسم</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="اكتب اسمك هنا..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">عنوان البلاغ</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="اكتب عنوان البلاغ هنا..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">محتوى البلاغ</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right min-h-[120px]"
                  placeholder="اكتب تفاصيل البلاغ هنا..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  maxLength={1000}
                />
              </div>
              {error && <div className="text-red-600 text-center">{error}</div>}
              <button
                type="submit"
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold text-lg hover:bg-primary-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CreateReportPage; 