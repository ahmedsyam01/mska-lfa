import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { articlesAPI } from '../utils/api';

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
        setError('فشل في تحميل المدونات');
        // Fallback to mock data if API fails
        setBlogPosts([
          {
            id: '1',
            title: 'تطور التعليم في موريتانيا',
            content: 'مقال عن التطورات الحديثة في نظام التعليم الموريتاني والجهود المبذولة لتحسين جودة التعليم...',
            contentAr: 'مقال عن التطورات الحديثة في نظام التعليم الموريتاني والجهود المبذولة لتحسين جودة التعليم...',
            excerpt: 'مقال عن التطورات الحديثة في نظام التعليم الموريتاني والجهود المبذولة لتحسين جودة التعليم...',
            excerptAr: 'مقال عن التطورات الحديثة في نظام التعليم الموريتاني والجهود المبذولة لتحسين جودة التعليم...',
            image: '/images/news/education-rural.jpg',
            createdAt: '2024-01-15',
            category: 'تعليم',
            readTime: '5 دقائق'
          },
          {
            id: '2',
            title: 'الاقتصاد الموريتاني: تحديات وآفاق',
            content: 'تحليل شامل للوضع الاقتصادي في موريتانيا والتحديات التي تواجهها والفرص المتاحة...',
            contentAr: 'تحليل شامل للوضع الاقتصادي في موريتانيا والتحديات التي تواجهها والفرص المتاحة...',
            excerpt: 'تحليل شامل للوضع الاقتصادي في موريتانيا والتحديات التي تواجهها والفرص المتاحة...',
            excerptAr: 'تحليل شامل للوضع الاقتصادي في موريتانيا والتحديات التي تواجهها والفرص المتاحة...',
            image: '/images/news/economics-1.jpg',
            createdAt: '2024-01-14',
            category: 'اقتصاد',
            readTime: '8 دقائق'
          },
          {
            id: '3',
            title: 'الصحة في المناطق الريفية',
            content: 'استكشاف للخدمات الصحية المتوفرة في المناطق الريفية الموريتانية والتحديات...',
            contentAr: 'استكشاف للخدمات الصحية المتوفرة في المناطق الريفية الموريتانية والتحديات...',
            excerpt: 'استكشاف للخدمات الصحية المتوفرة في المناطق الريفية الموريتانية والتحديات...',
            excerptAr: 'استكشاف للخدمات الصحية المتوفرة في المناطق الريفية الموريتانية والتحديات...',
            image: '/images/news/healthcare-mobile.jpg',
            createdAt: '2024-01-13',
            category: 'صحة',
            readTime: '6 دقائق'
          },
          {
            id: '4',
            title: 'الابتكار التكنولوجي في نواكشوط',
            content: 'نظرة على المشهد التكنولوجي المتنامي في العاصمة الموريتانية...',
            contentAr: 'نظرة على المشهد التكنولوجي المتنامي في العاصمة الموريتانية...',
            excerpt: 'نظرة على المشهد التكنولوجي المتنامي في العاصمة الموريتانية...',
            excerptAr: 'نظرة على المشهد التكنولوجي المتنامي في العاصمة الموريتانية...',
            image: '/images/news/tech-innovation.jpg',
            createdAt: '2024-01-12',
            category: 'تكنولوجيا',
            readTime: '4 دقائق'
          }
        ]);
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
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">جاري تحميل المدونات...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">المدونات</h1>
            <p className="text-xl text-gray-600">مقالات وآراء من كُتاب موريتانيا</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={post.image || '/images/news/placeholder-1.jpg'}
                    alt={post.titleAr || post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.readTime || '5 دقائق'}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.titleAr || post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerptAr || post.excerpt || post.contentAr || post.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {post.author ? (post.author.firstName?.charAt(0) || post.author.username?.charAt(0) || '?') : '?'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'مجهول'}
                      </span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                      اقرأ المزيد
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">اشترك في النشرة الإخبارية</h2>
            <p className="text-blue-100 mb-6">احصل على أحدث المقالات والمدونات مباشرة في بريدك الإلكتروني</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
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
