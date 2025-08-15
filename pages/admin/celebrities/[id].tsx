import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/router';

const initialState = {
  name: '',
  nameAr: '',
  bio: '',
  bioAr: '',
  followerCount: '',
  isVerified: false,
  avatar: '',
  socialLinks: {
    twitter: '',
    instagram: '',
    facebook: '',
  },
};

const EditCelebrityPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(initialState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchCelebrity();
    // eslint-disable-next-line
  }, [id]);

  const fetchCelebrity = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/celebrities/${id}`);
      if (!res.ok) throw new Error('فشل جلب بيانات المشهور');
      const data = await res.json();
      setForm({
        ...data,
        followerCount: data.followerCount?.toString() || '',
        socialLinks: typeof data.socialLinks === 'string' ? JSON.parse(data.socialLinks) : (data.socialLinks || {}),
      });
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('socialLinks.')) {
      setForm({
        ...form,
        socialLinks: {
          ...form.socialLinks,
          [name.split('.')[1]]: value,
        },
      });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      return part ? part.split(';').shift() || '' : '';
    }
    return '';
  }

  const uploadAvatar = async (): Promise<string> => {
    if (!avatarFile) return form.avatar;
    const formData = new FormData();
    formData.append('image', avatarFile);
    const token = getCookie('rimna_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/upload/image`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });
    if (!res.ok) throw new Error('فشل رفع الصورة');
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let avatarUrl = form.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/celebrities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          avatar: avatarUrl,
          followerCount: Number(form.followerCount),
          socialLinks: JSON.stringify(form.socialLinks),
        }),
      });
      if (!res.ok) throw new Error('فشل تحديث بيانات المشهور');
      router.push('/admin/celebrities');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 py-8 font-[Tajawal] text-center" dir="rtl">
          جاري تحميل بيانات المشهور...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-8 font-[Tajawal]" dir="rtl">
        <h1 className="text-2xl font-bold mb-6">تعديل بيانات المشهور</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block mb-1 font-semibold">الاسم</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">الاسم بالعربي</label>
            <input name="nameAr" value={form.nameAr} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">النبذة</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">النبذة بالعربي</label>
            <textarea name="bioAr" value={form.bioAr} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">عدد المتابعين</label>
            <input name="followerCount" type="number" value={form.followerCount} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex items-center gap-2">
            <input name="isVerified" type="checkbox" checked={form.isVerified} onChange={handleChange} />
            <label className="font-semibold">موثق</label>
          </div>
          <div>
            <label className="block mb-1 font-semibold">الصورة الشخصية</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {form.avatar && !avatarFile && (
              <div className="mt-2"><img src={form.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border" /></div>
            )}
            {avatarFile && <div className="mt-2 text-sm text-green-600">تم اختيار صورة: {avatarFile.name}</div>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">تويتر</label>
            <input name="socialLinks.twitter" value={form.socialLinks.twitter} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">انستغرام</label>
            <input name="socialLinks.instagram" value={form.socialLinks.instagram} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">فيسبوك</label>
            <input name="socialLinks.facebook" value={form.socialLinks.facebook} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded font-bold" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCelebrityPage; 