import React from 'react';
import Link from 'next/link';
import { Calendar, Eye, MessageCircle, Share2, Heart } from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
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
    try {
      // Parse the date string and handle timezone issues
      let date: Date;
      
      // Check if the date string is already a valid date
      if (dateString.includes('T') || dateString.includes('Z')) {
        // ISO format date
        date = parseISO(dateString);
      } else {
        // Try to parse as regular date string
        date = new Date(dateString);
      }
      
      // Validate the date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'تاريخ غير محدد';
      }
      
      // Get current time
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      // If less than 24 hours, show relative time
      if (diffInMinutes < 1440) {
        return formatDistanceToNow(date, {
          addSuffix: true,
          locale: ar
        });
      }
      
      // If more than 24 hours, show absolute date
      return format(date, 'dd/MM/yyyy', { locale: ar });
      
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'تاريخ غير محدد';
    }
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'POLITICS': return 'from-mauritania-red to-mauritania-red-dark';
      case 'ECONOMY': return 'from-mauritania-gold to-mauritania-gold-dark';
      case 'SPORTS': return 'from-mauritania-green to-mauritania-green-dark';
      case 'TECHNOLOGY': return 'from-mauritania-green to-mauritania-gold';
      case 'CULTURE': return 'from-mauritania-gold to-mauritania-red';
      case 'HEALTH': return 'from-mauritania-green to-mauritania-green-light';
      default: return 'from-mauritania-green to-mauritania-gold';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'POLITICS': return 'السياسة';
      case 'ECONOMY': return 'الاقتصاد';
      case 'SPORTS': return 'الرياضة';
      case 'TECHNOLOGY': return 'التكنولوجيا';
      case 'CULTURE': return 'الثقافة';
      case 'HEALTH': return 'الصحة';
      default: return category;
    }
  };

  if (variant === 'compact') {
    return (
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="modern-card p-4 hover:scale-[1.02] transition-all duration-300" dir="rtl">
          <div className="flex gap-4">
            {article.imageUrl && (
              <div className="flex-shrink-0 w-20 h-20 relative">
                <img
                  src={fixImageUrl(article.imageUrl) || ''}
                  alt={article.titleAr || article.title}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="absolute -top-2 -right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)} shadow-lg`}>
                    {getCategoryText(article.category)}
                  </span>
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-mauritania-green transition-colors duration-300 text-right">
                {article.titleAr || article.title}
              </h3>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 justify-end">
                <div className="flex items-center gap-1 space-x-reverse text-mauritania-gold-dark">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="w-1 h-1 bg-mauritania-gold rounded-full"></div>
                <span className="font-medium text-mauritania-green-dark">
                  {sourceData.nameAr || sourceData.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-500" dir="rtl">
          {article.imageUrl && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={fixImageUrl(article.imageUrl) || ''}
                alt={article.titleAr || article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)} shadow-xl`}>
                  {getCategoryText(article.category)}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <div className="flex items-center gap-1 space-x-reverse">
                    <Heart className="w-4 h-4 text-mauritania-red animate-pulse" />
                    <span>{article.viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-mauritania-green transition-colors duration-300 text-right">
              {article.titleAr || article.title}
            </h1>
            <p className="text-gray-600 mb-6 line-clamp-3 text-right leading-relaxed">
              {article.descriptionAr || article.description}
            </p>
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-6 text-sm text-gray-500 space-x-reverse">
                <div className="flex items-center gap-2 space-x-reverse text-mauritania-gold-dark">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2 space-x-reverse text-mauritania-green-dark">
                  <Eye className="w-4 h-4" />
                  <span>{article.viewCount}</span>
                </div>
                <div className="flex items-center gap-2 space-x-reverse text-mauritania-red-dark">
                  <MessageCircle className="w-4 h-4" />
                  <span>{article._count.comments}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-mauritania-green transition-colors duration-300 space-x-reverse bg-mauritania-green/10 hover:bg-mauritania-green/20 px-4 py-2 rounded-full"
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
      <div className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-300" dir="rtl">
        {article.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={fixImageUrl(article.imageUrl) || ''}
              alt={article.titleAr || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(article.category)} shadow-lg`}>
                {getCategoryText(article.category)}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-mauritania-green transition-colors duration-300 text-right">
            {article.titleAr || article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 text-right leading-relaxed">
            {article.descriptionAr || article.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 flex-row-start">
            <div className="flex items-center gap-3 space-x-reverse">
              <div className="flex items-center gap-1 space-x-reverse text-mauritania-gold-dark">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="w-1 h-1 bg-mauritania-gold rounded-full"></div>
              <span className="font-medium text-mauritania-green-dark">
                {sourceData.nameAr || sourceData.name}
              </span>
            </div>
            <div className="flex items-center gap-4 space-x-reverse">
              <div className="flex items-center gap-1 space-x-reverse text-mauritania-green-dark">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount}</span>
              </div>
              <div className="flex items-center gap-1 space-x-reverse text-mauritania-red-dark">
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