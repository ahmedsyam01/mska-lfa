import React from 'react';
import Link from 'next/link';
import { Calendar, Eye, MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { fixImageUrl } from '../../utils/imageUrl';

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    imageUrl?: string;
    publishedAt: string;
    category: string;
    source?: {
      id: string;
      name: string;
      nameAr?: string;
    };
    viewCount: number;
    _count: {
      comments: number;
    };
  };
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ar
    });
  };

  // Fallback source data if not provided
  const sourceData = article.source || {
    id: 'rimna',
    name: 'Rimna',
    nameAr: 'ريمنا'
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/articles/${article.id}`;
    const title = article.titleAr || article.title;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: article.descriptionAr || article.description
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  if (variant === 'compact') {
    return (
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="flex gap-3 p-3 hover:bg-gray-50 transition-colors" dir="rtl">
          {article.imageUrl && (
            <div className="flex-shrink-0 w-16 h-16 relative">
              <img
                src={fixImageUrl(article.imageUrl) || ''}
                alt={article.titleAr || article.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors text-right">
              {article.titleAr || article.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 justify-end">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{sourceData.nameAr || sourceData.name}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden" dir="rtl">
          {article.imageUrl && (
            <div className="relative h-64 md:h-80">
              <img
                src={fixImageUrl(article.imageUrl) || ''}
                alt={article.titleAr || article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {article.category === 'POLITICS' ? 'السياسة' :
                   article.category === 'ECONOMY' ? 'الاقتصاد' :
                   article.category === 'SPORTS' ? 'الرياضة' :
                   article.category === 'TECHNOLOGY' ? 'التكنولوجيا' :
                   article.category === 'CULTURE' ? 'الثقافة' :
                   article.category === 'HEALTH' ? 'الصحة' : article.category}
                </span>
              </div>
            </div>
          )}
          <div className="p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors text-right">
              {article.titleAr || article.title}
            </h1>
            <p className="text-gray-600 mb-4 line-clamp-3 text-right">
              {article.descriptionAr || article.description}
            </p>
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-4 text-sm text-gray-500 space-x-reverse">
                <div className="flex items-center gap-1 space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1 space-x-reverse">
                  <Eye className="w-4 h-4" />
                  <span>{article.viewCount}</span>
                </div>
                <div className="flex items-center gap-1 space-x-reverse">
                  <MessageCircle className="w-4 h-4" />
                  <span>{article._count.comments}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors space-x-reverse"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">مشاركة</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden" dir="rtl">
        {article.imageUrl && (
          <div className="relative h-48">
            <img
              src={fixImageUrl(article.imageUrl) || ''}
              alt={article.titleAr || article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {article.category === 'POLITICS' ? 'السياسة' :
                 article.category === 'ECONOMY' ? 'الاقتصاد' :
                 article.category === 'SPORTS' ? 'الرياضة' :
                 article.category === 'TECHNOLOGY' ? 'التكنولوجيا' :
                 article.category === 'CULTURE' ? 'الثقافة' :
                 article.category === 'HEALTH' ? 'الصحة' : article.category}
              </span>
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-right">
            {article.titleAr || article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 text-right">
            {article.descriptionAr || article.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 flex-row-start">
            <div className="flex items-center gap-2 space-x-reverse">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="font-medium">
                {sourceData.nameAr || sourceData.name}
              </span>
            </div>
            <div className="flex items-center gap-3 space-x-reverse">
              <div className="flex items-center gap-1 space-x-reverse">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount}</span>
              </div>
              <div className="flex items-center gap-1 space-x-reverse">
                <MessageCircle className="w-4 h-4" />
                <span>{article._count.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard; 