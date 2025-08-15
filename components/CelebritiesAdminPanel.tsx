import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Celebrity {
  id: string;
  name: string;
  nameAr?: string;
  avatar?: string;
  isVerified: boolean;
  followerCount: number;
}

const CelebritiesAdminPanel: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    fetchCelebrities();
  }, [filter]);

  const fetchCelebrities = async () => {
    try {
      setError('');
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/celebrities?limit=1000`;
      if (filter === 'verified') url += '&verified=true';
      if (filter === 'unverified') url += '&verified=false';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to fetch celebrities');
      }
      const data = await response.json();
      setCelebrities(data.celebrities || []);
    } catch (error: any) {
      setCelebrities([]);
      setError(error.message || 'حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-[Tajawal]" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">إدارة المشاهير</h1>
        <Link href="/admin/celebrities/new" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">إضافة مشهور</Link>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>الكل</button>
        <button onClick={() => setFilter('verified')} className={`px-3 py-1 rounded ${filter==='verified' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>موثق</button>
        <button onClick={() => setFilter('unverified')} className={`px-3 py-1 rounded ${filter==='unverified' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>غير موثق</button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : celebrities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">لا توجد بيانات مشاهير</div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-right">
              <th className="py-2 px-4">الصورة</th>
              <th className="py-2 px-4">الاسم</th>
              <th className="py-2 px-4">موثق؟</th>
              <th className="py-2 px-4">عدد المتابعين</th>
              <th className="py-2 px-4">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {celebrities.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2 px-4">
                  <img src={c.avatar || '/api/placeholder/80/80'} alt={c.nameAr || c.name} className="w-12 h-12 rounded-full object-cover border" />
                </td>
                <td className="py-2 px-4 font-bold">{c.nameAr || c.name}</td>
                <td className="py-2 px-4">{c.isVerified ? '✔️' : ''}</td>
                <td className="py-2 px-4">{c.followerCount}</td>
                <td className="py-2 px-4 space-x-2 space-x-reverse">
                  <Link href={`/admin/celebrities/${c.id}`} className="text-blue-600 hover:underline">تعديل</Link>
                  <button className="text-red-600 hover:underline">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CelebritiesAdminPanel; 