import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { Calendar, Eye, MessageCircle, Share2, ArrowLeft, Heart, Bookmark, User, Source, Tag, Clock } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto px-6 py-12" dir="rtl">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded-2xl mb-8"></div>
            <div className="h-6 bg-gradient-to-r from-mauritania-gold/20 to-mauritania-red/20 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gradient-to-r from-mauritania-red/20 to-mauritania-green/20 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-mauritania-green/20 to-mauritania-gold/20 rounded w-full"></div>
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
        <div className="max-w-4xl mx-auto px-6 py-12" dir="rtl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-6">
              المقال غير موجود
            </h1>
            <p className="text-mauritania-gold-dark text-lg mb-8">
              المقال الذي تبحث عنه غير موجود.
            </p>
            <button
              onClick={() => router.push('/news')}
              className="bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white px-8 py-4 rounded-2xl font-bold hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
      <div className="max-w-4xl mx-auto px-6 py-12" dir="rtl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-mauritania-gold-dark hover:text-mauritania-gold mb-8 transition-all duration-300 space-x-reverse group"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 rounded-full flex items-center justify-center group-hover:from-mauritania-green/20 group-hover:to-mauritania-gold/20 transition-all duration-300">
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </div>
          <span className="font-semibold">رجوع</span>
        </button>

        {/* Article Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6 justify-start space-x-reverse">
            <div className="flex items-center gap-2 text-mauritania-gold-dark">
              <div className="w-6 h-6 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold">
                {formatDate(currentArticle.publishedAt)}
              </span>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark border border-mauritania-green/20">
              {currentArticle.category === 'POLITICS' ? 'السياسة' :
               currentArticle.category === 'ECONOMY' ? 'الاقتصاد' :
               currentArticle.category === 'SPORTS' ? 'الرياضة' :
               currentArticle.category === 'TECHNOLOGY' ? 'التكنولوجيا' :
               currentArticle.category === 'CULTURE' ? 'الثقافة' :
               currentArticle.category === 'HEALTH' ? 'الصحة' : currentArticle.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6 leading-tight text-right">
            {currentArticle.titleAr || currentArticle.title}
          </h1>

          <p className="text-xl text-mauritania-gold-dark mb-8 text-right leading-relaxed">
            {currentArticle.descriptionAr || currentArticle.description}
          </p>

          {/* Article Meta */}
          <div className="modern-card p-8 mb-8">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-4 space-x-reverse">
                <div className="flex items-center gap-4 space-x-reverse">
                  <div className="text-right">
                    <p className="font-bold text-mauritania-green-dark text-lg">
                      {currentArticle.author.nameAr || currentArticle.author.name}
                    </p>
                    <p className="text-mauritania-gold-dark font-semibold">
                      {currentArticle.source.nameAr || currentArticle.source.name}
                    </p>
                  </div>
                  {currentArticle.author.avatar ? (
                    <img
                      src={currentArticle.author.avatar}
                      alt={currentArticle.author.name}
                      className="w-12 h-12 rounded-full border-2 border-mauritania-green/20"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-full flex items-center justify-center text-white font-bold">
                      {(currentArticle.author.nameAr || currentArticle.author.name).charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 space-x-reverse">
                <div className="flex items-center gap-2 text-mauritania-gold-dark">
                  <div className="w-8 h-8 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-full flex items-center justify-center">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold">{currentArticle.viewCount}</span>
                </div>
                <div className="flex items-center gap-2 text-mauritania-gold-dark">
                  <div className="w-8 h-8 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold">{currentArticle._count.comments}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark hover:from-mauritania-green/20 hover:to-mauritania-gold/20 transition-all duration-300 border border-mauritania-green/20"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      bookmarked 
                        ? 'bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white shadow-lg' 
                        : 'bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark hover:from-mauritania-green/20 hover:to-mauritania-gold/20 border border-mauritania-green/20'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleLike}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      liked 
                        ? 'bg-gradient-to-r from-mauritania-red to-mauritania-red-dark text-white shadow-lg' 
                        : 'bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark hover:from-mauritania-green/20 hover:to-mauritania-gold/20 border border-mauritania-green/20'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        {currentArticle.imageUrl && (
          <div className="mb-12">
            <div className="modern-card p-4">
              <img
                src={fixImageUrl(currentArticle.imageUrl) || ''}
                alt={currentArticle.titleAr || currentArticle.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="modern-card p-8 mb-12">
          <div
            className="text-mauritania-green-dark leading-relaxed text-right text-lg"
            dangerouslySetInnerHTML={{
              __html: currentArticle.contentAr || currentArticle.content
            }}
          />
        </div>

        {/* Tags */}
        {currentArticle.tags && currentArticle.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 justify-end">
              <Tag className="w-6 h-6 text-mauritania-gold" />
              <h3 className="text-xl font-bold text-mauritania-green-dark">العلامات</h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              {currentArticle.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark hover:from-mauritania-green/20 hover:to-mauritania-gold/20 cursor-pointer transition-all duration-300 border border-mauritania-green/20 font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comment System */}
        <div className="mb-12">
          <CommentSystem articleId={currentArticle.id} />
        </div>

        {/* Related Articles */}
        {currentArticle.relatedArticles && currentArticle.relatedArticles.length > 0 && (
          <div className="modern-card p-8">
            <div className="flex items-center gap-3 mb-8 justify-end">
              <div className="w-8 h-8 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center">
                <Source className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gradient">
                مقالات ذات صلة
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentArticle.relatedArticles.slice(0, 4).map(relatedArticle => (
                <div
                  key={relatedArticle.id}
                  onClick={() => router.push(`/articles/${relatedArticle.id}`)}
                  className="modern-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  dir="rtl"
                >
                  {relatedArticle.imageUrl && (
                    <img
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <h3 className="font-bold text-mauritania-green-dark mb-3 line-clamp-2 text-right group-hover:text-mauritania-green transition-colors duration-300">
                    {relatedArticle.titleAr || relatedArticle.title}
                  </h3>
                  <p className="text-sm text-mauritania-gold-dark line-clamp-2 text-right leading-relaxed">
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