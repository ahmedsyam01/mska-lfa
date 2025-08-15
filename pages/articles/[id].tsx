import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { Calendar, Eye, MessageCircle, Share2, ArrowLeft, Heart, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import CommentSystem from '../../components/common/CommentSystem';
import { articlesAPI } from '../../utils/api';
import { fixImageUrl } from '../../utils/imageUrl';

interface Article {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl?: string;
  publishedAt: string;
  category: string;
  source: {
    id: string;
    name: string;
    nameAr?: string;
    website?: string;
    logo?: string;
  };
  author: {
    id: string;
    name: string;
    nameAr?: string;
    avatar?: string;
    bio?: string;
    bioAr?: string;
  };
  viewCount: number;
  likeCount: number;
  _count: {
    comments: number;
    likes: number;
  };
  tags: string[];
  relatedArticles?: Article[];
}

interface ArticlePageProps {
  article?: Article;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(!article);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(article || null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!article && router.query.id) {
      fetchArticle(router.query.id as string);
    }
  }, [router.query.id, article]);

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true);
      const response = await articlesAPI.getById(id);
      const data = response.data;
      const received = data.article ?? data;
      setCurrentArticle(received || null);
    } catch (error) {
      console.error('Error fetching article:', error);
      router.push('/404');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ar
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = currentArticle?.titleAr || currentArticle?.title;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: currentArticle?.descriptionAr || currentArticle?.description
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const handleLike = async () => {
    if (!currentArticle) return;
    
    try {
      const response = await articlesAPI.like(currentArticle.id);
      if (response.status === 200) {
        setLiked(!liked);
        setCurrentArticle(prev => prev ? {
          ...prev,
          _count: {
            ...prev._count,
            likes: liked ? prev._count.likes - 1 : prev._count.likes + 1
          }
        } : null);
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleBookmark = async () => {
    if (!currentArticle) return;
    
    try {
      const apiBase = (typeof window !== 'undefined' && window.location.hostname.includes('railway.app'))
        ? 'https://rimna-backend-production.up.railway.app'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      const response = await fetch(`${apiBase}/api/articles/${currentArticle.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentArticle) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              المقال غير موجود
            </h1>
            <p className="text-gray-600 mb-8">
              المقال الذي تبحث عنه غير موجود.
            </p>
            <button
              onClick={() => router.push('/news')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              العودة إلى الأخبار
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors space-x-reverse"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          رجوع
        </button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 justify-start space-x-reverse">
            <span className="text-sm text-gray-500">
              {formatDate(currentArticle.publishedAt)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {currentArticle.category === 'POLITICS' ? 'السياسة' :
               currentArticle.category === 'ECONOMY' ? 'الاقتصاد' :
               currentArticle.category === 'SPORTS' ? 'الرياضة' :
               currentArticle.category === 'TECHNOLOGY' ? 'التكنولوجيا' :
               currentArticle.category === 'CULTURE' ? 'الثقافة' :
               currentArticle.category === 'HEALTH' ? 'الصحة' : currentArticle.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight text-right">
            {currentArticle.titleAr || currentArticle.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6 text-right">
            {currentArticle.descriptionAr || currentArticle.description}
          </p>

          {/* Article Meta */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 flex-row-reverse">
            <div className="flex items-center gap-4 space-x-reverse">
              <div className="flex items-center gap-2 space-x-reverse">
                <div>
                  <p className="font-medium text-gray-900 text-right">
                    {currentArticle.author.nameAr || currentArticle.author.name}
                  </p>
                  <p className="text-sm text-gray-500 text-right">
                    {currentArticle.source.nameAr || currentArticle.source.name}
                  </p>
                </div>
                {currentArticle.author.avatar ? (
                  <img
                    src={currentArticle.author.avatar}
                    alt={currentArticle.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 space-x-reverse">
              <div className="flex items-center gap-1 text-gray-500 space-x-reverse">
                <span className="text-sm">{currentArticle.viewCount}</span>
                <Eye className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 text-gray-500 space-x-reverse">
                <span className="text-sm">{currentArticle._count.comments}</span>
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full transition-colors ${
                    liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        {currentArticle.imageUrl && (
          <div className="mb-8">
            <img
              src={fixImageUrl(currentArticle.imageUrl) || ''}
              alt={currentArticle.titleAr || currentArticle.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div
            className="text-gray-900 leading-relaxed text-right"
            dangerouslySetInnerHTML={{
              __html: currentArticle.contentAr || currentArticle.content
            }}
          />
        </div>

        {/* Tags */}
        {currentArticle.tags && currentArticle.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-end">
              {currentArticle.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comment System */}
        <CommentSystem articleId={currentArticle.id} />

        {/* Related Articles */}
        {currentArticle.relatedArticles && currentArticle.relatedArticles.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentArticle.relatedArticles.slice(0, 4).map(relatedArticle => (
                <div
                  key={relatedArticle.id}
                  onClick={() => router.push(`/articles/${relatedArticle.id}`)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  dir="rtl"
                >
                  {relatedArticle.imageUrl && (
                    <img
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-right">
                    {relatedArticle.titleAr || relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 text-right">
                    {relatedArticle.descriptionAr || relatedArticle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  
  try {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const isLocal = /localhost|127\.0\.0\.1|::1/i.test(envUrl);
    const backendUrl = !envUrl || isLocal
      ? 'https://rimna-backend-production.up.railway.app'
      : envUrl;
    const response = await fetch(`${backendUrl}/api/articles/${id}`);
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }
    
    const raw = await response.json();
    const article = raw.article ?? raw;
    
    // Sanitize article data
    const sanitizedArticle = {
      ...article,
      description: article.excerpt || '',
      descriptionAr: article.excerptAr || null,
      titleAr: article.titleAr || null,
      contentAr: article.contentAr || null,
      imageUrl: article.imageUrl || null,
      source: {
        id: 'default',
        name: 'Rimna',
        nameAr: 'ريمنا',
        website: null,
        logo: null,
      },
      author: {
        id: article.author?.id || '',
        name: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim(),
        nameAr: article.author?.nameAr || null,
        avatar: article.author?.avatar || null,
        bio: article.author?.bio || null,
        bioAr: article.author?.bioAr || null,
      },
      tags: article.tags?.map((tag: any) => tag.tag?.name || tag.name || tag) || [],
      relatedArticles: [],
      likeCount: article._count?.likes || 0,
      publishedAt: article.publishedAt || article.createdAt || new Date().toISOString(),
      createdAt: article.createdAt || new Date().toISOString(),
      updatedAt: article.updatedAt || new Date().toISOString(),
    };
    
    return {
      props: {
        article: sanitizedArticle,
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      props: {},
    };
  }
};

export default ArticlePage; 