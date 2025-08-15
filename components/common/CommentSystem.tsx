import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MessageCircle, ThumbsUp, Reply, Send, User } from 'lucide-react';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}/comments`);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}/comments`, {
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
    <div className={`${isReply ? 'mr-8 mt-4' : 'mb-6'} bg-white rounded-lg p-4 shadow-sm border`}>
      <div className="flex items-start space-x-3 space-x-reverse">
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {comment.author.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={`${comment.author.firstName} ${comment.author.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-primary-600" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-medium text-gray-900 text-sm">
                {comment.author.firstName} {comment.author.lastName}
              </span>
              <span className="text-gray-500 text-xs">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed mb-3 text-right">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center space-x-1 space-x-reverse text-sm ${
                comment.isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
              }`}
              disabled={!isAuthenticated}
            >
              <ThumbsUp className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            
            {!isReply && isAuthenticated && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500 hover:text-primary-600"
              >
                <Reply className="h-4 w-4" />
                <span>رد</span>
              </button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك هنا..."
                className="w-full p-2 border border-gray-300 rounded-md resize-none text-right text-sm"
                rows={2}
              />
              <div className="flex justify-end space-x-2 space-x-reverse mt-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyText.trim()}
                  className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="flex items-center space-x-2 space-x-reverse mb-6">
        <MessageCircle className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          التعليقات ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="bg-white rounded-lg border p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="شاركنا رأيك حول هذا المقال..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newComment.trim() || loading}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>نشر التعليق</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg mb-8">
          <p className="text-gray-600 mb-3">يجب تسجيل الدخول لإضافة تعليق</p>
          <a
            href="/auth/login"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            تسجيل الدخول
          </a>
        </div>
      )}

      {/* Comments List */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">جاري تحميل التعليقات...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد تعليقات بعد</p>
            <p className="text-gray-400 text-sm">كن أول من يعلق على هذا المقال</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSystem; 