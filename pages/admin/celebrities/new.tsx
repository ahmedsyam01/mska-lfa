import React, { useState } from 'react';
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

const NewCelebrityPage: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

  const uploadAvatar = async (): Promise<string> => {
    if (!avatarFile) return '';
    const formData = new FormData();
    formData.append('image', avatarFile);
    const token = typeof window !== 'undefined' ? (document.cookie.match(/rimna_token=([^;]+)/)?.[1] || '') : '';
    const base = (typeof window !== 'undefined' && window.location.hostname.includes('railway.app'))
      ? 'https://rimna-backend-production.up.railway.app'
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    const res = await fetch(`${base}/api/upload/image`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });
    if (!res.ok) throw new Error('فشل رفع الصورة');
    const data = await res.json();
    return data.url;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let avatarUrl = form.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }
      if (avatarUrl && avatarUrl.startsWith('/')) {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        avatarUrl = base.replace(/\/$/, '') + avatarUrl;
      }
      const token = getCookie('rimna_token');
      const base = (typeof window !== 'undefined' && window.location.hostname.includes('railway.app'))
        ? 'https://rimna-backend-production.up.railway.app'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      const res = await fetch(`${base}/api/celebrities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          avatar: avatarUrl,
          followerCount: Number(form.followerCount),
          socialLinks: form.socialLinks,
        }),
      });
      if (!res.ok) throw new Error('فشل إضافة المشهور');
      router.push('/admin/celebrities');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-8 font-[Tajawal]" dir="rtl">
        <h1 className="text-2xl font-bold mb-6">إضافة مشهور جديد</h1>
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

export default NewCelebrityPage; 