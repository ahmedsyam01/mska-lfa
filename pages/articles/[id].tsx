import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { Calendar, Eye, MessageCircle, Share2, ArrowLeft, Heart, Bookmark, User, Link, Tag, Clock } from 'lucide-react';
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
        <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="h-80 bg-slate-200 rounded-xl"></div>
            <div className="h-8 bg-slate-200 rounded w-2/3"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 bg-slate-200 rounded w-full"></div>
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
        <div className="max-w-2xl mx-auto px-4 py-16" dir="rtl">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              المقال غير موجود
            </h1>
            <p className="text-slate-600 mb-8">
              المقال الذي تبحث عنه غير موجود.
            </p>
            <button
              onClick={() => router.push('/news')}
              className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors font-medium"
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
      <div className="max-w-5xl mx-auto px-4 py-6" dir="rtl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-600 hover:text-slate-800 mb-8 transition-colors space-x-reverse group"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </div>
          <span className="font-medium">رجوع</span>
        </button>

        {/* Article Header */}
        <header className="mb-10">
          {/* Category and Date */}
          <div className="flex items-center gap-6 mb-6 justify-start space-x-reverse">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDate(currentArticle.publishedAt)}
              </span>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {currentArticle.category === 'POLITICS' ? 'السياسة' :
               currentArticle.category === 'ECONOMY' ? 'الاقتصاد' :
               currentArticle.category === 'SPORTS' ? 'الرياضة' :
               currentArticle.category === 'TECHNOLOGY' ? 'التكنولوجيا' :
               currentArticle.category === 'CULTURE' ? 'الثقافة' :
               currentArticle.category === 'HEALTH' ? 'الصحة' : currentArticle.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight text-right">
            {currentArticle.titleAr || currentArticle.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-600 mb-8 text-right leading-relaxed max-w-4xl">
            {currentArticle.descriptionAr || currentArticle.description}
          </p>

          {/* Author and Source */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-4 space-x-reverse">
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-lg">
                    {currentArticle.author.nameAr || currentArticle.author.name}
                  </p>
                  <p className="text-slate-600 font-medium">
                    {currentArticle.source.nameAr || currentArticle.source.name}
                  </p>
                </div>
                {currentArticle.author.avatar ? (
                  <img
                    src={currentArticle.author.avatar}
                    alt={currentArticle.author.name}
                    className="w-14 h-14 rounded-2xl border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center">
                    <span className="text-slate-600 font-bold text-lg">
                      {(currentArticle.author.nameAr || currentArticle.author.name).charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center gap-6 space-x-reverse">
                <div className="flex items-center gap-2 text-slate-600 space-x-reverse">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                    <Eye className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{currentArticle.viewCount}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 space-x-reverse">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{currentArticle._count.comments}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                      bookmarked ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                      liked ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Image */}
        {currentArticle.imageUrl && (
          <div className="mb-10">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <img
                src={fixImageUrl(currentArticle.imageUrl) || ''}
                alt={currentArticle.titleAr || currentArticle.title}
                className="w-full h-80 md:h-96 object-cover rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="mb-10">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div
              className="text-slate-800 leading-relaxed text-right text-lg prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{
                __html: currentArticle.contentAr || currentArticle.content
              }}
            />
          </div>
        </article>

        {/* Tags */}
        {currentArticle.tags && currentArticle.tags.length > 0 && (
          <div className="mb-10">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4 text-right">العلامات</h3>
              <div className="flex flex-wrap gap-3 justify-end">
                {currentArticle.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm bg-white text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comment System */}
        <div className="mb-10">
          <CommentSystem articleId={currentArticle.id} />
        </div>

        {/* Related Articles */}
        {currentArticle.relatedArticles && currentArticle.relatedArticles.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-right">
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentArticle.relatedArticles.slice(0, 4).map(relatedArticle => (
                <div
                  key={relatedArticle.id}
                  onClick={() => router.push(`/articles/${relatedArticle.id}`)}
                  className="bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 hover:border-slate-300"
                  dir="rtl"
                >
                  {relatedArticle.imageUrl && (
                    <img
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-bold text-slate-800 mb-3 line-clamp-2 text-right text-lg">
                    {relatedArticle.titleAr || relatedArticle.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-2 text-right leading-relaxed">
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