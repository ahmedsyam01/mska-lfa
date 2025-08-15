import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Users, Verified, Twitter, Instagram, Facebook, Crown } from 'lucide-react';
import { celebritiesAPI } from '@/utils/api';

interface Celebrity {
  id: string;
  name: string;
  nameAr?: string;
  bio?: string;
  bioAr?: string;
  avatar?: string;
  category?: string;
  isVerified: boolean;
  followerCount: number;
  socialLinks?: string; // JSON string
}

const parseSocialLinks = (socialLinksStr?: string) => {
  if (!socialLinksStr) return {};
  try {
    return JSON.parse(socialLinksStr);
  } catch {
    return {};
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const CelebritiesPage: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    fetchCelebrities();
  }, [filter]);

  const fetchCelebrities = async () => {
    try {
      const params: any = { limit: 1000 };
      if (filter === 'verified') params.verified = true;
      if (filter === 'unverified') params.verified = false;
      const response = await celebritiesAPI.getAll(params);
      setCelebrities(response.data.celebrities || []);
    } catch (error) {
      setCelebrities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 bg-gray-50 font-[Tajawal]" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 flex-row-start">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                المشاهير
              </h2>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>الكل</button>
            <button onClick={() => setFilter('verified')} className={`px-3 py-1 rounded ${filter==='verified' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>موثق</button>
            <button onClick={() => setFilter('unverified')} className={`px-3 py-1 rounded ${filter==='unverified' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>غير موثق</button>
          </div>

          {celebrities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">لا توجد بيانات مشاهير</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {celebrities.map((celebrity) => (
                <div key={celebrity.id} className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto w-20 h-20">
                        <img
                          src={celebrity.avatar || '/api/placeholder/150/150'}
                          alt={celebrity.nameAr || celebrity.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                        {celebrity.isVerified && (
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Verified className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {celebrity.nameAr || celebrity.name}
                        </h3>
                        
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Users className="h-4 w-4 ml-1" />
                        <span>{formatNumber(celebrity.followerCount)} متابع</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 space-x-reverse">
                        {parseSocialLinks(celebrity.socialLinks).twitter && (
                          <a href={`https://twitter.com/${parseSocialLinks(celebrity.socialLinks).twitter}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                        {parseSocialLinks(celebrity.socialLinks).instagram && (
                          <a href={`https://instagram.com/${parseSocialLinks(celebrity.socialLinks).instagram}`} className="text-gray-400 hover:text-pink-400 transition-colors">
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {parseSocialLinks(celebrity.socialLinks).facebook && (
                          <a href={`https://facebook.com/${parseSocialLinks(celebrity.socialLinks).facebook}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CelebritiesPage; 