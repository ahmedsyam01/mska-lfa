import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MessageCircle, ThumbsUp, Reply, Send, User, Clock } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSystemProps {
  articleId: string;
  initialComments?: Comment[];
}

const CommentSystem: React.FC<CommentSystemProps> = ({ articleId, initialComments = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const base = (typeof window !== 'undefined' && window.location.hostname.includes('railway.app'))
        ? 'https://rimna-backend-production.up.railway.app'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      const response = await fetch(`${base}/api/articles/${articleId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        // Mock comments for demonstration
        setComments([
          {
            id: '1',
            content: 'مقال رائع ومفيد جداً. شكراً لك على هذه المعلومات القيمة.',
            author: {
              id: '1',
              firstName: 'أحمد',
              lastName: 'محمد'
            },
            createdAt: new Date().toISOString(),
            likes: 5,
            isLiked: false,
            replies: [
              {
                id: '2',
                content: 'أتفق معك تماماً، موضوع مهم جداً.',
                author: {
                  id: '2',
                  firstName: 'فاطمة',
                  lastName: 'أحمد'
                },
                createdAt: new Date().toISOString(),
                likes: 2,
                isLiked: false
              }
            ]
          },
          {
            id: '3',
            content: 'هل يمكن توضيح النقطة الثالثة أكثر؟ أشعر أنها تحتاج لمزيد من التفصيل.',
            author: {
              id: '3',
              firstName: 'عمر',
              lastName: 'علي'
            },
            createdAt: new Date().toISOString(),
            likes: 1,
            isLiked: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      const base = (typeof window !== 'undefined' && window.location.hostname.includes('railway.app'))
        ? 'https://rimna-backend-production.up.railway.app'
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      const response = await fetch(`${base}/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rimna_token')}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData.comment, ...comments]);
        setNewComment('');
      } else {
        // Mock adding comment
        const mockComment: Comment = {
          id: Date.now().toString(),
          content: newComment,
          author: {
            id: user?.id || '1',
            firstName: user?.firstName || 'مجهول',
            lastName: user?.lastName || ''
          },
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false
        };
        setComments([mockComment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyText.trim() || !isAuthenticated) return;

    const mockReply: Comment = {
      id: Date.now().toString(),
      content: replyText,
      author: {
        id: user?.id || '1',
        firstName: user?.firstName || 'مجهول',
        lastName: user?.lastName || ''
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...(comment.replies || []), mockReply] }
        : comment
    ));
    
    setReplyText('');
    setReplyingTo(null);
  };

  const handleLike = async (commentId: string) => {
    if (!isAuthenticated) return;

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked 
          }
        : {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === commentId
                ? { 
                    ...reply, 
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked 
                  }
                : reply
            )
          }
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`;
    return `${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'mr-8 mt-4' : 'mb-6'} bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200">
          {comment.author.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={`${comment.author.firstName} ${comment.author.lastName}`}
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-slate-600" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="font-bold text-slate-800 text-sm">
                {comment.author.firstName} {comment.author.lastName}
              </span>
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-slate-700 text-sm leading-relaxed mb-4 text-right">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center space-x-2 space-x-reverse text-sm px-3 py-2 rounded-xl transition-colors ${
                comment.isLiked 
                  ? 'text-red-600 bg-red-50 border border-red-200' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200'
              }`}
              disabled={!isAuthenticated}
            >
              <ThumbsUp className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{comment.likes}</span>
            </button>
            
            {!isReply && isAuthenticated && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-2 space-x-reverse text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <Reply className="h-4 w-4" />
                <span>رد</span>
              </button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك هنا..."
                className="w-full p-3 border border-slate-200 rounded-xl resize-none text-right text-sm focus:ring-2 focus:ring-slate-300 focus:border-slate-300 text-slate-700 transition-colors"
                rows={2}
              />
              <div className="flex justify-end space-x-3 space-x-reverse mt-3">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  رد
                </button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-3 space-x-reverse mb-8">
        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
          <MessageCircle className="h-5 w-5 text-slate-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">
          التعليقات ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="شاركنا رأيك حول هذا المقال..."
              className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 text-right text-slate-700 transition-colors"
              rows={3}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={!newComment.trim() || loading}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Send className="h-4 w-4" />
                <span>نشر التعليق</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <User className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-4 text-lg">يجب تسجيل الدخول لإضافة تعليق</p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
          >
            تسجيل الدخول
          </a>
        </div>
      )}

      {/* Comments List */}
      <div>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600"></div>
            </div>
            <p className="text-slate-600 text-lg">جاري تحميل التعليقات...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <MessageCircle className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg mb-2">لا توجد تعليقات بعد</p>
            <p className="text-slate-500">كن أول من يعلق على هذا المقال</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSystem; 