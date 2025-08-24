import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { 
  User, 
  Mail, 
  MapPin, 
  FileText, 
  Edit, 
  Save, 
  X,
  Camera,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  bio: string;
}

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">يجب تسجيل الدخول أولاً</h1>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Debug: Check authentication token
      const token = Cookies.get('rimna_token');
      console.log('🔐 Auth token check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 20) + '...'
      });

      // Only send fields that the backend allows for updates
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        location: formData.location
      };

      console.log('Sending profile update:', updateData);
      
      const response = await api.put('/users/me', updateData);
      console.log('Profile update response:', response);
      
      setSuccess(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      
      let errorMessage = 'حدث خطأ أثناء تحديث الملف الشخصي';
      
      if (err.response?.status === 500) {
        errorMessage = 'خطأ في الخادم - قد يكون الخدمة قيد إعادة التشغيل. يرجى المحاولة مرة أخرى لاحقاً.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.error || 'بيانات غير صحيحة';
      } else if (err.response?.status === 401) {
        errorMessage = 'انتهت صلاحية الجلسة - يرجى تسجيل الدخول مرة أخرى';
      } else if (err.response?.status === 404) {
        errorMessage = 'نقطة النهاية غير موجودة';
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        errorMessage = 'خطأ في الاتصال بالخادم - تحقق من اتصالك بالإنترنت';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'USER':
        return 'مواطن';
      case 'REPORTER':
        return 'صحفي';
      case 'ADMIN':
        return 'مدير';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'USER':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REPORTER':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-mauritania-green hover:text-mauritania-green-dark mb-4 transition-colors"
          >
            <User className="w-5 h-5 ml-2" />
            العودة للوحة التحكم
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-mauritania-green to-mauritania-gold rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
              <p className="text-gray-600">إدارة معلومات حسابك الشخصي</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">تم التحديث بنجاح!</h3>
              <p className="text-green-700">تم حفظ التغييرات في ملفك الشخصي</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">حدث خطأ!</h3>
              <p className="text-red-700">{error}</p>
              {error.includes('قيد إعادة التشغيل') && (
                <button
                  onClick={() => {
                    setError(null);
                    setIsEditing(true);
                  }}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
                >
                  إعادة المحاولة
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  <Camera className="w-4 h-4" />
                  تغيير الصورة
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user?.role || '')}`}>
                    <Shield className="w-4 h-4" />
                    {getRoleText(user?.role || '')}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>انضم في {new Date(user?.createdAt || '').toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">المعلومات الشخصية</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-mauritania-green text-white rounded-xl hover:bg-mauritania-green-dark transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                      اسم العائلة
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true}
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-right mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                    الموقع
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="نواكشوط، موريتانيا"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 text-right mb-2">
                    نبذة شخصية
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 pt-4 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="اكتب نبذة مختصرة عن نفسك..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري الحفظ...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Save className="w-5 h-5" />
                          حفظ التغييرات
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
