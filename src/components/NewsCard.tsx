import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Share2, Eye, MessageCircle, Heart, ExternalLink, MapPin, Clock } from 'lucide-react';

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    titleAr?: string;
    content: string;
    contentAr?: string;
    excerpt?: string;
    excerptAr?: string;
    imageUrl?: string;
    videoUrl?: string;
    sourceUrl?: string;
    sourceName?: string;
    category: string;
    publishedAt: string;
    createdAt: string;
    viewCount?: number;
    commentCount?: number;
    likeCount?: number;
    location?: string;
    isBreaking?: boolean;
    author?: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
  showActions?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'default',
  showActions = true,
  showAuthor = true,
  showExcerpt = true,
  className = ''
}) => {
  const isRTL = false;
  const locale = enUS;

  const getTitle = () => {
    return isRTL && article.titleAr ? article.titleAr : article.title;
  };

  const getExcerpt = () => {
    if (isRTL && article.excerptAr) return article.excerptAr;
    if (article.excerpt) return article.excerpt;
    const content = isRTL && article.contentAr ? article.contentAr : article.content;
    return content.substring(0, 150) + '...';
  };

  const handleShare = async () => {
    const shareData = {
      title: getTitle(),
      text: getExcerpt(),
      url: `${window.location.origin}/articles/${article.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      POLITICS: 'bg-red-100 text-red-800',
      ECONOMY: 'bg-blue-100 text-blue-800',
      SOCIETY: 'bg-green-100 text-green-800',
      CULTURE: 'bg-purple-100 text-purple-800',
      SPORTS: 'bg-orange-100 text-orange-800',
      TECHNOLOGY: 'bg-gray-100 text-gray-800',
      HEALTH: 'bg-pink-100 text-pink-800',
      ENVIRONMENT: 'bg-teal-100 text-teal-800',
      INTERNATIONAL: 'bg-indigo-100 text-indigo-800',
      OTHER: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.OTHER;
  };

  if (variant === 'minimal') {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Link href={`/articles/${article.id}`} className="block">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                  {getTitle()}
                </h3>
              </Link>
              {article.sourceName && (
                <p className="text-xs text-gray-500 mt-1">{article.sourceName}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">
                  {formatDate(article.publishedAt)}
                </span>
                {article.isBreaking && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                    Breaking
                  </span>
                )}
              </div>
            </div>
            {article.imageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={getTitle()}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
        <div className="p-4">
          <div className="flex items-start gap-4">
            {article.imageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={getTitle()}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Link href={`/articles/${article.id}`} className="block">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                      {article.isBreaking && (
                        <span className="text-red-600 font-bold mr-2">Breaking:</span>
                      )}
                      {getTitle()}
                    </h3>
                  </Link>
                  {showExcerpt && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{getExcerpt()}</p>
                  )}
                </div>
                {showActions && (
                  <button
                    onClick={handleShare}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
                    {article.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                {showActions && (
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {article.viewCount && (
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {article.viewCount}
                      </span>
                    )}
                    {article.commentCount && (
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {article.commentCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
        {article.imageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={article.imageUrl}
              alt={getTitle()}
              className="w-full h-full object-cover"
            />
            {article.isBreaking && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Breaking
                </span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
                <Link href={`/articles/${article.id}`} className="block">
                  <h2 className="text-xl font-bold text-white line-clamp-2 hover:text-blue-200 transition-colors">
                    {getTitle()}
                  </h2>
                </Link>
                {showExcerpt && (
                  <p className="text-gray-200 mt-2 line-clamp-2">{getExcerpt()}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          {!article.imageUrl && (
            <div className="mb-4">
              <Link href={`/articles/${article.id}`} className="block">
                <h2 className="text-2xl font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                  {article.isBreaking && (
                    <span className="text-red-600 mr-2">Breaking:</span>
                  )}
                  {getTitle()}
                </h2>
              </Link>
              {showExcerpt && (
                <p className="text-gray-600 mt-3 line-clamp-3">{getExcerpt()}</p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
                {article.category.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />
                {formatDate(article.publishedAt)}
              </span>
              {article.location && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} />
                  {article.location}
                </span>
              )}
            </div>
            {showActions && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Share2 size={18} />
                </button>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
          
          {showAuthor && article.author && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              {article.author.avatar && (
                <img
                  src={article.author.avatar}
                  alt={`${article.author.firstName} ${article.author.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {article.author.firstName} {article.author.lastName}
                </p>
                <p className="text-xs text-gray-500">@{article.author.username}</p>
              </div>
            </div>
          )}
          
          {showActions && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {article.viewCount && (
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {article.viewCount.toLocaleString()}
                  </span>
                )}
                {article.commentCount && (
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    {article.commentCount}
                  </span>
                )}
                {article.likeCount && (
                  <span className="flex items-center gap-1">
                    <Heart size={16} />
                    {article.likeCount}
                  </span>
                )}
              </div>
              {article.sourceName && (
                <span className="text-sm text-gray-500">
                  Source: {article.sourceName}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
                {article.category.toUpperCase()}
              </span>
              {article.isBreaking && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
                  Breaking
                </span>
              )}
            </div>
            
            <Link href={`/articles/${article.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {getTitle()}
              </h3>
            </Link>
            
            {showExcerpt && (
              <p className="text-gray-600 mt-2 line-clamp-3">{getExcerpt()}</p>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(article.publishedAt)}
                </span>
                {article.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {article.location}
                  </span>
                )}
                {article.sourceName && (
                  <span>Source: {article.sourceName}</span>
                )}
              </div>
              
              {showActions && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {article.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={getTitle()}
                className="w-32 h-24 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {article.viewCount && (
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {article.viewCount.toLocaleString()}
                </span>
              )}
              {article.commentCount && (
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {article.commentCount}
                </span>
              )}
              {article.likeCount && (
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  {article.likeCount}
                </span>
              )}
            </div>
            
            {showAuthor && article.author && (
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <img
                    src={article.author.avatar}
                    alt={`${article.author.firstName} ${article.author.lastName}`}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-gray-600">
                  {article.author.firstName} {article.author.lastName}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard; 