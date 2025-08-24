import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';
import { BookOpen, Calendar, Clock, User, Mail, ArrowRight, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  excerpt?: string;
  excerptAr?: string;
  image?: string;
  createdAt: string;
  category: string;
  author?: {
    username: string;
    firstName: string;
    lastName: string;
  };
  readTime?: string;
}

const BlogPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('جميع');

  const categories = ['جميع', 'تعليم', 'اقتصاد', 'صحة', 'تكنولوجيا', 'سياسة', 'ثقافة'];

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const params: any = {
          limit: 12,
          status: 'published'
        };
        
        if (selectedCategory !== 'جميع') {
          params.category = selectedCategory;
        }
        
        const response = await articlesAPI.getAll(params);
        setBlogPosts(response.data.articles || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('فشل في تحميل المدونات من الخادم');
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12" dir="rtl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-mauritania-gold-dark font-semibold">جاري تحميل المدونات...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-6">المدونات</h1>
            <p className="text-xl text-mauritania-gold-dark">مقالات وآراء من كُتاب موريتانيا</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-mauritania-red/10 to-mauritania-red/20 border-2 border-mauritania-red/30 text-mauritania-red-dark px-6 py-4 rounded-2xl mb-8 font-semibold">
              {error}
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white shadow-lg transform scale-105'
                    : 'bg-white/50 backdrop-blur-sm text-mauritania-green-dark hover:bg-mauritania-green/10 border-2 border-mauritania-green/20 hover:border-mauritania-green/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post) => (
              <article key={post.id} className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
                <div className="relative h-56">
                  <img
                    src={post.image || '/images/news/placeholder-1.jpg'}
                    alt={post.titleAr || post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {post.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-mauritania-gold-dark">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime || '5 دقائق'}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-mauritania-green-dark mb-4 line-clamp-2 group-hover:text-mauritania-green transition-colors duration-300">
                    {post.titleAr || post.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerptAr || post.excerpt || post.contentAr || post.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        <span className="text-sm">
                          {post.author ? (post.author.firstName?.charAt(0) || post.author.username?.charAt(0) || '?') : '?'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-mauritania-green-dark">
                        {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'مجهول'}
                      </span>
                    </div>
                    <button className="bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white px-6 py-3 rounded-xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
                      <span>اقرأ المزيد</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="modern-card p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gradient mb-6">اشترك في النشرة الإخبارية</h2>
            <p className="text-mauritania-gold-dark text-lg mb-8">احصل على أحدث المقالات والمدونات مباشرة في بريدك الإلكتروني</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-mauritania-green/30 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg"
              />
              <button className="bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white px-8 py-4 rounded-2xl font-bold hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                اشتراك
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default BlogPage;
